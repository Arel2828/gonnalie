"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Plus } from "lucide-react";
import { createLink } from "@/app/actions/links";

export function CreateLinkButton() {
  const [isOpen, setIsOpen] = useState(false);
  const [name, setName] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleCreate = async () => {
    setIsLoading(true);
    try {
      await createLink(name || null);
      setName("");
      setIsOpen(false);
    } catch (error) {
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  if (!isOpen) {
    return (
      <Button 
        onClick={() => setIsOpen(true)} 
        className="bg-white/20 hover:bg-white/30 text-white rounded-xl px-4 py-2 text-sm font-medium flex items-center gap-2"
      >
        <Plus className="w-4 h-4" />
        Add Link
      </Button>
    );
  }

  return (
    <div className="flex items-center gap-2">
      <Input
        value={name}
        onChange={(e) => setName(e.target.value)}
        placeholder="Link name (optional)"
        className="bg-white/20 text-white placeholder:text-white/60 border-white/20 rounded-xl px-3 py-1 h-8 w-40 text-sm"
      />
      <Button
        onClick={handleCreate}
        disabled={isLoading}
        className="bg-white text-indigo-600 hover:bg-white/90 rounded-xl px-3 py-1 h-8 text-sm font-medium"
      >
        {isLoading ? "..." : "Add"}
      </Button>
      <Button
        onClick={() => setIsOpen(false)}
        variant="ghost"
        className="text-white hover:text-white/80 hover:bg-white/10 rounded-xl px-2 py-1 h-8 text-sm"
      >
        ✕
      </Button>
    </div>
  );
}