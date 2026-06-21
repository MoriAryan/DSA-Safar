import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import { getLocalDateString } from '@/lib/dateUtils';

export type Confidence = 'easy' | 'partial' | 'forgot' | 'unsolved';

export interface ProblemProgress {
  status: 'solved' | 'unsolved';
  confidence: Confidence;
  lastSolvedAt: number | null; // timestamp
  nextRevisionDate: number | null; // timestamp
  revisionCount: number;
  history: { date: number; confidence: Confidence; type: 'solve' | 'revision' }[];
}

export interface UserStats {
  dailyTarget: number;
  longestStreak: number;
  lastActiveDate: string | null;
}

interface ProgressState {
  completedProblems: Record<string, ProblemProgress | boolean>; // boolean for legacy support during migration
  bookmarkedProblems: Record<string, boolean>;
  notes: Record<string, string>;
  stats: UserStats;
  dailySolves: Record<string, number>;
  showReward: boolean;
  
  // Actions
  toggleProblem: (id: string, confidence?: Confidence) => void;
  updateConfidence: (id: string, confidence: Confidence) => void;
  toggleBookmark: (id: string) => void;
  saveNote: (id: string, note: string) => void;
  updateStats: (updates: Partial<UserStats>) => void;
  setShowReward: (val: boolean) => void;
  resetTodayProgress: () => void;
  
  // Getters
  getNote: (id: string) => string;
  isCompleted: (id: string) => boolean;
  getProblemData: (id: string) => ProblemProgress | null;
  isBookmarked: (id: string) => boolean;
  getProgress: (problemIds: string[]) => { completed: number; total: number; percentage: number };
  getStreak: () => number;
}

const getNextRevisionDate = (confidence: Confidence, revisionCount: number, currentDate: number): number | null => {
  if (confidence === 'unsolved') return null;
  
  const DAY = 24 * 60 * 60 * 1000;
  
  if (confidence === 'forgot') {
    return currentDate + DAY; // Tomorrow
  }
  
  if (confidence === 'partial') {
    return currentDate + (DAY * 3); // 3 days
  }
  
  // Easy recall intervals: 1, 7, 30, 90
  const intervals = [1, 7, 30, 90];
  const daysToAdd = intervals[Math.min(revisionCount, intervals.length - 1)];
  
  return currentDate + (daysToAdd * DAY);
};

export const useProgressStore = create<ProgressState>()(
  persist(
    (set, get) => ({
      completedProblems: {},
      bookmarkedProblems: {},
      notes: {},
      dailySolves: {},
      showReward: false,
      stats: {
        dailyTarget: 3,
        longestStreak: 0,
        lastActiveDate: null,
      },

      setShowReward: (val) => set({ showReward: val }),

      resetTodayProgress: () => set((state) => {
        const today = getLocalDateString();
        const nextDaily = { ...state.dailySolves };
        nextDaily[today] = 0;
        return { dailySolves: nextDaily };
      }),

      toggleProblem: (id, confidence = 'easy') => set((state) => {
        const next = { ...state.completedProblems };
        const nextDaily = { ...state.dailySolves };
        const now = Date.now();
        const today = getLocalDateString();
        
        const existing = next[id];
        const isLegacy = typeof existing === 'boolean';
        const isCurrentlySolved = existing && (isLegacy || (existing as ProblemProgress).status === 'solved');
        
        let targetReachedToday = false;

        if (isCurrentlySolved) {
          // Unsolve
          delete next[id];
          nextDaily[today] = Math.max(0, (nextDaily[today] || 0) - 1);
        } else {
          // Solve
          next[id] = {
            status: 'solved',
            confidence,
            lastSolvedAt: now,
            nextRevisionDate: getNextRevisionDate(confidence, 0, now),
            revisionCount: 0,
            history: [{ date: now, confidence, type: 'solve' }]
          };
          
          nextDaily[today] = (nextDaily[today] || 0) + 1;
          
          // Trigger reward if exactly hit daily target
          if (nextDaily[today] === state.stats.dailyTarget) {
            targetReachedToday = true;
          }
        }
        
        // Recalculate longest streak dynamically inside the action if needed, or leave to getter.
        // We'll update lastActiveDate.
        return { 
          completedProblems: next, 
          dailySolves: nextDaily,
          stats: { ...state.stats, lastActiveDate: today },
          showReward: targetReachedToday ? true : state.showReward
        };
      }),

      updateConfidence: (id, confidence) => set((state) => {
        const next = { ...state.completedProblems };
        const now = Date.now();
        const existing = next[id];
        
        if (!existing) return state;
        
        let currentProg: ProblemProgress;
        if (typeof existing === 'boolean') {
           // Migrate legacy
           currentProg = {
             status: 'solved',
             confidence: 'easy',
             lastSolvedAt: now,
             nextRevisionDate: null,
             revisionCount: 0,
             history: []
           };
        } else {
           currentProg = existing as ProblemProgress;
        }
        
        const newRevisionCount = currentProg.revisionCount + 1;
        
        next[id] = {
          ...currentProg,
          confidence,
          lastSolvedAt: now, // Also update last solved to reflect revision time
          nextRevisionDate: getNextRevisionDate(confidence, newRevisionCount, now),
          revisionCount: newRevisionCount,
          history: [...currentProg.history, { date: now, confidence, type: 'revision' }]
        };
        
        return { completedProblems: next };
      }),

      toggleBookmark: (id) => set((state) => {
        const next = { ...state.bookmarkedProblems };
        if (next[id]) delete next[id];
        else next[id] = true;
        return { bookmarkedProblems: next };
      }),

      saveNote: (id, note) => set((state) => ({
        notes: { ...state.notes, [id]: note }
      })),

      updateStats: (updates) => set((state) => ({
        stats: { ...state.stats, ...updates }
      })),

      getNote: (id) => get().notes[id] || '',

      isCompleted: (id) => {
        const item = get().completedProblems[id];
        if (!item) return false;
        if (typeof item === 'boolean') return item;
        return item.status === 'solved';
      },
      
      getProblemData: (id) => {
         const item = get().completedProblems[id];
         if (!item) return null;
         if (typeof item === 'boolean') {
           return {
             status: 'solved',
             confidence: 'easy',
             lastSolvedAt: null,
             nextRevisionDate: null,
             revisionCount: 0,
             history: []
           };
         }
         return item as ProblemProgress;
      },

      isBookmarked: (id) => !!get().bookmarkedProblems[id],

      getProgress: (problemIds) => {
        const { completedProblems } = get();
        const completedCount = problemIds.filter(id => {
          const item = completedProblems[id];
          return item && (typeof item === 'boolean' || item.status === 'solved');
        }).length;
        const total = problemIds.length;
        const percentage = total === 0 ? 0 : Math.round((completedCount / total) * 100);
        return { completed: completedCount, total, percentage };
      },

      getStreak: () => {
        const { dailySolves, stats } = get();
        const { dailyTarget } = stats;
        
        let streak = 0;
        const today = new Date();
        const dateStr = getLocalDateString(today);
        
        // Start from yesterday
        let currentDay = new Date();
        currentDay.setDate(today.getDate() - 1);

        while (true) {
          const dStr = getLocalDateString(currentDay);
          if ((dailySolves[dStr] || 0) >= dailyTarget) {
            streak++;
            currentDay.setDate(currentDay.getDate() - 1);
          } else {
            break;
          }
        }

        // Add today if target met
        if ((dailySolves[dateStr] || 0) >= dailyTarget) {
          streak++;
        }

        return streak;
      }
    }),
    {
      name: 'striver-a2z-progress-storage',
      // Migration of legacy data can also be done via versioning, 
      // but inline getter/setter migrations (as done above) are safer for rapid iteration.
    }
  )
);
