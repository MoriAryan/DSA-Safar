"use client";

import React, { useEffect, useState } from "react";
import { useProgressStore } from "@/store/useProgressStore";
import { Flame } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { getLocalDateString } from "@/lib/dateUtils";

export function TopRightHeader() {
  const getStreak = useProgressStore(state => state.getStreak);
  const dailySolves = useProgressStore(state => state.dailySolves);
  const stats = useProgressStore(state => state.stats);
  const showReward = useProgressStore(state => state.showReward);
  const setShowReward = useProgressStore(state => state.setShowReward);

  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  const today = getLocalDateString();
  const solvesToday = dailySolves[today] || 0;
  const isLit = solvesToday >= stats.dailyTarget;

  const currentStreak = getStreak();

  return (
    <>
      <div className="fixed top-4 right-4 z-50 flex items-center gap-2 bg-white/80 dark:bg-[#1a1b1e]/80 backdrop-blur-md px-4 py-2 rounded-full border border-zinc-200 dark:border-zinc-800 shadow-sm transition-all">
        <span className={`font-outfit font-bold text-lg ${isLit ? 'text-orange-500' : 'text-zinc-400'}`}>
          {currentStreak}
        </span>
        <Flame 
          size={24} 
          className={`transition-colors duration-500 ${isLit ? 'text-orange-500 fill-orange-500' : 'text-zinc-400'}`} 
        />
      </div>

      <AnimatePresence>
        {showReward && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] pointer-events-none"
          >
            <motion.div 
              initial={{ scale: 0.5, y: 50 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0, x: "45vw", y: "-45vh", opacity: 0 }}
              transition={{ duration: 1, type: "spring", bounce: 0.4 }}
              onAnimationComplete={() => setShowReward(false)}
              className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 flex flex-col items-center justify-center"
            >
              <img 
                src="/fire.gif" 
                alt="Animated Fire" 
                className="w-48 h-48 object-contain drop-shadow-[0_0_15px_rgba(249,115,22,0.8)]"
              />
              
              <motion.div 
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                className="mt-2 px-5 py-2.5 bg-[#1a1b1e] border border-zinc-800 rounded-xl shadow-2xl flex items-center gap-2"
              >
                <span className="text-sm font-semibold text-zinc-200 tracking-wide uppercase font-inter">
                  Daily Target Hit
                </span>
                <span className="text-sm">🔥</span>
              </motion.div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
