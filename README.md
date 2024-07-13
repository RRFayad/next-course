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

## 03 - Server Components

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
