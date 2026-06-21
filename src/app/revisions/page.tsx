"use client";

import React, { useMemo } from "react";
import dataset from "@/data/data.json";
import { useProgressStore, ProblemProgress } from "@/store/useProgressStore";
import { ProblemTable } from "@/components/ProblemTable";
import { Clock, Calendar, AlertCircle } from "lucide-react";

export default function RevisionsPage() {
  const { completedProblems } = useProgressStore();

  const { overdue, today, thisWeek } = useMemo(() => {
    const now = Date.now();
    const DAY = 24 * 60 * 60 * 1000;
    
    const overdueList: any[] = [];
    const todayList: any[] = [];
    const thisWeekList: any[] = [];

    // Flatten all problems from dataset
    const allProblems = dataset.flatMap(s => s.lectures.flatMap(l => l.problems));

    allProblems.forEach(prob => {
      const prog = completedProblems[prob.id];
      if (!prog || typeof prog === 'boolean') return;
      
      const p = prog as ProblemProgress;
      if (p.status !== 'solved' || p.nextRevisionDate === null) return;

      const diff = p.nextRevisionDate - now;

      if (diff < 0) {
        // Only count as overdue if it's past today
        const daysPast = Math.abs(diff) / DAY;
        if (daysPast > 1) {
          overdueList.push(prob);
        } else {
          todayList.push(prob);
        }
      } else if (diff < DAY) {
        todayList.push(prob);
      } else if (diff < DAY * 7) {
        thisWeekList.push(prob);
      }
    });

    return { overdue: overdueList, today: todayList, thisWeek: thisWeekList };
  }, [completedProblems]);

  return (
    <div className="max-w-6xl mx-auto py-8 px-4 sm:px-6 lg:px-8 font-inter">
      <div className="mb-8">
        <h1 className="text-3xl font-outfit font-bold mb-2">Smart Revision Dashboard</h1>
        <p className="text-zinc-500 dark:text-zinc-400">Spaced repetition engine to ensure you never forget what you've learned.</p>
      </div>

      <div className="space-y-8">
        {overdue.length > 0 && (
          <div className="bg-red-50 dark:bg-red-950/20 border border-red-200 dark:border-red-900 rounded-xl overflow-hidden">
            <div className="p-4 bg-red-100 dark:bg-red-900/40 flex items-center gap-3">
              <AlertCircle className="text-red-600 dark:text-red-400" />
              <h2 className="text-lg font-semibold text-red-800 dark:text-red-300">Overdue Revisions ({overdue.length})</h2>
            </div>
            <div className="p-0 overflow-x-auto bg-white dark:bg-[#1a1b1e]">
              <ProblemTable problems={overdue} />
            </div>
          </div>
        )}

        <div className="bg-white dark:bg-[#1a1b1e] border border-zinc-200 dark:border-zinc-800 rounded-xl overflow-hidden shadow-sm">
          <div className="p-4 bg-zinc-50 dark:bg-zinc-800/50 flex items-center gap-3 border-b border-zinc-200 dark:border-zinc-800">
            <Clock className="text-blue-500" />
            <h2 className="text-lg font-semibold">Due Today ({today.length})</h2>
          </div>
          <div className="p-0 overflow-x-auto">
            {today.length > 0 ? (
              <ProblemTable problems={today} />
            ) : (
              <div className="p-8 text-center text-zinc-500">No revisions due today. You're all caught up!</div>
            )}
          </div>
        </div>

        {thisWeek.length > 0 && (
          <div className="bg-white dark:bg-[#1a1b1e] border border-zinc-200 dark:border-zinc-800 rounded-xl overflow-hidden shadow-sm">
            <div className="p-4 bg-zinc-50 dark:bg-zinc-800/50 flex items-center gap-3 border-b border-zinc-200 dark:border-zinc-800">
              <Calendar className="text-emerald-500" />
              <h2 className="text-lg font-semibold">Upcoming This Week ({thisWeek.length})</h2>
            </div>
            <div className="p-0 overflow-x-auto">
              <ProblemTable problems={thisWeek} />
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
