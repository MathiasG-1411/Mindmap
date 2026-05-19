import React from "react";
import { Link } from "react-router-dom";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { MoreHorizontal, Pencil, Trash2, Copy } from "lucide-react";
import { format } from "date-fns";
import { fr } from "date-fns/locale";
import { STYLES } from "@/lib/mindMapUtils";

export default function MapCard({ map, onDelete, onDuplicate }) {
  const styleConfig = STYLES[map.style || "modern"];
  const nodeCount = map.nodes?.length || 0;
  const previewColors = (map.nodes || []).slice(0, 5).map((n) => n.color).filter(Boolean);

  return (
    <Card className="group relative overflow-hidden border border-border hover:border-primary/30 hover:shadow-lg transition-all duration-300">
      <Link to={`/editor?id=${map.id}`} className="block">
        {/* Preview area */}
        <div className="h-40 bg-gradient-to-br from-muted/50 to-muted relative overflow-hidden">
          {/* Mini node preview */}
          <div className="absolute inset-4 flex items-center justify-center">
            <div className="relative">
              {/* Central node */}
              <div
                className="w-20 h-8 rounded-lg flex items-center justify-center text-[9px] font-semibold text-white shadow-sm"
                style={{ backgroundColor: previewColors[0] || styleConfig.colors[0] }}
              >
                {(map.nodes?.[0]?.text || "").slice(0, 12)}
              </div>
              {/* Branch previews */}
              {previewColors.slice(1).map((color, i) => (
                <div
                  key={i}
                  className="absolute w-14 h-5 rounded-md opacity-70"
                  style={{
                    backgroundColor: color,
                    left: (i % 2 === 0 ? -70 : 60) + "px",
                    top: (i < 2 ? -20 : 20) + "px",
                  }}
                />
              ))}
            </div>
          </div>

          {/* Style badge */}
          <div className="absolute top-3 left-3 px-2 py-0.5 bg-card/80 backdrop-blur-sm rounded-full text-[10px] font-medium text-muted-foreground">
            {styleConfig.name}
          </div>
        </div>

        {/* Info */}
        <div className="p-4">
          <h3 className="font-semibold text-sm truncate">{map.title || "Sans titre"}</h3>
          <div className="flex items-center gap-2 mt-2 text-xs text-muted-foreground">
            <span>{nodeCount} nœud{nodeCount > 1 ? "s" : ""}</span>
            <span>·</span>
            <span>{map.updated_date ? format(new Date(map.updated_date), "d MMM yyyy", { locale: fr }) : "Récent"}</span>
          </div>
        </div>
      </Link>

      {/* Actions */}
      <div className="absolute top-3 right-3 opacity-0 group-hover:opacity-100 transition-opacity">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="secondary" size="icon" className="h-7 w-7 bg-card/80 backdrop-blur-sm shadow-sm">
              <MoreHorizontal className="h-3.5 w-3.5" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem onClick={() => onDuplicate(map)}>
              <Copy className="w-4 h-4 mr-2" /> Dupliquer
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => onDelete(map.id)} className="text-destructive">
              <Trash2 className="w-4 h-4 mr-2" /> Supprimer
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </Card>
  );
}
