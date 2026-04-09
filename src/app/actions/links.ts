"use server";

import { getSessionUser } from "@/app/actions/auth";
import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";

export async function createLink(name: string | null) {
  const user = await getSessionUser();
  
  if (!user) {
    throw new Error("Unauthorized");
  }

  function generateShortId(): string {
    return Math.random().toString(36).substring(2, 8);
  }

  const link = await prisma.link.create({
    data: {
      name: name || null,
      userId: user.id,
      shortId: generateShortId(),
    },
  });

  revalidatePath("/dashboard");
  return link;
}

export async function deleteLink(id: string) {
  const user = await getSessionUser();
  
  if (!user) {
    throw new Error("Unauthorized");
  }

  const link = await prisma.link.findUnique({
    where: { id },
  });

  if (!link || link.userId !== user.id) {
    throw new Error("Not found");
  }

  await prisma.link.delete({
    where: { id },
  });

  revalidatePath("/dashboard");
}