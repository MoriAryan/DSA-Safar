"use client";

import React, { useState } from "react";
import { Check, FileText, Play, Code2, Edit3, Star, Circle } from "lucide-react";
import { useProgressStore, Confidence } from "@/store/useProgressStore";
import { useUser, useClerk } from "@clerk/nextjs";
import { Tooltip, TooltipContent, TooltipTrigger, TooltipProvider } from "./ui/tooltip";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "./ui/dialog";
import { Button } from "./ui/button";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "./ui/dropdown-menu";

const DifficultyBadge = ({ level }: { level: string }) => {
  let color = "text-emerald-600 bg-emerald-500/10 border-emerald-500/20 dark:text-emerald-400 dark:bg-emerald-500/10 dark:border-emerald-500/20";
  if (level === "Medium") {
    color = "text-amber-600 bg-amber-500/10 border-amber-500/20 dark:text-amber-400 dark:bg-amber-500/10 dark:border-amber-500/20";
  } else if (level === "Hard") {
    color = "text-rose-600 bg-rose-500/10 border-rose-500/20 dark:text-rose-400 dark:bg-rose-500/10 dark:border-rose-500/20";
  }

  return (
    <span className={`px-2.5 py-0.5 text-[11px] font-semibold rounded-md border ${color}`}>
      {level}
    </span>
  );
};

const ResourceLink = ({ url, type }: { url: string | "MISSING", type: "article" | "youtube" | "practice" }) => {
  const isMissing = url === "MISSING";
  
  let Icon = FileText;
  let color = "text-zinc-400 hover:text-indigo-500 dark:text-zinc-500 dark:hover:text-indigo-400";
  let label = "Article";
  
  if (type === "youtube") {
    Icon = Play;
    color = "text-zinc-400 hover:text-rose-500 dark:text-zinc-500 dark:hover:text-rose-400";
    label = "Video";
  } else if (type === "practice") {
    Icon = Code2;
    color = "text-zinc-400 hover:text-emerald-500 dark:text-zinc-500 dark:hover:text-emerald-400";
    label = "Practice";
  }

  if (isMissing) {
    return (
      <TooltipProvider delay={100}>
        <Tooltip>
          <TooltipTrigger>
            <div className="p-2 text-zinc-200 dark:text-zinc-800 cursor-not-allowed">
              <Icon size={20} />
            </div>
          </TooltipTrigger>
          <TooltipContent className="bg-zinc-900 text-white border-zinc-800">
            <p>This {label.toLowerCase()} link was not present in the archived source.</p>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
    );
  }

  return (
    <a 
      href={url} 
      target="_blank" 
      rel="noopener noreferrer"
      className={`p-2 transition-colors inline-flex ${color}`}
      title={`Open ${label}`}
    >
      <Icon size={20} />
    </a>
  );
};

const StatusCell = ({ id }: { id: string }) => {
  const { toggleProblem, updateConfidence, getProblemData } = useProgressStore();
  const { isSignedIn } = useUser();
  const clerk = useClerk();
  
  const data = getProblemData(id);
  const isCompleted = !!data && data.status === 'solved';
  const confidence = data ? data.confidence : 'unsolved';

  const confidenceColors = {
    easy: "bg-green-500",
    partial: "bg-yellow-500",
    forgot: "bg-red-500",
    unsolved: "bg-zinc-300 dark:bg-zinc-700"
  };

  const handleToggle = () => {
    if (!isSignedIn) return clerk.openSignIn();
    toggleProblem(id);
  };

  return (
    <div className="flex items-center justify-center gap-2">
      <button 
        onClick={handleToggle}
        className={`w-5 h-5 rounded flex shrink-0 items-center justify-center border transition-all ${
          isCompleted 
            ? 'bg-red-600 border-red-600 text-white shadow-sm' 
            : 'border-zinc-300 dark:border-zinc-700 text-transparent hover:border-red-400/50 hover:bg-red-500/10'
        }`}
      >
        <Check size={14} strokeWidth={3} />
      </button>
      
      {isCompleted && (
        <DropdownMenu>
          <DropdownMenuTrigger className="focus:outline-none">
            <div 
              className={`w-3 h-3 rounded-full cursor-pointer hover:ring-2 ring-offset-1 dark:ring-offset-zinc-900 ring-zinc-300 transition-all ${confidenceColors[confidence as keyof typeof confidenceColors]}`} 
              title="Confidence Level"
            />
          </DropdownMenuTrigger>
          <DropdownMenuContent align="start" className="w-40 font-inter">
            <DropdownMenuItem onClick={() => updateConfidence(id, 'easy')} className="flex items-center gap-2 cursor-pointer">
              <Circle className="fill-green-500 text-green-500" size={10} /> Easy Recall
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => updateConfidence(id, 'partial')} className="flex items-center gap-2 cursor-pointer">
              <Circle className="fill-yellow-500 text-yellow-500" size={10} /> Partial Recall
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => updateConfidence(id, 'forgot')} className="flex items-center gap-2 cursor-pointer">
              <Circle className="fill-red-500 text-red-500" size={10} /> Forgot Solution
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      )}
    </div>
  );
};

export function ProblemTable({ problems }: { problems: any[] }) {
  const { toggleBookmark, isBookmarked, saveNote, getNote } = useProgressStore();
  const { isSignedIn } = useUser();
  const clerk = useClerk();
  
  const [noteDialogOpen, setNoteDialogOpen] = useState(false);
  const [activeNoteId, setActiveNoteId] = useState<string | null>(null);
  const [noteText, setNoteText] = useState("");

  const openNoteDialog = (id: string) => {
    if (!isSignedIn) return clerk.openSignIn();
    setActiveNoteId(id);
    setNoteText(getNote(id));
    setNoteDialogOpen(true);
  };

  const handleToggleBookmark = (id: string) => {
    if (!isSignedIn) return clerk.openSignIn();
    toggleBookmark(id);
  };

  const handleSaveNote = () => {
    if (activeNoteId) {
      saveNote(activeNoteId, noteText);
    }
    setNoteDialogOpen(false);
  };

  return (
    <>
      <table className="w-full text-sm text-left font-inter">
        <thead className="text-xs text-zinc-500 uppercase bg-zinc-100/50 dark:bg-zinc-900/50 dark:text-zinc-400">
          <tr>
            <th className="px-6 py-4 font-medium text-center w-24">Status</th>
            <th className="px-6 py-4 font-medium">Problem</th>
            <th className="px-6 py-4 font-medium text-center w-24">Article</th>
            <th className="px-6 py-4 font-medium text-center w-24">YouTube</th>
            <th className="px-6 py-4 font-medium text-center w-24">Practice</th>
            <th className="px-6 py-4 font-medium text-center w-24">Note</th>
            <th className="px-6 py-4 font-medium text-center w-32">Difficulty</th>
            <th className="px-6 py-4 font-medium text-center w-24">Revision</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-zinc-100 dark:divide-zinc-800/50">
          {problems.map((prob) => {
            const bookmarked = isBookmarked(prob.id);
            const hasNote = !!getNote(prob.id);

            return (
              <tr key={prob.id} className="hover:bg-white dark:hover:bg-zinc-800/20 transition-colors group">
                <td className="px-6 py-4 text-center">
                  <StatusCell id={prob.id} />
                </td>
                <td className="px-6 py-4 font-medium text-zinc-900 dark:text-zinc-100">
                  {prob.title}
                </td>
                <td className="px-6 py-4 text-center">
                  <ResourceLink url={prob.articleLink} type="article" />
                </td>
                <td className="px-6 py-4 text-center">
                  <ResourceLink url={prob.youtubeLink} type="youtube" />
                </td>
                <td className="px-6 py-4 text-center">
                  <ResourceLink url={prob.practiceLink} type="practice" />
                </td>
                <td className="px-6 py-4 text-center">
                  <button 
                    onClick={() => openNoteDialog(prob.id)}
                    className={`p-2 transition-colors ${
                      hasNote 
                        ? 'text-amber-500 hover:text-amber-600' 
                        : 'text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-300'
                    }`}
                  >
                    <Edit3 size={18} />
                  </button>
                </td>
                <td className="px-6 py-4 text-center">
                  <DifficultyBadge level={prob.difficulty} />
                </td>
                <td className="px-6 py-4 text-center">
                  <button 
                    onClick={() => handleToggleBookmark(prob.id)}
                    className={`p-2 transition-colors ${
                      bookmarked 
                        ? 'text-yellow-400' 
                        : 'text-zinc-300 dark:text-zinc-700 hover:text-yellow-400/50'
                    }`}
                  >
                    <Star size={20} fill={bookmarked ? "currentColor" : "none"} />
                  </button>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>

      <Dialog open={noteDialogOpen} onOpenChange={setNoteDialogOpen}>
        <DialogContent className="sm:max-w-md border-zinc-200 dark:border-zinc-800 bg-white dark:bg-[#1a1b1e]">
          <DialogHeader>
            <DialogTitle className="font-outfit text-xl">Add Note</DialogTitle>
          </DialogHeader>
          <div className="py-4">
            <textarea
              value={noteText}
              onChange={(e) => setNoteText(e.target.value)}
              placeholder="Write your notes or approaches here..."
              className="w-full min-h-[150px] p-3 rounded-md border border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-[#0c0c0e] focus:outline-none focus:ring-2 focus:ring-red-500/20 focus:border-red-500 transition-all resize-y"
            />
          </div>
          <div className="flex justify-end gap-3">
            <Button variant="ghost" onClick={() => setNoteDialogOpen(false)}>Cancel</Button>
            <Button onClick={handleSaveNote} className="bg-red-600 hover:bg-red-700 text-white">Save Note</Button>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}
