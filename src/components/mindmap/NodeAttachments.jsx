import React, { useRef, useState } from "react";
import { base44 } from "@/api/base44Client";
import { Label } from "@/components/ui/label";
import { Paperclip, Upload, Loader2, X, FileText, Image, File, ExternalLink } from "lucide-react";
import { cn } from "@/lib/utils";

function fileIcon(name) {
  const ext = name?.split(".").pop()?.toLowerCase();
  if (["jpg", "jpeg", "png", "gif", "webp", "svg"].includes(ext)) return <Image className="w-3.5 h-3.5" />;
  if (["pdf"].includes(ext)) return <FileText className="w-3.5 h-3.5 text-red-500" />;
  return <File className="w-3.5 h-3.5" />;
}

function fileName(url) {
  try { return decodeURIComponent(url.split("/").pop().split("?")[0]); }
  catch { return "Fichier"; }
}

export default function NodeAttachments({ selectedNode, onNodeUpdate }) {
  const inputRef = useRef(null);
  const [uploading, setUploading] = useState(false);

  const attachments = selectedNode?.attachments || [];

  const handleFiles = async (files) => {
    if (!files?.length) return;
    setUploading(true);
    const newAttachments = [...attachments];
    for (const file of Array.from(files)) {
      const { file_url } = await base44.integrations.Core.UploadFile({ file });
      newAttachments.push({ url: file_url, name: file.name, size: file.size });
    }
    onNodeUpdate(selectedNode.id, { attachments: newAttachments });
    setUploading(false);
  };

  const handleRemove = (idx) => {
    const updated = attachments.filter((_, i) => i !== idx);
    onNodeUpdate(selectedNode.id, { attachments: updated });
  };

  const handleDrop = (e) => {
    e.preventDefault();
    handleFiles(e.dataTransfer.files);
  };

  return (
    <div className="space-y-3">
      <Label className="text-xs font-semibold text-muted-foreground uppercase tracking-wide flex items-center gap-2">
        <Paperclip className="w-3.5 h-3.5" /> Fichiers attachés
      </Label>

      {attachments.length > 0 && (
        <div className="space-y-1.5">
          {attachments.map((att, idx) => (
            <div
              key={idx}
              className="flex items-center gap-2 px-3 py-2 rounded-lg bg-muted/50 border border-border group"
            >
              <span className="flex-shrink-0 text-muted-foreground">{fileIcon(att.name)}</span>
              <span className="flex-1 text-xs truncate text-foreground/80">{att.name || fileName(att.url)}</span>
              <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                <a
                  href={att.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-0.5 rounded hover:bg-primary/10 text-muted-foreground hover:text-primary"
                  title="Ouvrir"
                >
                  <ExternalLink className="w-3 h-3" />
                </a>
                <button
                  onClick={() => handleRemove(idx)}
                  className="p-0.5 rounded hover:bg-destructive/10 text-muted-foreground hover:text-destructive"
                  title="Supprimer"
                >
                  <X className="w-3 h-3" />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      <div
        onDrop={handleDrop}
        onDragOver={(e) => e.preventDefault()}
        onClick={() => !uploading && inputRef.current?.click()}
        className={cn(
          "flex flex-col items-center justify-center gap-2 p-4 rounded-lg border-2 border-dashed border-border",
          "hover:border-primary/40 hover:bg-primary/5 cursor-pointer transition-all",
          uploading && "pointer-events-none opacity-60"
        )}
      >
        {uploading ? (
          <>
            <Loader2 className="w-5 h-5 text-primary animate-spin" />
            <span className="text-xs text-muted-foreground">Upload en cours…</span>
          </>
        ) : (
          <>
            <Upload className="w-5 h-5 text-muted-foreground" />
            <span className="text-xs text-muted-foreground text-center">
              Glisser-déposer ou cliquer<br />
              <span className="text-[10px]">PDF, images, documents…</span>
            </span>
          </>
        )}
      </div>

      <input
        ref={inputRef}
        type="file"
        multiple
        className="hidden"
        onChange={(e) => handleFiles(e.target.files)}
      />
    </div>
  );
}
