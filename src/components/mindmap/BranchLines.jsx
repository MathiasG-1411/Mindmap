import React, { useMemo } from "react";
import { buildBranchPath } from "@/lib/mindMapUtils";

export default function BranchLines({ nodes, branchStyle, styleConfig }) {
  const paths = useMemo(() => {
    return nodes
      .filter((n) => n.parentId)
      .map((child) => {
        const parent = nodes.find((n) => n.id === child.parentId);
        if (!parent) return null;
        const d = buildBranchPath(parent, child, branchStyle);
        const color = child.color || styleConfig.colors[1] || "#999";
        return { id: child.id, d, color };
      })
      .filter(Boolean);
  }, [nodes, branchStyle, styleConfig]);

  return (
    <svg
      className="absolute inset-0 w-full h-full pointer-events-none"
      style={{ overflow: "visible" }}
    >
      {paths.map((p) => (
        <path
          key={p.id}
          d={p.d}
          stroke={p.color}
          strokeWidth={styleConfig.branchWidth}
          fill="none"
          strokeLinecap="round"
          strokeDasharray={styleConfig.nodeBorder.includes("dashed") ? "8 4" : undefined}
          className="transition-all duration-300"
          style={{ opacity: 0.7 }}
        />
      ))}
    </svg>
  );
}
