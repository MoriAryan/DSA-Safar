"use client";

import React, { useMemo, useState } from "react";
import dataset from "@/data/data.json";
import { useProgressStore, ProblemProgress, Confidence } from "@/store/useProgressStore";
import { ProblemTable } from "@/components/ProblemTable";
import { Clock, Calendar, AlertCircle, CheckCircle2, ChevronRight, Zap, Target, BrainCircuit, ExternalLink } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useUser, useClerk } from "@clerk/nextjs";

export default function RevisionsPage() {
  const [mounted, setMounted] = React.useState(false);
  const { completedProblems, updateConfidence } = useProgressStore();
  const { isSignedIn } = useUser();
  const clerk = useClerk();

  React.useEffect(() => {
    setMounted(true);
  }, []);

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

    return { 
      overdue: overdueList.sort((a, b) => {
        const progA = completedProblems[a.id] as ProblemProgress;
        const progB = completedProblems[b.id] as ProblemProgress;
        return (progA.nextRevisionDate || 0) - (progB.nextRevisionDate || 0);
      }), 
      today: todayList, 
      thisWeek: thisWeekList 
    };
  }, [completedProblems]);

  if (!mounted) {
    return <div className="max-w-4xl mx-auto py-8 px-4 sm:px-6 lg:px-8 font-inter animate-pulse min-h-screen"></div>;
  }

  const focusQueue = overdue.slice(0, 3); // Top 3 most urgent

  const handleConfidence = (id: string, conf: Confidence) => {
    if (!isSignedIn) return clerk.openSignIn();
    updateConfidence(id, conf);
  };

  return (
    <div className="max-w-4xl mx-auto py-12 px-4 sm:px-6 lg:px-8 font-inter">
      <div className="mb-10 text-center">
        <div className="w-16 h-16 mx-auto bg-gradient-to-br from-indigo-500 to-purple-600 rounded-2xl flex items-center justify-center shadow-lg shadow-indigo-500/20 mb-6 transform rotate-3">
          <BrainCircuit className="text-white" size={32} />
        </div>
        <h1 className="text-4xl font-outfit font-black mb-3 text-zinc-900 dark:text-white tracking-tight">Focus Revisions</h1>
        <p className="text-zinc-500 dark:text-zinc-400 text-lg max-w-xl mx-auto">
          Your personal spaced repetition engine. Master your weak spots without getting overwhelmed.
        </p>
      </div>

      <div className="space-y-12">
        {/* Focus Mode UI */}
        <div>
          <div className="flex items-center justify-between mb-6 px-2">
            <h2 className="text-2xl font-bold font-outfit flex items-center gap-2">
              <Zap className="text-orange-500" /> Priority Queue
            </h2>
            {overdue.length > 3 && (
              <span className="text-sm font-medium text-zinc-500 bg-zinc-100 dark:bg-zinc-800 px-3 py-1 rounded-full">
                +{overdue.length - 3} more in backlog
              </span>
            )}
          </div>

          {focusQueue.length > 0 ? (
            <div className="grid gap-4">
              {focusQueue.map((prob, idx) => {
                const prog = completedProblems[prob.id] as ProblemProgress;
                const daysOverdue = Math.floor((Date.now() - (prog.nextRevisionDate || 0)) / (24*60*60*1000));
                
                return (
                  <div key={prob.id} className="bg-white dark:bg-[#1a1b1e] border-2 border-zinc-200 dark:border-zinc-800 rounded-2xl p-6 shadow-sm hover:border-indigo-500/50 dark:hover:border-indigo-500/50 transition-colors">
                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2">
                          <span className="text-xs font-bold uppercase tracking-wider text-red-500 bg-red-100 dark:bg-red-500/10 px-2 py-1 rounded-md">
                            {daysOverdue} Days Overdue
                          </span>
                          <span className={`text-xs font-bold uppercase tracking-wider px-2 py-1 rounded-md ${
                            prob.difficulty === 'Easy' ? 'text-green-600 bg-green-100 dark:text-green-400 dark:bg-green-400/10' :
                            prob.difficulty === 'Medium' ? 'text-yellow-600 bg-yellow-100 dark:text-yellow-400 dark:bg-yellow-400/10' :
                            'text-red-600 bg-red-100 dark:text-red-400 dark:bg-red-400/10'
                          }`}>
                            {prob.difficulty}
                          </span>
                        </div>
                        <h3 className="text-xl font-bold font-outfit text-zinc-900 dark:text-white mb-1">{prob.title}</h3>
                        <p className="text-sm text-zinc-500">Revision #{prog.revisionCount + 1}</p>
                      </div>

                      <div className="flex flex-col gap-3 shrink-0">
                        <a 
                          href={prob.practiceLink || prob.articleLink} 
                          target="_blank" 
                          rel="noreferrer"
                          className="flex items-center justify-center gap-2 w-full md:w-auto bg-zinc-900 dark:bg-white text-white dark:text-zinc-900 px-6 py-3 rounded-xl font-semibold hover:bg-zinc-800 dark:hover:bg-zinc-100 transition-colors"
                        >
                          Solve Now <ExternalLink size={16} />
                        </a>
                        
                        <div className="flex gap-2">
                          <button onClick={() => handleConfidence(prob.id, 'easy')} className="flex-1 px-4 py-2 text-xs font-bold bg-green-100 text-green-700 dark:bg-green-500/10 dark:text-green-400 hover:bg-green-200 dark:hover:bg-green-500/20 rounded-lg transition-colors">
                            Easy
                          </button>
                          <button onClick={() => handleConfidence(prob.id, 'partial')} className="flex-1 px-4 py-2 text-xs font-bold bg-yellow-100 text-yellow-700 dark:bg-yellow-500/10 dark:text-yellow-400 hover:bg-yellow-200 dark:hover:bg-yellow-500/20 rounded-lg transition-colors">
                            Partial
                          </button>
                          <button onClick={() => handleConfidence(prob.id, 'forgot')} className="flex-1 px-4 py-2 text-xs font-bold bg-red-100 text-red-700 dark:bg-red-500/10 dark:text-red-400 hover:bg-red-200 dark:hover:bg-red-500/20 rounded-lg transition-colors">
                            Forgot
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="bg-gradient-to-br from-green-400/10 to-emerald-500/10 border-2 border-green-500/20 rounded-3xl p-12 text-center">
              <div className="w-20 h-20 mx-auto bg-green-500/20 rounded-full flex items-center justify-center mb-6">
                <CheckCircle2 className="text-green-500" size={40} />
              </div>
              <h3 className="text-2xl font-bold font-outfit text-zinc-900 dark:text-white mb-2">Queue is Empty!</h3>
              <p className="text-zinc-500">You have zero overdue revisions. Your memory is absolute perfection.</p>
            </div>
          )}
        </div>

        <hr className="border-zinc-200 dark:border-zinc-800" />

        {/* Upcoming UI */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-white dark:bg-[#1a1b1e] border border-zinc-200 dark:border-zinc-800 rounded-2xl overflow-hidden shadow-sm flex flex-col">
            <div className="p-5 bg-zinc-50 dark:bg-zinc-800/50 flex items-center justify-between border-b border-zinc-200 dark:border-zinc-800">
              <div className="flex items-center gap-3">
                <Clock className="text-blue-500" size={20} />
                <h2 className="font-bold font-outfit">Due Today</h2>
              </div>
              <span className="font-mono text-sm font-bold bg-blue-100 text-blue-700 dark:bg-blue-500/20 dark:text-blue-400 px-2 py-1 rounded">
                {today.length}
              </span>
            </div>
            <div className="p-5 flex-1 overflow-y-auto max-h-[300px]">
              {today.length > 0 ? (
                <ul className="space-y-3">
                  {today.map(p => (
                    <li key={p.id} className="flex items-center gap-3 text-sm">
                      <span className="w-1.5 h-1.5 rounded-full bg-blue-500 shrink-0" />
                      <span className="truncate flex-1 text-zinc-700 dark:text-zinc-300">{p.title}</span>
                    </li>
                  ))}
                </ul>
              ) : (
                <div className="h-full flex items-center justify-center text-zinc-400 text-sm italic">
                  Nothing else due today.
                </div>
              )}
            </div>
          </div>

          <div className="bg-white dark:bg-[#1a1b1e] border border-zinc-200 dark:border-zinc-800 rounded-2xl overflow-hidden shadow-sm flex flex-col">
            <div className="p-5 bg-zinc-50 dark:bg-zinc-800/50 flex items-center justify-between border-b border-zinc-200 dark:border-zinc-800">
              <div className="flex items-center gap-3">
                <Calendar className="text-emerald-500" size={20} />
                <h2 className="font-bold font-outfit">Later This Week</h2>
              </div>
              <span className="font-mono text-sm font-bold bg-emerald-100 text-emerald-700 dark:bg-emerald-500/20 dark:text-emerald-400 px-2 py-1 rounded">
                {thisWeek.length}
              </span>
            </div>
            <div className="p-5 flex-1 overflow-y-auto max-h-[300px]">
              {thisWeek.length > 0 ? (
                <ul className="space-y-3">
                  {thisWeek.map(p => (
                    <li key={p.id} className="flex items-center gap-3 text-sm">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 shrink-0" />
                      <span className="truncate flex-1 text-zinc-700 dark:text-zinc-300">{p.title}</span>
                    </li>
                  ))}
                </ul>
              ) : (
                <div className="h-full flex items-center justify-center text-zinc-400 text-sm italic">
                  No upcoming revisions.
                </div>
              )}
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
