import React from "react";

const ROOT_STYLE = {
  padding: "14px 28px",
  borderRadius: "14px",
  background: "linear-gradient(135deg, #6366f1 0%, #a855f7 100%)",
  color: "#ffffff",
  border: "none",
  fontWeight: "700",
  fontSize: "16px",
  boxShadow: "0 10px 30px -3px rgba(99,102,241,0.4)",
  minWidth: "160px",
  textAlign: "center",
  cursor: "default",
};

const CHILD_STYLE = {
  padding: "10px 22px",
  borderRadius: "30px",
  background: "#ffffff",
  color: "#1e293b",
  border: "2px solid #e2e8f0",
  fontWeight: "600",
  fontSize: "14px",
  boxShadow: "0 4px 15px -3px rgba(0,0,0,0.08)",
  minWidth: "130px",
  textAlign: "center",
  cursor: "default",
};

// Context to pass editingId + handlers down without recreating nodeTypes
export const FlowNodeContext = React.createContext({
  editingId: null,
  onLabelChange: () => {},
  onFinishEdit: () => {},
});

export default function FlowNode({ data, id }) {
  const { editingId, onLabelChange, onFinishEdit } = React.useContext(FlowNodeContext);
  const isEditing = editingId === id;
  const isRoot = id === "root";
  const style = isRoot ? ROOT_STYLE : CHILD_STYLE;

  return (
    <div style={style}>
      {isEditing ? (
        <input
          autoFocus
          className="bg-transparent border-none outline-none text-center w-full p-1 font-semibold"
          style={{ color: "inherit", fontSize: "inherit", minWidth: 80 }}
          value={data?.label || ""}
          onChange={(e) => onLabelChange(id, e.target.value)}
          onBlur={onFinishEdit}
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              e.stopPropagation();
              onFinishEdit();
            }
            e.stopPropagation();
          }}
        />
      ) : (
        <span>{data?.label || "Nouvelle idée"}</span>
      )}
    </div>
  );
}

// Stable nodeTypes object — defined once, never recreated
export const NODE_TYPES = { default: FlowNode };
