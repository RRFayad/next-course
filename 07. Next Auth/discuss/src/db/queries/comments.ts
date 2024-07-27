import type { Comment } from "@prisma/client";
import { cache } from "react";
import { db } from "@/db";

export type CommentWithAuthor = Comment & { user: { name: string | null; image: string | null } };

export const fetchCommentsByPostId = cache((postId: string): Promise<CommentWithAuthor[]> => {
  // console.log(postId);   // Just to check how many times this function is ran
  return db.comment.findMany({
    where: { postId },
    include: {
      user: {
        select: {
          name: true,
          image: true,
        },
      },
    },
  });
});
