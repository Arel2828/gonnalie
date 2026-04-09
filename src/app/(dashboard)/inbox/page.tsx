import { redirect } from "next/navigation";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { Mail, Trash2, Check, ArrowLeft, List, Inbox } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import Link from "next/link";

interface Props {
  searchParams: Promise<{ link?: string }>;
}

export default async function InboxPage({ searchParams }: Props) {
  const { link: selectedLink } = await searchParams;
  
  const session = await auth();
  
  if (!session?.user?.id) {
    redirect("/login");
  }

  const userId = session.user.id;

  const links = await prisma.link.findMany({
    where: { userId },
    select: { id: true, shortId: true, name: true },
    orderBy: { createdAt: "desc" },
  });

  const whereClause: any = { receiverId: userId };
  if (selectedLink) {
    whereClause.link = {
      OR: [
        { shortId: selectedLink },
        { id: selectedLink },
      ],
    };
  }

  const messages = await prisma.message.findMany({
    where: whereClause,
    include: {
      link: {
        select: { id: true, shortId: true, name: true },
      },
    },
    orderBy: { createdAt: "desc" },
  });

  const validMessages = messages.filter((m) => m.linkId !== null);
  const unreadMessages = validMessages.filter((m) => !m.isRead);
  const readMessages = validMessages.filter((m) => m.isRead);

  async function markAsRead(formData: FormData) {
    "use server";
    const id = formData.get("id") as string;
    await prisma.message.update({
      where: { id },
      data: { isRead: true },
    });
  }

  async function deleteMessage(formData: FormData) {
    "use server";
    const id = formData.get("id") as string;
    await prisma.message.delete({
      where: { id },
    });
  }

  function groupMessagesByLink(msgs: typeof messages) {
    const groups: Record<string, { id: string; shortId: string; name: string | null; messages: typeof msgs }> = {};
    msgs.forEach((msg) => {
      const linkId = msg.link?.id || "unknown";
      if (!groups[linkId]) {
        groups[linkId] = {
          id: linkId,
          shortId: msg.link?.shortId || "",
          name: msg.link?.name || null,
          messages: [],
        };
      }
      groups[linkId].messages.push(msg);
    });
    return Object.values(groups);
  }

  const unreadGroups = groupMessagesByLink(unreadMessages);
  const readGroups = groupMessagesByLink(readMessages);

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-pink-50/30">
      <header className="bg-white/80 backdrop-blur-xl border-b border-zinc-100 sticky top-0 z-50">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex justify-between items-center">
          <div className="flex items-center gap-4">
            <Link href="/dashboard" className="p-2 rounded-xl hover:bg-zinc-100 transition-colors">
              <ArrowLeft className="w-5 h-5 text-zinc-600" />
            </Link>
            <Link href="/" className="text-2xl font-bold gradient-text">GL</Link>
          </div>
          <div className="text-sm text-zinc-500">{validMessages.length} messages</div>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
        <div className="flex gap-8">
          <aside className="w-64 shrink-0">
            <div className="bg-white rounded-3xl border border-zinc-200 overflow-hidden sticky top-24">
              <div className="bg-gradient-to-r from-indigo-500 to-pink-500 px-4 py-3">
                <h3 className="text-white font-semibold flex items-center gap-2">
                  <List className="w-4 h-4" />
                  Your Links
                </h3>
              </div>
              <div className="p-2">
                <Link
                  href="/inbox"
                  className={`flex items-center justify-between p-3 rounded-xl transition-all ${!selectedLink ? "bg-indigo-50 text-indigo-600" : "hover:bg-zinc-50"}`}
                >
                  <div className="flex items-center gap-2">
                    <Inbox className="w-4 h-4" />
                    <span className="text-sm font-medium">All Messages</span>
                  </div>
                </Link>
                {links.map((link) => (
                  <Link
                    key={link.id}
                    href={`/inbox?link=${link.shortId || link.id}`}
                    className={`flex items-center p-3 rounded-xl transition-all ${selectedLink === link.shortId ? "bg-indigo-50 text-indigo-600" : "hover:bg-zinc-50"}`}
                  >
                    <div className="min-w-0">
                      <p className="text-sm font-medium truncate">{link.name || `Link #${link.shortId}`}</p>
                      <p className="text-xs text-zinc-400">#{link.shortId}</p>
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          </aside>

          <div className="flex-1">
            <h2 className="text-3xl font-bold mb-8 flex items-center gap-3">
              <Mail className="w-8 h-8 text-indigo-600" />
              {selectedLink ? "Link Messages" : "All Messages"}
            </h2>

            {validMessages.length === 0 ? (
              <div className="text-center py-16">
                <div className="w-20 h-20 bg-zinc-100 rounded-full mx-auto mb-4 flex items-center justify-center">
                  <Mail className="w-10 h-10 text-zinc-400" />
                </div>
                <p className="text-zinc-600 text-lg mb-2">No messages yet</p>
              </div>
            ) : (
              <div className="space-y-4">
                {unreadMessages.map((msg) => (
                  <Dialog key={msg.id}>
                    <DialogTrigger asChild>
                      <button className="w-full text-left p-4 rounded-2xl border border-zinc-200 hover:border-indigo-300 hover:shadow-md transition-all cursor-pointer bg-white">
                        <div className="flex items-start gap-3">
                          <div className="w-2 h-2 rounded-full gradient-bg mt-2 shrink-0" />
                          <div className="flex-1 min-w-0">
                            {msg.senderName && <p className="text-indigo-600 font-medium text-sm mb-1">@{msg.senderName}</p>}
                            <p className="text-zinc-800 line-clamp-2">{msg.content}</p>
                            <p className="text-zinc-500 text-sm mt-2">
                              {new Date(msg.createdAt).toLocaleDateString()}
                            </p>
                          </div>
                        </div>
                      </button>
                    </DialogTrigger>
                    <DialogContent className="bg-white rounded-3xl border-zinc-200 p-6 sm:p-8 max-w-lg">
                      {msg.senderName && <p className="text-indigo-600 font-medium text-sm mb-3">@{msg.senderName}</p>}
                      <p className="text-lg text-zinc-800 leading-relaxed">{msg.content}</p>
                      <p className="text-zinc-500 text-sm mt-4">{new Date(msg.createdAt).toLocaleString()}</p>
                      <form className="flex flex-wrap gap-3 mt-8">
                        <Button formAction={markAsRead} name="id" value={msg.id} className="bg-zinc-100 hover:bg-zinc-200 text-zinc-900 rounded-xl">
                          <Check className="w-4 h-4 mr-2" />Mark as Read
                        </Button>
                        <Button formAction={deleteMessage} name="id" value={msg.id} variant="destructive" className="bg-red-500 hover:bg-red-600 rounded-xl">
                          <Trash2 className="w-4 h-4 mr-2" />Delete
                        </Button>
                      </form>
                    </DialogContent>
                  </Dialog>
                ))}
                
                {readMessages.map((msg) => (
                  <Dialog key={msg.id}>
                    <DialogTrigger asChild>
                      <button className="w-full text-left p-4 rounded-2xl border border-zinc-200 hover:border-zinc-300 transition-all cursor-pointer bg-zinc-50">
                        <div className="flex items-start gap-3">
                          <div className="w-2 h-2 rounded-full bg-zinc-300 mt-2 shrink-0" />
                          <div className="flex-1 min-w-0">
                            {msg.senderName && <p className="text-zinc-600 font-medium text-sm mb-1">@{msg.senderName}</p>}
                            <p className="text-zinc-500 line-clamp-2">{msg.content}</p>
                            <p className="text-zinc-400 text-sm mt-2">{new Date(msg.createdAt).toLocaleDateString()}</p>
                          </div>
                        </div>
                      </button>
                    </DialogTrigger>
                    <DialogContent className="bg-white rounded-3xl border-zinc-200 p-6 sm:p-8 max-w-lg">
                      {msg.senderName && <p className="text-zinc-600 font-medium text-sm mb-3">@{msg.senderName}</p>}
                      <p className="text-lg text-zinc-600 leading-relaxed">{msg.content}</p>
                      <p className="text-zinc-500 text-sm mt-4">{new Date(msg.createdAt).toLocaleString()}</p>
                      <form className="flex flex-wrap gap-3 mt-8">
                        <Button formAction={deleteMessage} name="id" value={msg.id} variant="destructive" className="bg-red-500 hover:bg-red-600 rounded-xl">
                          <Trash2 className="w-4 h-4 mr-2" />Delete
                        </Button>
                      </form>
                    </DialogContent>
                  </Dialog>
                ))}
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}