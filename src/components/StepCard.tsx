"use client";

import React, { useState } from "react";
import { ChevronDown, ChevronUp } from "lucide-react";
import { LectureCard } from "./LectureCard";
import { useProgressStore } from "@/store/useProgressStore";

export function StepCard({ step, defaultOpen = false }: { step: any, defaultOpen?: boolean }) {
  const [isOpen, setIsOpen] = useState(defaultOpen);
  
  const allProblemIds = step.lectures.flatMap((l: any) => l.problems.map((p: any) => p.id));
  const completedProblems = useProgressStore(state => state.completedProblems);
  const getProgress = useProgressStore(state => state.getProgress);
  const { completed, total } = getProgress(allProblemIds);

  return (
    <div className="bg-white dark:bg-[#1a1b1e] rounded-xl shadow-sm border border-zinc-200 dark:border-zinc-800 overflow-hidden transition-all duration-200">
      <button 
        onClick={() => setIsOpen(!isOpen)}
        className="w-full px-6 py-4 flex items-center justify-between hover:bg-zinc-50 dark:hover:bg-zinc-800/50 transition-colors text-left"
      >
        <div className="flex items-center gap-4">
          <h2 className="text-xl font-bold font-outfit text-cyan-600 dark:text--500">{step.title}</h2>
        </div>
        <div className="flex items-center gap-4 text-zinc-500">
          <span className="text-sm font-medium bg-zinc-100 dark:bg-zinc-800 px-3 py-1 rounded-full">
            {completed} / {total}
          </span>
          {isOpen ? <ChevronUp size={24} /> : <ChevronDown size={24} />}
        </div>
      </button>
      
      {isOpen && (
        <div className="p-6 pt-2 space-y-4">
          {step.lectures.map((lec: any, idx: number) => (
            <LectureCard key={idx} lecture={lec} defaultOpen={idx === 0} />
          ))}
        </div>
      )}
    </div>
  );
}
