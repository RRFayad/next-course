"use server";

export async function createPost() {
  // revalidatePath('/')is not too relevant to be instantaneous, it can be revalidated by time
  // TODO: revalidatePath('/topics/:slug')
}
