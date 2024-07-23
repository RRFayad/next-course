"use server";

import type { Post } from "@prisma/client";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { z } from "zod";
import { db } from "@/db";
import { auth } from "@/auth";
import paths from "@/paths";

interface CreatePostFormState {
  errors: {
    title?: string[];
    content?: string[];
    _form?: string[]; // Stephen used this weird name to act like a "metadata" and not to conflict with any possible data name
  };
}

const createPostSchema = z.object({
  title: z.string().min(3),
  content: z.string().min(10),
});

export async function createPost(formState: CreatePostFormState, formData: FormData): Promise<CreatePostFormState> {
  console.log(formData);

  const validationResult = createPostSchema.safeParse({
    title: formData.get("title"),
    content: formData.get("content"),
  });

  if (!validationResult.success) {
    return { errors: validationResult.error.flatten().fieldErrors };
  }

  return { errors: {} };

  // revalidatePath('/')is not too relevant to be instantaneous, it can be revalidated by time
  // TODO: revalidatePath('/topics/:slug')
}
