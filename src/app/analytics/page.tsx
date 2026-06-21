"use client";

import React, { useMemo } from "react";
import dataset from "@/data/data.json";
import { useProgressStore } from "@/store/useProgressStore";
import { Flame, Target, TrendingUp, Zap, Trophy, CheckCircle2, Battery, AlertCircle, CircleDashed } from "lucide-react";

export default function AnalyticsPage() {
  const [mounted, setMounted] = React.useState(false);
  const { stats, completedProblems, getStreak, getActiveStreak } = useProgressStore();

  React.useEffect(() => {
    setMounted(true);
  }, []);

  const {
    totalSolved,
    totalProblems,
    easyCount,
    partialCount,
    forgotCount
  } = useMemo(() => {
    let tSolved = 0;
    let total = 0;
    let easy = 0, partial = 0, forgot = 0;
    
    dataset.forEach(step => {
      step.lectures.forEach(l => {
        total += l.problems.length;
        l.problems.forEach(p => {
          const prog = completedProblems[p.id];
          if (prog && (typeof prog === 'boolean' || prog.status === 'solved')) {
            tSolved++;
            const conf = typeof prog === 'boolean' ? 'easy' : prog.confidence;
            if (conf === 'easy') easy++;
            if (conf === 'partial') partial++;
            if (conf === 'forgot') forgot++;
          }
        });
      });
    });

    return { totalSolved: tSolved, totalProblems: total, easyCount: easy, partialCount: partial, forgotCount: forgot };
  }, [completedProblems]);

  if (!mounted) {
    return <div className="max-w-5xl mx-auto py-8 px-4 sm:px-6 lg:px-8 font-inter animate-pulse min-h-screen"></div>;
  }

  const completionPercentage = totalProblems > 0 ? Math.round((totalSolved / totalProblems) * 100) : 0;

  return (
    <div className="max-w-5xl mx-auto py-12 px-4 sm:px-6 lg:px-8 font-inter">
      <div className="mb-10 text-center md:text-left">
        <h1 className="text-4xl font-outfit font-black mb-3 text-zinc-900 dark:text-white tracking-tight">Overview</h1>
        <p className="text-zinc-500 dark:text-zinc-400 text-lg">Your progress and consistency at a single glance.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-4">
        {/* Active Streak */}
        <div className="bg-gradient-to-br from-indigo-500 to-blue-600 p-6 rounded-3xl text-white shadow-lg shadow-blue-500/20 relative overflow-hidden group">
          <div className="absolute -right-4 -top-4 opacity-20 transform group-hover:scale-110 transition-transform duration-500">
            <Zap size={120} />
          </div>
          <div className="relative z-10">
            <div className="w-10 h-10 rounded-full bg-white/20 backdrop-blur-md flex items-center justify-center mb-4">
              <Zap className="text-white" size={20} />
            </div>
            <p className="text-white/80 font-medium mb-1">Active Days</p>
            <div className="flex items-baseline gap-2">
              <p className="text-4xl font-black font-outfit">{getActiveStreak()}</p>
              <p className="text-white/70 font-medium">Streak</p>
            </div>
          </div>
        </div>

        {/* Goal Streak */}
        <div className="bg-gradient-to-br from-orange-400 to-red-500 p-6 rounded-3xl text-white shadow-lg shadow-orange-500/20 relative overflow-hidden group">
          <div className="absolute -right-4 -top-4 opacity-20 transform group-hover:scale-110 transition-transform duration-500">
            <Flame size={120} />
          </div>
          <div className="relative z-10">
            <div className="w-10 h-10 rounded-full bg-white/20 backdrop-blur-md flex items-center justify-center mb-4">
              <Flame className="text-white" size={20} />
            </div>
            <p className="text-white/80 font-medium mb-1">Daily Target</p>
            <div className="flex items-baseline gap-2">
              <p className="text-4xl font-black font-outfit">{getStreak()}</p>
              <p className="text-white/70 font-medium">Streak</p>
            </div>
          </div>
        </div>

        {/* Longest Streak */}
        <div className="bg-white dark:bg-[#1a1b1e] p-6 rounded-3xl border border-zinc-200 dark:border-zinc-800 shadow-sm col-span-1 md:col-span-2 flex items-center justify-between">
          <div>
            <div className="w-10 h-10 rounded-full bg-yellow-100 dark:bg-yellow-500/10 flex items-center justify-center mb-4">
              <Trophy className="text-yellow-500" size={20} />
            </div>
            <p className="text-zinc-500 dark:text-zinc-400 font-medium mb-1">Longest Goal Streak</p>
            <p className="text-3xl font-black font-outfit text-zinc-900 dark:text-white">{stats.longestStreak} <span className="text-lg text-zinc-400 font-medium">Days</span></p>
          </div>
          <div className="opacity-10 dark:opacity-5">
            <Trophy size={100} />
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Total Progress */}
        <div className="bg-white dark:bg-[#1a1b1e] p-8 rounded-3xl border border-zinc-200 dark:border-zinc-800 shadow-sm col-span-1 md:col-span-2">
          <div className="flex items-center gap-3 mb-8">
            <div className="w-10 h-10 rounded-full bg-emerald-100 dark:bg-emerald-500/10 flex items-center justify-center">
              <TrendingUp className="text-emerald-500" size={20} />
            </div>
            <h2 className="text-xl font-bold font-outfit text-zinc-900 dark:text-white">Sheet Completion</h2>
          </div>
          
          <div className="flex items-end gap-4 mb-6">
            <p className="text-6xl font-black font-outfit text-zinc-900 dark:text-white tracking-tighter">{completionPercentage}%</p>
            <p className="text-zinc-500 dark:text-zinc-400 font-medium mb-2">{totalSolved} of {totalProblems} solved</p>
          </div>

          <div className="w-full h-4 bg-zinc-100 dark:bg-zinc-800 rounded-full overflow-hidden">
            <div className="h-full bg-emerald-500 rounded-full" style={{ width: `${completionPercentage}%` }} />
          </div>
        </div>

        {/* Retention Quality */}
        <div className="bg-zinc-900 dark:bg-zinc-950 p-8 rounded-3xl text-white shadow-lg flex flex-col justify-between">
          <div>
            <div className="flex items-center gap-3 mb-6">
              <Battery className="text-zinc-400" size={24} />
              <h2 className="text-xl font-bold font-outfit">Retention Profile</h2>
            </div>
            
            <div className="space-y-5">
              <div>
                <div className="flex justify-between text-sm mb-2 font-medium">
                  <span className="flex items-center gap-2 text-green-400"><CheckCircle2 size={16}/> Mastered</span>
                  <span className="text-white">{easyCount}</span>
                </div>
                <div className="w-full h-1.5 bg-zinc-800 rounded-full overflow-hidden">
                  <div className="h-full bg-green-400" style={{ width: `${totalSolved ? (easyCount/totalSolved)*100 : 0}%` }} />
                </div>
              </div>
              
              <div>
                <div className="flex justify-between text-sm mb-2 font-medium">
                  <span className="flex items-center gap-2 text-yellow-400"><CircleDashed size={16}/> Needs Review</span>
                  <span className="text-white">{partialCount}</span>
                </div>
                <div className="w-full h-1.5 bg-zinc-800 rounded-full overflow-hidden">
                  <div className="h-full bg-yellow-400" style={{ width: `${totalSolved ? (partialCount/totalSolved)*100 : 0}%` }} />
                </div>
              </div>

              <div>
                <div className="flex justify-between text-sm mb-2 font-medium">
                  <span className="flex items-center gap-2 text-red-400"><AlertCircle size={16}/> Forgotten</span>
                  <span className="text-white">{forgotCount}</span>
                </div>
                <div className="w-full h-1.5 bg-zinc-800 rounded-full overflow-hidden">
                  <div className="h-full bg-red-400" style={{ width: `${totalSolved ? (forgotCount/totalSolved)*100 : 0}%` }} />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
