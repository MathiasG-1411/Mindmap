import React, { useMemo } from "react";

// Draws custom arrows between arbitrary nodes
export default function CustomArrows({ arrows, nodes, connectingFrom, mousePos, onDeleteArrow }) {
  const getCenter = (node) => ({
    x: node.x + (node.width || 150) / 2,
    y: node.y + (node.height || 50) / 2,
  });

  const arrowPaths = useMemo(() => {
    return arrows.map((arrow) => {
      const from = nodes.find((n) => n.id === arrow.fromId);
      const to = nodes.find((n) => n.id === arrow.toId);
      if (!from || !to) return null;
      const fc = getCenter(from);
      const tc = getCenter(to);
      const mx = (fc.x + tc.x) / 2;
      const my = (fc.y + tc.y) / 2 - 40;
      return { ...arrow, fc, tc, mx, my };
    }).filter(Boolean);
  }, [arrows, nodes]);

  const markerId = "arrowhead";

  return (
    <svg
      className="absolute inset-0 w-full h-full pointer-events-none"
      style={{ overflow: "visible", zIndex: 5 }}
    >
      <defs>
        <marker
          id={markerId}
          markerWidth="8"
          markerHeight="8"
          refX="6"
          refY="3"
          orient="auto"
        >
          <path d="M0,0 L0,6 L8,3 z" fill="#6C5CE7" />
        </marker>
        <marker
          id="arrowhead-preview"
          markerWidth="8"
          markerHeight="8"
          refX="6"
          refY="3"
          orient="auto"
        >
          <path d="M0,0 L0,6 L8,3 z" fill="#00b894" />
        </marker>
      </defs>

      {/* Existing arrows */}
      {arrowPaths.map((a) => (
        <g key={a.id} className="pointer-events-auto">
          <path
            d={`M${a.fc.x},${a.fc.y} Q${a.mx},${a.my} ${a.tc.x},${a.tc.y}`}
            stroke={a.color || "#6C5CE7"}
            strokeWidth={2}
            fill="none"
            strokeDasharray={a.dashed ? "6 3" : undefined}
            markerEnd={`url(#${markerId})`}
            opacity={0.85}
          />
          {/* Label */}
          {a.label && (
            <text
              x={a.mx}
              y={a.my - 6}
              textAnchor="middle"
              fontSize={11}
              fill={a.color || "#6C5CE7"}
              className="select-none"
            >
              {a.label}
            </text>
          )}
          {/* Invisible wider path for click */}
          <path
            d={`M${a.fc.x},${a.fc.y} Q${a.mx},${a.my} ${a.tc.x},${a.tc.y}`}
            stroke="transparent"
            strokeWidth={12}
            fill="none"
            onClick={() => onDeleteArrow && onDeleteArrow(a.id)}
            style={{ cursor: "pointer" }}
          />
        </g>
      ))}

      {/* Preview arrow while connecting */}
      {connectingFrom && mousePos && (() => {
        const from = nodes.find((n) => n.id === connectingFrom);
        if (!from) return null;
        const fc = getCenter(from);
        return (
          <path
            d={`M${fc.x},${fc.y} L${mousePos.x},${mousePos.y}`}
            stroke="#00b894"
            strokeWidth={2}
            fill="none"
            strokeDasharray="6 3"
            markerEnd="url(#arrowhead-preview)"
            opacity={0.7}
          />
        );
      })()}
    </svg>
  );
}
