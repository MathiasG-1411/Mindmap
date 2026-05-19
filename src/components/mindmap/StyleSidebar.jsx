import React, { useState } from "react";
import { cn } from "@/lib/utils";
import { STYLES, SHAPES, BRANCH_STYLES } from "@/lib/mindMapUtils";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { X, Palette, GitBranch, Square, Type, StickyNote, PaintBucket, Smile, Sparkles, Bold, Italic, Underline } from "lucide-react";
import IconPickerModal from "@/components/mindmap/IconPickerModal";
import NodeAttachments from "@/components/mindmap/NodeAttachments";
import VisualStylePanel from "@/components/mindmap/VisualStylePanel";

const SIDEBAR_TABS = ["style", "visuel", "nœud"];

export default function StyleSidebar({
  open,
  onClose,
  currentStyle,
  onStyleChange,
  branchStyle,
  onBranchStyleChange,
  selectedNode,
  onNodeUpdate,
  visualConfig,
  onVisualConfigChange,
  onApplyPreset,
}) {
  const [showIconPicker, setShowIconPicker] = useState(false);
  const [sidebarTab, setSidebarTab] = useState("style");

  const handleIconSelect = (iconData) => {
    if (!selectedNode) return;
    if (!iconData) {
      onNodeUpdate(selectedNode.id, { icon: null, imageUrl: null });
    } else if (iconData.type === "emoji") {
      onNodeUpdate(selectedNode.id, { icon: iconData.value, imageUrl: null });
    } else if (iconData.type === "image") {
      onNodeUpdate(selectedNode.id, { imageUrl: iconData.value, icon: null });
    }
  };

  if (!open) return null;

  return (
    <>
    <div className="absolute right-0 top-0 bottom-0 w-72 bg-card/98 backdrop-blur-xl border-l border-border z-40 overflow-y-auto shadow-2xl">
      <div className="sticky top-0 bg-card/95 backdrop-blur-lg z-10 p-4 border-b border-border flex items-center justify-between">
        <h3 className="font-semibold text-sm">Propriétés</h3>
        <Button variant="ghost" size="icon" className="h-7 w-7" onClick={onClose}>
          <X className="h-4 w-4" />
        </Button>
      </div>

      <div className="sticky top-14 z-10 bg-card/90 backdrop-blur-sm border-b border-border px-4 pt-2 pb-0 flex gap-1">
        {SIDEBAR_TABS.map((tab) => (
          <button
            key={tab}
            onClick={() => setSidebarTab(tab)}
            className={cn(
              "px-3 py-1.5 text-xs font-medium capitalize rounded-t-lg border-b-2 transition-all",
              sidebarTab === tab
                ? "border-primary text-primary bg-primary/5"
                : "border-transparent text-muted-foreground hover:text-foreground"
            )}
          >
            {tab === "style" && "🎨 "}{tab === "visuel" && <><Sparkles className="w-3 h-3 inline mr-1" /></>}{tab === "nœud" && "◉ "}
            {tab.charAt(0).toUpperCase() + tab.slice(1)}
          </button>
        ))}
      </div>

      <div className="p-4 space-y-6">
        {sidebarTab === "visuel" && (
          <VisualStylePanel
            visualConfig={visualConfig}
            onVisualConfigChange={onVisualConfigChange}
            onApplyPreset={onApplyPreset}
          />
        )}

        {sidebarTab === "style" && <>
        <div className="space-y-3">
          <Label className="text-xs font-semibold text-muted-foreground uppercase tracking-wide flex items-center gap-2">
            <Palette className="w-3.5 h-3.5" /> Style visuel
          </Label>
          <div className="flex flex-col gap-2">
            {Object.entries(STYLES).map(([key, style]) => (
              <button
                key={key}
                onClick={() => onStyleChange(key)}
                className={cn(
                  "flex items-center gap-3 px-3 py-2.5 rounded-xl border transition-all text-left",
                  currentStyle === key
                    ? "border-primary bg-primary/10"
                    : "border-border hover:border-primary/30"
                )}
              >
                <div className="flex gap-0.5 shrink-0">
                  {style.colors.slice(0, 4).map((c, i) => (
                    <div
                      key={i}
                      className="w-3.5 h-6 first:rounded-l-md last:rounded-r-md"
                      style={{ backgroundColor: c }}
                    />
                  ))}
                </div>
                <div className="min-w-0">
                  <div className={cn(
                    "text-xs font-semibold leading-tight",
                    currentStyle === key ? "text-primary" : "text-foreground"
                  )}>
                    <span className="mr-1">{style.emoji}</span>{style.name}
                  </div>
                  {style.glowEffect && (
                    <div className="text-[10px] text-muted-foreground mt-0.5">Fond sombre · Effets lumineux</div>
                  )}
                  {style.organicBranches && (
                    <div className="text-[10px] text-muted-foreground mt-0.5">Formes organiques · Nature</div>
                  )}
                </div>
                {currentStyle === key && (
                  <div className="ml-auto w-1.5 h-1.5 rounded-full bg-primary shrink-0" />
                )}
              </button>
            ))}
          </div>
        </div>

        <div className="space-y-3">
          <Label className="text-xs font-semibold text-muted-foreground uppercase tracking-wide flex items-center gap-2">
            <GitBranch className="w-3.5 h-3.5" /> Style de branches
          </Label>
          <Select value={branchStyle} onValueChange={onBranchStyleChange}>
            <SelectTrigger className="h-9">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {Object.entries(BRANCH_STYLES).map(([key, label]) => (
                <SelectItem key={key} value={key}>{label}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        </>}

        {sidebarTab === "nœud" && selectedNode && (
          <p className="text-xs text-muted-foreground">Sélectionnez un nœud sur la carte pour l'éditer.</p>
        )}
        {sidebarTab === "nœud" && !selectedNode && (
          <p className="text-xs text-muted-foreground italic">Cliquez sur un nœud de la carte pour accéder à ses propriétés.</p>
        )}

        {selectedNode && sidebarTab === "nœud" && (
          <>
            <div className="h-px bg-border" />
            <div className="space-y-3">
              <Label className="text-xs font-semibold text-muted-foreground uppercase tracking-wide flex items-center gap-2">
                <Square className="w-3.5 h-3.5" /> Forme
              </Label>
              <div className="grid grid-cols-3 gap-2">
                {Object.entries(SHAPES).map(([key, shape]) => (
                  <button
                    key={key}
                    onClick={() => onNodeUpdate(selectedNode.id, { shape: key })}
                    className={cn(
                      "px-2 py-1.5 rounded-lg text-xs border transition-all",
                      selectedNode.shape === key
                        ? "border-primary bg-primary/10 text-primary"
                        : "border-border hover:border-primary/30 text-foreground/70"
                    )}
                  >
                    {shape.name}
                  </button>
                ))}
              </div>
            </div>

            <div className="space-y-3">
              <Label className="text-xs font-semibold text-muted-foreground uppercase tracking-wide flex items-center gap-2">
                <Palette className="w-3.5 h-3.5" /> Couleur de bordure
              </Label>
              <div className="flex flex-wrap gap-2">
                {STYLES[currentStyle].colors.map((c) => (
                  <button
                    key={c}
                    onClick={() => onNodeUpdate(selectedNode.id, { color: c })}
                    className={cn(
                      "w-7 h-7 rounded-full border-2 transition-transform hover:scale-110",
                      selectedNode.color === c ? "border-foreground scale-110" : "border-transparent"
                    )}
                    style={{ backgroundColor: c }}
                  />
                ))}
                <Input
                  type="color"
                  value={selectedNode.color || "#6C5CE7"}
                  onChange={(e) => onNodeUpdate(selectedNode.id, { color: e.target.value })}
                  className="w-7 h-7 p-0 border-0 rounded-full cursor-pointer"
                />
              </div>
            </div>

            <div className="space-y-3">
              <Label className="text-xs font-semibold text-muted-foreground uppercase tracking-wide flex items-center gap-2">
                <PaintBucket className="w-3.5 h-3.5" /> Couleur de fond
              </Label>
              <div className="flex flex-wrap gap-2 items-center">
                <button
                  onClick={() => onNodeUpdate(selectedNode.id, { bgColor: null })}
                  className={cn(
                    "w-7 h-7 rounded-full border-2 transition-transform hover:scale-110 flex items-center justify-center text-[9px] font-bold",
                    !selectedNode.bgColor ? "border-foreground scale-110 bg-muted" : "border-border bg-muted/50"
                  )}
                  title="Automatique"
                >
                  A
                </button>
                {["#ffffff", "#1a1a1a", "#fff9db", "#e8f4fd", "#f0fdf4", "#fef2f2", "#f5f3ff", "#fff7ed"].map((c) => (
                  <button
                    key={c}
                    onClick={() => onNodeUpdate(selectedNode.id, { bgColor: c })}
                    className={cn(
                      "w-7 h-7 rounded-full border-2 transition-transform hover:scale-110",
                      selectedNode.bgColor === c ? "border-foreground scale-110" : "border-border"
                    )}
                    style={{ backgroundColor: c }}
                  />
                ))}
                <Input
                  type="color"
                  value={selectedNode.bgColor || "#ffffff"}
                  onChange={(e) => onNodeUpdate(selectedNode.id, { bgColor: e.target.value })}
                  className="w-7 h-7 p-0 border-0 rounded-full cursor-pointer"
                />
              </div>
              <p className="text-[10px] text-muted-foreground">
                La couleur du texte s'ajuste automatiquement selon le fond.
              </p>
            </div>

            <div className="space-y-3">
              <Label className="text-xs font-semibold text-muted-foreground uppercase tracking-wide flex items-center gap-2">
                <Type className="w-3.5 h-3.5" /> Mise en forme du texte
              </Label>
              <div className="flex gap-2">
                <button
                  onClick={() => onNodeUpdate(selectedNode.id, { bold: !selectedNode.bold })}
                  className={cn(
                    "flex-1 flex items-center justify-center gap-1.5 py-2 rounded-lg border text-xs font-bold transition-all",
                    selectedNode.bold ? "border-primary bg-primary/10 text-primary" : "border-border hover:border-primary/30"
                  )}
                >
                  <Bold className="w-4 h-4" /> Gras
                </button>
                <button
                  onClick={() => onNodeUpdate(selectedNode.id, { italic: !selectedNode.italic })}
                  className={cn(
                    "flex-1 flex items-center justify-center gap-1.5 py-2 rounded-lg border text-xs italic transition-all",
                    selectedNode.italic ? "border-primary bg-primary/10 text-primary" : "border-border hover:border-primary/30"
                  )}
                >
                  <Italic className="w-4 h-4" /> Italique
                </button>
                <button
                  onClick={() => onNodeUpdate(selectedNode.id, { underline: !selectedNode.underline })}
                  className={cn(
                    "flex-1 flex items-center justify-center gap-1.5 py-2 rounded-lg border text-xs underline transition-all",
                    selectedNode.underline ? "border-primary bg-primary/10 text-primary" : "border-border hover:border-primary/30"
                  )}
                >
                  <Underline className="w-4 h-4" /> Souligné
                </button>
              </div>
            </div>

            <div className="space-y-3">
              <Label className="text-xs font-semibold text-muted-foreground uppercase tracking-wide flex items-center gap-2">
                <Type className="w-3.5 h-3.5" /> Taille du texte
              </Label>
              <Select
                value={String(selectedNode.fontSize || 14)}
                onValueChange={(v) => onNodeUpdate(selectedNode.id, { fontSize: Number(v) })}
              >
                <SelectTrigger className="h-9">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {[10, 12, 14, 16, 18, 20, 24, 28, 32].map((s) => (
                    <SelectItem key={s} value={String(s)}>{s}px</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-3">
              <Label className="text-xs font-semibold text-muted-foreground uppercase tracking-wide flex items-center gap-2">
                <Smile className="w-3.5 h-3.5" /> Icône / Image
              </Label>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setShowIconPicker(true)}
                  className="flex items-center gap-2 px-3 py-1.5 rounded-lg border border-border hover:border-primary/40 bg-muted/50 text-sm transition-colors"
                >
                  {selectedNode.imageUrl ? (
                    <img src={selectedNode.imageUrl} alt="" className="w-5 h-5 rounded object-cover" />
                  ) : selectedNode.icon ? (
                    <span className="text-lg leading-none">{selectedNode.icon}</span>
                  ) : (
                    <Smile className="w-4 h-4 text-muted-foreground" />
                  )}
                  <span className="text-muted-foreground text-xs">
                    {selectedNode.icon || selectedNode.imageUrl ? "Changer" : "Ajouter"}
                  </span>
                </button>
                {(selectedNode.icon || selectedNode.imageUrl) && (
                  <button
                    onClick={() => onNodeUpdate(selectedNode.id, { icon: null, imageUrl: null })}
                    className="text-xs text-muted-foreground hover:text-destructive transition-colors"
                  >
                    Retirer
                  </button>
                )}
              </div>
            </div>

            <div className="space-y-3">
              <Label className="text-xs font-semibold text-muted-foreground uppercase tracking-wide flex items-center gap-2">
                <StickyNote className="w-3.5 h-3.5" /> Note cachée
              </Label>
              <Textarea
                value={selectedNode.note || ""}
                onChange={(e) => onNodeUpdate(selectedNode.id, { note: e.target.value })}
                placeholder="Ajouter une note..."
                className="h-20 text-sm resize-none"
              />
            </div>

            <div className="h-px bg-border" />
            <NodeAttachments selectedNode={selectedNode} onNodeUpdate={onNodeUpdate} />
          </>
        )}
      </div>
    </div>
    <IconPickerModal
        open={showIconPicker}
        onClose={setShowIconPicker}
        onSelect={handleIconSelect}
      />
    </>
  );
}
