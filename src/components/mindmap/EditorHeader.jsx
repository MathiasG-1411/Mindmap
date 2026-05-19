import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Link } from "react-router-dom";
import { ArrowLeft, Settings2, Check, Loader2, Layers, Map, List, Link2, Monitor, FileBox } from "lucide-react";
import { cn } from "@/lib/utils";

export default function EditorHeader({
  title,
  onTitleChange,
  saving,
  onToggleSidebar,
  sidebarOpen,
  onToggleHierarchy,
  hierarchyOpen,
  viewMode,
  onViewModeChange,
  connectMode,
  onToggleConnectMode,
  onPresent,
  pageFormat,
  onChangeFormat,
}) {
  const [editing, setEditing] = useState(false);
  const [editTitle, setEditTitle] = useState(title);

  const handleSubmit = () => {
    setEditing(false);
    if (editTitle.trim()) onTitleChange(editTitle.trim());
  };

  return (
    <div className="absolute top-0 left-0 right-0 z-30 h-14 bg-card/90 backdrop-blur-xl border-b border-border flex items-center px-4 gap-3">
      <Link to="/">
        <Button variant="ghost" size="icon" className="h-9 w-9 shrink-0">
          <ArrowLeft className="h-4 w-4" />
        </Button>
      </Link>

      {editing ? (
        <form onSubmit={(e) => { e.preventDefault(); handleSubmit(); }} className="flex items-center gap-2">
          <Input
            autoFocus
            value={editTitle}
            onChange={(e) => setEditTitle(e.target.value)}
            onBlur={handleSubmit}
            className="h-8 text-sm font-medium w-56"
          />
        </form>
      ) : (
        <button
          onClick={() => { setEditing(true); setEditTitle(title); }}
          className="font-semibold text-sm hover:text-primary transition-colors truncate max-w-[160px] md:max-w-[300px]"
        >
          {title}
        </button>
      )}

      {/* View mode toggle */}
      <div className="flex items-center bg-muted rounded-lg p-0.5 gap-0.5 ml-2">
        <button
          onClick={() => onViewModeChange("mindmap")}
          className={cn(
            "flex items-center gap-1.5 px-2.5 py-1.5 rounded-md text-xs font-medium transition-all",
            viewMode === "mindmap"
              ? "bg-card shadow-sm text-foreground"
              : "text-muted-foreground hover:text-foreground"
          )}
        >
          <Map className="w-3.5 h-3.5" />
          <span className="hidden sm:inline">Mind Map</span>
        </button>
        <button
          onClick={() => onViewModeChange("outline")}
          className={cn(
            "flex items-center gap-1.5 px-2.5 py-1.5 rounded-md text-xs font-medium transition-all",
            viewMode === "outline"
              ? "bg-card shadow-sm text-foreground"
              : "text-muted-foreground hover:text-foreground"
          )}
        >
          <List className="w-3.5 h-3.5" />
          <span className="hidden sm:inline">Liste</span>
        </button>
      </div>

      <div className="flex items-center gap-2 ml-auto">
        {saving && (
          <span className="flex items-center gap-1.5 text-xs text-muted-foreground">
            <Loader2 className="w-3 h-3 animate-spin" /> Sauvegarde...
          </span>
        )}
        {!saving && (
          <span className="flex items-center gap-1.5 text-xs text-green-600">
            <Check className="w-3 h-3" /> Sauvegardé
          </span>
        )}

        {/* Format button */}
        {onChangeFormat && (
          <Button
            variant="ghost"
            size="sm"
            className="h-9 gap-1.5 text-xs"
            onClick={onChangeFormat}
            title="Changer le format de page"
          >
            <FileBox className="h-4 w-4" />
            <span className="hidden md:inline">{pageFormat ? pageFormat.toUpperCase() : "Format"}</span>
          </Button>
        )}

        {/* Presentation button */}
        <Button
          variant="ghost"
          size="sm"
          className="h-9 gap-1.5 text-xs"
          onClick={onPresent}
          title="Mode présentation"
        >
          <Monitor className="h-4 w-4" />
          <span className="hidden md:inline">Présenter</span>
        </Button>

        {/* Connect mode button */}
        <Button
          variant={connectMode ? "default" : "ghost"}
          size="sm"
          className={cn("h-9 gap-1.5 text-xs", connectMode && "bg-green-600 hover:bg-green-700 text-white")}
          onClick={onToggleConnectMode}
          title="Mode connexion — cliquer deux nœuds pour créer une flèche"
        >
          <Link2 className="h-4 w-4" />
          <span className="hidden md:inline">{connectMode ? "Connecter (ESC)" : "Connecter"}</span>
        </Button>

        <Button
          variant={hierarchyOpen ? "secondary" : "ghost"}
          size="icon"
          className="h-9 w-9"
          onClick={onToggleHierarchy}
          title="Hiérarchie"
        >
          <Layers className="h-4 w-4" />
        </Button>
        <Button
          variant={sidebarOpen ? "secondary" : "ghost"}
          size="icon"
          className="h-9 w-9"
          onClick={onToggleSidebar}
          title="Styles"
        >
          <Settings2 className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
}
