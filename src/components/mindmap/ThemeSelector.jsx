import React from "react";
import { cn } from "@/lib/utils";

export const THEMES = {
  // Image 1 : Sketch – fond blanc, formes colorées arrondies, style croquis à la main
  sketch: {
    name: "Sketch",
    root: {
      background: "#f87171",
      color: "#ffffff",
      border: "3px solid #ef4444",
      fontFamily: "'Patrick Hand', cursive",
      boxShadow: "3px 3px 0px #ef4444",
    },
    nodeBg: "#fef9c3",
    nodeText: "#1e293b",
    colors: ["#f87171", "#34d399", "#fbbf24", "#60a5fa", "#a78bfa", "#fb923c", "#f472b6", "#4ade80"],
    canvasBg: "#ffffff",
    edgeStyle: "curved",
    fontFamily: "'Patrick Hand', cursive",
    borderStyle: "3px solid",
    nodeShadow: "2px 2px 0px",
  },

  // Image 2 : Tableau / Fiche scolaire – fond ligné beige, branches colorées vives, style pédagogique
  school: {
    name: "Fiche scolaire",
    root: {
      background: "#6366f1",
      color: "#ffffff",
      fontFamily: "'Caveat', cursive",
      borderRadius: "50%",
      width: "120px",
      height: "120px",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      fontWeight: "700",
    },
    nodeBg: "#fefce8",
    nodeText: "#1e293b",
    colors: ["#6366f1", "#10b981", "#f59e0b", "#ef4444", "#8b5cf6", "#ec4899", "#0ea5e9", "#14b8a6"],
    canvasBg: "#fefce8",
    canvasPattern: "lines",
    edgeStyle: "organic",
    fontFamily: "'Caveat', cursive",
    borderStyle: "2px solid",
  },

  // Image 3 : Corporate – fond blanc, nœuds colorés pleins, branches épaisses colorées par section
  corporate: {
    name: "Corporate",
    root: {
      background: "linear-gradient(135deg, #1e293b 0%, #334155 100%)",
      color: "#ffffff",
      fontFamily: "'Inter', sans-serif",
      fontWeight: "700",
    },
    nodeBg: "#10b981",
    nodeText: "#ffffff",
    colors: ["#10b981", "#f59e0b", "#6366f1", "#ef4444", "#0ea5e9", "#8b5cf6", "#ec4899", "#14b8a6"],
    canvasBg: "#f8fafc",
    edgeStyle: "curved",
    fontFamily: "'Inter', sans-serif",
    borderStyle: "none",
    nodeBgs: ["#10b981", "#f59e0b", "#6366f1", "#ef4444", "#0ea5e9", "#8b5cf6"],
    solidNodes: true,
  },

  // Image 4 : Notebook – fond papier ligné jaune, doodle hand-drawn, formes colorées irrégulières
  notebook: {
    name: "Notebook",
    root: {
      background: "#fbbf24",
      color: "#1e293b",
      fontFamily: "'Patrick Hand', cursive",
      border: "3px solid #92400e",
      fontWeight: "700",
      boxShadow: "4px 4px 0px #92400e",
    },
    nodeBg: "#fff",
    nodeText: "#1e293b",
    colors: ["#fbbf24", "#f472b6", "#34d399", "#60a5fa", "#fb923c", "#a78bfa", "#f87171", "#4ade80"],
    canvasBg: "#fef9c3",
    canvasPattern: "lines",
    edgeStyle: "straight",
    fontFamily: "'Patrick Hand', cursive",
    borderStyle: "2.5px solid #64748b",
    nodeShadow: "3px 3px 0px #64748b",
  },

  // Bonus : Dark Mode classique
  dark: {
    name: "Dark Mode",
    root: {
      background: "linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%)",
      color: "#ffffff",
      fontFamily: "'Inter', sans-serif",
    },
    nodeBg: "#1e293b",
    nodeText: "#e2e8f0",
    colors: ["#818cf8", "#34d399", "#fbbf24", "#f87171", "#a78bfa", "#f472b6", "#38bdf8", "#2dd4bf"],
    canvasBg: "#0f172a",
    edgeStyle: "curved",
    fontFamily: "'Inter', sans-serif",
    borderStyle: "2px solid",
  },

  // Bonus : Moderne minimaliste (l'ancien "default")
  default: {
    name: "Moderne",
    root: {
      background: "linear-gradient(135deg, #1e293b 0%, #334155 100%)",
      color: "#ffffff",
      fontFamily: "'Inter', sans-serif",
    },
    nodeBg: "#ffffff",
    nodeText: "#334155",
    colors: ["#6366f1", "#10b981", "#f59e0b", "#ef4444", "#8b5cf6", "#ec4899", "#0ea5e9", "#14b8a6"],
    canvasBg: "#f8fafc",
    edgeStyle: "curved",
    fontFamily: "'Inter', sans-serif",
    borderStyle: "2px solid",
  },
};

const THEME_PREVIEWS = {
  sketch: { emoji: "✏️", colors: ["#f87171", "#34d399", "#fbbf24", "#60a5fa"], bg: "#ffffff" },
  school: { emoji: "📚", colors: ["#6366f1", "#10b981", "#f59e0b", "#ef4444"], bg: "#fefce8" },
  corporate: { emoji: "💼", colors: ["#10b981", "#f59e0b", "#6366f1", "#0ea5e9"], bg: "#f8fafc" },
  notebook: { emoji: "📒", colors: ["#fbbf24", "#f472b6", "#34d399", "#60a5fa"], bg: "#fef9c3" },
  dark: { emoji: "🌙", colors: ["#818cf8", "#34d399", "#fbbf24", "#f87171"], bg: "#0f172a" },
  default: { emoji: "⚡", colors: ["#6366f1", "#10b981", "#f59e0b", "#ef4444"], bg: "#f8fafc" },
};

export default function ThemeSelector({ currentTheme, onThemeChange }) {
  return (
    <div className="grid grid-cols-2 gap-2">
      {Object.entries(THEMES).map(([key, theme]) => {
        const preview = THEME_PREVIEWS[key];
        const isActive = currentTheme === key;
        return (
          <button
            key={key}
            onClick={() => onThemeChange(key)}
            className={cn(
              "rounded-xl border overflow-hidden text-left transition-all",
              isActive
                ? "border-indigo-500 ring-2 ring-indigo-300 shadow-md"
                : "border-slate-200 hover:border-indigo-300 hover:shadow-sm"
            )}
          >
            {/* Mini canvas preview */}
            <div
              className="h-12 flex items-center justify-center gap-1 px-2"
              style={{ background: preview.bg }}
            >
              {preview.colors.map((c, i) => (
                <div
                  key={i}
                  className="rounded-full shrink-0"
                  style={{
                    width: i === 0 ? 20 : 12,
                    height: i === 0 ? 20 : 12,
                    background: c,
                    border: key === "sketch" || key === "notebook" ? `2px solid ${c}99` : "none",
                    boxShadow: key === "sketch" || key === "notebook" ? `1px 1px 0 ${c}66` : "none",
                  }}
                />
              ))}
            </div>
            {/* Label */}
            <div className={cn(
              "px-2 py-1.5 flex items-center gap-1.5",
              isActive ? "bg-indigo-50" : "bg-white"
            )}>
              <span className="text-sm">{preview.emoji}</span>
              <span className={cn(
                "text-xs font-medium truncate",
                isActive ? "text-indigo-700" : "text-slate-600"
              )}>
                {theme.name}
              </span>
            </div>
          </button>
        );
      })}
    </div>
  );
}
