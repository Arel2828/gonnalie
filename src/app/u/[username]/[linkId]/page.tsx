import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { MessageForm } from "@/components/message-form";
import { Sparkles, ArrowLeft } from "lucide-react";
import Link from "next/link";

export const dynamic = 'force-dynamic';

interface Props {
  params: Promise<{ username: string; shortId: string }>;
}

export default async function UserPage({ params }: Props) {
  const { username, shortId } = await params;
  
  const link = await prisma.link.findFirst({
    where: { 
      user: { username },
      shortId: shortId
    }
  });

  if (!link) {
    notFound();
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-pink-50/30">
      <div className="absolute top-20 left-10 w-72 h-72 bg-indigo-200/30 rounded-full blur-3xl" />
      <div className="absolute bottom-20 right-10 w-96 h-96 bg-pink-200/30 rounded-full blur-3xl" />

      <header className="relative z-10 border-b border-zinc-100">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex justify-between items-center">
          <Link href="/" className="p-2 rounded-xl hover:bg-zinc-100 transition-colors">
            <ArrowLeft className="w-5 h-5 text-zinc-600" />
          </Link>
          <Link href="/" className="text-2xl font-bold gradient-text">
            GL
          </Link>
          <div className="w-9" />
        </div>
      </header>

      <main className="relative z-10 max-w-xl mx-auto px-4 sm:px-6 py-12 sm:py-20">
        <div className="text-center mb-8 sm:mb-12">
          <div className="w-24 h-24 gradient-bg rounded-full mx-auto mb-5 flex items-center justify-center float-animation shadow-2xl shadow-indigo-500/20">
            <span className="text-4xl font-bold text-white">
              {username.charAt(0).toUpperCase()}
            </span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-bold mb-2">@{username}</h1>
          {link.name && (
            <p className="text-lg text-indigo-600 font-medium mb-2">{link.name}</p>
          )}
          <p className="text-zinc-500 flex items-center justify-center gap-2">
            <Sparkles className="w-4 h-4 text-indigo-500" />
            Send an anonymous message
          </p>
        </div>

        <div className="bg-white/80 backdrop-blur-xl rounded-3xl border border-white/20 shadow-2xl p-6 sm:p-8">
          <MessageForm username={username} shortId={shortId} />
        </div>
      </main>
    </div>
  );
}