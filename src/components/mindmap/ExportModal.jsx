import React, { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { Download, Image, FileText, Loader2 } from "lucide-react";
import html2canvas from "html2canvas";
import jsPDF from "jspdf";

// PDF page sizes in mm [width, height] portrait
const PAGE_SIZES = {
  a5: [148, 210],
  a4: [210, 297],
  a3: [297, 420],
  a2: [420, 594],
};

// Compute bounding box from actual DOM node elements inside the canvas
function getNodesBoundsFromDOM(canvasEl) {
  if (!canvasEl) return null;
  const domNodes = canvasEl.querySelectorAll("[data-node-id]");
  if (!domNodes.length) return null;
  let minX = Infinity, minY = Infinity, maxX = -Infinity, maxY = -Infinity;
  domNodes.forEach((el) => {
    const left = parseFloat(el.style.left) || 0;
    const top = parseFloat(el.style.top) || 0;
    const w = el.offsetWidth;
    const h = el.offsetHeight;
    minX = Math.min(minX, left);
    minY = Math.min(minY, top);
    maxX = Math.max(maxX, left + w);
    maxY = Math.max(maxY, top + h);
  });
  const pad = 50;
  return { minX: minX - pad, minY: minY - pad, w: maxX - minX + pad * 2, h: maxY - minY + pad * 2 };
}

export default function ExportModal({ open, onClose, canvasRef }) {
  const [format, setFormat] = useState("png");
  const [pageSize, setPageSize] = useState("a4");
  const [orientation, setOrientation] = useState("landscape");
  const [exporting, setExporting] = useState(false);

  const handleExport = async () => {
    if (!canvasRef?.current) return;
    setExporting(true);

    // canvasRef points to the inner "exportRef" div (absolute inset-0).
    // Its parent is the 6000×6000 div with the CSS transform (scale + translate).
    const canvasEl = canvasRef.current.parentElement;

    canvasEl.classList.add("exporting");

    const tempStyle = document.createElement("style");
    tempStyle.id = "__export_style__";
    tempStyle.textContent = `
      .exporting [data-export-hide],
      .exporting .__node_actions,
      .exporting .__selection_ring,
      .exporting .__drop_label,
      .exporting .__note_badge { display: none !important; }
    `;
    document.head.appendChild(tempStyle);

    const savedTransform = canvasEl.style.transform;
    const savedTransformOrigin = canvasEl.style.transformOrigin;
    canvasEl.style.transform = "none";
    canvasEl.style.transformOrigin = "0 0";

    const CANVAS_SIZE = canvasEl.offsetWidth;
    const CAPTURE_SCALE = 2;

    const fullCanvas = await html2canvas(canvasEl, {
      backgroundColor: "#ffffff",
      scale: CAPTURE_SCALE,
      useCORS: true,
      logging: false,
      width: CANVAS_SIZE,
      height: CANVAS_SIZE,
    });

    canvasEl.style.transform = savedTransform;
    canvasEl.style.transformOrigin = savedTransformOrigin;
    canvasEl.classList.remove("exporting");
    document.getElementById("__export_style__")?.remove();

    const bounds = getNodesBoundsFromDOM(canvasEl);
    let exportCanvas = fullCanvas;

    if (bounds) {
      const srcX = Math.max(0, Math.round(bounds.minX * CAPTURE_SCALE));
      const srcY = Math.max(0, Math.round(bounds.minY * CAPTURE_SCALE));
      const srcW = Math.min(Math.round(bounds.w * CAPTURE_SCALE), fullCanvas.width - srcX);
      const srcH = Math.min(Math.round(bounds.h * CAPTURE_SCALE), fullCanvas.height - srcY);

      if (srcW > 0 && srcH > 0) {
        const cropped = document.createElement("canvas");
        cropped.width = srcW;
        cropped.height = srcH;
        cropped.getContext("2d").drawImage(fullCanvas, srcX, srcY, srcW, srcH, 0, 0, srcW, srcH);
        exportCanvas = cropped;
      }
    }

    if (format === "png" || format === "jpg") {
      const link = document.createElement("a");
      link.download = `mindmap.${format}`;
      link.href = exportCanvas.toDataURL(`image/${format === "jpg" ? "jpeg" : "png"}`);
      link.click();
    } else if (format === "pdf") {
      const [pw, ph] = PAGE_SIZES[pageSize] || PAGE_SIZES.a4;
      const pageW = orientation === "landscape" ? Math.max(pw, ph) : Math.min(pw, ph);
      const pageH = orientation === "landscape" ? Math.min(pw, ph) : Math.max(pw, ph);

      const margin = pageW * 0.05;
      const availW = pageW - margin * 2;
      const availH = pageH - margin * 2;

      const imgRatio = exportCanvas.width / exportCanvas.height;
      const pageRatio = availW / availH;
      let imgW, imgH;
      if (imgRatio > pageRatio) {
        imgW = availW;
        imgH = availW / imgRatio;
      } else {
        imgH = availH;
        imgW = availH * imgRatio;
      }

      const offsetX = margin + (availW - imgW) / 2;
      const offsetY = margin + (availH - imgH) / 2;

      const pdf = new jsPDF({
        orientation: orientation,
        unit: "mm",
        format: [pageW, pageH],
      });

      const imgData = exportCanvas.toDataURL("image/png");
      pdf.addImage(imgData, "PNG", offsetX, offsetY, imgW, imgH);
      pdf.save("mindmap.pdf");
    }

    setExporting(false);
    onClose(false);
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-sm">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Download className="w-5 h-5 text-primary" />
            Exporter
          </DialogTitle>
        </DialogHeader>
        <div className="space-y-4 mt-2">
          <div className="space-y-2">
            <Label className="text-sm">Format</Label>
            <Select value={format} onValueChange={setFormat}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="png">
                  <span className="flex items-center gap-2"><Image className="w-4 h-4" /> PNG</span>
                </SelectItem>
                <SelectItem value="jpg">
                  <span className="flex items-center gap-2"><Image className="w-4 h-4" /> JPG</span>
                </SelectItem>
                <SelectItem value="pdf">
                  <span className="flex items-center gap-2"><FileText className="w-4 h-4" /> PDF</span>
                </SelectItem>
              </SelectContent>
            </Select>
          </div>

          {format === "pdf" && (
            <>
              <div className="space-y-2">
                <Label className="text-sm">Taille de page</Label>
                <Select value={pageSize} onValueChange={setPageSize}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="a5">A5</SelectItem>
                    <SelectItem value="a4">A4</SelectItem>
                    <SelectItem value="a3">A3</SelectItem>
                    <SelectItem value="a2">A2</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label className="text-sm">Orientation</Label>
                <Select value={orientation} onValueChange={setOrientation}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="landscape">Paysage</SelectItem>
                    <SelectItem value="portrait">Portrait</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </>
          )}

          <p className="text-xs text-muted-foreground">
            La carte sera recadrée automatiquement autour de vos nœuds et mise à l'échelle pour remplir la page.
          </p>

          <Button className="w-full" onClick={handleExport} disabled={exporting}>
            {exporting ? (
              <><Loader2 className="w-4 h-4 mr-2 animate-spin" /> Export en cours...</>
            ) : (
              <><Download className="w-4 h-4 mr-2" /> Télécharger</>
            )}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
