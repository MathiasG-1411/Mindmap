import React, { useState } from "react";
import { cn } from "@/lib/utils";
import { BACKGROUND_STYLES, NODE_STYLES, TEXT_STYLES, PRESET_STYLES, DECORATIONS } from "@/lib/visualStyles";
import { STYLES } from "@/lib/mindMapUtils";
import { Sparkles, Image, Circle, Type, Layers } from "lucide-react";

const TAB_ICONS = {
  presets: Sparkles,
  background: Image,
  nodes: Circle,
  text: Type,
  decorations: Layers,
};

const TABS = [
  { key: "presets", label: "Combos" },
  { key: "background", label: "Fond" },
  { key: "nodes", label: "Bulles" },
  { key: "text", label: "Texte" },
  { key: "decorations", label: "Effets" },
];

export default function VisualStylePanel({ visualConfig, onVisualConfigChange, onApplyPreset }) {
  const [activeTab, setActiveTab] = useState("presets");

  const update = (key, value) => onVisualConfigChange({ ...visualConfig, [key]: value });

  return (
    <div className="space-y-4">
      <div className="flex gap-1 bg-muted rounded-xl p-1 overflow-x-auto">
        {TABS.map(({ key, label }) => {
          const Icon = TAB_ICONS[key];
          return (
            <button
              key={key}
              onClick={() => setActiveTab(key)}
              className={cn(
                "flex items-center gap-1 px-2.5 py-1.5 rounded-lg text-[11px] font-medium transition-all whitespace-nowrap flex-1 justify-center",
                activeTab === key
                  ? "bg-card shadow text-foreground"
                  : "text-muted-foreground hover:text-foreground"
              )}
            >
              <Icon className="w-3 h-3" />
              {label}
            </button>
          );
        })}
      </div>

      {activeTab === "presets" && (
        <div className="flex flex-col gap-2">
          {Object.entries(PRESET_STYLES).map(([key, preset]) => {
            const bg = BACKGROUND_STYLES[preset.background];
            const isActive = visualConfig.presetKey === key;
            return (
              <button
                key={key}
                onClick={() => { onApplyPreset(key, preset); update("presetKey", key); }}
                className={cn(
                  "flex items-center gap-3 p-3 rounded-xl border text-left transition-all",
                  isActive ? "border-primary bg-primary/5" : "border-border hover:border-primary/30"
                )}
              >
                <div
                  className="w-12 h-10 rounded-lg shrink-0 border border-border/50 overflow-hidden flex items-center justify-center text-xl"
                  style={bg?.style || {}}
                >
                  <span className="drop-shadow">{preset.emoji}</span>
                </div>
                <div className="min-w-0">
                  <div className={cn("text-xs font-bold", isActive && "text-primary")}>{preset.name}</div>
                  <div className="text-[10px] text-muted-foreground mt-0.5 leading-tight">{preset.description}</div>
                </div>
                {isActive && <div className="ml-auto w-2 h-2 rounded-full bg-primary shrink-0" />}
              </button>
            );
          })}
        </div>
      )}

      {activeTab === "background" && (
        <div className="grid grid-cols-2 gap-2">
          {Object.entries(BACKGROUND_STYLES).map(([key, bg]) => {
            const isActive = visualConfig.background === key;
            return (
              <button
                key={key}
                onClick={() => update("background", key)}
                className={cn(
                  "flex flex-col items-center gap-1.5 p-2 rounded-xl border transition-all",
                  isActive ? "border-primary bg-primary/5" : "border-border hover:border-primary/30"
                )}
              >
                <div
                  className="w-full h-14 rounded-lg border border-border/30 overflow-hidden"
                  style={bg.style}
                />
                <span className={cn("text-[10px] font-medium text-center leading-tight", isActive && "text-primary")}>
                  {bg.emoji} {bg.name}
                </span>
                <span className="text-[9px] text-muted-foreground capitalize">{bg.intensity}</span>
              </button>
            );
          })}
        </div>
      )}

      {activeTab === "nodes" && (
        <div className="flex flex-col gap-2">
          {Object.entries(NODE_STYLES).map(([key, ns]) => {
            const isActive = visualConfig.nodeStyle === key;
            return (
              <button
                key={key}
                onClick={() => update("nodeStyle", key)}
                className={cn(
                  "flex items-center gap-3 px-3 py-2.5 rounded-xl border text-left transition-all",
                  isActive ? "border-primary bg-primary/5" : "border-border hover:border-primary/30"
                )}
              >
                <div
                  className="w-14 h-8 shrink-0 flex items-center justify-center text-[10px] font-semibold text-primary"
                  style={{
                    borderRadius: ns.borderRadius,
                    border: ns.borderStyle.replace("currentColor", "#6C5CE7"),
                    borderColor: "#6C5CE7",
                    boxShadow: ns.shadow,
                    backgroundColor: "#f0edff",
                  }}
                >
                  Idée
                </div>
                <div>
                  <div className={cn("text-xs font-semibold", isActive && "text-primary")}>
                    {ns.emoji} {ns.name}
                  </div>
                </div>
                {isActive && <div className="ml-auto w-2 h-2 rounded-full bg-primary shrink-0" />}
              </button>
            );
          })}
        </div>
      )}

      {activeTab === "text" && (
        <div className="flex flex-col gap-2">
          {Object.entries(TEXT_STYLES).map(([key, ts]) => {
            const isActive = visualConfig.textStyle === key;
            return (
              <button
                key={key}
                onClick={() => update("textStyle", key)}
                className={cn(
                  "flex items-center gap-3 px-3 py-3 rounded-xl border text-left transition-all",
                  isActive ? "border-primary bg-primary/5" : "border-border hover:border-primary/30"
                )}
              >
                <span
                  className={cn("text-lg font-bold shrink-0 w-8 text-center text-primary", ts.fontFamily)}
                  style={{ fontWeight: ts.titleWeight }}
                >
                  {ts.emoji}
                </span>
                <div>
                  <div className={cn("text-xs font-semibold", isActive && "text-primary")}>{ts.name}</div>
                  <div className="text-[10px] text-muted-foreground mt-0.5">{ts.usage}</div>
                  <div className={cn("text-[11px] mt-1 text-foreground/70", ts.fontFamily)}>
                    Titre · Contenu · Mot-clé
                  </div>
                </div>
                {isActive && <div className="ml-auto w-2 h-2 rounded-full bg-primary shrink-0" />}
              </button>
            );
          })}
        </div>
      )}

      {activeTab === "decorations" && (
        <div className="grid grid-cols-2 gap-2">
          {Object.entries(DECORATIONS).map(([key, dec]) => {
            const isActive = visualConfig.decoration === key;
            return (
              <button
                key={key}
                onClick={() => update("decoration", key)}
                className={cn(
                  "flex flex-col items-center gap-1.5 p-3 rounded-xl border text-left transition-all",
                  isActive ? "border-primary bg-primary/5" : "border-border hover:border-primary/30"
                )}
              >
                <span className="text-xl">{dec.emoji}</span>
                <span className={cn("text-[10px] font-medium text-center", isActive && "text-primary")}>
                  {dec.name}
                </span>
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}
