"use client";

import React, { createContext, useContext, useState, useEffect, ReactNode } from "react";
import toast from "react-hot-toast";

export interface TaskStatus {
  id: string;
  agent: string;
  status: "pending" | "running" | "completed" | "failed";
  result?: any;
}

interface TaskContextType {
  tasks: Record<string, TaskStatus>;
  activeCount: number;
  registerTask: (id: string, agent: string) => void;
  clearTask: (id: string) => void;
}

const TaskContext = createContext<TaskContextType | undefined>(undefined);

export function TaskProvider({ children }: { children: ReactNode }) {
  const [tasks, setTasks] = useState<Record<string, TaskStatus>>({});

  // Derived state for the top bar indicator
  const activeCount = Object.values(tasks).filter(
    (t) => t.status === "pending" || t.status === "running"
  ).length;

  const registerTask = (id: string, agent: string) => {
    setTasks((prev) => ({
      ...prev,
      [id]: { id, agent, status: "running" },
    }));
    toast.success(`Started ${agent} background task!`);
  };

  const clearTask = (id: string) => {
    setTasks((prev) => {
      const next = { ...prev };
      delete next[id];
      return next;
    });
  };

  useEffect(() => {
    // Polling loop
    const activeTaskIds = Object.values(tasks)
      .filter((t) => t.status === "pending" || t.status === "running")
      .map((t) => t.id);

    if (activeTaskIds.length === 0) return;

    const interval = setInterval(async () => {
      for (const id of activeTaskIds) {
        try {
          const res = await fetch(`http://localhost:8000/api/tasks/${id}`);
          if (!res.ok) continue;
          
          const data = await res.json();
          if (data.success && data.task) {
            const task = data.task;
            
            // If status changed to completed/failed
            if (task.status === "completed" || task.status === "failed") {
              setTasks((prev) => ({
                ...prev,
                [id]: {
                  id: task.id,
                  agent: task.agent,
                  status: task.status,
                  result: task.result,
                },
              }));
              
              if (task.status === "completed") {
                toast.success(`${task.agent} task completed!`);
              } else {
                toast.error(`${task.agent} task failed.`);
              }
            }
          }
        } catch (err) {
          console.error("Task poll error:", err);
        }
      }
    }, 2000); // Poll every 2 seconds

    return () => clearInterval(interval);
  }, [tasks]);

  return (
    <TaskContext.Provider value={{ tasks, activeCount, registerTask, clearTask }}>
      {children}
    </TaskContext.Provider>
  );
}

export function useTasks() {
  const context = useContext(TaskContext);
  if (context === undefined) {
    throw new Error("useTasks must be used within a TaskProvider");
  }
  return context;
}
