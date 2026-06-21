"use client";

import React, { useState, useMemo } from "react";
import dataset from "@/data/data.json";
import { StepCard } from "./StepCard";
import { Input } from "./ui/input";
import { Search, Star, Trophy } from "lucide-react";
import { useProgressStore } from "@/store/useProgressStore";
import { ImportExport } from "./ImportExport";
import { useEffect } from "react";
import { getLocalDateString } from "@/lib/dateUtils";

export default function CourseSheet() {
  const [mounted, setMounted] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [showBookmarks, setShowBookmarks] = useState(false);
  const isBookmarked = useProgressStore(state => state.isBookmarked);
  const getProgress = useProgressStore(state => state.getProgress);
  const completedProblems = useProgressStore(state => state.completedProblems);
  
  useEffect(() => {
    // Automated Backup
    const lastBackup = localStorage.getItem("tuf-last-backup-date");
    const today = getLocalDateString();
    if (lastBackup !== today) {
      const data = localStorage.getItem("striver-a2z-progress-storage");
      if (data) {
        localStorage.setItem("tuf-backup-auto", data);
        localStorage.setItem("tuf-last-backup-date", today);
      }
    }
    setMounted(true);
  }, []);

  
  const allProblemIds = useMemo(() => {
    return dataset.flatMap(s => s.lectures.flatMap(l => l.problems.map(p => p.id)));
  }, []);
  
  const { completed, total, percentage } = getProgress(allProblemIds);
  
  const filteredData = useMemo(() => {
    const query = searchQuery.toLowerCase();
    
    return dataset.map(step => {
      const filteredLectures = step.lectures.map(lec => {
        const filteredProblems = lec.problems.filter(prob => {
          const matchesSearch = prob.title.toLowerCase().includes(query);
          const matchesBookmark = showBookmarks ? isBookmarked(prob.id) : true;
          return matchesSearch && matchesBookmark;
        });
        return { ...lec, problems: filteredProblems };
      }).filter(lec => lec.problems.length > 0 || (lec.title.toLowerCase().includes(query) && !showBookmarks));
      
      const filteredStep = (filteredLectures.length > 0 || (step.title.toLowerCase().includes(query) && !showBookmarks)) 
        ? { ...step, lectures: filteredLectures } 
        : null;
      
      return filteredStep;
    }).filter(step => step !== null);
  }, [searchQuery, showBookmarks, isBookmarked]);

  if (!mounted) {
    return <div className="max-w-6xl mx-auto py-8 px-4 sm:px-6 lg:px-8 font-inter animate-pulse min-h-screen"></div>;
  }

  return (
    <div className="max-w-6xl mx-auto py-8 px-4 sm:px-6 lg:px-8 font-inter">
      <div className="flex flex-col md:flex-row md:items-end justify-between mb-8 gap-4">
        <div>
          <h1 className="text-3xl font-outfit font-bold mb-2">Strivers A2Z DSA Course/Sheet</h1>
          <p className="text-zinc-500 dark:text-zinc-400">The ONE STOP POINT to learn DSA from A to Z.</p>
        </div>
        <div className="flex items-center gap-4">
          <ImportExport />
        </div>
      </div>
      
      {/* Analytics Card */}
      <div className="bg-white dark:bg-[#1a1b1e] rounded-xl shadow-sm border border-zinc-200 dark:border-zinc-800 p-6 mb-8 flex flex-col md:flex-row items-center gap-6">
        <div className="w-16 h-16 rounded-full bg-red-100 dark:bg-red-500/10 flex items-center justify-center shrink-0">
          <Trophy className="text-red-500" size={32} />
        </div>
        <div className="flex-1 w-full">
          <div className="flex justify-between items-end mb-2">
            <div>
              <h3 className="font-outfit font-semibold text-lg flex items-center gap-4">
                Overall Progress
              </h3>
              <p className="text-sm text-zinc-500">{completed} of {total} problems solved</p>
            </div>
            <span className="font-bold text-2xl text-red-600 dark:text-red-500">{percentage}%</span>
          </div>
          <div className="w-full h-3 bg-zinc-100 dark:bg-zinc-800 rounded-full overflow-hidden">
            <div 
              className="h-full bg-red-500 transition-all duration-1000 ease-out" 
              style={{ width: `${percentage}%` }}
            />
          </div>
        </div>
      </div>
      
      <div className="flex flex-col sm:flex-row gap-4 mb-8">
        <div className="relative flex-1">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Search className="h-5 w-5 text-zinc-400" />
          </div>
          <Input 
            type="text" 
            placeholder="Search problems or topics..." 
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10 h-12 bg-white dark:bg-[#1a1b1e] border-zinc-200 dark:border-zinc-800 rounded-xl shadow-sm"
          />
        </div>
        <button
          onClick={() => setShowBookmarks(!showBookmarks)}
          className={`flex items-center gap-2 px-6 h-12 rounded-xl font-medium transition-colors border ${
            showBookmarks 
              ? 'bg-yellow-50 dark:bg-yellow-500/10 text-yellow-600 dark:text-yellow-500 border-yellow-200 dark:border-yellow-500/20' 
              : 'bg-white dark:bg-[#1a1b1e] text-zinc-600 dark:text-zinc-400 border-zinc-200 dark:border-zinc-800 hover:bg-zinc-50 dark:hover:bg-zinc-800/50'
          }`}
        >
          <Star size={18} fill={showBookmarks ? "currentColor" : "none"} />
          {showBookmarks ? "Showing Bookmarks" : "Show Bookmarks"}
        </button>
      </div>

      <div className="space-y-4">
        {filteredData.map((step, index) => (
          <StepCard key={step.title} step={step} defaultOpen={index === 0 && !searchQuery && !showBookmarks} />
        ))}
        {filteredData.length === 0 && (
          <div className="text-center py-16 bg-white dark:bg-[#1a1b1e] rounded-xl border border-zinc-200 dark:border-zinc-800">
            <p className="text-zinc-500 text-lg">No problems or topics found matching your criteria.</p>
          </div>
        )}
      </div>
    </div>
  );
}
