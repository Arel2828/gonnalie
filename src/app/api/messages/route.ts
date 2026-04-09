export const dynamic = 'force-dynamic';

import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { prisma } from "@/lib/prisma";
import { messageSchema } from "@/types";

export async function GET(req: NextRequest) {
  try {
    const sessionToken = req.cookies.get("next-auth.session-token")?.value 
      || req.cookies.get("__Secure-next-auth.session-token")?.value
      || req.cookies.get("authjs.session-token")?.value;
    
    if (!sessionToken) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const messages = await prisma.message.findMany({
      where: { receiverId: sessionToken },
      include: {
        link: {
          select: { id: true, shortId: true, name: true },
        },
      },
      orderBy: { createdAt: "desc" },
    });

    console.log("GET /api/messages - messages count:", messages.length, "token:", sessionToken);

    return NextResponse.json(messages);
  } catch (error) {
    console.error("Error fetching messages:", error);
    return NextResponse.json(
      { error: "Failed to fetch messages" },
      { status: 500 }
    );
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { username, content, senderName, shortId } = body;

    console.log("===== API RECEIVED =====");
    console.log("username:", username);
    console.log("shortId:", shortId);
    console.log("content length:", content?.length);

    if (!username || !content) {
      return NextResponse.json(
        { error: "Username and content required" },
        { status: 400 }
      );
    }

    const parsed = messageSchema.parse({ content });

    let link = null;
    
    const allLinks = await prisma.link.findMany({
      where: { user: { username } },
      select: { id: true, shortId: true, name: true }
    });
    console.log("All user links:", JSON.stringify(allLinks));
    console.log("Looking for shortId:", shortId, "type:", typeof shortId);
    
    let matchedLink = null;
    
    // Try direct match first
    if (shortId) {
      matchedLink = allLinks.find(l => l.shortId === shortId);
      console.log("Direct match:", matchedLink);
    }
    
    // Try lowercase match
    if (!matchedLink && shortId) {
      matchedLink = allLinks.find(l => l.shortId?.toLowerCase() === shortId.toLowerCase());
      console.log("Lowercase match:", matchedLink);
    }
    
    // Try trimmed match  
    if (!matchedLink && shortId) {
      const trimmed = shortId.trim().toLowerCase();
      matchedLink = allLinks.find(l => l.shortId?.toLowerCase() === trimmed);
      console.log("Trimmed lowercase match:", matchedLink);
    }
    
    if (matchedLink) {
      link = await prisma.link.findUnique({ where: { id: matchedLink.id } });
      console.log("Found link:", link?.id, "shortId:", link?.shortId);
    }
    
    if (!link) {
      console.log("No match, using first link");
      const firstLink = await prisma.link.findFirst({
        where: { user: { username } },
        orderBy: { createdAt: 'asc' },
      });
      link = firstLink;
    }

    if (!link) {
      return NextResponse.json({ error: "No link found for user" }, { status: 404 });
    }

    console.log("Using linkId:", link.id);

    const message = await prisma.message.create({
      data: {
        content: parsed.content,
        senderName: senderName || null,
        receiverId: link.userId,
        linkId: link.id,
      },
    });

    console.log("Message created with linkId:", message.linkId);

    return NextResponse.json(message);
  } catch (error: unknown) {
    console.error("Error creating message:", error);
    if (error instanceof Error) {
      return NextResponse.json({ error: error.message }, { status: 400 });
    }
    return NextResponse.json(
      { error: "Failed to send message" },
      { status: 500 }
    );
  }
}