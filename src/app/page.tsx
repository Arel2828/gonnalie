import Link from "next/link";
import {
  MessageSquare,
  LinkIcon,
  Shield,
  Sparkles,
  ArrowRight,
  Star,
  Zap,
  Heart,
} from "lucide-react";

export default function Home() {
  return (
    <div className="min-h-screen bg-white text-zinc-900 relative overflow-x-hidden">
      <div className="absolute inset-0 bg-gradient-to-br from-indigo-50 via-white to-pink-50/30" />
      <div className="absolute top-20 left-10 w-72 h-72 bg-indigo-200/30 rounded-full blur-3xl" />
      <div className="absolute bottom-20 right-10 w-96 h-96 bg-pink-200/30 rounded-full blur-3xl" />

      <header className="relative z-10 border-b border-zinc-100">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-5 flex justify-between items-center">
          <h1 className="text-2xl font-bold gradient-text tracking-tight">GonnaLie</h1>
          <div className="flex gap-3 sm:gap-4 items-center">
            <Link
              href="/login"
              className="text-zinc-600 hover:text-zinc-900 transition-colors text-sm sm:text-base px-3 py-2"
            >
              Login
            </Link>
            <Link
              href="/signup"
              className="bg-white text-zinc-900 border border-zinc-200 px-5 sm:px-7 py-2.5 rounded-full font-medium hover:bg-zinc-50 transition-all hover:scale-105 text-sm sm:text-base"
            >
              Get Started
            </Link>
          </div>
        </div>
      </header>

      <main className="relative z-10 max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 pt-20 sm:pt-32 pb-16 sm:pb-24 text-center">
        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-zinc-100 text-zinc-600 text-sm mb-8">
          <Sparkles className="w-4 h-4 text-indigo-500" />
          <span>Anonymous messaging reimagined</span>
        </div>

        <h2 className="text-5xl sm:text-6xl lg:text-7xl font-bold mb-6 leading-[1.1] tracking-tight">
          Get your{" "}
          <span className="gradient-text">GL</span>{" "}
          link
        </h2>

        <p className="text-lg sm:text-xl text-zinc-500 mb-10 sm:mb-14 max-w-2xl mx-auto leading-relaxed">
          Share your anonymous link and receive messages from friends, fans, or
          anyone who wants to send you something spicy. No strings attached.
        </p>

        <div className="flex flex-col sm:flex-row gap-4 justify-center mb-20 sm:mb-28">
          <Link
            href="/signup"
            className="inline-flex items-center justify-center gap-2 bg-white text-zinc-900 border border-zinc-200 px-8 py-4 rounded-full text-lg font-semibold hover:bg-zinc-50 transition-all hover:scale-105"
          >
            Create Your Link
            <ArrowRight className="w-5 h-5" />
          </Link>

        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5 mb-20 sm:mb-28">
          <div className="bg-white rounded-2xl p-7 sm:p-8 text-center border border-zinc-100 shadow-sm hover:shadow-lg transition-shadow">
            <div className="w-14 h-14 bg-indigo-100 rounded-xl flex items-center justify-center mx-auto mb-5">
              <LinkIcon className="w-7 h-7 text-indigo-600" />
            </div>
            <h3 className="text-lg font-semibold mb-2 text-zinc-900">
              1. Get Your Link
            </h3>
            <p className="text-zinc-500 text-sm leading-relaxed">
              Create your unique GL link in seconds. Share it anywhere.
            </p>
          </div>

          <div className="bg-white rounded-2xl p-7 sm:p-8 text-center border border-zinc-100 shadow-sm hover:shadow-lg transition-shadow">
            <div className="w-14 h-14 bg-pink-100 rounded-xl flex items-center justify-center mx-auto mb-5">
              <MessageSquare className="w-7 h-7 text-pink-600" />
            </div>
            <h3 className="text-lg font-semibold mb-2 text-zinc-900">
              2. Receive Messages
            </h3>
            <p className="text-zinc-500 text-sm leading-relaxed">
              Get anonymous messages instantly in your private inbox.
            </p>
          </div>

          <div className="bg-white rounded-2xl p-7 sm:p-8 text-center border border-zinc-100 shadow-sm hover:shadow-lg transition-shadow sm:col-span-2 lg:col-span-1">
            <div className="w-14 h-14 bg-violet-100 rounded-xl flex items-center justify-center mx-auto mb-5">
              <Shield className="w-7 h-7 text-violet-600" />
            </div>
            <h3 className="text-lg font-semibold mb-2 text-zinc-900">
              3. Stay Private
            </h3>
            <p className="text-zinc-500 text-sm leading-relaxed">
              No identity required. What happens in GL stays in GL.
            </p>
          </div>
        </div>

        <div className="mb-16">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-zinc-100 text-zinc-600 text-sm mb-8">
            <Heart className="w-4 h-4 text-pink-500" />
            <span>What people are saying</span>
          </div>

          <div className="grid md:grid-cols-2 gap-5 max-w-3xl mx-auto">
            <div className="bg-white p-6 rounded-2xl text-left border border-zinc-100 shadow-sm">
              <div className="flex gap-1 mb-4">
                {[...Array(5)].map((_, i) => (
                  <Star
                    key={i}
                    className="w-4 h-4 fill-amber-400 text-amber-400"
                  />
                ))}
              </div>
              <p className="text-zinc-600 mb-4 leading-relaxed">
                &quot;Finally a way to get honest feedback without the
                awkwardness!&quot;
              </p>
              <p className="text-zinc-500 text-sm font-medium">— Sarah M.</p>
            </div>

            <div className="bg-white p-6 rounded-2xl text-left border border-zinc-100 shadow-sm">
              <div className="flex gap-1 mb-4">
                {[...Array(5)].map((_, i) => (
                  <Star
                    key={i}
                    className="w-4 h-4 fill-amber-400 text-amber-400"
                  />
                ))}
              </div>
              <p className="text-zinc-600 mb-4 leading-relaxed">
                &quot;My followers love sending me secret messages. It&apos;s so
                fun!&quot;
              </p>
              <p className="text-zinc-500 text-sm font-medium">— Alex T.</p>
            </div>
          </div>
        </div>

        <div className="bg-gradient-to-r from-indigo-500 to-pink-500 rounded-3xl p-8 sm:p-12 text-white">
          <Zap className="w-10 h-10 text-white mx-auto mb-5" />
          <h3 className="text-2xl sm:text-3xl font-bold mb-3 text-white">
            Ready to get started?
          </h3>
          <p className="text-white/80 mb-8 max-w-md mx-auto text-white">
            Join thousands of people who are already receiving anonymous
            messages through GL.
          </p>

        </div>
      </main>

      <footer className="relative z-10 border-t border-zinc-100 mt-8">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 text-center text-zinc-400 text-sm">
          <p>&copy; 2026 GL. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
}