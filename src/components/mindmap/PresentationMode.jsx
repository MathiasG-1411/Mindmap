import React, { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, ChevronLeft, ChevronRight, Play, Pause } from "lucide-react";
import ReactMarkdown from "react-markdown";

function buildSequence(nodes) {
  if (!nodes.length) return [];
  const root = nodes.find((n) => !n.parentId);
  if (!root) return [];

  const sequence = [];
  const queue = [root];
  while (queue.length) {
    const node = queue.shift();
    sequence.push(node);
    const children = nodes.filter((n) => n.parentId === node.id);
    children.forEach((c) => queue.push(c));
  }
  return sequence;
}

function getLuminance(hex) {
  const c = (hex || "").replace("#", "");
  if (c.length < 6) return 0.5;
  const r = parseInt(c.slice(0, 2), 16) / 255;
  const g = parseInt(c.slice(2, 4), 16) / 255;
  const b = parseInt(c.slice(4, 6), 16) / 255;
  const toLinear = (v) => (v <= 0.03928 ? v / 12.92 : Math.pow((v + 0.055) / 1.055, 2.4));
  return 0.2126 * toLinear(r) + 0.7152 * toLinear(g) + 0.0722 * toLinear(b);
}

export default function PresentationMode({ nodes, styleConfig, onClose }) {
  const sequence = buildSequence(nodes);
  const [index, setIndex] = useState(0);
  const [autoPlay, setAutoPlay] = useState(false);

  const current = sequence[index];
  const children = current ? nodes.filter((n) => n.parentId === current.id) : [];
  const parent = current?.parentId ? nodes.find((n) => n.id === current.parentId) : null;
  const progress = sequence.length > 1 ? index / (sequence.length - 1) : 1;

  const goNext = useCallback(() => setIndex((i) => Math.min(i + 1, sequence.length - 1)), [sequence.length]);
  const goPrev = useCallback(() => setIndex((i) => Math.max(i - 1, 0)), []);

  useEffect(() => {
    if (!autoPlay) return;
    const timer = setInterval(() => {
      setIndex((i) => {
        if (i >= sequence.length - 1) { setAutoPlay(false); return i; }
        return i + 1;
      });
    }, 3000);
    return () => clearInterval(timer);
  }, [autoPlay, sequence.length]);

  useEffect(() => {
    const onKey = (e) => {
      if (e.key === "ArrowRight" || e.key === "ArrowDown" || e.key === " ") { e.preventDefault(); goNext(); }
      if (e.key === "ArrowLeft" || e.key === "ArrowUp") { e.preventDefault(); goPrev(); }
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [goNext, goPrev, onClose]);

  if (!current) return null;

  const color = current.color || styleConfig?.colors?.[0] || "#6C5CE7";
  const bgColor = current.bgColor;
  const textColor = bgColor ? (getLuminance(bgColor) > 0.35 ? "#1a1a1a" : "#ffffff") : undefined;

  return (
    <div className="fixed inset-0 z-50 bg-black flex flex-col select-none">
      <div className="flex items-center justify-between px-6 py-3 bg-black/80 backdrop-blur-sm">
        <div className="flex items-center gap-3">
          <span className="text-white/50 text-sm font-mono">{index + 1} / {sequence.length}</span>
          {parent && (
            <span className="text-white/40 text-xs px-2 py-0.5 rounded-full bg-white/10">
              ↳ {parent.text.replace(/[*_#\[\]]/g, "").slice(0, 30)}
            </span>
          )}
        </div>
        <div className="flex-1 mx-6 h-1 bg-white/10 rounded-full overflow-hidden">
          <motion.div
            className="h-full rounded-full"
            style={{ backgroundColor: color }}
            animate={{ width: `${progress * 100}%` }}
            transition={{ duration: 0.4 }}
          />
        </div>
        <button
          onClick={onClose}
          className="text-white/60 hover:text-white transition-colors p-1 rounded"
        >
          <X className="w-5 h-5" />
        </button>
      </div>

      <div className="flex-1 flex items-center justify-center px-12 py-8">
        <AnimatePresence mode="wait">
          <motion.div
            key={current.id}
            initial={{ opacity: 0, scale: 0.85, y: 30 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 1.1, y: -20 }}
            transition={{ duration: 0.4, ease: "easeOut" }}
            className="max-w-3xl w-full"
          >
            {(current.icon || current.imageUrl) && (
              <div className="flex justify-center mb-6">
                {current.imageUrl ? (
                  <img src={current.imageUrl} alt="" className="w-20 h-20 rounded-2xl object-cover shadow-2xl" />
                ) : (
                  <span className="text-6xl">{current.icon}</span>
                )}
              </div>
            )}

            <div
              className="rounded-3xl px-10 py-8 text-center shadow-2xl"
              style={{
                backgroundColor: bgColor || color + "22",
                border: `3px solid ${color}`,
                color: textColor,
              }}
            >
              <div
                className="leading-relaxed break-words"
                style={{ fontSize: Math.max((current.fontSize || 14) * 2.2, 28), fontWeight: 700 }}
              >
                <ReactMarkdown
                  components={{
                    p: ({ children }) => <span className="block">{children}</span>,
                    strong: ({ children }) => <strong>{children}</strong>,
                    em: ({ children }) => <em>{children}</em>,
                    a: ({ href, children }) => <a href={href} target="_blank" rel="noopener noreferrer" className="underline">{children}</a>,
                    ul: ({ children }) => <ul className="text-left list-disc pl-6 mt-2 text-2xl font-normal">{children}</ul>,
                    li: ({ children }) => <li className="my-1">{children}</li>,
                  }}
                >
                  {current.text}
                </ReactMarkdown>
              </div>
              {current.note && (
                <p className="mt-4 text-base opacity-60 font-normal">{current.note}</p>
              )}
            </div>

            {children.length > 0 && (
              <div className="mt-8 flex flex-wrap justify-center gap-3">
                {children.map((child) => (
                  <div
                    key={child.id}
                    className="px-4 py-2 rounded-xl text-sm font-medium opacity-60"
                    style={{
                      border: `1.5px solid ${child.color || color}`,
                      color: child.color || color,
                    }}
                  >
                    {child.icon && <span className="mr-1">{child.icon}</span>}
                    {child.text.replace(/[*_#\[\]]/g, "").slice(0, 40)}
                  </div>
                ))}
              </div>
            )}
          </motion.div>
        </AnimatePresence>
      </div>

      <div className="flex items-center justify-center gap-4 px-6 py-4 bg-black/80 backdrop-blur-sm">
        <button
          onClick={goPrev}
          disabled={index === 0}
          className="p-2 rounded-xl text-white/60 hover:text-white hover:bg-white/10 disabled:opacity-20 transition-all"
        >
          <ChevronLeft className="w-6 h-6" />
        </button>

        <button
          onClick={() => setAutoPlay((v) => !v)}
          className="flex items-center gap-2 px-5 py-2 rounded-xl text-white bg-white/10 hover:bg-white/20 transition-all text-sm font-medium"
        >
          {autoPlay ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
          {autoPlay ? "Pause" : "Auto"}
        </button>

        <button
          onClick={goNext}
          disabled={index === sequence.length - 1}
          className="p-2 rounded-xl text-white/60 hover:text-white hover:bg-white/10 disabled:opacity-20 transition-all"
        >
          <ChevronRight className="w-6 h-6" />
        </button>
      </div>

      <div className="absolute bottom-16 right-6 text-white/20 text-xs text-right space-y-0.5">
        <div>← → Naviguer</div>
        <div>Espace Suivant</div>
        <div>Échap Quitter</div>
      </div>
    </div>
  );
}
