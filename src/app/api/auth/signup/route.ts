import { NextResponse } from "next/server";
import { hash } from "bcryptjs";
import { prisma } from "@/lib/prisma";
import { signupSchema } from "@/types";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { username, email, password } = signupSchema.parse(body);

    const existingUser = await prisma.user.findFirst({
      where: {
        OR: [{ email }, { username }],
      },
    });

    if (existingUser) {
      if (existingUser.email === email) {
        return NextResponse.json(
          { error: "Email already in use" },
          { status: 400 }
        );
      }
      if (existingUser.username === username) {
        return NextResponse.json(
          { error: "Username already taken" },
          { status: 400 }
        );
      }
    }

    const hashedPassword = await hash(password, 12);

    function generateShortId(): string {
      return Math.random().toString(36).substring(2, 8);
    }

    const user = await prisma.user.create({
      data: {
        username,
        email,
        password: hashedPassword,
        links: {
          create: {
            name: null,
            shortId: generateShortId(),
          },
        },
      },
    });

    return NextResponse.json({ success: true, userId: user.id });
  } catch (error: unknown) {
    if (error instanceof Error) {
      return NextResponse.json({ error: error.message }, { status: 400 });
    }
    return NextResponse.json(
      { error: "Something went wrong" },
      { status: 500 }
    );
  }
}