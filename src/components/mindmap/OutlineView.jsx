import React, { useState } from "react";
import { cn } from "@/lib/utils";
import { ChevronRight, ChevronDown, Plus, Trash2 } from "lucide-react";

function OutlineNode({ node, allNodes, depth, selectedNodeId, onSelect, onUpdate, onDelete, onAddChild, styleConfig }) {
  const [expanded, setExpanded] = useState(true);
  const [editing, setEditing] = useState(false);
  const [text, setText] = useState(node.text);
  const children = allNodes.filter((n) => n.parentId === node.id);
  const isRoot = !node.parentId;
  const isSelected = selectedNodeId === node.id;

  const finishEdit = () => {
    setEditing(false);
    if (text.trim() && text.trim() !== node.text) {
      onUpdate(node.id, { text: text.trim() });
    }
  };

  return (
    <div>
      <div
        className={cn(
          "flex items-center gap-1 py-1 px-2 rounded-lg cursor-pointer group transition-colors",
          isSelected ? "bg-primary/10" : "hover:bg-muted/60"
        )}
        style={{ paddingLeft: `${depth * 16 + 8}px` }}
        onClick={() => onSelect(node.id)}
        onDoubleClick={() => { setEditing(true); setText(node.text); }}
      >
        <button
          className="flex-shrink-0 w-4 h-4 flex items-center justify-center text-muted-foreground"
          onClick={(e) => { e.stopPropagation(); setExpanded(!expanded); }}
        >
          {children.length > 0 ? (
            expanded ? <ChevronDown className="w-3.5 h-3.5" /> : <ChevronRight className="w-3.5 h-3.5" />
          ) : (
            <span className="w-1.5 h-1.5 rounded-full bg-muted-foreground/40 block mx-auto" />
          )}
        </button>

        <span
          className="flex-shrink-0 w-2.5 h-2.5 rounded-full"
          style={{ backgroundColor: node.color || styleConfig?.colors?.[0] || "#6C5CE7" }}
        />

        {node.icon && <span className="flex-shrink-0 text-base leading-none">{node.icon}</span>}

        {editing ? (
          <input
            autoFocus
            value={text}
            onChange={(e) => setText(e.target.value)}
            onBlur={finishEdit}
            onKeyDown={(e) => {
              if (e.key === "Enter") finishEdit();
              if (e.key === "Escape") { setEditing(false); setText(node.text); }
              e.stopPropagation();
            }}
            className={cn(
              "flex-1 bg-transparent outline-none text-sm min-w-0",
              isRoot && "font-semibold"
            )}
            onClick={(e) => e.stopPropagation()}
          />
        ) : (
          <span className={cn("flex-1 text-sm truncate", isRoot && "font-semibold")}>
            {node.text}
          </span>
        )}

        <div className="flex items-center gap-0.5 opacity-0 group-hover:opacity-100 transition-opacity flex-shrink-0">
          <button
            className="p-0.5 rounded hover:bg-primary/20 text-primary"
            onClick={(e) => { e.stopPropagation(); onAddChild(node.id); }}
            title="Ajouter"
          >
            <Plus className="w-3 h-3" />
          </button>
          {!isRoot && (
            <button
              className="p-0.5 rounded hover:bg-destructive/20 text-destructive"
              onClick={(e) => { e.stopPropagation(); onDelete(node.id); }}
              title="Supprimer"
            >
              <Trash2 className="w-3 h-3" />
            </button>
          )}
        </div>
      </div>

      {expanded && children.length > 0 && (
        <div>
          {children.map((child) => (
            <OutlineNode
              key={child.id}
              node={child}
              allNodes={allNodes}
              depth={depth + 1}
              selectedNodeId={selectedNodeId}
              onSelect={onSelect}
              onUpdate={onUpdate}
              onDelete={onDelete}
              onAddChild={onAddChild}
              styleConfig={styleConfig}
            />
          ))}
        </div>
      )}
    </div>
  );
}

export default function OutlineView({ nodes, selectedNodeId, onSelect, onUpdate, onDelete, onAddChild, styleConfig }) {
  const rootNodes = nodes.filter((n) => !n.parentId);

  if (nodes.length === 0) {
    return (
      <div className="flex-1 flex items-center justify-center text-muted-foreground text-sm">
        Aucun nœud. Double-cliquez sur le canvas pour commencer.
      </div>
    );
  }

  return (
    <div className="flex-1 overflow-y-auto p-3 space-y-0.5">
      {rootNodes.map((root) => (
        <OutlineNode
          key={root.id}
          node={root}
          allNodes={nodes}
          depth={0}
          selectedNodeId={selectedNodeId}
          onSelect={onSelect}
          onUpdate={onUpdate}
          onDelete={onDelete}
          onAddChild={onAddChild}
          styleConfig={styleConfig}
        />
      ))}
    </div>
  );
}
