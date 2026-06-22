"use client";

import Link from "next/link";
import { User, FileText, Bookmark, Code, Settings, Search, Sun, Moon, Flame, ChevronLeft, ChevronRight, Activity } from "lucide-react";
import { useTheme } from "next-themes";
import { useProgressStore } from "@/store/useProgressStore";
import { getLocalDateString } from "@/lib/dateUtils";
import { SignInButton, UserButton, useUser } from "@clerk/nextjs";
import { Button } from "./ui/button";
import { useState, useEffect } from "react";

export default function Sidebar() {
  const [mounted, setMounted] = useState(false);
  const [isCollapsed, setIsCollapsed] = useState(false);
  const { isSignedIn } = useUser();
  const { theme, setTheme } = useTheme();
  const dailySolves = useProgressStore(state => state.dailySolves);
  const stats = useProgressStore(state => state.stats);
  const today = getLocalDateString();
  const solvesToday = dailySolves[today] || 0;
  const progressPercent = Math.min((solvesToday / stats.dailyTarget) * 100, 100);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return <aside className={`bg-[#1a1b1e] text-white flex flex-col hidden md:flex shrink-0 border-r border-zinc-800 transition-all duration-300 ${isCollapsed ? 'w-[80px]' : 'w-[280px]'}`} />;
  }

  return (
    <aside className={`bg-[#1a1b1e] text-white flex flex-col hidden md:flex shrink-0 border-r border-zinc-800 transition-all duration-300 relative ${isCollapsed ? 'w-[80px]' : 'w-[280px]'}`}>
      <div className={`p-6 pb-2 flex items-center justify-between ${isCollapsed ? 'flex-col gap-4' : ''}`}>
        <div className={`flex items-center w-full ${isCollapsed ? 'flex-col gap-4' : 'gap-3'}`}>
          <button 
            onClick={() => setIsCollapsed(!isCollapsed)}
            className="w-10 h-10 flex items-center justify-center shrink-0 hover:scale-105 transition-transform overflow-visible"
            title="Toggle Sidebar"
          >
            <img src="/logo.png" alt="DSA Safar Logo" className="w-full h-full object-contain drop-shadow-md" />
          </button>
          {!isCollapsed && (
            <div className="flex-1 overflow-hidden">
              <div className="flex justify-between items-center mb-1">
                <span className="text-xs font-medium text-zinc-400 uppercase tracking-wider">Daily Goal</span>
                <span className="text-xs font-bold text-red-500">{solvesToday}/{stats.dailyTarget}</span>
              </div>
              <div className="w-full h-1.5 bg-zinc-800 rounded-full overflow-hidden">
                <div
                  className="h-full bg-gradient-to-r from-orange-500 to-red-500 transition-all duration-500"
                  style={{ width: `${progressPercent}%` }}
                />
              </div>
            </div>
          )}
        </div>
      </div>

      <nav className="flex-1 px-3 space-y-2 overflow-y-auto mt-6 font-outfit">
        <NavItem href="/app" icon={<FileText size={20} />} label="DSA Safar" isCollapsed={isCollapsed} />
        <NavItem href="/sprint" icon={<Flame size={20} />} label="2 Day Sprint" isCollapsed={isCollapsed} />
        <NavItem href="/analytics" icon={<Activity size={20} />} label="Analytics" isCollapsed={isCollapsed} />
        <NavItem href="/revisions" icon={<Code size={20} />} label="Revisions" isCollapsed={isCollapsed} />
        <NavItem href="/notes" icon={<Bookmark size={20} />} label="Saved Notes" isCollapsed={isCollapsed} />
        <NavItem href="/settings" icon={<Settings size={20} />} label="Settings" isCollapsed={isCollapsed} />
      </nav>

      <div className={`p-4 border-t border-zinc-800 flex items-center ${isCollapsed ? 'flex-col justify-center gap-4' : 'justify-between'}`}>
        <Button
          variant="ghost"
          size="icon"
          onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
          className="text-zinc-400 hover:text-white rounded-full hover:bg-zinc-800"
          title="Toggle Theme"
        >
          {theme === 'dark' ? <Sun size={20} /> : <Moon size={20} />}
        </Button>
        {isSignedIn ? (
          <div className={`flex items-center gap-3 ${isCollapsed ? 'justify-center' : 'justify-end w-full'}`}>
            <UserButton appearance={{ elements: { userButtonAvatarBox: "w-8 h-8" } }} />
          </div>
        ) : (
          <SignInButton mode="modal">
            <Button variant="destructive" className={`${isCollapsed ? 'w-10 h-10 p-0 rounded-full flex items-center justify-center' : 'w-full'} bg-red-600 hover:bg-red-700 font-outfit`}>
              {isCollapsed ? <User size={16} /> : 'Login'}
            </Button>
          </SignInButton>
        )}
      </div>
    </aside>
  );
}

function NavItem({ href, icon, label, isCollapsed }: { href: string, icon: React.ReactNode, label: string, isCollapsed: boolean }) {
  return (
    <Link href={href} className="flex items-center gap-3 px-3 py-3 text-zinc-400 hover:text-white hover:bg-zinc-800/50 rounded-lg transition-colors group" title={label}>
      <span className="shrink-0">{icon}</span>
      {!isCollapsed && <span className="truncate">{label}</span>}
      {isCollapsed && (
        <div className="absolute left-16 bg-zinc-800 text-white px-3 py-1.5 rounded-md text-sm whitespace-nowrap opacity-0 group-hover:opacity-100 pointer-events-none transition-opacity z-50 shadow-xl border border-zinc-700">
          {label}
        </div>
      )}
    </Link>
  );
}
