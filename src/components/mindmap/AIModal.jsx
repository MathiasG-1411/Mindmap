import React, { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Sparkles, Loader2, Wand2, FileText } from "lucide-react";
import { base44 } from "@/api/base44Client";

export default function AIModal({ open, onClose, onAddSuggestions, rootText }) {
  const [keyword, setKeyword] = useState(rootText || "");
  const [textInput, setTextInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [suggestions, setSuggestions] = useState([]);
  const [selected, setSelected] = useState([]);

  const generateSuggestions = async () => {
    setLoading(true);
    const res = await base44.integrations.Core.InvokeLLM({
      prompt: `Tu es un expert en création de cartes mentales. Pour le sujet "${keyword}", génère 6 à 8 idées de branches principales pertinentes. Chaque branche doit être courte (2-4 mots max). Réponds en français.`,
      response_json_schema: {
        type: "object",
        properties: {
          branches: {
            type: "array",
            items: {
              type: "object",
              properties: {
                text: { type: "string" },
                sub_branches: {
                  type: "array",
                  items: { type: "string" },
                },
              },
            },
          },
        },
      },
    });
    setSuggestions(res.branches || []);
    setSelected(res.branches?.map((_, i) => i) || []);
    setLoading(false);
  };

  const convertText = async () => {
    setLoading(true);
    const res = await base44.integrations.Core.InvokeLLM({
      prompt: `Transforme ce texte en structure de carte mentale. Identifie le thème central et les branches principales avec sous-branches. Chaque élément doit être court (2-4 mots). Texte: "${textInput}". Réponds en français.`,
      response_json_schema: {
        type: "object",
        properties: {
          central: { type: "string" },
          branches: {
            type: "array",
            items: {
              type: "object",
              properties: {
                text: { type: "string" },
                sub_branches: {
                  type: "array",
                  items: { type: "string" },
                },
              },
            },
          },
        },
      },
    });
    setSuggestions(res.branches || []);
    setSelected(res.branches?.map((_, i) => i) || []);
    if (res.central) setKeyword(res.central);
    setLoading(false);
  };

  const toggleSelect = (idx) => {
    setSelected((prev) =>
      prev.includes(idx) ? prev.filter((i) => i !== idx) : [...prev, idx]
    );
  };

  const handleApply = () => {
    const selectedBranches = suggestions.filter((_, i) => selected.includes(i));
    onAddSuggestions(selectedBranches, keyword);
    onClose(false);
    setSuggestions([]);
    setSelected([]);
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-primary" />
            Assistant IA
          </DialogTitle>
        </DialogHeader>

        <Tabs defaultValue="suggest" className="mt-2">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="suggest" className="text-xs">
              <Wand2 className="w-3.5 h-3.5 mr-1.5" /> Suggestions
            </TabsTrigger>
            <TabsTrigger value="text" className="text-xs">
              <FileText className="w-3.5 h-3.5 mr-1.5" /> Texte → Carte
            </TabsTrigger>
          </TabsList>

          <TabsContent value="suggest" className="space-y-4 mt-4">
            <div className="flex gap-2">
              <Input
                value={keyword}
                onChange={(e) => setKeyword(e.target.value)}
                placeholder="Entrez un mot-clé ou thème..."
                onKeyDown={(e) => e.key === "Enter" && generateSuggestions()}
              />
              <Button onClick={generateSuggestions} disabled={loading || !keyword.trim()}>
                {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Sparkles className="w-4 h-4" />}
              </Button>
            </div>
          </TabsContent>

          <TabsContent value="text" className="space-y-4 mt-4">
            <Textarea
              value={textInput}
              onChange={(e) => setTextInput(e.target.value)}
              placeholder="Collez un texte et l'IA le transformera en carte mentale..."
              className="h-32 resize-none"
            />
            <Button onClick={convertText} disabled={loading || !textInput.trim()} className="w-full">
              {loading ? (
                <><Loader2 className="w-4 h-4 mr-2 animate-spin" /> Analyse en cours...</>
              ) : (
                <><Wand2 className="w-4 h-4 mr-2" /> Transformer en carte</>
              )}
            </Button>
          </TabsContent>
        </Tabs>

        {suggestions.length > 0 && (
          <div className="space-y-3 mt-4">
            <p className="text-xs text-muted-foreground font-medium">
              Sélectionnez les branches à ajouter :
            </p>
            <div className="space-y-2 max-h-60 overflow-y-auto">
              {suggestions.map((branch, idx) => (
                <button
                  key={idx}
                  onClick={() => toggleSelect(idx)}
                  className={`w-full p-3 rounded-lg border text-left transition-all ${
                    selected.includes(idx)
                      ? "border-primary bg-primary/5"
                      : "border-border hover:border-primary/30"
                  }`}
                >
                  <p className="font-medium text-sm">{branch.text}</p>
                  {branch.sub_branches?.length > 0 && (
                    <p className="text-xs text-muted-foreground mt-1">
                      {branch.sub_branches.join(" · ")}
                    </p>
                  )}
                </button>
              ))}
            </div>
            <Button onClick={handleApply} className="w-full">
              Ajouter {selected.length} branche{selected.length > 1 ? "s" : ""}
            </Button>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}
