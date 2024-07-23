"use server";
import { z } from "zod";
import { db } from "@/db";

export async function createPost(formState: any, formData: FormData) {
  console.log(formData);

  return { errors: {} };

  // revalidatePath('/')is not too relevant to be instantaneous, it can be revalidated by time
  // TODO: revalidatePath('/topics/:slug')
}
