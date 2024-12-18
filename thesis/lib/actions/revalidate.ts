"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

export default async function revalidateAndRedirect(path: string, redirectPath: string) {
  revalidatePath(path);
  redirect(redirectPath);
}