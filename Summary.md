# Summary

## Intro & Basics

- Traditionnaly, React is used to highly interactive pages (Heavy JS + Data Fetching - Think in Airbnb)
  - It does not make sense to content driven apps
- Next suits well for using React to static contents

#### Commands

- npx create-next-app@latest

  - name
  - TS? y
  - ESLint? y
  - TW? y
  - src/? y
  - App Router? y
  - Change alias? n

- npx vercel (deploy)

#### App Routing and Special File and Folder Names

##### Folders Names

- anyName

  - Define the path

- [variableNameHere]

  - receive params in the props as a string
    - `{ params: { id: '2' }, searchParams: {} }`

- (anyNameHere)

  - Does not define a path, only organizes. e.g.: (logged-out-pages)

- api
  - Defines api path

##### File Names

- page.tsx

  - We give the app folders the name of our route, and call our tsx file as page

- not-found.tsx
  - If we don't create it, Next has a default

```javascript
import { notFound } from "next/navigation";
if (false) {
  return notFound();
}
```

- layout.tsx

  - Wraps up the displayed page

- loading.tsx

  - Shown when fetching data, and there's a default page?

- error.tsx

  - Shown when error occurs, and there's a default page

- route.tsx
  - Defines api endpoints

#### Specific Components

##### Link between pages

- `<Link href="performance">Performance</Link>`

##### Image

- `<Image src={homeImage} alt="car factory" fill style={{ objectFit: "cover" }} />`
  - It adjusts to the screen size
  - Works for local and online images
    - Online images should have height={} and width={} set
  - fill prop is made to "reserve" the image space while loading (avoid resizing)

#### CRUD

- Set Up DB (Prisma in our case)

  - npm install prisma
  - npx prisma init --datasource-provider postgres
  - define schema
  - Prisma Client
  - npx prisma migrate dev
  - npx prisma studio - Remember prisma studio
  - Obs.:
    - Prisma Models generates types to be used in the project

- Project 'Flow':
  - Create Prisma Cliente and Schema
  - Create a form
  - Define a Server Action (to be called when the form is submitted)
  - Validate input (zod)
  - Redirect ?

### Server Components and Server Actions

- Functions to be called when a form is submitted
- Always have "use server"

```javascript
const createSnippet = async (formData: FormData) => {
    "use server";
    // Get input and validate
    const title = formData.get("title") as string; // As TS give is type FormDataEntryValue (which may be a string or a file)
    const code = formData.get("code") as string;

    // Write a db query
    const snippet = await db.snippet.create({
      data: {
        title,
        code,
      },
    });

    redirect("/");
  };
```

#### Server Components vs Client Components

##### Client Component

- Same as React component
- Has 'use client' at the top
- Can not show directly a Server Component (exception: when it gets a server action as event handler through props)
- Usually, our client components stays in a 'components' folder

##### Server Component

- Our general preference and default (better performance and UX)
- We can use async/await directly in the component

- It **can not** use hooks
- It **can not** use event handlers

##### When to use each

- We always want Server Components, axcept when we need to use hooks or event handlers

#### Next Server Dynamics:

- Browser makes Request
- Server Components return a HTML
- New HTTP Request is made
- Server bundles Client Components into js

#### Fetching Data in a Server Component Checklist:

1. Create a server component (there's no 'use client' at the top)
2. Make it async
3. Access the DB or make an HTTP request
4. Render it (os pass it to a child)

#### Observations about Client Components in a Server Component:

- We have to use hooks or event handlers, so we need a client component
- Usually, we don't want the whole page as client component (as we may be fetching data), but a client component inside a server component

##### Server actions and Client COmponents:

- Server actions **can not** be defined in client components (as it would access databases);
- So it can be passed as props, or from a separated server component
- The best way is to crentralize the actions, creating an actions.tsx with all the server actions to be imported
  - In that, we write "use server" only once at the top of the file, not for each function;
  - If we call it index.tsx we don't have to specify the file name in the import, it's implict
- Importing it from an action file, also has 02 approaches:

  - Using bind (Next docs usually takes this approach):
    - ![Option 1](./readme%20imgs/option1.png)
  - More Regular React Approach (my preference)
    - ![Option 2](./readme%20imgs//Option2.png)

- Server action example:

  ```javascript
  "use server";

  import { db } from "@/db";
  import { redirect } from "next/navigation";

  export async function editSnippet(id: number, code: string) {
  await db.snippet.update({
    where: { id },
    data: { code },
  });
  redirect(`/snippets/${id}`);
  }
  ```

  - Server action in a client component (check components/SnippetEditForm.tsx):

  ```javascript
    // Other imports...
    import * as actions from "@/actions";

    const componentFunction = ({snippet}: ComponentProps) => {

    const [code, setCode] = useState(snippet.code);

    const editSnippetAction = actions.editSnippet.bind(null, snippet.id, code);

    // Or, this APPROACH:
    // const editSnippetAction = async () => {
    //   await actions.editSnippet(code)
    // }

    return (
      //...

      <form action={editSnippetAction}>
        <button type="submit" className="p-2 border rounded">
          Save
        </button>
      </form>
    )
    }
  ```

  - In our project, Stephen always wrapped a button the handles a server action in a form:

  ```javascript
  <form action={deleteSnippetAction}>
    <button className="p-2 border rounded">Delete</button>
  </form>
  ```

## 5. Server Form wih UseFormState

- Form can run without js (which mean they can be ran as server components)
  - If we run it as client components, we can validate in the client, ut also would need to validate on the server
- useFormState can be used in a Client Component to communicate the feedback from the server to the client

#### How to implement it:

- In the Client:

  ```javascript
  const [formState, action] = useFormState(actions.createSnippet, { message: "" });

  return (
  <form action={action}>
    // ...
       {formState.message && <div className="my-1  text-red-500">{formState.message}</div>}

  <button type="submit" className="rounded p-2 bg-blue-200">
      Create
  </button>
  </form>;
  )
  ```

- In the server:
  ```javascript
    export async function createSnippet(formState: { message: string }, formData: FormData) {
    return { message: "Title must be longer" };
    }
  ```

#### Handling Errors in the Server Action

- An error in the db interaction would break our code;
- There's the error page default route, and we shold create 'error.tsx' and **it must be a client component**
  - So, the best approach is to return the rror message and render it in the error page

```javascript
  export async function createSnippet(formState: { message: string }, formData: FormData) {
  // data handling logic here...

try {
  // Create a new record in the database
  const snippet = await db.snippet.create({
    data: {
      title,
      code,
    },
  });
} catch (err: unknown) {
  if (err instanceof Error) {
    return { message: err.message };
  } else {
    return { message: "Something Went Wrong" };
  }
}

redirect("/"); // Never use it inside the try catch (it will return a weird error message)
}
```

## 6. Next Caching System

- Next Caching:

  - Data Cache - Fetched data is stores to be reused;
  - Router Cache - To facilitate navigation
  - Request Memoization - Avoid redudant's fetches
  - Full Route Cache - At build time, Next decides if the route is Static (rendered and stored) or Dynamic (rerended every time)

- That's why we should sometimes simulate production, to check the static and dynamic routes

  - npm run build
    - When we run, we will see in the console:
      - o for static data - Now will render it only once
      - ƒ for dynamic data
  - npm run start

- By default, everything is static, besides:

  - dynamic functions or dynamic variables, such as cookies.set(), cookies.delete(), useSearchParams() and searchParams prop;
  - Assigning specifc routes configs;
  - Calling 'fetch' and caching out the resposponse - `fetch('...', {next: {revalidate:0}})`
  - Dynamic routes - '/snippets/[id]/page.tsx

- Cache controls:

  - On Demand (most-used probably): `revalidatePath('/path-to-be-updated-here')`
    - Probaly we will set it in the respective server action, after updating data
  - Time-Based: `export const revalidate = 3  // revalidate each 3 seconds`
  - Disable Caching: `export const dynamic = "force-dynamic";` (or `export const revalidate = 0`)

- Enabling Caching for Dynamic Routes with generateStaticParams()
  - The strategy is to force the caching of a dynamic route, and revaldiate only when needed
    - Probably it worths when there's not a lot of data updates
  - To implement it:
    - I should `export synt function generateSaticParams() {}` in the same page file
      - Check docs, as ai didn't understand that well why it should return an array as strings
    - Then, in the respective server action, implement before the return (or redirect):
      - `revalidatePath('/snippets/${id}');`

## Next Auth

- npm install next-auth next-auth/prisma-adapter (check in the docs)
  - next-auth / authjs are the same library, just renamed

#### Main Steps:

1. Create Database

- Follow Prisma Implementation Steps;
- When Creating the Schema, there's a Schema template in the Next Auth Docs, which isbuilt to handle sessions, authentication etc;

2. Config the Third Party Apps (E.g. Google, Github, etc) for the OAuth & the .env file

- Create dotenv file with the client id, and secret
- To the Callback routes, we will have: `http:domain-name.com/api/auth/callback/provider`

3. Create the auth.ts file (check file and docs for details)

4. Create OAuth API

- /app
  - /api
    - /auth
      - [...nextauth]
        - route.ts

5. OPTIONAL - Implement Auth in Server Actions

#### Auth Functions - Server Component:

```javascript
import * as actions from "@/actions";
import { auth } from "@/auth";

export default async function Home() {
  const session = await auth();
  return (
    <div>
      <form action={actions.signIn}>
        <Button type="submit">Sign in!!</Button>
      </form>
      <form action={actions.signOut}>
        <Button type="submit">Sign Out!!</Button>
      </form>
      {session?.user ? <div>Signed in - {JSON.stringify(session.user)}</div> : <div> Signed out </div>}
    </div>
  );
}
```

#### Auth Functions - Client Component:

- In provider.tsx - wrap the return with the SessionPrivider

  - I saw in the docs that there are built in methods that we dont have to to this

  ```javascript
  "use client";
    import { SessionProvider } from "next-auth/react";

    interface ProvidersProps {
      children: React.ReactNode;
    }
    export default function Providers({ children }: ProvidersProps) {
      return (
        <SessionProvider>
          {children}
        </SessionProvider>
      );
    }
  ```

- In the client component:

  ```javascript
  "use client";

  import { useSession } from "next-auth/react";

  export default function Profile() {
    const session = useSession();

    if (session.data?.user) {
      return <div>User is signed in! ({JSON.stringify(session.data.user)})</div>;
    }

    return <div>User NOT signed in!</div>;
  }
  ```

  **Obs.**: Usully we will have to implement Auth Logic in CLient components, as if we do as server components, we might have to make our whole application dynamic

## Structuring a Project (Stephens's Step-by-step):

1. Identify the routes
2. Define the data to be shown in each route
3. Create a 'path-helper' funcionts file
4. Create routing folders + page.tsx
5. Identify places where data is dynamic
6. Define the nedded server actions (write them empty, only for define)
   a. **Important:** Add in the comments what paths need to have revalidatePath('/') in the server action
   - **Remember: revalidatePath() to define dynamic data and avoid Caching Errors**

E.g.:

|   Page Name   |                 Path                 | Data Shown                 |
| :-----------: | :----------------------------------: | :------------------------- |
|   Home Page   |                  /                   | Many Posts, Many topics    |
|  Topic Show   |         /topics/[topicName]          | single topic, many posts   |
| Create a Post |   /topics/[topicName] / posts/new    | single topic, many posts   |
|  Show a Post  | /topics/[topicName] / posts/[postId] | single post, many comments |

#### Form Validation with Zod

- We can create a zod schema and use it in the client side and in the server side (server actions)

```javascript
  "use server";

    import { z } from "zod";

    const createTopicSchema = z.object({
      name: z
        .string()
        .min(3)
        .regex(
          /[a-z-]/, // lowercase or dash characters
          { message: "Must be lowercase letter or dashes without spaces" }
        ),
      description: z.string().min(10),
    });

    export async function createTopic(formData: FormData) {
      const result = createTopicSchema.safeParse({ name: formData.get("name"), description: formData.get("description") });

      if (!result.success) {
        console.log(result.error.flatten().fieldErrors); // Method to make the error mapping easier
      }

      //TODO: revalidatePath('/')
    }
```

#### Combining Zod ans useFormState

- **Important:** The types of: useFormState state, serverAction formState and Server Action return **must match**(Attention also to the Generic retrn type )

- In the client:

  - Set initial state that matches the type;
  - Set the action in the form;
  - Create conditional rendering logic for the error messages

- Client Component:

```javascript
"use client";
//Imports...
function TopicCreateForm() {
  const [formState, action] = useFormState(actions.createTopic, { errors: {} }); // Remember it must match with the type that returns from the server action

  return (
        <form action={action}>
          {//... Logic}
            {formState.errors.description && <div>{formState.errors.description[0]}</div>}
          {//... Logic}
        </form>
  );
}
``
```

- Server Action

```javascript
  /// createTopicSchema Logic (Zod Schema)

  export async function createTopic(formState: CreateTopicFormState, formData: FormData): Promise<CreateTopicFormState> {
  const result = createTopicSchema.safeParse({ name: formData.get("name"), description: formData.get("description") });

  if (!result.success) {
    // console.log(result.error.flatten().fieldErrors); // Method to make the error mapping easier
    return { errors: result.error.flatten().fieldErrors };
  }
  return { errors: {} };

}
```

## 08. Using Data - Database Queries & UX

#### useFormStatus and LoadingSpinners while form is processing

- We have the useFormStatus() ho get the form submission status

  - So, we can get the pending value, and while it's true, show a loading spinner

- **Obs:** We _can not_ have the useFormStatus directly in the form component, we have to have a separate FormButton component as a child

```javascript
  "use client";
import { useFormStatus } from "react-dom";
import { Button } from "@nextui-org/react";

interface FormButtonProps {
  children: React.ReactNode;
}

function FormButton({ children }: FormButtonProps) {
  const { pending } = useFormStatus();

  return (
    <Button type="submit" isLoading={pending}>
      {children}
    </Button>
  );
}

export default FormButton;
```

#### Loading Skeletons

- While some components are loading, we can add skeletons with React Suspense:

```javascript
<div className="m-4">
  <div className="my-2">
    <Skeleton className="h-8 w-48" />
  </div>
  <div className="p-4 border rounded space-y-2">
    <Skeleton className="h-6 w-32" />
    <Skeleton className="h-6 w-32" />
    <Skeleton className="h-6 w-32" />
  </div>
</div>
```

```javascript
import { Suspense } from "react";

<Suspense fallback={<SkeletonComponent />}>
  <PostShow postId={postId} />
</Suspense>;
```

#### Adding Search Function

- We are gonna create a query function to handle the search string via params, and use it to run an include db function
