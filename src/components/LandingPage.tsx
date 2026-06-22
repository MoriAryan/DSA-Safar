"use client";

import { Terminal, Code2, BrainCircuit, Rocket, ChevronRight, CheckCircle2 } from "lucide-react";
import { SignInButton, SignUpButton } from "@clerk/nextjs";
import { useEffect, useState } from "react";
import { Button } from "./ui/button";

export function LandingPage() {
  const [text, setText] = useState("");
  const codeSnippet = `import { MasteryEngine } from '@dsa-safar/engine';
import { LocalFirst } from '@dsa-safar/sync';

const engine = new MasteryEngine({
  target: 'Top Tier',
  retentionRate: 0.95,
  storage: new LocalFirst()
});

engine.on('overdue', (problem) => {
  // Never forget a pattern again.
  solve(problem);
});

await engine.start();`;

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
    <div className="w-full min-h-screen bg-[#0c0c0e] text-zinc-50 font-inter overflow-hidden relative selection:bg-red-500/30">
      
      {/* Background gradients */}
      <div className="absolute top-[-20%] left-[-10%] w-[50%] h-[50%] rounded-full bg-red-600/20 blur-[150px] pointer-events-none" />
      <div className="absolute bottom-[-20%] right-[-10%] w-[50%] h-[50%] rounded-full bg-orange-600/10 blur-[150px] pointer-events-none" />

      {/* Nav */}
      <nav className="relative z-10 flex items-center justify-between px-6 py-6 max-w-7xl mx-auto">
        <div className="flex items-center gap-3">
          <div className="w-14 h-14 flex items-center justify-center overflow-visible">
            <img src="/logo.png" alt="DSA Safar" className="w-full h-full object-contain drop-shadow-md" />
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
            <a href="/app">
              <Button size="lg" className="w-full sm:w-auto text-base font-semibold bg-red-600 hover:bg-red-700 text-white rounded-full px-8 py-6 h-auto flex items-center gap-2 group shadow-[0_0_40px_rgba(220,38,38,0.3)]">
                Launch App <ChevronRight className="group-hover:translate-x-1 transition-transform" />
              </Button>
            </a>
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

      {/* Core Philosophy Section */}
      <section className="relative z-10 max-w-7xl mx-auto px-6 py-32 border-t border-zinc-800/50">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-20 items-center">
          <div>
            <h2 className="text-3xl lg:text-4xl font-outfit font-bold tracking-tight mb-6">The Spaced Repetition Engine.</h2>
            <p className="text-zinc-400 text-lg leading-relaxed mb-6">
              Most developers grind LeetCode endlessly and forget the patterns a month later. DSA Safar utilizes a scientifically proven spaced-repetition algorithm that mathematically guarantees long-term retention.
            </p>
            <ul className="space-y-4 font-mono text-sm text-zinc-500">
              <li className="flex items-center gap-3"><span className="text-red-500">→</span> Easy: Reviews pushed further out.</li>
              <li className="flex items-center gap-3"><span className="text-orange-500">→</span> Partial: Reviewed again soon.</li>
              <li className="flex items-center gap-3"><span className="text-zinc-400">→</span> Forgot: Immediately added to the active sprint.</li>
            </ul>
          </div>
          <div className="bg-black/50 border border-zinc-800/80 p-8 rounded-2xl shadow-xl">
            <div className="flex items-center justify-between mb-8 pb-6 border-b border-zinc-800">
              <div>
                <div className="text-xs font-mono text-zinc-500 mb-1">NEXT REVIEW</div>
                <div className="text-xl font-bold font-outfit">Binary Search Tree</div>
              </div>
              <div className="text-red-500 font-mono font-bold">OVERDUE</div>
            </div>
            <div className="space-y-4">
              <div className="w-full h-2 bg-zinc-900 rounded-full overflow-hidden">
                <div className="w-[85%] h-full bg-zinc-700" />
              </div>
              <div className="w-full h-2 bg-zinc-900 rounded-full overflow-hidden">
                <div className="w-[60%] h-full bg-zinc-700" />
              </div>
              <div className="w-full h-2 bg-zinc-900 rounded-full overflow-hidden">
                <div className="w-[30%] h-full bg-red-500" />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Local First Section */}
      <section className="relative z-10 max-w-7xl mx-auto px-6 py-32 border-t border-zinc-800/50">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-20 items-center">
          <div className="order-2 md:order-1 font-mono text-sm">
            <div className="bg-[#09090b] border border-zinc-800 p-6 rounded-xl">
              <div className="text-zinc-500 mb-2">// 100% Local execution. No latency.</div>
              <div className="text-emerald-400 mb-1">$ ping api.dsasafar.com</div>
              <div className="text-zinc-400 mb-4">Request timeout for icmp_seq 0</div>
              <div className="text-emerald-400 mb-1">$ cat ~/.local/share/progress.db</div>
              <div className="text-zinc-300">{"{"} "status": "perfectly_synced" {"}"}</div>
            </div>
          </div>
          <div className="order-1 md:order-2">
            <h2 className="text-3xl lg:text-4xl font-outfit font-bold tracking-tight mb-6">Local-First Architecture.</h2>
            <p className="text-zinc-400 text-lg leading-relaxed">
              Your progress is inherently yours. By leveraging IndexedDB and aggressive local caching, DSA Safar operates seamlessly offline. When you do choose to authenticate, the Sync Engine quietly merges your local state with the cloud, ensuring zero data loss without ever blocking your workflow.
            </p>
          </div>
        </div>
      </section>
      {/* Footer */}
      <footer className="relative z-10 border-t border-zinc-800/50 py-12 text-center">
        <p className="text-zinc-500 font-medium">
          Built with ❤️ and precision by <a href="https://www.linkedin.com/in/mori-aryan" className="text-red-400 hover:text-red-300 transition-colors underline decoration-red-500/30 underline-offset-4" target="blank">MoriAryan</a>.
        </p>
      </footer>
    </div>
  );
}
