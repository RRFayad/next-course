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

export async function deleteSnippet(id: number) {
  await db.snippet.delete({
    where: { id },
  });

  redirect(`/`);
}

export async function createSnippet(formState: { message: string }, formData: FormData) {
  // Get input and validate
  const title = formData.get("title"); // As TS give is type FormDataEntryValue (which may be a string or a file)
  const code = formData.get("code");

  if (typeof title !== "string" || title.length < 3) {
    return { message: "Title must be longer!" };
  }
  if (typeof code !== "string" || code.length < 10) {
    return { message: "Code must be longer!" };
  }

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
