"use client";

import React, { useMemo } from "react";
import dataset from "@/data/data.json";
import { useProgressStore, ProblemProgress } from "@/store/useProgressStore";
import { Flame, Target, TrendingUp, AlertTriangle } from "lucide-react";

export default function AnalyticsPage() {
  const { stats, completedProblems } = useProgressStore();

  const {
    topicStats,
    weakTopics,
    totalSolved,
    easyCount,
    partialCount,
    forgotCount
  } = useMemo(() => {
    let tSolved = 0;
    let easy = 0, partial = 0, forgot = 0;
    
    const tStats = dataset.map(step => {
      let stepTotal = 0;
      let stepSolved = 0;
      let stepForgot = 0;
      
      step.lectures.forEach(l => {
        stepTotal += l.problems.length;
        l.problems.forEach(p => {
          const prog = completedProblems[p.id];
          if (prog && (typeof prog === 'boolean' || prog.status === 'solved')) {
            stepSolved++;
            tSolved++;
            const conf = typeof prog === 'boolean' ? 'easy' : prog.confidence;
            if (conf === 'easy') easy++;
            if (conf === 'partial') partial++;
            if (conf === 'forgot') {
              forgot++;
              stepForgot++;
            }
          }
        });
      });
      
      return {
        title: step.title,
        total: stepTotal,
        solved: stepSolved,
        forgot: stepForgot,
        percentage: stepTotal > 0 ? Math.round((stepSolved / stepTotal) * 100) : 0
      };
    });

    const wTopics = [...tStats]
      .filter(t => t.solved > 0 && (t.percentage < 50 || t.forgot > 2))
      .sort((a, b) => a.percentage - b.percentage)
      .slice(0, 5);

    return { topicStats: tStats, weakTopics: wTopics, totalSolved: tSolved, easyCount: easy, partialCount: partial, forgotCount: forgot };
  }, [completedProblems]);

  return (
    <div className="max-w-6xl mx-auto py-8 px-4 sm:px-6 lg:px-8 font-inter">
      <div className="mb-8">
        <h1 className="text-3xl font-outfit font-bold mb-2">Analytics & Weakness Analysis</h1>
        <p className="text-zinc-500 dark:text-zinc-400">Track your daily targets, streaks, and identify areas for improvement.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-white dark:bg-[#1a1b1e] p-6 rounded-xl border border-zinc-200 dark:border-zinc-800 shadow-sm flex items-center gap-4">
          <div className="w-12 h-12 rounded-full bg-orange-100 dark:bg-orange-500/10 flex items-center justify-center shrink-0">
            <Flame className="text-orange-500" size={24} />
          </div>
          <div>
            <p className="text-sm text-zinc-500 font-medium">Current Streak</p>
            <p className="text-2xl font-bold font-outfit">{stats.currentStreak} Days</p>
          </div>
        </div>
        <div className="bg-white dark:bg-[#1a1b1e] p-6 rounded-xl border border-zinc-200 dark:border-zinc-800 shadow-sm flex items-center gap-4">
          <div className="w-12 h-12 rounded-full bg-blue-100 dark:bg-blue-500/10 flex items-center justify-center shrink-0">
            <Target className="text-blue-500" size={24} />
          </div>
          <div>
            <p className="text-sm text-zinc-500 font-medium">Longest Streak</p>
            <p className="text-2xl font-bold font-outfit">{stats.longestStreak} Days</p>
          </div>
        </div>
        <div className="bg-white dark:bg-[#1a1b1e] p-6 rounded-xl border border-zinc-200 dark:border-zinc-800 shadow-sm flex items-center gap-4">
          <div className="w-12 h-12 rounded-full bg-purple-100 dark:bg-purple-500/10 flex items-center justify-center shrink-0">
            <TrendingUp className="text-purple-500" size={24} />
          </div>
          <div>
            <p className="text-sm text-zinc-500 font-medium">Total Solved</p>
            <p className="text-2xl font-bold font-outfit">{totalSolved}</p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
        <div className="bg-white dark:bg-[#1a1b1e] border border-zinc-200 dark:border-zinc-800 rounded-xl overflow-hidden shadow-sm">
          <div className="p-6 border-b border-zinc-200 dark:border-zinc-800">
            <h2 className="text-lg font-bold font-outfit flex items-center gap-2">
              <AlertTriangle className="text-yellow-500" /> Weak Areas
            </h2>
            <p className="text-sm text-zinc-500 mt-1">Topics with low completion or high forget rates.</p>
          </div>
          <div className="p-6">
            {weakTopics.length > 0 ? (
              <div className="space-y-4">
                {weakTopics.map(wt => (
                  <div key={wt.title} className="flex justify-between items-center">
                    <div>
                      <p className="font-medium">{wt.title}</p>
                      <p className="text-xs text-zinc-500">{wt.forgot} problems forgotten</p>
                    </div>
                    <div className="text-right">
                      <p className="font-bold text-red-500">{wt.percentage}%</p>
                      <p className="text-xs text-zinc-500">{wt.solved} / {wt.total}</p>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-zinc-500">No weak areas identified yet. Keep solving!</p>
            )}
          </div>
        </div>

        <div className="bg-white dark:bg-[#1a1b1e] border border-zinc-200 dark:border-zinc-800 rounded-xl overflow-hidden shadow-sm">
          <div className="p-6 border-b border-zinc-200 dark:border-zinc-800">
            <h2 className="text-lg font-bold font-outfit">Confidence Breakdown</h2>
            <p className="text-sm text-zinc-500 mt-1">How well you remember solved problems.</p>
          </div>
          <div className="p-6 space-y-6">
            <div>
              <div className="flex justify-between text-sm mb-1">
                <span className="text-green-600 dark:text-green-400 font-medium">Easy Recall</span>
                <span>{easyCount}</span>
              </div>
              <div className="w-full h-2 bg-zinc-100 dark:bg-zinc-800 rounded-full overflow-hidden">
                <div className="h-full bg-green-500" style={{ width: `${totalSolved ? (easyCount/totalSolved)*100 : 0}%` }} />
              </div>
            </div>
            <div>
              <div className="flex justify-between text-sm mb-1">
                <span className="text-yellow-600 dark:text-yellow-400 font-medium">Partial Recall</span>
                <span>{partialCount}</span>
              </div>
              <div className="w-full h-2 bg-zinc-100 dark:bg-zinc-800 rounded-full overflow-hidden">
                <div className="h-full bg-yellow-500" style={{ width: `${totalSolved ? (partialCount/totalSolved)*100 : 0}%` }} />
              </div>
            </div>
            <div>
              <div className="flex justify-between text-sm mb-1">
                <span className="text-red-600 dark:text-red-400 font-medium">Forgot Solution</span>
                <span>{forgotCount}</span>
              </div>
              <div className="w-full h-2 bg-zinc-100 dark:bg-zinc-800 rounded-full overflow-hidden">
                <div className="h-full bg-red-500" style={{ width: `${totalSolved ? (forgotCount/totalSolved)*100 : 0}%` }} />
              </div>
            </div>
          </div>
        </div>
      </div>
      
      <div className="bg-white dark:bg-[#1a1b1e] border border-zinc-200 dark:border-zinc-800 rounded-xl overflow-hidden shadow-sm">
        <div className="p-6 border-b border-zinc-200 dark:border-zinc-800">
          <h2 className="text-lg font-bold font-outfit">Topic Completion</h2>
        </div>
        <div className="p-6 space-y-4">
          {topicStats.map(ts => (
            <div key={ts.title}>
              <div className="flex justify-between text-sm mb-1">
                <span className="font-medium text-zinc-700 dark:text-zinc-300">{ts.title}</span>
                <span className="text-zinc-500">{ts.percentage}% ({ts.solved}/{ts.total})</span>
              </div>
              <div className="w-full h-1.5 bg-zinc-100 dark:bg-zinc-800 rounded-full overflow-hidden">
                <div className="h-full bg-blue-500" style={{ width: `${ts.percentage}%` }} />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
