"use server";

import { Topic } from "@prisma/client";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { z } from "zod";
import { auth } from "@/auth";
import { db } from "@/db";
import paths from "@/paths"; // The paths file we created

interface CreateTopicFormState {
  errors: {
    name?: string[];
    description?: string[];
    _form?: string[]; // Stephen used this weird name to act like a "metadata" and not to conflict with any possible data name
  };
}

const createTopicSchema = z.object({
  name: z
    .string()
    .min(3)
    .regex(
      /[a-z-]/, // lowercase or dash characters
      { message: "Must be lowercase letter or dashes without spaces" }
    ),
  description: z.string().min(10),
});

export async function createTopic(formState: CreateTopicFormState, formData: FormData): Promise<CreateTopicFormState> {
  const result = createTopicSchema.safeParse({ name: formData.get("name"), description: formData.get("description") });

  if (!result.success) {
    // console.log(result.error.flatten().fieldErrors); // Method to make the error mapping easier
    return { errors: result.error.flatten().fieldErrors };
  }

  const session = await auth();
  if (!session || !session.user) {
    return {
      errors: {
        _form: ["You must be logged in"],
      },
    };
  }

  let topic: Topic;

  try {
    topic = await db.topic.create({
      data: { slug: result.data.name, description: result.data.description },
    });
  } catch (error: unknown) {
    if (error instanceof Error) {
      return {
        errors: {
          _form: [error.message],
        },
      };
    } else {
      return {
        errors: {
          _form: ["Something went wrong"],
        },
      };
    }
  }
  revalidatePath("/");
  redirect(paths.topicShow(topic.slug));
}
