"use client";

import { useState } from "react";
import { worksheetProblems } from "./data";

export default function WorksheetPage() {
  const [generating, setGenerating] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function downloadPDF() {
    setError(null);
    setGenerating(true);
    try {
      // Dynamic import keeps jsPDF out of the main bundle until needed.
      const { jsPDF } = await import("jspdf");
      const { olChikiFontBase64 } = await import("./olChikiFont");
      const doc = new jsPDF({ unit: "pt", format: "a4" });

      // Register the Ol Chiki font so Santali text renders as real
      // glyphs instead of blank boxes.
      doc.addFileToVFS("NotoSansOlChiki-Regular.ttf", olChikiFontBase64);
      doc.addFont("NotoSansOlChiki-Regular.ttf", "OlChiki", "normal");

      const pageWidth = doc.internal.pageSize.getWidth();
      const margin = 48;
      let y = 60;

      doc.setFont("helvetica", "bold");
      doc.setFontSize(20);
      doc.text("Sahayak - Practice Worksheet", margin, y);

      y += 22;
      doc.setFont("helvetica", "normal");
      doc.setFontSize(11);
      doc.text("Class 3 - Mathematics - Hindi / Santali", margin, y);

      y += 30;
      doc.setDrawColor(180);
      doc.line(margin, y, pageWidth - margin, y);
      y += 30;

      worksheetProblems.forEach((problem, i) => {
        if (y > 740) {
          doc.addPage();
          y = 60;
        }

        doc.setFont("helvetica", "bold");
        doc.setFontSize(12);
        doc.text(`${i + 1}.`, margin, y);

        doc.setFont("helvetica", "normal");
        doc.setFontSize(12);
        const hindiLines = doc.splitTextToSize(problem.hindi, pageWidth - margin * 2 - 24);
        doc.text(hindiLines, margin + 24, y);
        y += hindiLines.length * 16 + 4;

        // Santali line uses the embedded Ol Chiki font; switch back to
        // helvetica afterward for the answer line.
        doc.setFont("OlChiki", "normal");
        const santaliLines = doc.splitTextToSize(problem.santali, pageWidth - margin * 2 - 24);
        doc.text(santaliLines, margin + 24, y);
        y += santaliLines.length * 16 + 4;

        doc.setFont("helvetica", "normal");
        doc.text(problem.answerLine, margin + 24, y);
        y += 30;
      });

      doc.save("sahayak-practice-worksheet.pdf");
    } catch (e: any) {
      setError(e.message || "Could not generate the PDF.");
    } finally {
      setGenerating(false);
    }
  }

  return (
    <main className="flex justify-center py-10 px-4">
      <div className="w-full max-w-[420px] bg-slate rounded-[34px] p-3 shadow-2xl">
        <div className="bg-paper rounded-[22px] overflow-hidden flex flex-col min-h-[640px]">
          <div className="px-5 pt-4 pb-4 flex items-center justify-between border-b border-line">
            <div>
              <div className="font-display font-semibold text-[15px] text-slate">
                Practice Worksheet
              </div>
              <div className="text-[11px] text-inksoft">Hindi - Santali, Class 3 Maths</div>
            </div>
            <a href="/" className="text-[12px] font-display text-slate underline">
              Back
            </a>
          </div>

          <div className="p-5 flex flex-col gap-4 flex-1">
            <div className="flex flex-col gap-2 overflow-y-auto">
              {worksheetProblems.map((p, i) => (
                <div key={i} className="bg-white border border-line rounded-2xl p-3">
                  <div className="text-[11px] text-inksoft mb-1">Question {i + 1}</div>
                  <div className="font-devanagari text-[14px] text-ink">{p.hindi}</div>
                  <div className="font-devanagari text-[14px] text-marigolddark mt-1">
                    {p.santali}
                  </div>
                </div>
              ))}
            </div>

            <button
              onClick={downloadPDF}
              disabled={generating}
              className="rounded-pill py-2 font-display text-[13px] font-semibold bg-marigold text-slate disabled:opacity-50"
            >
              {generating ? "Generating PDF..." : "Download worksheet (PDF)"}
            </button>

            {error && (
              <div className="rounded-2xl border border-marigolddark bg-[#FBEFE0] text-[13px] p-3 text-marigolddark">
                {error}
              </div>
            )}
          </div>
        </div>
      </div>
    </main>
  );
}