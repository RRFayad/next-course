import { PrismaClient } from "@prisma/client";

export const db = new PrismaClient();

/* Prisma Example:

// Remember that snippets comes from our Model
db.snippet.create({
    data: { title: "Title", code: "const abc = () => {}" },
});

*/
