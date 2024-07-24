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

export async function createPost(
  topicSlug: string,
  formState: CreatePostFormState,
  formData: FormData
): Promise<CreatePostFormState> {
  console.log(formData);

  const validationResult = createPostSchema.safeParse({
    title: formData.get("title"),
    content: formData.get("content"),
  });

  // Input validation
  if (!validationResult.success) {
    return { errors: validationResult.error.flatten().fieldErrors };
  }

  // Check auth
  const session = await auth();
  if (!session || !session.user) {
    return {
      errors: {
        _form: ["User not logged in"],
      },
    };
  }

  // Find topic => save data in db => Check it's correctly saved
  const topic = await db.topic.findFirst({
    where: { slug: topicSlug },
  });

  if (!topic) {
    return {
      errors: {
        _form: ["Can not find topic"],
      },
    };
  }

  let post: Post;
  try {
    post = await db.post.create({
      data: {
        title: validationResult.data.title,
        content: validationResult.data.content,
        userId: session.user.id,
        topicId: topic.id,
      },
    });
  } catch (err: unknown) {
    if (err instanceof Error) {
      return {
        errors: {
          _form: [err.message],
        },
      };
    } else {
      return {
        errors: {
          _form: ["Failed to Create Post"],
        },
      };
    }
  }

  revalidatePath(paths.topicShow(topicSlug));
  redirect(paths.postShow(topicSlug, post.id));
}
