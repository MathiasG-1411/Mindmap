import React from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";

// Formats: width x height in px at 96dpi (approx A-series landscape / portrait)
export const PAGE_FORMATS = {
  free:      { label: "Libre",         w: null,  h: null,  desc: "Canvas infini" },
  a4l:       { label: "A4 Paysage",    w: 1123,  h: 794,   desc: "297 × 210 mm" },
  a4p:       { label: "A4 Portrait",   w: 794,   h: 1123,  desc: "210 × 297 mm" },
  a3l:       { label: "A3 Paysage",    w: 1587,  h: 1123,  desc: "420 × 297 mm" },
  a3p:       { label: "A3 Portrait",   w: 1123,  h: 1587,  desc: "297 × 420 mm" },
  a5l:       { label: "A5 Paysage",    w: 794,   h: 559,   desc: "210 × 148 mm" },
  a5p:       { label: "A5 Portrait",   w: 559,   h: 794,   desc: "148 × 210 mm" },
  slide169:  { label: "Présentation",  w: 1280,  h: 720,   desc: "16:9 (1280×720)" },
};

export default function FormatPickerModal({ open, onSelect }) {
  return (
    <Dialog open={open} onOpenChange={() => {}}>
      <DialogContent className="max-w-lg" hideClose>
        <DialogHeader>
          <DialogTitle className="text-lg font-semibold">Choisir un format</DialogTitle>
          <p className="text-sm text-muted-foreground">
            Sélectionnez la taille de votre carte mentale. Vous pourrez la changer plus tard.
          </p>
        </DialogHeader>
        <div className="grid grid-cols-2 gap-3 mt-2">
          {Object.entries(PAGE_FORMATS).map(([key, fmt]) => (
            <button
              key={key}
              onClick={() => onSelect(key)}
              className="flex flex-col items-center justify-center gap-1.5 border-2 border-border rounded-xl p-4 hover:border-primary hover:bg-primary/5 transition-all group"
            >
              {/* Mini page preview */}
              <div
                className="bg-white border border-border rounded shadow-sm group-hover:border-primary transition-colors"
                style={{
                  width: key === "free" ? 48 : Math.round((fmt.w / Math.max(fmt.w, fmt.h)) * 48),
                  height: key === "free" ? 48 : Math.round((fmt.h / Math.max(fmt.w, fmt.h)) * 48),
                  background: key === "free" ? "repeating-linear-gradient(45deg,#e2e8f0 0,#e2e8f0 1px,#fff 0,#fff 50%) center/8px 8px" : undefined,
                }}
              />
              <span className="text-sm font-medium text-foreground">{fmt.label}</span>
              <span className="text-xs text-muted-foreground">{fmt.desc}</span>
            </button>
          ))}
        </div>
      </DialogContent>
    </Dialog>
  );
}
