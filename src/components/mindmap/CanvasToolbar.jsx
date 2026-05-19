import React from "react";
import { Button } from "@/components/ui/button";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import {
  ZoomIn, ZoomOut, Maximize2, Undo2, Redo2, Download, Sparkles, LayoutGrid, Shuffle,
} from "lucide-react";

function ToolButton({ icon: Icon, label, onClick, disabled }) {
  return (
    <TooltipProvider delayDuration={200}>
      <Tooltip>
        <TooltipTrigger asChild>
          <Button
            variant="ghost"
            size="icon"
            className="h-9 w-9 rounded-lg hover:bg-primary/10 text-foreground/70 hover:text-primary disabled:opacity-30"
            onClick={onClick}
            disabled={disabled}
          >
            <Icon className="h-4 w-4" />
          </Button>
        </TooltipTrigger>
        <TooltipContent side="bottom" className="text-xs">
          {label}
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
}

export default function CanvasToolbar({
  scale,
  onZoomIn,
  onZoomOut,
  onFitView,
  onUndo,
  onRedo,
  canUndo,
  canRedo,
  onExport,
  onAISuggest,
  onTemplates,
  onReorganize,
}) {
  return (
    <div className="absolute bottom-6 left-1/2 -translate-x-1/2 z-30 flex items-center gap-1 bg-card/95 backdrop-blur-lg border border-border rounded-2xl px-3 py-2 shadow-xl">
      <ToolButton icon={Undo2} label="Annuler (Ctrl+Z)" onClick={onUndo} disabled={!canUndo} />
      <ToolButton icon={Redo2} label="Rétablir (Ctrl+Y)" onClick={onRedo} disabled={!canRedo} />
      <div className="w-px h-6 bg-border mx-1" />
      <ToolButton icon={ZoomOut} label="Dézoomer" onClick={onZoomOut} />
      <span className="text-xs font-medium text-muted-foreground w-12 text-center">
        {Math.round(scale * 100)}%
      </span>
      <ToolButton icon={ZoomIn} label="Zoomer" onClick={onZoomIn} />
      <ToolButton icon={Maximize2} label="Ajuster la vue" onClick={onFitView} />
      <div className="w-px h-6 bg-border mx-1" />
      <ToolButton icon={Shuffle} label="Réorganiser automatiquement" onClick={onReorganize} />
      <ToolButton icon={Sparkles} label="IA : Suggestions" onClick={onAISuggest} />
      <ToolButton icon={LayoutGrid} label="Templates" onClick={onTemplates} />
      <ToolButton icon={Download} label="Exporter" onClick={onExport} />
    </div>
  );
}
