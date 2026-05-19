import React from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { TEMPLATES } from "@/lib/mindMapUtils";
import { cn } from "@/lib/utils";

export default function TemplateModal({ open, onClose, onSelect }) {
  const categories = [...new Set(TEMPLATES.map((t) => t.category))];

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-lg">
        <DialogHeader>
          <DialogTitle className="text-lg">Choisir un modèle</DialogTitle>
        </DialogHeader>
        <div className="space-y-6 mt-2">
          {categories.map((cat) => (
            <div key={cat}>
              <h4 className="text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-3">
                {cat}
              </h4>
              <div className="grid grid-cols-2 gap-3">
                {TEMPLATES.filter((t) => t.category === cat).map((template) => (
                  <button
                    key={template.id}
                    onClick={() => { onSelect(template); onClose(false); }}
                    className={cn(
                      "p-4 rounded-xl border border-border bg-card text-left",
                      "hover:border-primary/50 hover:shadow-md transition-all duration-200",
                      "group"
                    )}
                  >
                    <span className="text-2xl mb-2 block">{template.icon}</span>
                    <p className="font-medium text-sm group-hover:text-primary transition-colors">
                      {template.name}
                    </p>
                    <p className="text-xs text-muted-foreground mt-1">{template.description}</p>
                  </button>
                ))}
              </div>
            </div>
          ))}
        </div>
      </DialogContent>
    </Dialog>
  );
}
