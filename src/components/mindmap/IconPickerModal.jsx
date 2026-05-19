import React, { useState, useRef } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { base44 } from "@/api/base44Client";
import { Upload, Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";

const EMOJI_CATEGORIES = {
  "Fréquents": ["⭐", "✅", "❌", "⚠️", "💡", "🔥", "🎯", "📌", "🔑", "💎", "🚀", "✨", "💬", "📊", "🧠", "🎨", "📝", "🔧", "🌟", "❤️"],
  "Visages": ["😀", "😃", "😄", "😊", "🥰", "😎", "🤔", "😮", "😢", "😡", "🤩", "🥳", "😴", "🤯", "🧐", "😇", "🤗", "😏", "🤭", "🤫"],
  "Nature": ["🌱", "🌿", "🌸", "🌺", "🌻", "🌲", "🌊", "⛰️", "🌈", "☀️", "🌙", "⭐", "🌍", "🌺", "🍀", "🦋", "🐝", "🦁", "🐬", "🦅"],
  "Objets": ["📱", "💻", "⌨️", "🖥️", "📷", "🎧", "📚", "✏️", "📎", "🔍", "💼", "🎒", "🔐", "📦", "🗂️", "📋", "🗝️", "⚙️", "🔋", "💡"],
  "Symboles": ["✔️", "❎", "🔴", "🟠", "🟡", "🟢", "🔵", "🟣", "⚫", "⚪", "🔶", "🔷", "🔸", "🔹", "▶️", "⏩", "⏸️", "🔄", "♾️", "⚡"],
  "Activités": ["🎮", "🏆", "⚽", "🎸", "🎭", "🎬", "🎯", "🎲", "🧩", "🎵", "🎤", "🏋️", "🚴", "✈️", "🚀", "🛠️", "🔬", "🧪", "🎓", "🏅"],
};

export default function IconPickerModal({ open, onClose, onSelect }) {
  const [search, setSearch] = useState("");
  const [activeTab, setActiveTab] = useState("Fréquents");
  const [uploading, setUploading] = useState(false);
  const fileRef = useRef(null);

  const allEmojis = Object.values(EMOJI_CATEGORIES).flat();
  const filtered = search
    ? allEmojis.filter((e) => e.includes(search))
    : EMOJI_CATEGORIES[activeTab] || [];

  const handleImageUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(true);
    const { file_url } = await base44.integrations.Core.UploadFile({ file });
    setUploading(false);
    onSelect({ type: "image", value: file_url });
    onClose(false);
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-sm">
        <DialogHeader>
          <DialogTitle className="text-base">Icône / Image</DialogTitle>
        </DialogHeader>

        <div className="space-y-3">
          {/* Search */}
          <Input
            placeholder="Rechercher un emoji..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="h-8 text-sm"
          />

          {/* Upload image */}
          <div>
            <input ref={fileRef} type="file" accept="image/*" className="hidden" onChange={handleImageUpload} />
            <Button
              variant="outline"
              size="sm"
              className="w-full gap-2"
              onClick={() => fileRef.current?.click()}
              disabled={uploading}
            >
              {uploading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Upload className="w-4 h-4" />}
              {uploading ? "Chargement..." : "Importer une image"}
            </Button>
          </div>

          {/* Category tabs */}
          {!search && (
            <div className="flex gap-1 flex-wrap">
              {Object.keys(EMOJI_CATEGORIES).map((cat) => (
                <button
                  key={cat}
                  onClick={() => setActiveTab(cat)}
                  className={cn(
                    "px-2 py-0.5 rounded text-xs transition-colors",
                    activeTab === cat ? "bg-primary text-primary-foreground" : "bg-muted hover:bg-muted/80 text-foreground/70"
                  )}
                >
                  {cat}
                </button>
              ))}
            </div>
          )}

          {/* Emoji grid */}
          <div className="grid grid-cols-8 gap-1 max-h-48 overflow-y-auto">
            {/* Remove icon option */}
            <button
              className="w-8 h-8 flex items-center justify-center rounded hover:bg-muted text-xs text-muted-foreground border border-dashed border-border"
              onClick={() => { onSelect(null); onClose(false); }}
              title="Aucune icône"
            >
              ✕
            </button>
            {filtered.map((emoji) => (
              <button
                key={emoji}
                className="w-8 h-8 flex items-center justify-center rounded hover:bg-muted text-lg transition-transform hover:scale-110"
                onClick={() => { onSelect({ type: "emoji", value: emoji }); onClose(false); }}
              >
                {emoji}
              </button>
            ))}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
