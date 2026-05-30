"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { ArrowLeft, Brain, Sparkles, TrendingUp } from "lucide-react";
import { Bar, BarChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";

type Task = {
  id: string;
  title: string;
  course: string;
  dueDate: string;
  priority: "High" | "Medium" | "Low";
  done: boolean;
};

type CheckInLog = {
  readiness: number;
  moodClimate: string;
  stressLoad: string;
  energyBattery: string;
  studyMode: string;
};

type BudgetTransaction = {
  type: "Income" | "Expense";
  category: string;
  amount: number;
};

type SplitEntry = {
  direction: "i_owe" | "owes_me";
  amount: number;
  settled: boolean;
};

type PulseEntry = {
  vibe: string;
  tags: string[];
};

type Subject = {
  name: string;
  held: number;
  attended: number;
};

type PeriodEntry = {
  status?: string;
  lastPeriodStart?: string;
  usualCycleLength?: number;
};

function loadJson<T>(key: string, fallback: T): T {
  if (typeof window === "undefined") return fallback;

  const saved = localStorage.getItem(key);
  if (!saved) return fallback;

  try {
    return JSON.parse(saved) as T;
  } catch {
    return fallback;
  }
}

function attendancePercent(attended: number, held: number) {
  if (!held) return 0;
  return Math.round((attended / held) * 100);
}

export default function InsightsPage() {
  const [ready, setReady] = useState(false);

  useEffect(() => {
    setReady(true);
  }, []);

  const data = useMemo(() => {
    if (!ready) {
      return {
        tasks: [] as Task[],
        wellness: [] as CheckInLog[],
        transactions: [] as BudgetTransaction[],
        splits: [] as SplitEntry[],
        pulses: [] as PulseEntry[],
        subjects: [] as Subject[],
        cycleEvents: [] as PeriodEntry[],
      };
    }

    return {
      tasks: loadJson<Task[]>("hercatalyst_tasks", []),
      wellness: loadJson<CheckInLog[]>("hercatalyst_checkin_logs", []),
      transactions: loadJson<BudgetTransaction[]>("hercatalyst_budget_transactions", []),
      splits: loadJson<SplitEntry[]>("hercatalyst_split_entries", []),
      pulses: loadJson<PulseEntry[]>("hercatalyst_daily_pulse", []),
      subjects: loadJson<Subject[]>("hercatalyst_attendance_subjects", []),
      cycleEvents: loadJson<PeriodEntry[]>("hercatalyst_cycle_events", []),
    };
  }, [ready]);

  const insights = useMemo(() => {
    const result: { title: string; body: string; type: "Academic" | "Wellness" | "Money" | "Safety" | "Career" | "Life" }[] = [];

    const openTasks = data.tasks.filter((task) => !task.done);
    const highTasks = openTasks.filter((task) => task.priority === "High");

    if (highTasks.length >= 2) {
      result.push({
        type: "Academic",
        title: "High-priority load is building",
        body: `You have ${highTasks.length} high-priority tasks open. Use the planner to split them into smaller blocks before they become deadline stress.`,
      });
    } else if (openTasks.length > 0) {
      result.push({
        type: "Academic",
        title: "Planner is active",
        body: `You have ${openTasks.length} open task${openTasks.length === 1 ? "" : "s"}. Start with the smallest one to build momentum.`,
      });
    }

    const latestWellness = data.wellness[0];
    if (latestWellness) {
      result.push({
        type: "Wellness",
        title: `Readiness is ${latestWellness.readiness}%`,
        body: `HerCatalyst currently sees your energy as ${latestWellness.energyBattery}, stress as ${latestWellness.stressLoad}, and recommends: ${latestWellness.studyMode}`,
      });
    }

    const lowReadiness = data.wellness.filter((log) => log.readiness < 55);
    if (lowReadiness.length >= 2) {
      result.push({
        type: "Wellness",
        title: "Recovery pattern detected",
        body: "Multiple recent check-ins show lower readiness. Short study bursts, food, water, and sleep protection should be prioritized.",
      });
    }

    const expenses = data.transactions
      .filter((transaction) => transaction.type === "Expense")
      .reduce((sum, transaction) => sum + transaction.amount, 0);

    const income = data.transactions
      .filter((transaction) => transaction.type === "Income")
      .reduce((sum, transaction) => sum + transaction.amount, 0);

    if (expenses > income && expenses > 0) {
      result.push({
        type: "Money",
        title: "Spending is above income",
        body: "Your recorded expenses are higher than recorded income. Check food, transport, and split payments before the end of the month.",
      });
    }

    const activeOwe = data.splits
      .filter((split) => !split.settled && split.direction === "i_owe")
      .reduce((sum, split) => sum + split.amount, 0);

    const activeOwed = data.splits
      .filter((split) => !split.settled && split.direction === "owes_me")
      .reduce((sum, split) => sum + split.amount, 0);

    if (activeOwe || activeOwed) {
      result.push({
        type: "Money",
        title: "Split balances need attention",
        body: `You owe ₹${activeOwe.toLocaleString("en-IN")} and are owed ₹${activeOwed.toLocaleString("en-IN")}. Settle small amounts early to avoid confusion.`,
      });
    }

    const riskySubjects = data.subjects.filter((subject) => attendancePercent(subject.attended, subject.held) < 75);
    if (riskySubjects.length > 0) {
      result.push({
        type: "Academic",
        title: "Attendance risk",
        body: `${riskySubjects.length} subject${riskySubjects.length === 1 ? " is" : "s are"} below 75%. Attend the next classes before skipping more.`,
      });
    }

    const lowSleepPulse = data.pulses.filter((entry) => entry.tags.includes("Low sleep"));
    if (lowSleepPulse.length >= 2) {
      result.push({
        type: "Life",
        title: "Low sleep is repeating",
        body: "Your Daily Pulse shows low sleep more than once. This may affect focus, mood, and cycle regularity.",
      });
    }

    const anxiousPulse = data.pulses.filter((entry) => entry.tags.includes("Anxious") || entry.vibe === "Stressed");
    if (anxiousPulse.length >= 2) {
      result.push({
        type: "Wellness",
        title: "Stress signals are repeating",
        body: "Your journal shows repeated stress/anxiety signals. Move heavy tasks earlier and use check-ins before night study blocks.",
      });
    }

    if (data.cycleEvents.length > 0) {
      result.push({
        type: "Wellness",
        title: "Cycle tracker is active",
        body: "Your period and cycle check-ins are now part of your productivity context. Keep logging 'not yet' if your period has not started.",
      });
    }

    if (result.length === 0) {
      result.push({
        type: "Life",
        title: "Start logging to unlock intelligence",
        body: "Add planner tasks, wellness check-ins, budget entries, attendance subjects, and Daily Pulse entries. Insights will become more personal as data builds.",
      });
    }

    return result;
  }, [data]);

  const systemMap = useMemo(() => {
    return [
      { name: "Planner", value: data.tasks.length },
      { name: "Wellness", value: data.wellness.length },
      { name: "Money", value: data.transactions.length + data.splits.length },
      { name: "Journal", value: data.pulses.length },
      { name: "Attendance", value: data.subjects.length },
      { name: "Cycle", value: data.cycleEvents.length },
    ];
  }, [data]);

  return (
    <main className="min-h-screen bg-[#FFF7FA] px-6 py-6 text-[#26111D] md:px-10">
      <Link href="/dashboard" className="inline-flex items-center gap-2 font-bold text-[#EC3A7A]">
        <ArrowLeft className="h-4 w-4" />
        Back to dashboard
      </Link>

      <section className="mx-auto mt-8 max-w-7xl">
        <div className="mb-8">
          <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-[#EC3A7A] text-white">
            <Brain className="h-7 w-7" />
          </div>

          <h1 className="text-4xl font-black md:text-6xl">AI Insights</h1>

          <p className="mt-3 max-w-3xl text-[#6F4B5D]">
            HerCatalyst reads your local app activity and turns it into cross-feature guidance.
            This is the bridge between planner, wellness, cycle, budget, attendance, and journal.
          </p>
        </div>

        <div className="grid gap-5 lg:grid-cols-[0.9fr_1.1fr]">
          <Card className="border-[#F6C6D7] bg-[#26111D] p-6 text-white shadow-sm">
            <div className="mb-5 flex items-center gap-2">
              <Sparkles className="h-5 w-5 text-[#F48FB1]" />
              <h2 className="text-2xl font-black">Intelligence map</h2>
            </div>

            <div className="h-72">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={systemMap}>
                  <XAxis dataKey="name" stroke="#ffffff99" />
                  <YAxis stroke="#ffffff99" allowDecimals={false} />
                  <Tooltip />
                  <Bar dataKey="value" fill="#EC3A7A" radius={[12, 12, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>

            <p className="mt-4 text-sm leading-6 text-white/65">
              The more modules you use, the more context HerCatalyst has for recommendations.
            </p>
          </Card>

          <div className="space-y-4">
            {insights.map((insight) => (
              <Card key={insight.title} className="border-[#F6C6D7] bg-white/80 p-6 shadow-sm">
                <div className="mb-3 flex items-center justify-between gap-3">
                  <Badge className="bg-[#FFF0F5] text-[#EC3A7A] hover:bg-[#FFF0F5]">
                    {insight.type}
                  </Badge>
                  <TrendingUp className="h-5 w-5 text-[#EC3A7A]" />
                </div>

                <h2 className="text-2xl font-black">{insight.title}</h2>
                <p className="mt-3 leading-7 text-[#6F4B5D]">{insight.body}</p>
              </Card>
            ))}
          </div>
        </div>
      </section>
    </main>
  );
}