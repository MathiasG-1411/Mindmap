import React, { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Loader2, FileText, Copy, Check, List } from "lucide-react";
import { base44 } from "@/api/base44Client";

function buildTree(nodes, edges) {
  const childrenMap = {};
  edges.forEach(e => {
    if (!childrenMap[e.source]) childrenMap[e.source] = [];
    childrenMap[e.source].push(e.target);
  });
  const nodeMap = {};
  nodes.forEach(n => { nodeMap[n.id] = n; });
  return { childrenMap, nodeMap };
}

function renderOutline(nodeId, nodeMap, childrenMap, depth = 0) {
  const node = nodeMap[nodeId];
  if (!node) return "";
  const label = typeof node.data?.label === "string" ? node.data.label : String(node.data?.label || "");
  const indent = "  ".repeat(depth);
  const prefix = depth === 0 ? "●" : depth === 1 ? "▸" : "–";
  let result = `${indent}${prefix} ${label}\n`;
  (childrenMap[nodeId] || []).forEach(childId => {
    result += renderOutline(childId, nodeMap, childrenMap, depth + 1);
  });
  return result;
}

export default function SynthesisModal({ open, onClose, nodes, edges, title }) {
  const [mode, setMode] = useState("outline"); // "outline" | "summary"
  const [summary, setSummary] = useState("");
  const [loading, setLoading] = useState(false);
  const [copied, setCopied] = useState(false);

  const { childrenMap, nodeMap } = buildTree(nodes, edges);
  const rootNode = nodes.find(n => n.id === "root");

  const outlineText = rootNode ? renderOutline("root", nodeMap, childrenMap) : "";

  const generateSummary = async () => {
    setLoading(true);
    const res = await base44.integrations.Core.InvokeLLM({
      prompt: `Voici la structure d'une carte mentale intitulée "${title}":\n\n${outlineText}\n\nTransforme cette carte mentale en une synthèse rédigée claire et structurée, avec des titres (##), des listes à puces et des paragraphes explicatifs. Rédige en français, de façon professionnelle et complète.`,
    });
    setSummary(res);
    setLoading(false);
  };

  const handleCopy = () => {
    const text = mode === "outline" ? outlineText : summary;
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[80vh] flex flex-col">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <List className="w-5 h-5 text-indigo-500" />
            Synthèse classique
          </DialogTitle>
        </DialogHeader>

        <div className="flex gap-2 mt-1">
          <button
            onClick={() => setMode("outline")}
            className={`px-4 py-2 rounded-xl text-sm font-medium border transition-all ${
              mode === "outline" ? "border-indigo-500 bg-indigo-50 text-indigo-700" : "border-slate-200 text-slate-600 hover:border-indigo-300"
            }`}
          >
            📋 Plan structuré
          </button>
          <button
            onClick={() => setMode("summary")}
            className={`px-4 py-2 rounded-xl text-sm font-medium border transition-all ${
              mode === "summary" ? "border-indigo-500 bg-indigo-50 text-indigo-700" : "border-slate-200 text-slate-600 hover:border-indigo-300"
            }`}
          >
            ✍️ Synthèse rédigée (IA)
          </button>
        </div>

        <div className="flex-1 overflow-y-auto mt-3 min-h-0">
          {mode === "outline" ? (
            <pre className="bg-slate-50 rounded-xl p-4 text-sm text-slate-700 whitespace-pre-wrap leading-relaxed border border-slate-100 font-mono">
              {outlineText || "Aucun nœud trouvé."}
            </pre>
          ) : (
            <div className="space-y-3">
              {!summary && !loading && (
                <div className="text-center py-8">
                  <FileText className="w-12 h-12 text-slate-300 mx-auto mb-3" />
                  <p className="text-slate-500 text-sm mb-4">L'IA va rédiger une synthèse complète basée sur votre carte mentale.</p>
                  <Button onClick={generateSummary} className="bg-indigo-600 hover:bg-indigo-700">
                    <Loader2 className={`w-4 h-4 mr-2 ${loading ? "animate-spin" : "hidden"}`} />
                    Générer la synthèse
                  </Button>
                </div>
              )}
              {loading && (
                <div className="flex items-center justify-center py-12 gap-3">
                  <Loader2 className="w-5 h-5 animate-spin text-indigo-500" />
                  <span className="text-slate-500 text-sm">Rédaction en cours...</span>
                </div>
              )}
              {summary && !loading && (
                <div className="bg-slate-50 rounded-xl p-4 text-sm text-slate-700 leading-relaxed border border-slate-100 whitespace-pre-wrap">
                  {summary}
                </div>
              )}
            </div>
          )}
        </div>

        <div className="flex justify-between items-center pt-3 border-t border-slate-100 mt-2 shrink-0">
          {mode === "summary" && summary && (
            <Button variant="outline" size="sm" onClick={generateSummary} disabled={loading} className="text-xs">
              Régénérer
            </Button>
          )}
          <div className="ml-auto flex gap-2">
            <Button variant="outline" size="sm" onClick={handleCopy} className="gap-1.5 text-xs">
              {copied ? <Check className="w-3.5 h-3.5 text-green-500" /> : <Copy className="w-3.5 h-3.5" />}
              {copied ? "Copié !" : "Copier"}
            </Button>
            <Button size="sm" onClick={() => onClose(false)} className="text-xs bg-slate-800 hover:bg-slate-700">
              Fermer
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
