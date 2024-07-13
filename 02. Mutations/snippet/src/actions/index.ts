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
  return { message: "Title must be longer" };
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

  // Redirect (to the Home Page for now)
  redirect("/");
}
