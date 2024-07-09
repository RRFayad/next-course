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
