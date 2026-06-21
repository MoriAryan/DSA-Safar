"use client";

import { useEffect, useState } from "react";
import { Terminal } from "lucide-react";

export default function Loading() {
  const [text, setText] = useState("");
  const lines = [
    "INITIALIZING DSA SAFAR ENGINE...",
    "FETCHING USER PROGRESS...",
    "COMPILING ALGORITHMS...",
    "RENDERING UI MODULES...",
    "SYSTEM READY."
  ];

  useEffect(() => {
    let currentLine = 0;
    let currentChar = 0;
    let currentText = "";

    const typeInterval = setInterval(() => {
      if (currentLine >= lines.length) {
        clearInterval(typeInterval);
        return;
      }

      if (currentChar < lines[currentLine].length) {
        currentText += lines[currentLine][currentChar];
        setText(currentText);
        currentChar++;
      } else {
        currentText += "\n> ";
        setText(currentText);
        currentLine++;
        currentChar = 0;
      }
    }, 30); // Very fast typing

    return () => clearInterval(typeInterval);
  }, []);

  return (
    <div className="flex items-center justify-center min-h-screen bg-[#0c0c0e] font-mono text-emerald-500 p-8">
      <div className="w-full max-w-2xl bg-black/50 border border-emerald-500/30 rounded-lg p-6 shadow-[0_0_30px_rgba(16,185,129,0.1)]">
        <div className="flex items-center gap-3 mb-4 border-b border-emerald-500/20 pb-4">
          <Terminal size={24} className="text-emerald-500" />
          <span className="text-emerald-500 font-bold tracking-widest uppercase text-sm">DSA Safar Terminal //</span>
        </div>
        <pre className="whitespace-pre-wrap text-sm md:text-base h-[120px]">
          {"> " + text}
          <span className="animate-pulse">_</span>
        </pre>
      </div>
    </div>
  );
}
