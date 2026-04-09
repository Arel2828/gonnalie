"use server";

import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";

export async function getSessionUser() {
  const session = await auth();
  
  if (!session?.user?.id) {
    return null;
  }
  
  return {
    id: session.user.id,
    username: session.user.name,
  };
}