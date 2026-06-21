"use client";

import { useEffect, useRef } from "react";
import { useUser } from "@clerk/nextjs";
import { useProgressStore } from "@/store/useProgressStore";

export function SyncEngine() {
  const { user, isLoaded, isSignedIn } = useUser();
  const hasHydrated = useRef(false);

  useEffect(() => {
    if (!isLoaded) return;
    
    // Always mark active today on load, regardless of auth
    if (!hasHydrated.current) {
      useProgressStore.getState().markActiveToday();
    }

    if (isSignedIn && user && !hasHydrated.current) {
      // Fetch initial data from MongoDB on login
      fetch('/api/progress')
        .then(res => {
          if (!res.ok) throw new Error(`HTTP error! status: ${res.status}`);
          return res.json();
        })
        .then(data => {
          if (data && data.completedProblems) {
            useProgressStore.setState((state) => ({
              // We merge local and remote progress. If collision, remote wins.
              // A better robust sync would do deeper conflict resolution, but this works for smooth UX.
              completedProblems: { ...state.completedProblems, ...data.completedProblems },
              bookmarkedProblems: { ...state.bookmarkedProblems, ...data.bookmarkedProblems },
              notes: { ...state.notes, ...data.notes },
              dailySolves: { ...state.dailySolves, ...data.dailySolves },
              activeDays: { ...state.activeDays, ...data.activeDays },
              stats: { ...state.stats, ...data.stats },
            }));
          }
        })
        .catch(err => console.error("Failed to fetch progress from DB:", err))
        .finally(() => {
          hasHydrated.current = true;
        });
    } else if (!isSignedIn && !hasHydrated.current) {
      // If not signed in, just mark as hydrated so we don't keep running this
      hasHydrated.current = true;
    }
  }, [isLoaded, isSignedIn, user]);

  useEffect(() => {
    // Subscribe to all changes in the store
    const unsubscribe = useProgressStore.subscribe((state, prevState) => {
      if (!isSignedIn || !hasHydrated.current) return;
      
      // We do a simple debounce to avoid hammering the DB
      const handler = setTimeout(() => {
        fetch('/api/progress', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            completedProblems: state.completedProblems,
            bookmarkedProblems: state.bookmarkedProblems,
            notes: state.notes,
            dailySolves: state.dailySolves,
            activeDays: state.activeDays,
          stats: state.stats
        })
      }).then(res => {
        if (!res.ok) throw new Error(`Sync failed with status: ${res.status}`);
      }).catch(err => console.error("Failed to sync progress:", err));
    }, 1000); // 1 second debounce

      return () => clearTimeout(handler);
    });

    return () => unsubscribe();
  }, [isSignedIn]);

  return null; // This component is invisible
}
