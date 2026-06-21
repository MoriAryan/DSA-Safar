"use client";

import React, { useState } from "react";
import { useProgressStore } from "@/store/useProgressStore";
import { Settings, Target, Flame, Check } from "lucide-react";
import { getLocalDateString } from "@/lib/dateUtils";

export default function SettingsPage() {
  const stats = useProgressStore(state => state.stats);
  const updateStats = useProgressStore(state => state.updateStats);
  const resetTodayProgress = useProgressStore(state => state.resetTodayProgress);
  const dailySolves = useProgressStore(state => state.dailySolves);
  
  const [dailyTarget, setDailyTarget] = useState(stats.dailyTarget.toString());
  const [saved, setSaved] = useState(false);
  const [resetting, setResetting] = useState(false);

  const today = getLocalDateString();
  const solvesToday = dailySolves[today] || 0;

  const handleSave = () => {
    const val = parseInt(dailyTarget);
    if (!isNaN(val) && val > 0) {
      updateStats({ dailyTarget: val });
      setSaved(true);
      setTimeout(() => setSaved(false), 2000);
    }
  };

  return (
    <div className="max-w-4xl mx-auto py-8 px-4 sm:px-6 lg:px-8 font-inter">
      <div className="mb-8 flex items-center gap-3">
        <Settings size={32} className="text-zinc-400" />
        <h1 className="text-3xl font-outfit font-bold">Settings</h1>
      </div>

      <div className="bg-white dark:bg-[#1a1b1e] rounded-xl border border-zinc-200 dark:border-zinc-800 p-6 shadow-sm mb-6">
        <div className="flex items-center gap-3 mb-6">
          <Target className="text-blue-500" />
          <h2 className="text-xl font-semibold font-outfit">Daily Goals & Streaks</h2>
        </div>

        <div className="space-y-6 max-w-md">
          <div>
            <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-2">
              Daily Question Target
            </label>
            <p className="text-sm text-zinc-500 dark:text-zinc-400 mb-4">
              How many questions do you want to solve every day to maintain your <Flame className="inline text-orange-500 w-4 h-4" /> streak? Default is 3.
            </p>
            <div className="flex items-center gap-3">
              <input 
                type="number"
                min="1"
                max="50"
                value={dailyTarget}
                onChange={(e) => setDailyTarget(e.target.value)}
                className="w-24 bg-zinc-50 dark:bg-[#0c0c0e] border border-zinc-200 dark:border-zinc-700 rounded-lg px-4 py-2 text-zinc-900 dark:text-zinc-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <button 
                onClick={handleSave}
                className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-medium transition-colors flex items-center gap-2"
              >
                {saved ? <><Check size={18} /> Saved</> : 'Save Target'}
              </button>
            </div>
          </div>
        </div>

        <div className="mt-8 pt-8 border-t border-zinc-200 dark:border-zinc-800 max-w-md">
          <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-2">
            Reset Today's Progress
          </label>
          <p className="text-sm text-zinc-500 dark:text-zinc-400 mb-4">
            Erase your current daily progress count without unchecking any problems. Use this if you want to test the fire animation or start your daily goal from 0 again! (Currently at {solvesToday} / {stats.dailyTarget})
          </p>
          <button 
            onClick={() => {
              setResetting(true);
              resetTodayProgress();
              setTimeout(() => setResetting(false), 2000);
            }}
            className="bg-zinc-100 hover:bg-zinc-200 dark:bg-zinc-800 dark:hover:bg-zinc-700 text-zinc-900 dark:text-zinc-100 px-4 py-2 rounded-lg font-medium transition-colors flex items-center gap-2"
          >
            {resetting ? <><Check size={18} className="text-green-500" /> Reset Successful</> : 'Reset Today to 0'}
          </button>
        </div>
      </div>
    </div>
  );
}
