import type { Post } from "@prisma/client";
import { db } from "..";

export type PostWithData = Post & {
  // Important to give some thought to these Type names to not make the code cumbersome, such ad PostListItem as well, PostForDisplay, etc
  topic: { slug: string };
  user: { name: string | null };
  _count: { comments: number };
};

export type PostWithData_OPTIONAL_VERSION = Awaited<ReturnType<typeof fetchPostsByTopicSlug>>[number]; // [number] means "take on element of the resulted array"

export function fetchPostsByTopicSlug(slug: string): Promise<PostWithData[]> {
  return db.post.findMany({
    where: { topic: { slug } },
    include: {
      topic: { select: { slug: true } },
      user: { select: { name: true } },
      _count: { select: { comments: true } },
    },
  });
}
