"use client";

import React, { useState, useEffect } from "react";
import dataset from "@/data/data.json";
import { ProblemTable } from "@/components/ProblemTable";
import { Play, Timer, RotateCcw } from "lucide-react";
import { Button } from "@/components/ui/button";

const formatTime = (seconds: number) => {
  const m = Math.floor(seconds / 60).toString().padStart(2, '0');
  const s = (seconds % 60).toString().padStart(2, '0');
  return `${m}:${s}`;
};

export default function InterviewPage() {
  const [activeSet, setActiveSet] = useState<any[] | null>(null);
  const [timeLeft, setTimeLeft] = useState<number | null>(null);
  const [isRunning, setIsRunning] = useState(false);

  useEffect(() => {
    let interval: any;
    if (isRunning && timeLeft !== null && timeLeft > 0) {
      interval = setInterval(() => {
        setTimeLeft(t => (t ? t - 1 : 0));
      }, 1000);
    } else if (timeLeft === 0) {
      setIsRunning(false);
    }
    return () => clearInterval(interval);
  }, [isRunning, timeLeft]);

  const generateSet = (duration: 30 | 60 | 90) => {
    const allProblems = dataset.flatMap(s => s.lectures.flatMap(l => l.problems));
    
    const easies = allProblems.filter(p => p.difficulty === 'Easy');
    const mediums = allProblems.filter(p => p.difficulty === 'Medium');
    const hards = allProblems.filter(p => p.difficulty === 'Hard');

    const getRandom = (arr: any[], count: number) => {
      const shuffled = [...arr].sort(() => 0.5 - Math.random());
      return shuffled.slice(0, count);
    };

    let selected: any[] = [];
    if (duration === 30) {
      selected = [...getRandom(easies, 1), ...getRandom(mediums, 1)];
    } else if (duration === 60) {
      selected = [...getRandom(easies, 1), ...getRandom(mediums, 2)];
    } else if (duration === 90) {
      selected = [...getRandom(easies, 1), ...getRandom(mediums, 2), ...getRandom(hards, 1)];
    }

    setActiveSet(selected);
    setTimeLeft(duration * 60);
    setIsRunning(true);
  };

  const stopInterview = () => {
    setIsRunning(false);
    setActiveSet(null);
    setTimeLeft(null);
  };

  return (
    <div className="max-w-6xl mx-auto py-8 px-4 sm:px-6 lg:px-8 font-inter">
      <div className="mb-8">
        <h1 className="text-3xl font-outfit font-bold mb-2">Mock Interview Mode</h1>
        <p className="text-zinc-500 dark:text-zinc-400">Generate a random set of problems and solve them under time pressure.</p>
      </div>

      {!activeSet ? (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {[30, 60, 90].map((mins) => (
            <div key={mins} className="bg-white dark:bg-[#1a1b1e] p-6 rounded-xl border border-zinc-200 dark:border-zinc-800 shadow-sm flex flex-col items-center text-center">
              <div className="w-16 h-16 rounded-full bg-blue-100 dark:bg-blue-500/10 flex items-center justify-center shrink-0 mb-4">
                <Timer className="text-blue-500" size={32} />
              </div>
              <h2 className="text-xl font-bold font-outfit mb-2">{mins} Minute Set</h2>
              <p className="text-sm text-zinc-500 mb-6">
                {mins === 30 ? "1 Easy, 1 Medium" : mins === 60 ? "1 Easy, 2 Mediums" : "1 Easy, 2 Mediums, 1 Hard"}
              </p>
              <Button onClick={() => generateSet(mins as 30 | 60 | 90)} className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold">
                <Play className="mr-2" size={18} /> Start {mins}m Mock
              </Button>
            </div>
          ))}
        </div>
      ) : (
        <div className="space-y-6">
          <div className="bg-zinc-900 text-white p-6 rounded-xl flex items-center justify-between shadow-lg border border-zinc-800">
            <div>
              <p className="text-zinc-400 font-medium mb-1">Time Remaining</p>
              <p className={`text-4xl font-outfit font-bold tracking-widest ${timeLeft && timeLeft < 300 ? 'text-red-500' : ''}`}>
                {formatTime(timeLeft || 0)}
              </p>
            </div>
            <div className="flex gap-4">
              <Button 
                variant="outline" 
                className="bg-transparent border-zinc-700 hover:bg-zinc-800 hover:text-white"
                onClick={() => setIsRunning(!isRunning)}
              >
                {isRunning ? "Pause Timer" : "Resume Timer"}
              </Button>
              <Button 
                variant="destructive"
                onClick={stopInterview}
              >
                <RotateCcw className="mr-2" size={16} /> End Interview
              </Button>
            </div>
          </div>

          <div className="bg-white dark:bg-[#1a1b1e] border border-zinc-200 dark:border-zinc-800 rounded-xl overflow-hidden shadow-sm">
            <div className="p-0 overflow-x-auto">
              <ProblemTable problems={activeSet} />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
