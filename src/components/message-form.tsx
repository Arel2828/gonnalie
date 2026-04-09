"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Send, Sparkles, CheckCircle } from "lucide-react";

const SPAM_WORDS = ["spam", "scam", "viagra", "casino", "lottery"];
const PROFANITY_WORDS = ["fuck", "shit", "damn", "ass", "bitch", "hell"];

function containsSpamOrProfanity(text: string): boolean {
  const lower = text.toLowerCase();
  return SPAM_WORDS.some((word) => lower.includes(word)) ||
    PROFANITY_WORDS.some((word) => lower.includes(word));
}

export function MessageForm({ username, shortId }: { username: string; shortId: string }) {
  const shortIdString = String(shortId);
  
  console.log("===== MessageForm PROPS =====");
  console.log("username:", username);
  console.log("shortId type:", typeof shortId);
  console.log("shortId value:", shortIdString);
  console.log("shortId length:", shortIdString.length);
  
  const [message, setMessage] = useState("");
  const [senderName, setSenderName] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  const prompts = [
    "What's something you've never told anyone?",
    "Send a compliment they deserve",
    "Your honest opinion on anything",
    "A secret confession",
    "A burning question",
  ];
  const [showPrompt, setShowPrompt] = useState(prompts[Math.floor(Math.random() * prompts.length)]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    console.log("===== SUBMIT FORM =====");
    console.log("Username:", username);
    console.log("ShortId:", shortId);
    console.log("Message length:", message.length);

    if (message.trim().length < 1) {
      setError("Message cannot be empty");
      return;
    }

    if (message.length > 500) {
      setError("Message must be less than 500 characters");
      return;
    }

    if (containsSpamOrProfanity(message)) {
      setError("Your message contains inappropriate content");
      return;
    }

    setIsSubmitting(true);

    try {
      const res = await fetch("/api/messages", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, content: message, senderName: senderName || null, shortId }),
      });

      if (res.ok) {
        setSuccess(true);
        setMessage("");
        setSenderName("");
        setTimeout(() => {
          setSuccess(false);
          setShowPrompt(prompts[Math.floor(Math.random() * prompts.length)]);
        }, 3000);
      } else {
        const data = await res.json();
        setError(data.error || "Failed to send message");
      }
    } catch {
      setError("Something went wrong");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (success) {
    return (
      <div className="text-center py-8">
        <div className="w-20 h-20 bg-emerald-500/20 border border-emerald-500/30 rounded-full mx-auto mb-4 flex items-center justify-center pulse-glow">
          <CheckCircle className="w-10 h-10 text-emerald-500" />
        </div>
        <h3 className="text-xl font-bold mb-2 gradient-text">
          Message Sent!
        </h3>
        <p className="text-zinc-500">Your anonymous message has been delivered.</p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <Input
          value={senderName}
          onChange={(e) => setSenderName(e.target.value)}
          placeholder="Fake username (optional)"
          className="bg-zinc-50 border-zinc-200 text-zinc-900 placeholder:text-zinc-400 mb-3"
        />
      </div>

      <div className="relative">
        <Textarea
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          placeholder={showPrompt}
          className="min-h-[140px] resize-none bg-zinc-50 border-zinc-200 text-zinc-900 placeholder:text-zinc-400"
        />
        <button
          type="button"
          onClick={() => setShowPrompt(prompts[Math.floor(Math.random() * prompts.length)])}
          className="absolute top-4 right-4 p-2 text-zinc-400 hover:text-indigo-500 hover:bg-indigo-500/10 rounded-xl transition-all cursor-pointer"
        >
          <Sparkles className="w-5 h-5" />
        </button>
      </div>

      <div className="flex items-center justify-between">
        {error && <p className="text-red-500 text-sm">{error}</p>}
        {!error && <span className="text-zinc-500 text-sm">{message.length}/500</span>}
      </div>

      <Button
        type="submit"
        disabled={isSubmitting}
        className="w-full gradient-bg text-white hover:opacity-90 rounded-xl h-14 text-base font-semibold shadow-lg shadow-indigo-500/20"
      >
        {isSubmitting ? (
          <span className="flex items-center gap-2">
            <Sparkles className="w-5 h-5 animate-spin" />
            Sending...
          </span>
        ) : (
          <span className="flex items-center gap-2">
            <Send className="w-5 h-5" />
            Send Anonymously
          </span>
        )}
      </Button>

      <p className="text-center text-zinc-500 text-xs">
        🔒 Your message will be completely anonymous
      </p>
    </form>
  );
}