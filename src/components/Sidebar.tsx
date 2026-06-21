"use client";

import Link from "next/link";
import { User, FileText, Bookmark, Code, List, Settings, Search, Sun, Moon, Flame } from "lucide-react";
import { useTheme } from "next-themes";
import { Button } from "./ui/button";
import { useProgressStore } from "@/store/useProgressStore";
import { getLocalDateString } from "@/lib/dateUtils";

export default function Sidebar() {
  const { theme, setTheme } = useTheme();
  const dailySolves = useProgressStore(state => state.dailySolves);
  const stats = useProgressStore(state => state.stats);
  const today = getLocalDateString();
  const solvesToday = dailySolves[today] || 0;
  const progressPercent = Math.min((solvesToday / stats.dailyTarget) * 100, 100);

  return (
    <aside className="w-[280px] bg-[#1a1b1e] text-white flex flex-col hidden md:flex shrink-0 border-r border-zinc-800">
      <div className="p-6 pb-2 flex items-center justify-between">
        <div className="flex items-center gap-3 w-full">
          <div className="w-10 h-10 rounded-full bg-red-600 flex items-center justify-center font-outfit font-bold italic text-xl shadow-lg shrink-0">
            TUF
          </div>
          <div className="flex-1">
            <div className="flex justify-between items-center mb-1">
              <span className="text-xs font-medium text-zinc-400 uppercase tracking-wider">Daily Goal</span>
              <span className="text-xs font-bold text-orange-500">{solvesToday}/{stats.dailyTarget}</span>
            </div>
            <div className="w-full h-1.5 bg-zinc-800 rounded-full overflow-hidden">
              <div 
                className="h-full bg-gradient-to-r from-orange-500 to-red-500 transition-all duration-500" 
                style={{ width: `${progressPercent}%` }}
              />
            </div>
          </div>
        </div>
      </div>
      
      <nav className="flex-1 px-4 space-y-2 overflow-y-auto mt-4 font-outfit">
        <Link href="/" className="flex items-center gap-3 px-3 py-3 text-zinc-400 hover:text-white rounded-lg transition-colors">
          <FileText size={20} />
          <span>Home</span>
        </Link>
        <Link href="/sprint" className="flex items-center gap-3 px-3 py-3 text-zinc-400 hover:text-white rounded-lg transition-colors">
          <Flame size={20} />
          <span>2 Day Sprint</span>
        </Link>
        <Link href="/analytics" className="flex items-center gap-3 px-3 py-3 text-zinc-400 hover:text-white rounded-lg transition-colors">
          <User size={20} />
          <span>Analytics</span>
        </Link>
        <Link href="/revisions" className="flex items-center gap-3 px-3 py-3 text-zinc-400 hover:text-white rounded-lg transition-colors">
          <Bookmark size={20} />
          <span>Revisions</span>
        </Link>
        <Link href="/interview" className="flex items-center gap-3 px-3 py-3 text-zinc-400 hover:text-white rounded-lg transition-colors">
          <Code size={20} />
          <span>Interview Mode</span>
        </Link>
        <Link href="/restart" className="flex items-center gap-3 px-3 py-3 text-zinc-400 hover:text-white rounded-lg transition-colors">
          <List size={20} />
          <span>Quick Restart</span>
        </Link>
        <Link href="/notes" className="flex items-center gap-3 px-3 py-3 text-zinc-400 hover:text-white rounded-lg transition-colors">
          <FileText size={20} />
          <span>Saved Notes</span>
        </Link>

        <div className="pt-4 mt-4 border-t border-zinc-800 space-y-1">
          <Link href="/settings" className="flex items-center gap-3 px-3 py-3 text-zinc-400 hover:text-white rounded-lg transition-colors">
            <Settings size={20} />
            <span>Settings</span>
          </Link>
        </div>  
      </nav>
      
      <div className="p-4 border-t border-zinc-800 flex items-center justify-between">
        <Button 
          variant="ghost" 
          size="icon" 
          onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
          className="text-zinc-400 hover:text-white rounded-full hover:bg-zinc-800"
        >
          {theme === 'dark' ? <Sun size={20} /> : <Moon size={20} />}
        </Button>
        <Button variant="destructive" className="bg-red-600 hover:bg-red-700 rounded-md font-outfit">
          Login
        </Button>
      </div>
    </aside>
  );
}
