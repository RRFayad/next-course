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

#### Special File Names

    ##### page.tsx
        - We give the app folders the name of our route, and call our tsx file as page

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
