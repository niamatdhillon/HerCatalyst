"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { ArrowLeft, CalendarCheck, Plus, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";

type Task = {
  id: string;
  title: string;
  course: string;
  dueDate: string;
  priority: "High" | "Medium" | "Low";
  done: boolean;
};

export default function PlannerPage() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [title, setTitle] = useState("");
  const [course, setCourse] = useState("");
  const [dueDate, setDueDate] = useState("");
  const [priority, setPriority] = useState<Task["priority"]>("Medium");

  useEffect(() => {
    const saved = localStorage.getItem("hercatalyst_tasks");
    if (saved) setTasks(JSON.parse(saved));
  }, []);

  useEffect(() => {
    localStorage.setItem("hercatalyst_tasks", JSON.stringify(tasks));
  }, [tasks]);

  function addTask() {
    if (!title.trim()) return;

    const task: Task = {
      id: crypto.randomUUID(),
      title,
      course,
      dueDate,
      priority,
      done: false,
    };

    setTasks([task, ...tasks]);
    setTitle("");
    setCourse("");
    setDueDate("");
    setPriority("Medium");
  }

  function toggleTask(id: string) {
    setTasks(tasks.map((task) => (task.id === id ? { ...task, done: !task.done } : task)));
  }

  function deleteTask(id: string) {
    setTasks(tasks.filter((task) => task.id !== id));
  }

  const completed = tasks.filter((task) => task.done).length;

  return (
    <main className="min-h-screen bg-[#FFF7FA] px-6 py-6 text-[#26111D] md:px-10">
      <Link href="/dashboard" className="inline-flex items-center gap-2 font-bold text-[#EC3A7A]">
        <ArrowLeft className="h-4 w-4" />
        Back to dashboard
      </Link>

      <section className="mx-auto mt-8 max-w-6xl">
        <div className="mb-8">
          <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-[#EC3A7A] text-white">
            <CalendarCheck className="h-7 w-7" />
          </div>
          <h1 className="text-4xl font-black md:text-6xl">Smart Planner</h1>
          <p className="mt-3 max-w-2xl text-[#6F4B5D]">
            Add assignments, exams, study sessions, and goals. Your tasks stay saved in this browser.
          </p>
        </div>

        <div className="grid gap-5 lg:grid-cols-[0.85fr_1.15fr]">
          <Card className="border-[#F6C6D7] bg-white/80 p-6 shadow-sm">
            <h2 className="text-2xl font-black">Add task</h2>

            <div className="mt-6 space-y-5">
              <div className="space-y-2">
                <Label>Task</Label>
                <Input value={title} onChange={(event) => setTitle(event.target.value)} placeholder="Finish DSA assignment" />
              </div>

              <div className="space-y-2">
                <Label>Course / Area</Label>
                <Input value={course} onChange={(event) => setCourse(event.target.value)} placeholder="Data Structures" />
              </div>

              <div className="space-y-2">
                <Label>Due date</Label>
                <Input type="date" value={dueDate} onChange={(event) => setDueDate(event.target.value)} />
              </div>

              <div className="space-y-2">
                <Label>Priority</Label>
                <select
                  value={priority}
                  onChange={(event) => setPriority(event.target.value as Task["priority"])}
                  className="h-10 w-full rounded-md border border-[#F6C6D7] bg-white px-3 text-sm"
                >
                  <option>High</option>
                  <option>Medium</option>
                  <option>Low</option>
                </select>
              </div>

              <Button onClick={addTask} className="w-full bg-[#EC3A7A] text-white hover:bg-[#d82f6d]">
                <Plus className="mr-2 h-4 w-4" />
                Add task
              </Button>
            </div>
          </Card>

          <Card className="border-[#F6C6D7] bg-white/80 p-6 shadow-sm">
            <div className="mb-6 flex items-center justify-between">
              <div>
                <h2 className="text-2xl font-black">Today’s board</h2>
                <p className="text-sm text-[#6F4B5D]">
                  {completed} of {tasks.length} completed
                </p>
              </div>
              <Badge className="bg-[#FFF0F5] text-[#EC3A7A] hover:bg-[#FFF0F5]">
                {tasks.length} tasks
              </Badge>
            </div>

            <div className="space-y-3">
              {tasks.length === 0 ? (
                <div className="rounded-2xl border border-dashed border-[#F6C6D7] p-8 text-center text-[#6F4B5D]">
                  No tasks yet. Add your first one.
                </div>
              ) : (
                tasks.map((task) => (
                  <div
                    key={task.id}
                    className="flex items-center justify-between gap-4 rounded-2xl border border-[#F6C6D7] bg-[#FFF7FA] p-4"
                  >
                    <button onClick={() => toggleTask(task.id)} className="flex flex-1 items-start gap-3 text-left">
                      <span
                        className={`mt-1 h-5 w-5 rounded-full border ${
                          task.done ? "border-[#EC3A7A] bg-[#EC3A7A]" : "border-[#F48FB1]"
                        }`}
                      />
                      <span>
                        <span className={`block font-bold ${task.done ? "text-[#6F4B5D] line-through" : ""}`}>
                          {task.title}
                        </span>
                        <span className="text-sm text-[#6F4B5D]">
                          {task.course || "General"} {task.dueDate ? `• Due ${task.dueDate}` : ""}
                        </span>
                      </span>
                    </button>

                    <Badge variant="outline" className="border-[#F6C6D7]">
                      {task.priority}
                    </Badge>

                    <Button variant="ghost" size="icon" onClick={() => deleteTask(task.id)}>
                      <Trash2 className="h-4 w-4 text-[#F15A24]" />
                    </Button>
                  </div>
                ))
              )}
            </div>
          </Card>
        </div>
      </section>
    </main>
  );
}