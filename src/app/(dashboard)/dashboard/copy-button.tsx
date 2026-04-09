"use client";

import { Copy, Check } from "lucide-react";
import { useState } from "react";

export function CopyLinkButton({ link }: { link: string }) {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    await navigator.clipboard.writeText(link);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <button
      onClick={handleCopy}
      className="flex items-center justify-center gap-2 gradient-bg text-white px-6 py-4 rounded-xl hover:opacity-90 transition-all hover:scale-105 font-medium shadow-lg shadow-indigo-500/20 cursor-pointer"
      title="Copy link"
    >
      {copied ? (
        <>
          <Check className="w-5 h-5" />
          <span>Copied!</span>
        </>
      ) : (
        <>
          <Copy className="w-5 h-5" />
          <span>Copy</span>
        </>
      )}
    </button>
  );
}