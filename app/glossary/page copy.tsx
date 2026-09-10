"use client";

import { useState } from "react";
import { glossaryTerms } from "./data";

export default function GlossaryPage() {
  const [mode, setMode] = useState<"list" | "flashcards">("list");
  const [index, setIndex] = useState(0);
  const [flipped, setFlipped] = useState(false);

  const current = glossaryTerms[index];

  function next() {
    setFlipped(false);
    setIndex((i) => (i + 1) % glossaryTerms.length);
  }

  function prev() {
    setFlipped(false);
    setIndex((i) => (i - 1 + glossaryTerms.length) % glossaryTerms.length);
  }

  return (
    <main className="flex justify-center py-10 px-4">
      <div className="w-full max-w-[420px] bg-slate rounded-[34px] p-3 shadow-2xl">
        <div className="bg-paper rounded-[22px] overflow-hidden flex flex-col min-h-[640px]">
          <div className="px-5 pt-4 pb-4 flex items-center justify-between border-b border-line">
            <div>
              <div className="font-display font-semibold text-[15px] text-slate">
                Bilingual Glossary
              </div>
              <div className="text-[11px] text-inksoft">Hindi – Santali maths words</div>
            </div>
            <a href="/" className="text-[12px] font-display text-slate underline">
              Back
            </a>
          </div>

          <div className="p-5 flex flex-col gap-4 flex-1">
            <div className="flex gap-2">
              <button
                onClick={() => setMode("list")}
                className={`flex-1 rounded-pill py-2 font-display text-[13px] font-semibold ${
                  mode === "list" ? "bg-slate text-white" : "bg-white border border-line text-inksoft"
                }`}
              >
                Word list
              </button>
              <button
                onClick={() => setMode("flashcards")}
                className={`flex-1 rounded-pill py-2 font-display text-[13px] font-semibold ${
                  mode === "flashcards" ? "bg-slate text-white" : "bg-white border border-line text-inksoft"
                }`}
              >
                Flashcards
              </button>
            </div>

            {mode === "list" && (
              <div className="flex flex-col gap-2 overflow-y-auto">
                {glossaryTerms.map((t) => (
                  <div
                    key={t.english}
                    className="bg-white border border-line rounded-2xl p-3 flex items-center justify-between"
                  >
                    <div>
                      <div className="text-[13px] text-inksoft">{t.english}</div>
                      <div className="font-devanagari text-[15px] text-ink">{t.hindi}</div>
                    </div>
                    <div className="font-devanagari text-[18px] text-marigolddark">{t.santali}</div>
                  </div>
                ))}
              </div>
            )}

            {mode === "flashcards" && (
              <div className="flex flex-col items-center gap-4">
                <div
                  onClick={() => setFlipped((f) => !f)}
                  className="w-full h-56 bg-white border border-line rounded-2xl flex items-center justify-center cursor-pointer"
                >
                  {!flipped ? (
                    <div className="text-center">
                      <div className="text-[12px] text-inksoft mb-2">English / Hindi</div>
                      <div className="text-[20px] font-display font-semibold text-slate">
                        {current.english}
                      </div>
                      <div className="font-devanagari text-[22px] mt-1">{current.hindi}</div>
                    </div>
                  ) : (
                    <div className="text-center">
                      <div className="text-[12px] text-inksoft mb-2">Santali</div>
                      <div className="font-devanagari text-[28px] text-marigolddark">
                        {current.santali}
                      </div>
                    </div>
                  )}
                </div>
                <div className="text-[12px] text-inksoft">Tap the card to flip</div>
                <div className="flex gap-3">
                  <button
                    onClick={prev}
                    className="px-5 py-2 rounded-pill bg-white border border-line text-[13px] font-display"
                  >
                    Previous
                  </button>
                  <button
                    onClick={next}
                    className="px-5 py-2 rounded-pill bg-marigold text-slate text-[13px] font-display font-semibold"
                  >
                    Next
                  </button>
                </div>
                <div className="text-[11px] text-inksoft">
                  {index + 1} / {glossaryTerms.length}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </main>
  );
}
