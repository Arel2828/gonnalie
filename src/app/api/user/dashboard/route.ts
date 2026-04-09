export const dynamic = 'force-dynamic';

import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(req: NextRequest) {
  try {
    const sessionToken = req.cookies.get("next-auth.session-token")?.value 
      || req.cookies.get("__Secure-next-auth.session-token")?.value
      || req.cookies.get("authjs.session-token")?.value;
    
    if (!sessionToken) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const user = await prisma.user.findUnique({
      where: { id: sessionToken },
      include: {
        links: {
          include: {
            _count: {
              select: { messages: true },
            },
          },
          orderBy: { createdAt: "desc" },
        },
        messages: {
          select: { isRead: true },
        },
      },
    });

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    return NextResponse.json(user);
  } catch (error) {
    console.error("Error fetching user:", error);
    return NextResponse.json({ error: "Failed to fetch user" }, { status: 500 });
  }
}