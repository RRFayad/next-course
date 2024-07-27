# next-course

## 01 - Intro

#### 01. Intro

- Traditionally, React is used to make highly interactive pages (Heavy JS + Data Fetching)
- Other sites don't require heavy interactoin or dynamic data fetching
  - Content driving sites
- One of the primary goals of Next is to expand the use of React to static sites

#### 02. Project Overview

- Landing Page
- Performence Page
- Reliability Page
- Scale Page

- Create Project:
  - npx create-next-app@latest
    - name
    - TS? y
    - ESLint? y
    - TW? y
    - src/? y
    - App Router? y
    - Change alias? n

#### File-Based Routing

- For the routing, we add files named "page" for each folder (which will be the route)
  - Each file must export by default a react component

#### Linking Between Pages

- Built in Link component:
  `<Link href="performance">Performance</Link>`

#### Common UI in Next JS with Layouts

- In the layout.tsx we can render a component that will render with all pages

#### Project Folder Structure

- We will keep in the app folder only the pages
  - The other files (compenents, util etc) will be structured in the src folder

#### Absolute Path Shortcut

- This '@' means the path from src (to avoid the messy '../../../')
  `import Header from "@/components/header";`

#### Images in Next JS - Image Component

- The Image Component adjust the size for the screen (Next server will resize the image before sending to the Client)
  - Work for local and online images
- We saved the image files in the public directory

e.g.: `<Image src={homeImage} alt="car factory" fill style={{ objectFit: "cover" }} />`

#### More about Image Sizing

- Layout shifting (when the iamge delays to load, so when it render, it changes the initial layout) is something we watn to always avoid
  - That's why we use the 'fill' prop
- When it's local image, it's automatic, when its from internet, we should manually insert height={} and width={}

#### Production Deployment with Vercel

- npx vercel

## 02 - Changing Data with Mutations (CRUD)

- This is a project for CRUD operations for code snippets (we want to create and show users some snippets)

#### Project Setup

- We are going to work with SQLite (local DB) and Prisma

- Setting Up Prisma

  - npm install prisma
  - npx prisma init --datasource-provider sqlite

- We need to tell Prisma the different kinds of data
  - Create the model in schema.prisma
  - npx prisma migrate dev

#### Creating a Prisma Client within Next.js

- Our project flow must be:

  - Create a Prisma client
  - Create a form
  - Define a Server Action (to be called when the form is submitted)
  - Validate Input and Create a new snippet
  - Redirect to Home Page (which shows all snippets)

- Create a db file creating the client (that allows us to interact with the db):

```javascript
import { PrismaClient } from "@prisma/client";

export const db = new PrismaClient();
```

- An example of using Prisma would be:

```javascript
// Remember that snippet comes from our Model
db.snippet.create({
  data: { title: "Title", code: "const abc = () => {}" },
});
```

## 03 - Server Components & 04. Server Actions in Greater Detail

- Now we have created the form, we need to work in the server components

- Server actions

  - Number one way to change data (CRUD) in a next app
  - Server action are very integrated to HTML forms
  - Server actions are functions that will be called when a form is submitted

- Code:
  - "use server" is a next special string to define its a server action;
  - check formData type;
  - redirect was imported from 'next/navigation'

```javascript
const createSnippet = async (formData: FormData) => {
    // This needs to be a server action
    "use server";
    // Get input and validate
    const title = formData.get("title") as string; // As TS give is type FormDataEntryValue (which may be a string or a file)
    const code = formData.get("code") as string;

    // Create a new record in the database
    const snippet = await db.snippet.create({
      data: {
        title,
        code,
      },
    });
    console.log(snippet);

    // Redirect (to the Home Page for now)
    redirect("/");
  };
```

#### A Deeper Dive into Server Actions

- When using React, we tipically send HTTP requests to a API;

- With Next, IN THE SAME PROJECT, some of our code is in the server, and some in the client

- When we use 'use server' it defines the code is server concern
  - So there's te post, and the response
    **So, it's important to know where the code is actually running**

#### Server Components vs Client Components (Fetching data)

##### Fetching Data:

1. Create a server component (a component that does not have 'use client' at the top);
2. Mark the component as 'async';
3. Make an HTTP request OR directly access a DB;
4. Render it (or pass to a child)

##### 2 types of components:

- Client Component

  - Same as React Components - With the usual rules (incluiding hooks and events)
  - We write 'use client' in the top of the file to define it as client component
  - It can not show directly a Server Component (there is one exception)
  - Usually we will have the client components inside the components folder

- Server Component

  - We want to generally prefer Server Components
    - Better Performance + UX
  - By default, all component are server components
  - We can use async/await directly on the body of the component
    - We don't need to use useState or useEffect to fetch data anymore
  - **Limitations**:
    - Server components can not use any kind of hook
    - Can not assign any event handlers

##### When to use each type?

- Use Client Component - Generally Speaking - when:

  - Need to use hooks;
  - Need to use event handlers;

- Use Server Component - Generally Speaking - when:
  - When there's data fetching
  - Always it's possible :)

##### Next Server Dynamics:

- Browser makes Request => Server Components Returns a HTML => New HTTp Request is made => Server bundles Client Components into JS to send back

#### Fetching Data with Server Components

(Again, our checklist)

- Create a server component (a component that does not have 'use client' at the top);
  - Ok, it does not
- Mark the component as 'async';
  - Done
- Make an HTTP request OR directly access a DB;
  - In our case, it's not a separated API, so, we can access the DB directly
  - DOne
- Render it (or pass to a child)

#### Dynamic Paths

- We name the folders with [variableNameHere]

  - This will make we receive the params in the props automatically (in our case the folder is [id]) as a string
    - `{ params: { id: '2' }, searchParams: {} }`

- **Not Found**
  - Next comes with a notFound default redirect

```javascript
import { notFound } from "next/navigation";
import { db } from "@/db";

interface SnippetShowPageProps {
  params: {
    id: string;
  };
}

const SnippetShowPage = async ({ params }: SnippetShowPageProps) => {
  const snippet = await db.snippet.findFirst({
    where: { id: parseInt(params.id) },
  });

  if (!snippet) {
    return notFound();
  }

  return <div>{snippet.title}</div>;
};

export default SnippetShowPage;

```

#### Customize Not Found Pages

##### Special File Names in the 'app' folder:

![Special File Names](/readme%20imgs/image.png)

- So, we can create our custom not-found.tsx page
  - When needed, Next will look for the closest not-found file (not necessairly in the same directory)

#### Automatic Loading Pages

- We can add a loading.tsx page to be shown when it's loading (fetching data or something)
  - I don't have to call anything in my page, it will automatically look for a loading.tsx file

* Obs.: Just to remember, when I want to force a Promise and await:
  `await new Promise((r) => setTimeout(r, 2000));`

#### Some tasks and tips

- TO create a lot of files such as loading, not-found etc, it will becomes mnessy

  - So, it's up to the dev, how many files he will implement, an when he is going to use pure jsx

#### 33. Showing a Client Component in a Server Component

- We are working on the edit page

- We want to show a code editor to the user

  - for that, we are going to use React Monaco Editor
  - And for that we will work with hooks and event handlers
  - So, we need to create a client component
  - **Important:** Note that we don't really want to make our editPage a client components, as it's fetching data, we want to create a client component to be called inside the server component

  - Important to note that the client component is rendered on the server side, to then send the HTML and the inject some JS (for the handling events)

  #### Obs About Prisma and Types:

  - We can import te type from Orisma Model

  ```typescript
  import type { Snippet } from "@prisma/client";

  interface SnippetEditFormProps {
    snippet: Snippet;
  }
  ```

#### Adding the Monaco Editor && Handling Editor Changes

- npm install @monaco-editor/react

- When we are going to update our code, we need to do some server actions

  - **Important:** Server actions **cannot** be defined in Client Components

- So, we have 2 options to use a server action in a Client Component:

  - We can pass Server Action through props
    - And this is the Exception that we can pass event handlers down to a Client Component
    - When we are passing server action
  - Or, we can Define a separate file with server actions (multiple server action, lke an util file) and call it
    - When we do it, we don't need to write 'use server' for every server action

- We will use option number 2 - A file to centralize all server actions

#### 38. Options for Calling Server Actions from Client Components

- Now we have 02 options:

1. Like in the server componen with a bind:

- ![Option 1](./readme%20imgs/option1.png)

2. More like regular React approach

- ![Option 2](./readme%20imgs//Option2.png)

- Stephen usually likes more option 2 (I felt the same way) but Next docs usually prefer option 1

#### Calling a Server Action from a Client Component

- Server Action (in a server file):

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

- Client Component using it with state values as arguments:

  ```javascript
  // Here we can have a server action, preloaded with our state arguments
  const editSnippetAction = actions.editSnippet.bind(null, snippet.id, code);
  // Remember the 'bind()' is like preconfiguring the function with the arguments I want (and not running it yet)

  // ... Component logic here....

  <form action={editSnippetAction}>
    <button type="submit" className="p-2 border rounded">
      Save
    </button>
  </form>;
  ```

#### Deleting a Record - A Server Action in a Server Component

- To create a delete button with a server action in a server component, I had to:
  - Wrap the button in a form, and bind the server action to run it as an action of the form (it did not work other way - Like onClick, or a callback to the action instead of creating a bound function)

#### General Obs.:

- When we call a file index.ts we don't need to specify the file name in the import, its implict

## 5. Server Form wih UseFormState

#### 41. Understanding the UseFormState Hook

- Our application is working, but we have no validation in the form neither error handling for when running server actions

  - Important to remember that, a big point of forms, is that they can work without any JS in the browser;
  - Rght now, forms in our pages are sending info **to** a server action
  - So, we need to communicate **from a server action back to the page** with the error message
  - React-dom (not react) has useFormState hook specially for this

- How Server Form work without useFormState:

  - ![No useFormState](./readme%20imgs/5.1%20-%20no%20hook.png)

- With useFormState:

  - ![With useFormState](./readme%20imgs/5.1.%20with%20hook.png)

- There's the FormState along the proccess, and nor our Server Action must return the FormState (with some message iof there's an error to communicate to the user)

#### 42. UseForm State in Action

- We set our createSnippet in the actions file;
  - It receives formState and formData:
  ```javascript
    export async function createSnippet(formState: { message: string }, formData: FormData) {
    return { message: "Title must be longer" };
    }
  ```
- We set useFormState:

  - It receives the action and the empty message formState;
  - It returns the current state and the updated action;
  - **Important:** Type of useFormState state (2nd arg), must match with the return of the server action
    - Check its implemention in the Next Auth Project

  ```javascript
  const [formState, action] = useFormState(actions.createSnippet, { message: "" });
  ```

- We bound it to the form, with a conditional rendering of the state
  ```javascript
  <form action={action}>
    // ... logic
    <div>{formState.message}</div> // User feedback // ... logic
  </form>
  ```

#### 44. Error Handling in Nextjs - Error File

- An error with the DB interaction would break our code, so we must handle other errors besides the input validation;

- There is the error page, for that, we should create the **error.tsx** file and **it must be a client component**;

  - If we simply throw an error, we go to the Error page, but with no route to leave it;
  - So the best approach is to handle possible errors to return a error message to the useFormState:
    - **Obs.:** - the redirect() must be out of the try catch block
      - To be precise here, it works this way because redirect() throws an error

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
  // Redirect (to the Home Page for now)
  }
  ```

## 6. Next Caching System

- Simulate production:

  - npm run build
  - npm run start

- When in production, we added a new item, and when refreshed the item was gone!

#### 46. The Full Route Cache System

![Caching](./readme%20imgs/Caching.png)

- The 1sts three, we are already dealing during the development, but when in production, we deal with the Full Route Cache

- The Full Route Cache:

  - Next will render the HomeRoute (and fetch the data)
  - Next recognizes the page as Static (it is Static or Dynamic), and it has a "very strong caching"
  - So it renders the component into a HTML file, with the fetched data
  - So, in the last lecture, when we refresh the page, it's because of the caching

- It's mainly because Next recognized our HomePage as Static

  - When we run npm build we have 2 different symbols:
    - o for static data - Now will render it only once
    - ƒ for dynamic data

- How does NExt decide what is static or dynamic?

  - All, by default, is static
  - What makes a page dynamc:
    ![Dynamic Routes](./readme%20imgs/Dynamic%20Routes.png)

  - So a dynamic path is dynamic, or we can simpl opt for:
    `export const dynamic = "force-dynamic";`

#### Cache Controls

- Time-Based: `export const revalidate = 3  // revalidate each 3 seconds`
- On Demand: `revalidatePath('/path-to-be-updated-here')`
  - Probably in the server actions
- Disable Caching: `export const dynamic = "force-dynamic";` (or `export const revalidate = 0`)

- As we know when the data will be updated, we will use the on-demand approach:
  ![On Demand Caching](./readme%20imgs/on-demand-cache.png)

#### Enabling Caching for Dynamic Routes - GenerateStaticsParams

![Theory](./readme%20imgs/GenerateStaticParams.png)

- In the page we added the GenerateStaticsParams() to the caching:

  ```javascript
  export async function generateStaticParams() {
    const snippets = await db.snippet.findMany();

    return snippets.map((snippet) => {
      return {
        id: snippet.id.toString(), // Next expects strings here
      };
    });
  }
  ```

- And in the server actoins we needed to revalidatePath to update:

  ```javascript
    export async function editSnippet(id: number, code: string) {
  await db.snippet.update({
    where: { id },
    data: { code },
  });

  revalidatePath(`/snippets/${id}`);
  redirect(`/snippets/${id}`);
  }
  ```

## 7. Next-Auth (A Full Project to Model)

- Our project will be a Social Media with Authentication, where user will be able to post and intereact between posts

![Project](./readme%20imgs/Next-Auth-Proj.png)

#### 54. Critical Libraries in Our Project

- Prisma - SQLite
- nextui - Component Library (works well with TW)
- next-auth / authjs (same library - renamed)

#### 55 NextUI Set up

- npm install --save-exact @nextui-org/react@2.2.9 framer-motion
- tailwind.config.js:

  ```javascript
    import { nextui } from "@nextui-org/react";
    content: [
        // ... Previous rules
      "./node_modules/@nextui-org/theme/dist/**/*.{js,ts,jsx,tsx}",
    ],
    //....
    darkMode: "class",
    plugins: [nextui()],
  ```

- Create providers.tsx (inside the app folder):

  ```javascript
      "use client";

      import { NextUIProvider } from "@nextui-org/react";

      interface ProvidersProps {
        children: React.ReactNode;
      }
      export default function Providers({ children }: ProvidersProps) {
        return <NextUIProvider>{children}</NextUIProvider>;
      }

  ```

- In the layout.tsx - Wrap the children inside the Providers we just created

- Delete globals.css css code (keep the tw configs)

#### 57. Database Setup

- npm install prisma
- npx prisma init --datasource-provider sqlite
- Define the schema (schema.prisma)
  - Check out prisma adaptar models
  - https://next-auth.js.org/v3/adapters/typeorm/postgres
- Create our database:

  - npx prisma migrate dev
  - Create db folder, with an index file for the db client:

    ```javascript
    import { PrismaClient } from "@prisma/client";

    export const db = new PrismaClient();
    ```

#### 58. OAuth Setup

![Steps](./readme%20imgs//OAuth%20Steps.png)

- Create the app config in the third party apps (in our case - github)

  - .env.local
    ```env
    GITHUB_CLIENT_ID =
    GITHUB_CLIENT_SECRET =
    AUTH_SECRET=
    ```
  - npm install --save-exact @auth/core@0.18.1 @auth/prisma-adapter@1.0.6 next-auth@5.0.0-beta.3

#### 59. Next-Auth Setup

- create auth.ts file (check file for details)

#### Creating the OAuth API

- Folder Structure:

  - app
    - api
      - auth
        - [...nextauth]
          - route.ts

- OAuth:
  ![OAuth](./readme%20imgs/OAuth.png)

#### Auth in Server Actions (Optional - For better readability)

- We set the signIn and signOut in the server actions file

#### Sign In, Sign out, and Checking Auth Status (From Server Component and from Client Component)

![Auth Functions](./readme%20imgs//Auth%20Functions.png)

- Checking it from a server component:

```javascript
import { Button } from "@nextui-org/react";
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

- From a CLient Component:

  - in provider.tsx - wrap the return with the SessionPrivider

  ```javascript
  "use client";

  import { NextUIProvider } from "@nextui-org/react";
  import { SessionProvider } from "next-auth/react";

  interface ProvidersProps {
  children: React.ReactNode;
  }
  export default function Providers({ children }: ProvidersProps) {
    return (
      <SessionProvider>
      <NextUIProvider>{children}</NextUIProvider>
      </SessionProvider>
    );
  }
  ```

  - In the Client COmponent: - Pay attention that in the client it's `session.data?.user`(while in server it `session?.user`)

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

### Structuring the Project (**Implement this Steps to my process**)

#### Upfront Design Process

- Steps Stephen Recommends when thinking in the project:
  - Identify the routes + data that each show
  - Make 'path helper' functions
  - Create routing folders + page.tsx
  - Identify places where data is dynamic
  - Define the server actions needed (wite them empty)
  - **Important**Add in comments what paths need to _revalidate_ for each server action
    - **Remember: revalidatePath() to define dynamic data and avoid Caching Errors**

|   Page Name   |                 Path                 | Data Shown                 |
| :-----------: | :----------------------------------: | :------------------------- |
|   Home Page   |                  /                   | Many Posts, Many topics    |
|  Topic Show   |         /topics/[topicName]          | single topic, many posts   |
| Create a Post |   /topics/[topicName] / posts/new    | single topic, many posts   |
|  Show a Post  | /topics/[topicName] / posts/[postId] | single post, many comments |

#### Path Helpers

##### Why Path Helpers?

- If we decide do a change in a path, we will have to hunt all the links in the code base

  - That's why we create a set of functions, to determine all the paths

- Create the path.ts file

#### Creating The Routing Structure

- Created the folder structure

#### Stubbing Out Server Actions

- Now we want to identify all the places where data changes and create empty server actions for those

- It's a good practice to create a file for each server action, centralizing them in an index.ts file and exporting all

#### Planning Revalidating Strategies

- Remember about the Caching

  - So, I define where my data is dynamic
  - And add Comments about the need of implementing Caching Revalidation
    - So it's basically about looking to all actions vs all Routes and asking mself if there will be side effects

- Stephen discuss about the revalidating tactics
  - e.g.: When a new comment, inside a topic is created, depending on the size of our project, we can implement a timing revalidation (as the users don't really expect to see the update in the very second it occurs)

### Coding

#### Header

- Built the Header;
- Displayed the Sign In and Sign Out Buttons
- Enabled SIgn Out
- Solve Caching Issue:
  - Right now all my pages are set as dynamic, and that's because of the auth() in the Header (which is shown in all pages)
  - auth() handles cookies - which is one of the rules to make a page dynamic
  - So, we are gonna move the auth stuff into a client component
- HeaderAuth client component:
  - we need to use useSession() - It makes a req to the backend to get auth status
    - Great! We built it, and now it's static again!

#### New Topic Logic

- We are going to create the logic to create new topics
  - A btn 'New Topic' which will open a form in a modal, with form validation (in server actions) to then, we work in the topic search bar
  - Our homepage will contain the postList and the TopicCreateForm
- Created the homepage structure
  **Styling:** Note how Stephen set the Home Page with a grid
- Created the button to New Topic and form
- Created the popover form
- Wrapped formData with server action

#### Adding Validation with Zod

- With Zod we create a Schema, so, we get a validator object
- npm install zod
- zod logic:
  ![Zod](./readme%20imgs/zod.png)

- Our code for implementing Zod:

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

#### useFormState for returning validation error messages

- **Important:** The types of: useFormState state, serverAction formState and Server Action return **must match**(Attention also to the Generic retrn type ). So we have to:

```javascript
  "use server";

import { z } from "zod";

interface CreateTopicFormState {
  errors: {
    name?: string[];
    description?: string[];
  };
}

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

export async function createTopic(formState: CreateTopicFormState, formData: FormData): Promise<CreateTopicFormState> {
  const result = createTopicSchema.safeParse({ name: formData.get("name"), description: formData.get("description") });

  if (!result.success) {
    // console.log(result.error.flatten().fieldErrors); // Method to make the error mapping easier
    return { errors: result.error.flatten().fieldErrors };
  }
  return { errors: {} };

  //TODO: revalidatePath('/')
}
```

- In the client:
  - Set initial state that matches the type;
  - set the action in the form;
  - Create conditional rendering logic for the error messages:
    (in our project we made the rendering element a lil different as we are using NextUI)

```javascript
"use client";
import { useFormState } from "react-dom";
import * as actions from "@/actions";

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

export default TopicCreateForm;

```

#### Handling "General Form Errors"

- We want to adding auth verification (we want the user to be logged in to create a new topic)
  - So it will be a verification for the whole form, not each input error
  - We just added one more property to our formState for the overall form

#### Handling Database Errors in Forms

- Now we want to send the validated data to the database to return in our topics list
- We created the logic to create the newTopic in the server action
- Also, we added the revalidatePath()

#### Some Obs During the Development:

- **Caching Issues:** During the development, it makes sense from time to time to run _npm run build_ and check the caching
- We centralize 'repeated components' such as the navbar in the layout.tsx
- **Styling:** Note how Stephen set the Home Page with a grid

## 08. Usign Data - Database Queries

#### 85. Loading Spinners with UseFormStatus

- We inserted a setTimeout to simulate a delay, so we insert a loading spinner when submitting the form

- We want to se useFormStatus for that. The useFormStatus Hook provides status information of the last form submission, but here's the tricky part:

  - We _can not_ insert useFormStatus directly in the component with the form
  - We have to create the FormButton as a child component
  - **Obs.:** Remember it must the a client component, as it has a hook

- useFormStatus() returns the status.pending and nextUi Button has a default loadingSpinner to the isLoading attribute

#### 86. Fetching and Listing Content from Prisma

- Now, we want to list the topic out in our HomePage

  - They should be link to navigate

- Nothing really new here (except for the UI elements)
  - We fetched the data, mapped it and rendered in the Home Page with some basic styling

#### 87. Scaffolding the Topic Show Page

- Nothing Specific - Just want to observe again that Stephen always cretes a Grid for each page

#### 88. Displaying a Creation Form

- Nothing new Here - Its about the PopOver form component to create a new post

#### 89. Applying Validation to Post Creation

- Nothing new Here - It's about the zod logic in the crete-post action

#### 90. Checking Authentication Status

- Remember - We check the auth in the server action:

```javascript
const session = await auth();
if (!session || !!session.user) {
  return {
    errors: {
      _form: ["User not logged in"],
    },
  };
}
```

#### 91. Passing Additional Args to a Server Action

- To pass aditional args to the Server action, we bind it with the actoin in the useFormState:

  ```javascript
  const [formState, action] = useFormState(actions.createPost.bind(null, topicSlug), { errors: {} });
  ```

- Now, our server action receives the topicSlug as the 1st arg:

  ```javascript
  export async function createPost(
  topicSlug: string,
  formState: CreatePostFormState,
  formData: FormData
  ): Promise<CreatePostFormState> {}
  ```

#### 92. Creating the Record

- Implemented saving data (post) in the db

#### 94. Mergins some files

- We added some components just to skip the code without new concepts

#### 95. Considerations Around Where to Fetch Data and 96. Data Fetching in Child Components

- In our post-list file, we are gonna to implement data fetching, which has different possible approach and design patterns

  - We will render the Post List inside the TopicShowPage;
  - The Post List component will render a lot of data:
    - All posts, Name of creator, comments associated, post id, topic slug
  - **Obs.:** In our case the discussion is only about the direct child, but the discussion is about the decision in bigger projects (with more children components)

- Option 1: Priorization in the higher level (page) component - Traditional React - Passing props

  - Pros:
    - Easy to understand what data is fetched
    - Make child components more reusable
    - Easier to avoid "n+1" query issues:
      - **N+1 Problem**: it happens when:
        - we do a query, get some data (like our list of posts);
        - to then, each post becoming a postItemComponent - Each one querying in he db by itself
        - (like bigO problem for querying DB)
      - So, it's easier to avoid determing in the list component what data we need in the 1st query
  - Cons:
    - Can lead to overfetching data;
    - Can lead to duplicate code in other Pages using the child component
    - Can lead to annoying interfaces: Props that are models with an additional data

- Option 2: Child component fetches its own data
  - Pros:
    - Easier to build 'skeleton' loading pages;
  - Cons:
    - Not reusable components

#### 97. Recommended Data Fetching

- Looking again to our options:

  - Option 1 has slower page load and more reusable components;
  - Option 2 has faster page load and less reusable components;

- We going to make a decision in the middle
  - We are going to fetch data from the child component;
  - But in a reusable way;
  - We will define in the parent what type of data should be fetched (passing a fetching function via props)
    - And the the child component will render it

#### 98. Define in Parent, Fetch in Child

- Step 1: Created the db query (posts.ts file inside db folder);
- Step 2: Fetch the data inside the postList component;
- Step 3: Display postList in the parent component (to pass the child component)

#### 99. Alternative Type Names and Query Definitions

- We could define the type in an 'easier' way:

`export type PostWithData_OPTIONAL_VERSION = Awaited<ReturnType<typeof fetchPostsByTopicSlug>>[number]; // [number] means "take on element of the resulted array"`

#### 100. Don't Go Crazy With Reuse

- It's more to focus that we can sometimes simply fetch the data from the component, and don't worry about the component not being reusable

#### 102. Recursively Rendering Components

- Now we want to show the comment list, which may have nested comments (and so on, can be an infinite nesting)
  - So, each comment will look for a possible nested comment (even the already nested comment)
  - We will have 2 approaches: 01 "normal" with props
  - And one with another Next Features we haven't seen yet

#### 103. Fetching the Big List

- Approach 1 (same as we used in the topic show page):
  - Create a comment query file;
    - Define a new type and define a fetchCommentsByPostId()
  - Import it in the PostShowPage
    - Pass it through props to the CommentList
  - IN the CommentList we will call fetchComments

## Section 09: Cachin with Request Memoization

#### 104. Multiple Repated DB Queries

- Just for studying purposes, we are gonna refactor our fetch comments solution to show another Next Feature

- Right now we have the big list of comments in the parent component (Comment List) to then pass them to the children components ("commentShow()"s);

- We are going to pass the postId only via props, and each child component will fetch data
  - So the query function will be called many times
  - It will be unecessary, so there's a Next feature for it

#### 105. Introducing Duplicate Queries

- We refactored our code to make each comment component to make a request, so, right now there's many requests being ran at the same time
  - The problem is, as comments are nested, sometimes the exact same comment is queried more than once

#### 106. Request Memoization

- To deduplicate the fetching functions, Next hve Request Memozation Caching
  - Which is atopmatically used with the built-in 'fetch' feunction (when the arguments are the same between different calls)

#### 107. Deduplicating Requests with Cache

- In the query (in our case 'queries/comments') we simply make the query function an arrow function, and wrap it in the cache() (imported from react)
  - Now the actual function will not be duplicated
