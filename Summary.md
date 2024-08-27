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

#### Server Actions

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

#### Observatoins about Client COmponents in a Server Component:

    - We have to use hooks or event handlers, so we need a client component
    - Usually, we don't want the whole page as client component (as we may be fetching data), but a client component inside a server component

##### Server actions and Client COmponents:

    - Server actions **can not** be defined in client components (as it would access databases);
    - So it can be passed as props
    - The best way is to cretralize the actions, creating an actions.tsx with all the server actions to be imported
        - In that, we write "use server" only once at the top of the file, not for each function

