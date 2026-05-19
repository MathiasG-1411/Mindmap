import React, { useState, useRef, useEffect } from "react";
import { cn } from "@/lib/utils";
import { Plus, Trash2, StickyNote } from "lucide-react";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import ReactMarkdown from "react-markdown";
import { NODE_STYLES, TEXT_STYLES } from "@/lib/visualStyles";

function getShapeClasses(shape) {
  switch (shape) {
    case "circle": return "rounded-full";
    case "cloud": return "rounded-[40%]";
    case "postit": return "rounded-sm shadow-md rotate-[-1deg]";
    case "diamond": return "rotate-45";
    case "rectangle": return "rounded-none";
    case "rounded":
    default: return "rounded-xl";
  }
}

// Returns luminance 0–1 for a hex color
function getLuminance(hex) {
  const c = hex.replace("#", "");
  const r = parseInt(c.slice(0, 2), 16) / 255;
  const g = parseInt(c.slice(2, 4), 16) / 255;
  const b = parseInt(c.slice(4, 6), 16) / 255;
  const toLinear = (v) => (v <= 0.03928 ? v / 12.92 : Math.pow((v + 0.055) / 1.055, 2.4));
  return 0.2126 * toLinear(r) + 0.7152 * toLinear(g) + 0.0722 * toLinear(b);
}

function getContrastTextColor(bgHex) {
  if (!bgHex || bgHex.length < 7) return undefined;
  return getLuminance(bgHex) > 0.35 ? "#1a1a1a" : "#ffffff";
}

function getShapeStyle(shape, color, styleConfig, bgColor) {
  const bg = bgColor || (shape === "postit" ? color + "40" : styleConfig.nodeBg);
  const base = {
    backgroundColor: bg,
    border: `${styleConfig.nodeBorder.split(" ").slice(0, -1).join(" ")} ${color}`,
    borderRadius: shape === "circle" ? "50%" : undefined,
  };
  if (styleConfig.glowEffect) {
    base.boxShadow = `0 0 12px ${color}99, 0 0 30px ${color}44`;
  } else if (styleConfig.shadow) {
    base.boxShadow = `0 4px 20px ${color}22`;
  }
  return base;
}

export default function MindMapNode({
  node,
  styleConfig,
  isSelected,
  isRoot,
  isDropTarget,
  scale,
  onSelect,
  onUpdate,
  onDelete,
  onAddChild,
  onAddSibling,
  onDragStart,
  connectMode,
  connectingFrom,
  onConnectClick,
  visualConfig,
}) {
  const [isEditing, setIsEditing] = useState(false);
  const [editText, setEditText] = useState(node.text);
  const [showNote, setShowNote] = useState(false);
  const inputRef = useRef(null);
  const nodeRef = useRef(null);
  const dragStartPos = useRef(null);
  const isDragging = useRef(false);
  const enterPressed = useRef(false);

  useEffect(() => {
    if (isEditing && inputRef.current) {
      inputRef.current.focus();
      inputRef.current.select();
    }
  }, [isEditing]);

  const handleDoubleClick = (e) => {
    e.stopPropagation();
    setIsEditing(true);
    setEditText(node.text);
  };

  const finishEditing = (shouldAddSibling = false) => {
    setIsEditing(false);
    enterPressed.current = false;
    const trimmed = editText.trim();
    const textToSave = trimmed || node.text;
    if (textToSave !== node.text) {
      onUpdate(node.id, { text: textToSave });
    }
    if (shouldAddSibling && node.parentId) {
      setTimeout(() => onAddSibling && onAddSibling(node.id), 30);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      finishEditing(true);
    }
    if (e.key === "Escape") {
      enterPressed.current = false;
      setEditText(node.text);
      setIsEditing(false);
    }
    e.stopPropagation();
  };

  const handleMouseDown = (e) => {
    if (isEditing) return;
    e.stopPropagation();
    if (connectMode) {
      onConnectClick && onConnectClick(node.id);
      return;
    }
    onSelect(node.id);
    dragStartPos.current = { x: e.clientX, y: e.clientY };
    isDragging.current = false;

    const onMove = (moveEvent) => {
      const dx = moveEvent.clientX - dragStartPos.current.x;
      const dy = moveEvent.clientY - dragStartPos.current.y;
      if (!isDragging.current && Math.sqrt(dx * dx + dy * dy) > 5) {
        isDragging.current = true;
        onDragStart(e, node.id);
      }
    };

    const onUp = () => {
      window.removeEventListener("mousemove", onMove);
      window.removeEventListener("mouseup", onUp);
    };

    window.addEventListener("mousemove", onMove);
    window.addEventListener("mouseup", onUp);
  };

  useEffect(() => {
    if (!nodeRef.current) return;
    const observer = new ResizeObserver(() => {
      if (!nodeRef.current) return;
      const h = nodeRef.current.offsetHeight;
      const w = nodeRef.current.offsetWidth;
      if (Math.abs(h - (node.height || 50)) > 2 || Math.abs(w - (node.width || 150)) > 2) {
        onUpdate(node.id, { height: h, width: w });
      }
    });
    observer.observe(nodeRef.current);
    return () => observer.disconnect();
  }, [node.id, node.text, node.fontSize, node.width]);

  const color = node.color || styleConfig.colors[0];
  const bgColor = node.bgColor || null;
  const styleBgContrast = styleConfig.nodeBg ? getContrastTextColor(styleConfig.nodeBg.padEnd(7, "0")) : undefined;
  const textColor = bgColor ? getContrastTextColor(bgColor) : (styleConfig.glowEffect ? "#ffffff" : styleBgContrast);

  const activeNodeStyle = visualConfig?.nodeStyle ? (NODE_STYLES[visualConfig.nodeStyle] || null) : null;
  const activeTextStyle = visualConfig?.textStyle ? (TEXT_STYLES[visualConfig.textStyle] || null) : null;

  return (
    <div
      ref={nodeRef}
      className={cn(
          "absolute group select-none",
          "transition-shadow duration-200",
          connectMode ? "cursor-crosshair" : "cursor-grab active:cursor-grabbing",
          connectMode && connectingFrom === node.id && "ring-2 ring-green-500 rounded-xl",
      isDropTarget && "ring-2 ring-blue-400 ring-offset-2 rounded-xl",
          isSelected && !connectMode && "z-20"
        )}
      data-node-id={node.id}
      style={{
        left: node.x,
        top: node.y,
        width: node.width || 150,
        minHeight: node.height || 50,
      }}
      onMouseDown={handleMouseDown}
      onDoubleClick={handleDoubleClick}
    >
      {/* Drop target indicator */}
      {isDropTarget && (
        <div className="__drop_label absolute -top-7 left-1/2 -translate-x-1/2 bg-blue-500 text-white text-[10px] font-semibold px-2 py-0.5 rounded-full whitespace-nowrap pointer-events-none z-40 shadow">
          Déposer ici
        </div>
      )}

      {/* Selection ring */}
      {isSelected && (
        <div
          className="__selection_ring absolute -inset-2 rounded-2xl border-2 border-primary pointer-events-none"
          style={{ borderColor: color }}
        />
      )}

      {/* Node body */}
      <div
        className={cn(
          "w-full flex items-center justify-center px-3 py-2 transition-all duration-150",
          getShapeClasses(node.shape || "rounded"),
          activeTextStyle ? activeTextStyle.fontFamily : styleConfig.fontFamily,
          node.shape === "diamond" && "scale-[0.7]"
        )}
        style={{
          ...getShapeStyle(node.shape || "rounded", color, styleConfig, bgColor),
          ...(activeNodeStyle ? {
            borderRadius: activeNodeStyle.borderRadius,
            boxShadow: activeNodeStyle.shadow,
          } : {}),
        }}
      >
        {/* Icon / image */}
        {(node.icon || node.imageUrl) && (
          <span className="flex-shrink-0 mr-1">
            {node.imageUrl ? (
              <img src={node.imageUrl} alt="" className="w-6 h-6 rounded object-cover" />
            ) : (
              <span className="text-lg leading-none">{node.icon}</span>
            )}
          </span>
        )}

        {isEditing ? (
          <textarea
            ref={inputRef}
            value={editText}
            onChange={(e) => setEditText(e.target.value)}
            onBlur={finishEditing}
            onKeyDown={handleKeyDown}
            rows={3}
            className="w-full bg-transparent text-center outline-none resize-none leading-tight"
            style={{ fontSize: node.fontSize || 14, color: textColor || (isRoot ? color : undefined) }}
            placeholder="Markdown supporté: **gras**, *italique*, [lien](url)&#10;Entrée pour valider, Shift+Entrée pour nouvelle ligne"
          />
        ) : (
          <div
            className={cn(
              "w-full text-center leading-tight break-words markdown-node",
              node.shape === "diamond" && "-rotate-45"
            )}
            style={{
              fontSize: node.fontSize || 14,
              color: textColor || (node.shape === "postit" ? "#333" : undefined),
              fontWeight: node.bold ? 700 : (isRoot ? 700 : 500),
              fontStyle: node.italic ? "italic" : "normal",
              textDecoration: node.underline ? "underline" : "none",
            }}
          >
            <ReactMarkdown
              components={{
                p: ({ children }) => <span className="block">{children}</span>,
                strong: ({ children }) => <strong className="font-bold">{children}</strong>,
                em: ({ children }) => <em className="italic">{children}</em>,
                a: ({ href, children }) => (
                  <a
                    href={href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="underline opacity-80 hover:opacity-100"
                    onClick={(e) => e.stopPropagation()}
                    style={{ color: "inherit" }}
                  >
                    {children}
                  </a>
                ),
                ul: ({ children }) => <ul className="text-left list-disc pl-4 mt-0.5">{children}</ul>,
                ol: ({ children }) => <ol className="text-left list-decimal pl-4 mt-0.5">{children}</ol>,
                li: ({ children }) => <li className="leading-snug">{children}</li>,
                code: ({ children }) => (
                  <code className="px-1 rounded text-[0.85em]" style={{ background: "rgba(0,0,0,0.1)" }}>
                    {children}
                  </code>
                ),
              }}
            >
              {node.text}
            </ReactMarkdown>
          </div>
        )}
      </div>

      {/* Note indicator */}
      {node.note && (
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <button
                className="__note_badge absolute -top-2 -right-2 w-5 h-5 bg-amber-400 rounded-full flex items-center justify-center shadow-sm"
                onClick={(e) => { e.stopPropagation(); setShowNote(!showNote); }}
              >
                <StickyNote className="w-3 h-3 text-amber-800" />
              </button>
            </TooltipTrigger>
            <TooltipContent side="top" className="max-w-[200px]">
              <p className="text-xs">{node.note}</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      )}

      {/* Action buttons */}
      {isSelected && !isEditing && (
        <div className="__node_actions absolute -bottom-10 left-1/2 -translate-x-1/2 flex items-center gap-1 bg-card border border-border rounded-lg px-1.5 py-1 shadow-lg z-30">
          <button
            onClick={(e) => { e.stopPropagation(); onAddChild(node.id); }}
            className="p-1 rounded hover:bg-primary/10 text-primary transition-colors"
            title="Ajouter une branche"
          >
            <Plus className="w-4 h-4" />
          </button>
          {!isRoot && (
            <button
              onClick={(e) => { e.stopPropagation(); onDelete(node.id); }}
              className="p-1 rounded hover:bg-destructive/10 text-destructive transition-colors"
              title="Supprimer"
            >
              <Trash2 className="w-4 h-4" />
            </button>
          )}
        </div>
      )}
    </div>
  );
}
