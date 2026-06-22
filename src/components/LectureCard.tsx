"use client";

import React, { useState } from "react";
import { ChevronDown, ChevronUp } from "lucide-react";
import { ProblemTable } from "./ProblemTable";
import { useProgressStore } from "@/store/useProgressStore";

export function LectureCard({ lecture, defaultOpen = false }: { lecture: any, defaultOpen?: boolean }) {
  const [isOpen, setIsOpen] = useState(defaultOpen);
  
  const problemIds = lecture.problems.map((p: any) => p.id);
  const completedProblems = useProgressStore(state => state.completedProblems);
  const getProgress = useProgressStore(state => state.getProgress);
  const { completed, total, percentage } = getProgress(problemIds);

  return (
    <div className="bg-white dark:bg-[#0c0c0e] rounded-xl overflow-hidden border border-zinc-200 dark:border-zinc-800/50 shadow-sm">
      <button 
        onClick={() => setIsOpen(!isOpen)}
        className="w-full px-5 py-4 flex items-center justify-between hover:bg-zinc-50 dark:hover:bg-zinc-800/50 transition-colors text-left"
      >
        <div className="flex items-center gap-3">
          <h3 className="text-[15px] font-semibold font-outfit text-zinc-900 dark:text-zinc-200">{lecture.title}</h3>
        </div>
        <div className="flex items-center gap-4 text-zinc-400">
          <div className="w-24 h-2 bg-zinc-100 dark:bg-zinc-800/80 rounded-full overflow-hidden">
            <div 
              className="h-full bg-red-500 transition-all duration-500" 
              style={{ width: `${percentage}%` }}
            />
          </div>
          {isOpen ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
        </div>
      </button>
      
      {isOpen && (
        <div className="p-0 border-t border-zinc-100 dark:border-zinc-800/50 overflow-x-auto">
          <ProblemTable problems={lecture.problems} />
        </div>
      )}
    </div>
  );
}
