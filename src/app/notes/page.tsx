"use client";

import React, { useMemo } from "react";
import dataset from "@/data/data.json";
import { useProgressStore } from "@/store/useProgressStore";
import { FileText, AlignLeft } from "lucide-react";
import Link from "next/link";

export default function NotesPage() {
  const notes = useProgressStore(state => state.notes);
  
  const savedNotes = useMemo(() => {
    // Flatten dataset to dictionary for easy lookup
    const problemsMap = new Map();
    dataset.forEach(step => {
      step.lectures.forEach(l => {
        l.problems.forEach(p => {
          problemsMap.set(p.id, p);
        });
      });
    });

    return Object.entries(notes)
      .filter(([id, note]) => note && note.trim().length > 0)
      .map(([id, note]) => {
        const problem = problemsMap.get(id);
        return {
          id,
          note,
          title: problem?.title || id,
          topic: problem?.topic || "General" // If available in dataset
        };
      });
  }, [notes]);

  return (
    <div className="max-w-4xl mx-auto py-8 px-4 sm:px-6 lg:px-8 font-inter">
      <div className="mb-8 flex items-center gap-3">
        <FileText size={32} className="text-zinc-400" />
        <h1 className="text-3xl font-outfit font-bold">Saved Notes</h1>
      </div>

      {savedNotes.length === 0 ? (
        <div className="text-center py-16 bg-white dark:bg-[#1a1b1e] rounded-xl border border-zinc-200 dark:border-zinc-800">
          <AlignLeft className="mx-auto h-12 w-12 text-zinc-300 dark:text-zinc-600 mb-4" />
          <p className="text-zinc-500 text-lg">No notes saved yet.</p>
          <p className="text-zinc-400 text-sm mt-2">Add notes to problems to see them appear here.</p>
          <Link href="/" className="mt-6 inline-block bg-blue-600 text-white px-4 py-2 rounded-lg font-medium hover:bg-blue-700 transition-colors">
            Go to Course Sheet
          </Link>
        </div>
      ) : (
        <div className="grid gap-6">
          {savedNotes.map(({ id, title, note }) => (
            <div key={id} className="bg-white dark:bg-[#1a1b1e] rounded-xl border border-zinc-200 dark:border-zinc-800 overflow-hidden shadow-sm">
              <div className="bg-zinc-50 dark:bg-zinc-800/30 px-6 py-4 border-b border-zinc-200 dark:border-zinc-800 flex items-center justify-between">
                <h3 className="font-semibold font-outfit text-lg truncate pr-4 text-zinc-900 dark:text-zinc-100">
                  {title}
                </h3>
              </div>
              <div className="px-6 py-4 bg-yellow-50/50 dark:bg-yellow-500/5">
                <p className="whitespace-pre-wrap text-zinc-700 dark:text-zinc-300 leading-relaxed font-mono text-sm">
                  {note}
                </p>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
