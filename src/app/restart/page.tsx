"use client";

import React, { useMemo } from "react";
import dataset from "@/data/data.json";
import { useProgressStore, ProblemProgress } from "@/store/useProgressStore";
import { ProblemTable } from "@/components/ProblemTable";
import { RefreshCcw, Info } from "lucide-react";

export default function RestartPage() {
  const { stats, completedProblems } = useProgressStore();

  const { overdue, nextSuggested } = useMemo(() => {
    const now = Date.now();
    const overdueList: any[] = [];
    const allProblems = dataset.flatMap(s => s.lectures.flatMap(l => l.problems));
    let nextSuggestedList: any[] = [];

    // Find overdue
    allProblems.forEach(prob => {
      const prog = completedProblems[prob.id];
      if (prog && typeof prog !== 'boolean') {
        const p = prog as ProblemProgress;
        if (p.status === 'solved' && p.nextRevisionDate && p.nextRevisionDate < now) {
          overdueList.push(prob);
        }
      }
    });

    // Find first 10 unsolved problems to act as "Suggested Next"
    nextSuggestedList = allProblems.filter(prob => {
      const prog = completedProblems[prob.id];
      return !prog || (typeof prog !== 'boolean' && prog.status !== 'solved');
    }).slice(0, 10);

    return { overdue: overdueList, nextSuggested: nextSuggestedList };
  }, [completedProblems]);

  const diffDays = useMemo(() => {
    if (!stats.lastActiveDate) return 0;
    const lastDate = new Date(stats.lastActiveDate);
    const currentDate = new Date();
    const diffTime = Math.abs(currentDate.getTime() - lastDate.getTime());
    return Math.floor(diffTime / (1000 * 60 * 60 * 24));
  }, [stats.lastActiveDate]);

  return (
    <div className="max-w-6xl mx-auto py-8 px-4 sm:px-6 lg:px-8 font-inter">
      <div className="mb-8">
        <h1 className="text-3xl font-outfit font-bold mb-2">Quick Restart System</h1>
        <p className="text-zinc-500 dark:text-zinc-400">Returning after a break? Pick up exactly where you left off.</p>
      </div>

      <div className="bg-blue-50 dark:bg-blue-950/20 border border-blue-200 dark:border-blue-900 rounded-xl p-6 mb-8 flex items-start gap-4">
        <Info className="text-blue-500 shrink-0 mt-1" />
        <div>
          <h3 className="font-semibold text-blue-800 dark:text-blue-300">Welcome Back!</h3>
          <p className="text-sm text-blue-600 dark:text-blue-400 mt-1">
            {diffDays > 0 
              ? `You've been away for ${diffDays} days. Don't worry, we've organized your pending tasks below so you can ease back into your preparation.`
              : "You're active today! Keep up the great work. If you want to warm up, check your pending revisions below."}
          </p>
        </div>
      </div>

      <div className="space-y-8">
        {overdue.length > 0 && (
          <div className="bg-white dark:bg-[#1a1b1e] border border-zinc-200 dark:border-zinc-800 rounded-xl overflow-hidden shadow-sm">
            <div className="p-4 bg-zinc-50 dark:bg-zinc-800/50 flex items-center gap-3 border-b border-zinc-200 dark:border-zinc-800">
              <RefreshCcw className="text-orange-500" />
              <h2 className="text-lg font-semibold">Warm Up: Overdue Revisions ({overdue.length})</h2>
            </div>
            <div className="p-4 bg-white dark:bg-[#1a1b1e] text-sm text-zinc-500 border-b border-zinc-100 dark:border-zinc-800/50">
              Before learning new concepts, try recalling these forgotten problems to strengthen your memory.
            </div>
            <div className="p-0 overflow-x-auto">
              <ProblemTable problems={overdue} />
            </div>
          </div>
        )}

        <div className="bg-white dark:bg-[#1a1b1e] border border-zinc-200 dark:border-zinc-800 rounded-xl overflow-hidden shadow-sm">
          <div className="p-4 bg-zinc-50 dark:bg-zinc-800/50 flex items-center gap-3 border-b border-zinc-200 dark:border-zinc-800">
            <h2 className="text-lg font-semibold">Suggested Next Problems</h2>
          </div>
          <div className="p-4 bg-white dark:bg-[#1a1b1e] text-sm text-zinc-500 border-b border-zinc-100 dark:border-zinc-800/50">
            Based on your progress, these are the next problems you should tackle.
          </div>
          <div className="p-0 overflow-x-auto">
            {nextSuggested.length > 0 ? (
              <ProblemTable problems={nextSuggested} />
            ) : (
              <div className="p-8 text-center text-zinc-500">You have completed all problems in the sheet!</div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
