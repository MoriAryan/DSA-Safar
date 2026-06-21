"use client";

import React, { useMemo, useState } from "react";
import dataset from "@/data/data.json";
import sprintData from "@/data/sprint.json";
import { useProgressStore } from "@/store/useProgressStore";
import { ProblemTable } from "@/components/ProblemTable";
import { ChevronDown, ChevronUp } from "lucide-react";

export default function SprintPage() {
  const getProgress = useProgressStore(state => state.getProgress);
  const completedProblems = useProgressStore(state => state.completedProblems); // for reactivity

  const { topics, allSprintIds } = useMemo(() => {
    // Flatten dataset to dictionary for easy lookup
    const problemsMap = new Map();
    dataset.forEach(step => {
      step.lectures.forEach(l => {
        l.problems.forEach(p => {
          problemsMap.set(p.id, p);
        });
      });
    });

    const mappedTopics = sprintData.map((topic: any) => ({
      title: topic.title,
      problems: topic.problems.map((id: string) => problemsMap.get(id)).filter(Boolean)
    }));

    const sprintIds = mappedTopics.flatMap(t => t.problems.map((p: any) => p.id));
    
    return { topics: mappedTopics, allSprintIds: sprintIds };
  }, []);

  const overallProgress = getProgress(allSprintIds);

  const [openTopics, setOpenTopics] = useState<Record<string, boolean>>(
    topics.reduce((acc, t) => ({ ...acc, [t.title]: true }), {})
  );

  const toggleTopic = (title: string) => {
    setOpenTopics(prev => ({ ...prev, [title]: !prev[title] }));
  };

  return (
    <div className="max-w-6xl mx-auto py-8 px-4 sm:px-6 lg:px-8 font-inter">
      <div className="mb-8">
        <h1 className="text-3xl font-outfit font-bold mb-2">2 Day Sprint</h1>
        <p className="text-zinc-500 dark:text-zinc-400">
          The ultimate final curated list. Master these ~80 problems and you're good to go.
        </p>
      </div>

      <div className="bg-white dark:bg-[#1a1b1e] rounded-xl border border-zinc-200 dark:border-zinc-800 p-4 mb-8 shadow-sm">
        <div className="flex justify-between items-end mb-2">
          <div>
            <h3 className="font-outfit font-semibold text-lg">Sprint Progress</h3>
          </div>
          <div className="text-right">
            <span className="font-bold text-lg text-blue-600 dark:text-blue-500">{overallProgress.percentage}%</span>
            <div className="text-xs text-zinc-500">{overallProgress.completed} / {overallProgress.total} solved</div>
          </div>
        </div>
        <div className="w-full h-2 bg-zinc-100 dark:bg-zinc-800 rounded-full overflow-hidden mb-4">
          <div 
            className="h-full bg-blue-500 transition-all" 
            style={{ width: `${overallProgress.percentage}%` }}
          />
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-4">
          {topics.map(topic => {
            const topicIds = topic.problems.map((p: any) => p.id);
            const pStats = getProgress(topicIds);
            return (
              <div key={topic.title} className="text-sm">
                <div className="flex justify-between mb-1">
                  <span className="text-zinc-600 dark:text-zinc-400 truncate pr-2" title={topic.title}>
                    {topic.title}
                  </span>
                  <span className="font-medium text-zinc-900 dark:text-zinc-100">{pStats.completed}/{pStats.total}</span>
                </div>
                <div className="w-full h-1 bg-zinc-100 dark:bg-zinc-800 rounded-full overflow-hidden">
                  <div 
                    className="h-full bg-blue-500" 
                    style={{ width: `${pStats.percentage}%` }}
                  />
                </div>
              </div>
            );
          })}
        </div>
      </div>

      <div className="space-y-4">
        {topics.map(topic => (
          <div key={topic.title} className="bg-white dark:bg-[#1a1b1e] rounded-xl border border-zinc-200 dark:border-zinc-800 overflow-hidden shadow-sm">
            <button 
              onClick={() => toggleTopic(topic.title)}
              className="w-full flex items-center justify-between p-4 bg-zinc-50 dark:bg-[#15161a] hover:bg-zinc-100 dark:hover:bg-zinc-800/50 transition-colors"
            >
              <div className="flex items-center gap-3">
                <h2 className="text-lg font-semibold font-outfit">{topic.title}</h2>
                <span className="bg-zinc-200 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-400 px-2.5 py-0.5 rounded-full text-xs font-medium">
                  {topic.problems.length}
                </span>
              </div>
              {openTopics[topic.title] ? <ChevronUp size={20} className="text-zinc-400" /> : <ChevronDown size={20} className="text-zinc-400" />}
            </button>
            
            {openTopics[topic.title] && (
              <div className="p-0 overflow-x-auto border-t border-zinc-200 dark:border-zinc-800">
                <ProblemTable problems={topic.problems} />
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
