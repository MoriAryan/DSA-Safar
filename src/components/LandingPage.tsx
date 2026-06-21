"use client";

import { Terminal, Code2, BrainCircuit, Rocket, ChevronRight, CheckCircle2 } from "lucide-react";
import { SignInButton, SignUpButton } from "@clerk/nextjs";
import { useEffect, useState } from "react";
import { Button } from "./ui/button";

export function LandingPage() {
  const [text, setText] = useState("");
  const codeSnippet = `function masterDSA() {
  const roadmap = fetch('dsa-safar');
  let skills = 0;
  
  while (roadmap.hasNext()) {
    const problem = roadmap.next();
    solve(problem);
    skills++;
  }
  
  return "FAANG Ready";
}`;

  useEffect(() => {
    let i = 0;
    const interval = setInterval(() => {
      setText(codeSnippet.slice(0, i));
      i++;
      if (i > codeSnippet.length) clearInterval(interval);
    }, 20);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="min-h-screen bg-[#0c0c0e] text-zinc-50 font-inter overflow-hidden relative selection:bg-red-500/30">
      
      {/* Background gradients */}
      <div className="absolute top-[-20%] left-[-10%] w-[50%] h-[50%] rounded-full bg-red-600/20 blur-[150px] pointer-events-none" />
      <div className="absolute bottom-[-20%] right-[-10%] w-[50%] h-[50%] rounded-full bg-orange-600/10 blur-[150px] pointer-events-none" />

      {/* Nav */}
      <nav className="relative z-10 flex items-center justify-between px-6 py-6 max-w-7xl mx-auto">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-red-600 to-red-800 flex items-center justify-center font-outfit font-bold italic text-xl shadow-lg shadow-red-600/20">
            S
          </div>
          <span className="font-outfit font-black text-2xl tracking-tight">DSA Safar</span>
        </div>
        <div className="flex items-center gap-4">
          <SignInButton mode="modal">
            <button className="text-sm font-semibold text-zinc-300 hover:text-white transition-colors">Sign In</button>
          </SignInButton>
          <SignUpButton mode="modal">
            <button className="text-sm font-semibold bg-white text-black px-5 py-2.5 rounded-full hover:bg-zinc-200 transition-colors">Get Started</button>
          </SignUpButton>
        </div>
      </nav>

      {/* Hero */}
      <main className="relative z-10 max-w-7xl mx-auto px-6 pt-20 pb-32 flex flex-col lg:flex-row items-center gap-16">
        <div className="flex-1 text-center lg:text-left">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-red-500/10 border border-red-500/20 text-red-400 text-sm font-semibold mb-8">
            <Rocket size={16} /> 
            <span>The Ultimate DSA Progression Tracker</span>
          </div>
          <h1 className="text-5xl lg:text-7xl font-outfit font-black leading-tight mb-6 tracking-tight">
            Master Algorithms.<br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-red-500 to-orange-400">
              Without the Chaos.
            </span>
          </h1>
          <p className="text-lg lg:text-xl text-zinc-400 mb-10 max-w-2xl mx-auto lg:mx-0 leading-relaxed">
            DSA Safar is an elite, intelligent progression tracker for Data Structures and Algorithms. Spaced repetition, precise analytics, and a terminal-like environment built for serious engineers.
          </p>
          
          <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4">
            <SignUpButton mode="modal">
              <Button size="lg" className="w-full sm:w-auto text-base font-semibold bg-red-600 hover:bg-red-700 text-white rounded-full px-8 py-6 h-auto flex items-center gap-2 group shadow-[0_0_40px_rgba(220,38,38,0.3)]">
                Start Coding <ChevronRight className="group-hover:translate-x-1 transition-transform" />
              </Button>
            </SignUpButton>
          </div>
          
          <div className="mt-10 flex items-center justify-center lg:justify-start gap-8 text-sm font-medium text-zinc-500">
            <span className="flex items-center gap-2"><CheckCircle2 className="text-red-500" size={16} /> Spaced Repetition</span>
            <span className="flex items-center gap-2"><CheckCircle2 className="text-red-500" size={16} /> Deep Analytics</span>
            <span className="flex items-center gap-2"><CheckCircle2 className="text-red-500" size={16} /> Cloud Sync</span>
          </div>
        </div>

        <div className="flex-1 w-full max-w-2xl lg:max-w-none">
          <div className="relative rounded-2xl bg-black/40 border border-zinc-800 p-2 shadow-2xl backdrop-blur-sm overflow-hidden group">
            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-red-500 to-orange-500 opacity-50" />
            
            {/* Terminal Header */}
            <div className="flex items-center gap-2 px-4 py-3 border-b border-zinc-800/50 bg-black/60 rounded-t-xl">
              <div className="w-3 h-3 rounded-full bg-red-500/80" />
              <div className="w-3 h-3 rounded-full bg-yellow-500/80" />
              <div className="w-3 h-3 rounded-full bg-green-500/80" />
              <span className="ml-4 text-xs font-mono text-zinc-500">dsa-safar.ts</span>
            </div>
            
            {/* Terminal Body */}
            <div className="p-6 font-mono text-sm sm:text-base leading-relaxed overflow-x-auto">
              <div className="text-zinc-400 mb-4">// Initialize your journey to engineering excellence</div>
              <pre>
                <code className="text-emerald-400">
                  {text}
                  <span className="animate-pulse inline-block w-2 h-4 ml-1 bg-emerald-400 align-middle" />
                </code>
              </pre>
            </div>
          </div>
        </div>
      </main>

      {/* Feature Grid */}
      <section className="relative z-10 border-t border-zinc-800/50 bg-black/20 backdrop-blur-md">
        <div className="max-w-7xl mx-auto px-6 py-24">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="p-8 rounded-3xl bg-zinc-900/50 border border-zinc-800 hover:border-red-500/30 transition-colors">
              <div className="w-12 h-12 rounded-xl bg-red-500/10 flex items-center justify-center mb-6">
                <BrainCircuit className="text-red-500" size={24} />
              </div>
              <h3 className="text-xl font-bold font-outfit mb-3">Spaced Repetition</h3>
              <p className="text-zinc-400 leading-relaxed">Our Focus Mode algorithm guarantees you never forget a solution. Overdue questions are prioritized automatically.</p>
            </div>
            
            <div className="p-8 rounded-3xl bg-zinc-900/50 border border-zinc-800 hover:border-red-500/30 transition-colors">
              <div className="w-12 h-12 rounded-xl bg-orange-500/10 flex items-center justify-center mb-6">
                <Terminal className="text-orange-500" size={24} />
              </div>
              <h3 className="text-xl font-bold font-outfit mb-3">Nerd Aesthetics</h3>
              <p className="text-zinc-400 leading-relaxed">Built for engineers, by engineers. A blazing fast, keyboard-friendly UI with dark mode as a first-class citizen.</p>
            </div>
            
            <div className="p-8 rounded-3xl bg-zinc-900/50 border border-zinc-800 hover:border-red-500/30 transition-colors">
              <div className="w-12 h-12 rounded-xl bg-green-500/10 flex items-center justify-center mb-6">
                <Code2 className="text-green-500" size={24} />
              </div>
              <h3 className="text-xl font-bold font-outfit mb-3">Deep Analytics</h3>
              <p className="text-zinc-400 leading-relaxed">Track your goal streaks, active days, and retention profile in a beautifully crafted Bento-Box dashboard.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="relative z-10 border-t border-zinc-800/50 py-12 text-center">
        <p className="text-zinc-500 font-medium">
          Built with precision by <a href="#" className="text-red-400 hover:text-red-300 transition-colors underline decoration-red-500/30 underline-offset-4">MoriAryan</a>.
        </p>
      </footer>
    </div>
  );
}
