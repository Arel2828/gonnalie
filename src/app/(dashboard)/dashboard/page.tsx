import { redirect } from "next/navigation";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { Plus, Sparkles, Trash2, ExternalLink, Mail, Eye } from "lucide-react";
import Link from "next/link";
import { UserMenu } from "@/components/user-menu";
import { CopyLinkButton } from "./copy-button";
import { CreateLinkButton } from "./create-link-button";

export default async function DashboardPage() {
  const session = await auth();
  
  if (!session?.user?.email) {
    redirect("/login");
  }

  const user = await prisma.user.findUnique({
    where: { email: session.user.email },
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
    redirect("/login");
  }

  const baseUrl = process.env.NEXTAUTH_URL || "http://localhost:3000";
  const unreadCount = (user.messages as any[]).filter((m: any) => !m.isRead).length;

  const prompts = [
    "Send me your best pickup line 🦋",
    "Tell me something you never told anyone 💭",
    "What's your honest opinion on my content? 🤔",
    "Drop a secret confession 🤫",
    "Send me a compliment I deserve ✨",
  ];
  const randomPrompt = prompts[Math.floor(Math.random() * prompts.length)];

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-pink-50/30">
      <header className="bg-white/80 backdrop-blur-xl border-b border-zinc-100 sticky top-0 z-50">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex justify-between items-center">
          <Link href="/" className="text-2xl font-bold gradient-text">
            GL
          </Link>
          <div className="flex items-center gap-3 sm:gap-6">
            <Link 
              href="/inbox" 
              className="relative p-2 rounded-xl hover:bg-zinc-100 transition-colors"
            >
              <Mail className="w-5 h-5 text-zinc-600" />
              {unreadCount > 0 && (
                <span className="absolute -top-0.5 -right-0.5 w-5 h-5 bg-gradient-to-r from-indigo-500 to-pink-500 rounded-full text-xs text-white flex items-center justify-center font-medium">
                  {unreadCount}
                </span>
              )}
            </Link>
            <UserMenu username={user.username} />
          </div>
        </div>
      </header>

      <main className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
        <div className="text-center mb-8">
          <h2 className="text-3xl sm:text-4xl font-bold mb-3">Your Dashboard</h2>
          <p className="text-zinc-500">Manage your anonymous messaging</p>
        </div>

        <div className="bg-white rounded-3xl shadow-lg border border-zinc-100 overflow-hidden mb-6">
          <div className="bg-gradient-to-r from-indigo-500 to-pink-500 px-6 py-4 flex justify-between items-center">
            <h3 className="text-white font-semibold flex items-center gap-2">
              <ExternalLink className="w-5 h-5" />
              Your GL Links
            </h3>
            <CreateLinkButton />
          </div>
          <div className="p-6 space-y-4">
            {user.links.length === 0 ? (
              <div className="text-center py-8">
                <p className="text-zinc-500 mb-4">No links yet. Create your first GL link!</p>
              </div>
            ) : (
              user.links.map((link: any) => (
                <div key={link.id} className="flex items-center justify-between p-4 bg-zinc-50 rounded-2xl border border-zinc-200">
                  <div className="flex-1 min-w-0">
                    <p className="text-zinc-900 font-medium">
                      {link.name || "Default Link"}
                    </p>
                    <p className="text-zinc-500 text-sm truncate">
                      {baseUrl}/u/{user.username}/{link.shortId || link.id}
                    </p>
                    <p className="text-zinc-400 text-xs mt-1">
                      {link._count.messages} messages
                    </p>
                  </div>
                  <div className="flex items-center gap-2 ml-4">
                    <Link 
                      href={`/inbox?link=${link.shortId || link.id}`}
                      className="p-2 bg-indigo-500 hover:bg-indigo-600 text-white rounded-xl flex items-center gap-1 text-sm"
                    >
                      <Eye className="w-4 h-4" />
                      View
                    </Link>
                    <CopyLinkButton link={`${baseUrl}/u/${user.username}/${link.shortId || link.id}`} />
                    <form action={async () => {
                      "use server";
                      const { deleteLink } = await import("@/app/actions/links");
                      await deleteLink(link.id);
                    }}>
                      <button type="submit" className="p-2 bg-red-500 hover:bg-red-600 text-white rounded-xl">
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </form>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        <div className="bg-gradient-to-r from-indigo-500 to-pink-500 rounded-3xl p-6 sm:p-8 text-white">
          <h3 className="text-lg font-semibold mb-2 flex items-center gap-2">
            <Sparkles className="w-5 h-5" />
            Prompt Idea
          </h3>
          <p className="text-white/80 mb-4 text-sm">
            Share this with your followers to get more messages:
          </p>
          <div className="bg-white/20 backdrop-blur-sm rounded-2xl p-4 border border-white/20">
            <p className="font-medium text-lg">&ldquo;{randomPrompt}&rdquo;</p>
          </div>
        </div>
      </main>
    </div>
  );
}