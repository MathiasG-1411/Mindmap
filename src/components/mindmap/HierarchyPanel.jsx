import React, { useState } from "react";
import { cn } from "@/lib/utils";
import { ChevronRight, ChevronDown, X, Layers } from "lucide-react";
import { Button } from "@/components/ui/button";

function TreeNode({ node, allNodes, depth, selectedId, onSelect, styleConfig }) {
  const children = allNodes.filter((n) => n.parentId === node.id);
  const [expanded, setExpanded] = useState(depth < 2);
  const hasChildren = children.length > 0;
  const color = node.color || styleConfig.colors[0];

  return (
    <div className="select-none">
      <div
        className={cn(
          "flex items-center gap-1.5 py-1 px-2 rounded-lg cursor-pointer transition-all group",
          "hover:bg-muted/70",
          selectedId === node.id && "bg-primary/10"
        )}
        style={{ paddingLeft: `${8 + depth * 16}px` }}
        onClick={() => onSelect(node.id)}
      >
        {hasChildren ? (
          <button
            className="w-4 h-4 flex items-center justify-center text-muted-foreground hover:text-foreground shrink-0"
            onClick={(e) => { e.stopPropagation(); setExpanded(!expanded); }}
          >
            {expanded
              ? <ChevronDown className="w-3.5 h-3.5" />
              : <ChevronRight className="w-3.5 h-3.5" />}
          </button>
        ) : (
          <span className="w-4 h-4 shrink-0 flex items-center justify-center">
            <span className="w-1.5 h-1.5 rounded-full bg-muted-foreground/40" />
          </span>
        )}

        {/* Color dot */}
        <span
          className="w-2.5 h-2.5 rounded-full shrink-0"
          style={{ backgroundColor: color }}
        />

        <span
          className={cn(
            "text-sm truncate max-w-[160px]",
            selectedId === node.id ? "text-primary font-medium" : "text-foreground/80",
            depth === 0 && "font-semibold text-foreground"
          )}
        >
          {node.text}
        </span>

        {hasChildren && (
          <span className="ml-auto text-[10px] text-muted-foreground shrink-0">
            {children.length}
          </span>
        )}
      </div>

      {expanded && hasChildren && (
        <div>
          {children.map((child) => (
            <TreeNode
              key={child.id}
              node={child}
              allNodes={allNodes}
              depth={depth + 1}
              selectedId={selectedId}
              onSelect={onSelect}
              styleConfig={styleConfig}
            />
          ))}
        </div>
      )}
    </div>
  );
}

export default function HierarchyPanel({ open, onClose, nodes, selectedNodeId, onSelectNode, styleConfig }) {
  if (!open) return null;

  const roots = nodes.filter((n) => !n.parentId);

  return (
    <div className="absolute left-0 top-0 bottom-0 w-64 bg-card/98 backdrop-blur-xl border-r border-border z-40 flex flex-col shadow-2xl">
      <div className="sticky top-0 bg-card/95 backdrop-blur-lg p-4 border-b border-border flex items-center justify-between shrink-0">
        <div className="flex items-center gap-2">
          <Layers className="w-4 h-4 text-primary" />
          <h3 className="font-semibold text-sm">Hiérarchie</h3>
          <span className="text-xs text-muted-foreground bg-muted rounded-full px-1.5 py-0.5">
            {nodes.length}
          </span>
        </div>
        <Button variant="ghost" size="icon" className="h-7 w-7" onClick={onClose}>
          <X className="h-4 w-4" />
        </Button>
      </div>

      <div className="flex-1 overflow-y-auto p-2">
        {nodes.length === 0 ? (
          <p className="text-xs text-muted-foreground text-center py-8">
            Aucun nœud pour l'instant
          </p>
        ) : (
          roots.map((root) => (
            <TreeNode
              key={root.id}
              node={root}
              allNodes={nodes}
              depth={0}
              selectedId={selectedNodeId}
              onSelect={onSelectNode}
              styleConfig={styleConfig}
            />
          ))
        )}
      </div>
    </div>
  );
}
