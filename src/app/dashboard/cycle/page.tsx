"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { AlertTriangle, ArrowLeft, CalendarDays, HeartPulse, Plus, Sparkles, Trash2 } from "lucide-react";
import { Bar, BarChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

type CycleEvent = {
  id: string;
  date: string;
  status: "period_started" | "not_started" | "spotting";
  lastPeriodStart: string;
  usualPeriodLength: number;
  usualCycleLength: number;
  flow?: string;
  symptoms: string[];
  note: string;
};

const statuses = [
  { value: "not_started", label: "Not yet" },
  { value: "period_started", label: "Yes, started" },
  { value: "spotting", label: "Spotting only" },
] as const;

const flows = ["Light", "Medium", "Heavy"];
const symptomsList = ["Cramps", "Headache", "Back pain", "Bloating", "Acne", "Mood swings", "Fatigue", "Nausea", "Tender breasts", "None"];

function daysBetween(start: string, end: Date) {
  const a = new Date(`${start}T00:00:00`);
  const b = new Date(end.toISOString().slice(0, 10) + "T00:00:00");
  return Math.floor((b.getTime() - a.getTime()) / 86400000);
}

function addDays(dateString: string, days: number) {
  const date = new Date(`${dateString}T00:00:00`);
  date.setDate(date.getDate() + days);
  return date.toISOString().slice(0, 10);
}

function toggleItem(list: string[], item: string) {
  if (item === "None") return list.includes("None") ? [] : ["None"];
  const clean = list.filter((x) => x !== "None");
  return clean.includes(item) ? clean.filter((x) => x !== item) : [...clean, item];
}

function estimatePhase(cycleDay: number, cycleLength: number, periodLength: number) {
  if (cycleDay <= periodLength) return "Menstrual";
  const ovulationDay = Math.max(11, cycleLength - 14);
  if (cycleDay < ovulationDay - 3) return "Follicular";
  if (cycleDay <= ovulationDay + 1) return "Ovulation";
  return "Luteal";
}

function phasePlan(phase: string, lateBy: number) {
  if (lateBy > 0) {
    return {
      score: lateBy >= 5 ? 45 : 56,
      mode: "Waiting / check-in mode",
      description:
        "Your expected period date has passed, but HerCatalyst will not start a new cycle until you log real bleeding. Track symptoms and keep your workload flexible.",
      tasks: ["Track symptoms", "Protect sleep", "Keep study blocks short", "Consider a test/health check if relevant"],
    };
  }

  if (phase === "Period due soon") {
    return {
      score: 62,
      mode: "Pre-period mode",
      description: "Your period is expected soon. Keep buffers around deadlines and prepare essentials.",
      tasks: ["Prepare supplies", "Finish urgent work early", "Hydrate", "Use checklist planning"],
    };
  }

  if (phase === "Menstrual") {
    return {
      score: 58,
      mode: "Recovery-aware mode",
      description: "Choose lighter academic tasks and avoid forcing long sprints.",
      tasks: ["Gentle review", "Organize notes", "Low-friction tasks", "Rest + hydration"],
    };
  }

  if (phase === "Follicular") {
    return {
      score: 86,
      mode: "Build mode",
      description: "A strong window for learning, planning, and starting hard work.",
      tasks: ["Start new units", "Deep STEM problems", "Project planning", "Research drafting"],
    };
  }

  if (phase === "Ovulation") {
    return {
      score: 82,
      mode: "Connect mode",
      description: "A good window for presentations, collaboration, interviews, and mentor calls.",
      tasks: ["Present work", "Group study", "Mentor meeting", "Apply to opportunities"],
    };
  }

  return {
    score: 70,
    mode: "Structure mode",
    description: "Use checklists, smaller steps, and predictable routines.",
    tasks: ["Edit assignments", "Debug code", "Checklist study", "Prep deadlines"],
  };
}

function Chip({ active, children, onClick }: { active: boolean; children: React.ReactNode; onClick: () => void }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`rounded-full border px-4 py-2 text-sm font-bold transition ${
        active
          ? "border-[#EC3A7A] bg-[#EC3A7A] text-white shadow-lg shadow-[#EC3A7A]/20"
          : "border-[#F6C6D7] bg-white text-[#6F4B5D] hover:border-[#EC3A7A]/60"
      }`}
    >
      {children}
    </button>
  );
}

export default function CyclePage() {
  const today = new Date().toISOString().slice(0, 10);

  const [events, setEvents] = useState<CycleEvent[]>([]);
  const [date, setDate] = useState(today);
  const [status, setStatus] = useState<CycleEvent["status"]>("not_started");
  const [lastPeriodStart, setLastPeriodStart] = useState(today);
  const [usualPeriodLength, setUsualPeriodLength] = useState(5);
  const [usualCycleLength, setUsualCycleLength] = useState(28);
  const [flow, setFlow] = useState("Medium");
  const [symptoms, setSymptoms] = useState<string[]>(["None"]);
  const [note, setNote] = useState("");

  useEffect(() => {
    const saved = localStorage.getItem("hercatalyst_cycle_events");
    if (saved) {
      const parsed = JSON.parse(saved) as CycleEvent[];
      setEvents(parsed);

      const latestRealPeriod = parsed.find((event) => event.status === "period_started");
      const latestEvent = parsed[0];

      if (latestRealPeriod) setLastPeriodStart(latestRealPeriod.lastPeriodStart);
      if (latestEvent) {
        setUsualPeriodLength(latestEvent.usualPeriodLength);
        setUsualCycleLength(latestEvent.usualCycleLength);
      }
    }
  }, []);

  useEffect(() => {
    localStorage.setItem("hercatalyst_cycle_events", JSON.stringify(events));
  }, [events]);

  const intelligence = useMemo(() => {
    const daysSinceLastPeriod = Math.max(0, daysBetween(lastPeriodStart, new Date()));
    const cycleDay = daysSinceLastPeriod + 1;
    const expectedPeriod = addDays(lastPeriodStart, usualCycleLength);
    const lateBy = Math.max(0, daysBetween(expectedPeriod, new Date()));
    const daysUntil = Math.max(0, -daysBetween(expectedPeriod, new Date()));
    const dueSoon = lateBy === 0 && daysUntil <= 2;

    const phase =
      lateBy > 0
        ? "Period late / not started"
        : dueSoon
          ? "Period due soon"
          : estimatePhase(cycleDay, usualCycleLength, usualPeriodLength);

    return {
      cycleDay,
      expectedPeriod,
      lateBy,
      daysUntil,
      phase,
      plan: phasePlan(phase, lateBy),
    };
  }, [lastPeriodStart, usualCycleLength, usualPeriodLength]);

  function saveEvent() {
    const realStart = status === "period_started" ? date : lastPeriodStart;

    const event: CycleEvent = {
      id: crypto.randomUUID(),
      date,
      status,
      lastPeriodStart: realStart,
      usualPeriodLength,
      usualCycleLength,
      flow: status === "period_started" ? flow : undefined,
      symptoms,
      note,
    };

    setEvents([event, ...events]);

    if (status === "period_started") {
      setLastPeriodStart(date);
    }

    setStatus("not_started");
    setSymptoms(["None"]);
    setNote("");
  }

  function deleteEvent(id: string) {
    const next = events.filter((event) => event.id !== id);
    setEvents(next);

    const latestRealPeriod = next.find((event) => event.status === "period_started");
    if (latestRealPeriod) setLastPeriodStart(latestRealPeriod.lastPeriodStart);
  }

  const chartData = events
    .filter((event) => event.status === "period_started")
    .slice(0, 8)
    .reverse()
    .map((event, index) => ({
      cycle: `Cycle ${index + 1}`,
      cycleLength: event.usualCycleLength,
      periodLength: event.usualPeriodLength,
    }));

  return (
    <main className="min-h-screen bg-[#FFF7FA] px-6 py-6 text-[#26111D] md:px-10">
      <Link href="/dashboard" className="inline-flex items-center gap-2 font-bold text-[#EC3A7A]">
        <ArrowLeft className="h-4 w-4" />
        Back to dashboard
      </Link>

      <section className="mx-auto mt-8 max-w-7xl">
        <div className="mb-8">
          <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-[#EC3A7A] text-white">
            <HeartPulse className="h-7 w-7" />
          </div>
          <h1 className="text-4xl font-black md:text-6xl">Period + Cycle Intelligence</h1>
          <p className="mt-3 max-w-3xl text-[#6F4B5D]">
            HerCatalyst predicts your cycle from your last actual period. If your period has not started,
            log “Not yet” instead of choosing a flow.
          </p>
        </div>

        {intelligence.lateBy > 0 && (
          <Card className="mb-5 border-[#F15A24]/30 bg-[#FFF1EC] p-5 text-[#7A2510]">
            <div className="flex gap-3">
              <AlertTriangle className="mt-1 h-5 w-5 shrink-0" />
              <div>
                <h2 className="font-black">
                  Your period may be late by about {intelligence.lateBy} day{intelligence.lateBy === 1 ? "" : "s"}.
                </h2>
                <p className="mt-1 text-sm leading-6">
                  This is an estimate, not a diagnosis. Stress, sleep, travel, illness, medication changes,
                  PCOS, and pregnancy can affect timing. If pregnancy is possible or irregularity repeats,
                  consider a test or a healthcare professional.
                </p>
              </div>
            </div>
          </Card>
        )}

        <div className="grid gap-5 lg:grid-cols-[0.95fr_1.05fr]">
          <Card className="border-[#F6C6D7] bg-white/80 p-6 shadow-sm">
            <h2 className="text-2xl font-black">Cycle check-in</h2>

            <div className="mt-6 space-y-7">
              <div className="space-y-2">
                <Label>Today / check-in date</Label>
                <Input type="date" value={date} onChange={(event) => setDate(event.target.value)} />
              </div>

              <div className="space-y-2">
                <Label>When did your last real period start?</Label>
                <Input
                  type="date"
                  value={lastPeriodStart}
                  onChange={(event) => setLastPeriodStart(event.target.value)}
                />
              </div>

              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <Label>Usual period length</Label>
                  <Input
                    type="number"
                    min="1"
                    max="12"
                    value={usualPeriodLength}
                    onChange={(event) => setUsualPeriodLength(Number(event.target.value))}
                  />
                </div>

                <div className="space-y-2">
                  <Label>Usual cycle length</Label>
                  <Input
                    type="number"
                    min="18"
                    max="45"
                    value={usualCycleLength}
                    onChange={(event) => setUsualCycleLength(Number(event.target.value))}
                  />
                </div>
              </div>

              <div>
                <Label>Did your period start?</Label>
                <div className="mt-3 flex flex-wrap gap-2">
                  {statuses.map((item) => (
                    <Chip key={item.value} active={status === item.value} onClick={() => setStatus(item.value)}>
                      {item.label}
                    </Chip>
                  ))}
                </div>
              </div>

              {status === "period_started" && (
                <div>
                  <Label>Flow</Label>
                  <div className="mt-3 flex flex-wrap gap-2">
                    {flows.map((item) => (
                      <Chip key={item} active={flow === item} onClick={() => setFlow(item)}>
                        {item}
                      </Chip>
                    ))}
                  </div>
                </div>
              )}

              <div>
                <Label>{status === "period_started" ? "Symptoms this period" : "Symptoms today"}</Label>
                <div className="mt-3 flex flex-wrap gap-2">
                  {symptomsList.map((symptom) => (
                    <Chip
                      key={symptom}
                      active={symptoms.includes(symptom)}
                      onClick={() => setSymptoms(toggleItem(symptoms, symptom))}
                    >
                      {symptom}
                    </Chip>
                  ))}
                </div>
              </div>

              <div className="space-y-2">
                <Label>Optional context</Label>
                <Textarea
                  value={note}
                  onChange={(event) => setNote(event.target.value)}
                  placeholder={
                    status === "not_started"
                      ? "Example: Expected it yesterday, still no bleeding."
                      : status === "spotting"
                        ? "Example: Spotting only, no full flow yet."
                        : "Example: Period started this morning."
                  }
                />
              </div>

              <Button onClick={saveEvent} className="w-full bg-[#EC3A7A] text-white hover:bg-[#d82f6d]">
                <Plus className="mr-2 h-4 w-4" />
                Save cycle check-in
              </Button>
            </div>
          </Card>

          <div className="space-y-5">
            <Card className="border-[#F6C6D7] bg-[#26111D] p-6 text-white shadow-sm">
              <div className="flex items-start justify-between gap-5">
                <div>
                  <p className="font-bold text-[#F48FB1]">Estimated current status</p>
                  <h2 className="mt-2 text-5xl font-black">{intelligence.phase}</h2>
                </div>
                <Sparkles className="h-8 w-8 text-[#F48FB1]" />
              </div>

              <div className="mt-6 grid gap-3 md:grid-cols-3">
                <div className="rounded-2xl bg-white/10 p-4">
                  <p className="text-sm text-white/60">Cycle day</p>
                  <p className="text-2xl font-black">{intelligence.cycleDay}</p>
                </div>
                <div className="rounded-2xl bg-white/10 p-4">
                  <p className="text-sm text-white/60">Expected period</p>
                  <p className="text-2xl font-black">{intelligence.expectedPeriod}</p>
                </div>
                <div className="rounded-2xl bg-white/10 p-4">
                  <p className="text-sm text-white/60">Productivity</p>
                  <p className="text-2xl font-black">{intelligence.plan.score}%</p>
                </div>
              </div>

              <div className="mt-6 rounded-2xl bg-white/10 p-5">
                <p className="text-sm text-white/60">Recommended mode</p>
                <h3 className="mt-1 text-3xl font-black">{intelligence.plan.mode}</h3>
                <p className="mt-3 leading-7 text-white/75">{intelligence.plan.description}</p>
              </div>

              <div className="mt-5 grid gap-3 md:grid-cols-2">
                {intelligence.plan.tasks.map((task) => (
                  <div key={task} className="rounded-2xl bg-white/10 p-4 font-semibold text-white/85">
                    {task}
                  </div>
                ))}
              </div>
            </Card>

            <Card className="border-[#F6C6D7] bg-white/80 p-6 shadow-sm">
              <div className="mb-5 flex items-center gap-2">
                <CalendarDays className="h-5 w-5 text-[#EC3A7A]" />
                <h2 className="text-2xl font-black">Period history</h2>
              </div>

              <div className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={chartData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="cycle" />
                    <YAxis />
                    <Tooltip />
                    <Bar dataKey="cycleLength" fill="#EC3A7A" radius={[12, 12, 0, 0]} />
                    <Bar dataKey="periodLength" fill="#1E9CD7" radius={[12, 12, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </Card>

            <Card className="border-[#F6C6D7] bg-white/80 p-6 shadow-sm">
              <div className="mb-5 flex items-center justify-between">
                <h2 className="text-2xl font-black">Saved cycle check-ins</h2>
                <Badge className="bg-[#FFF0F5] text-[#EC3A7A] hover:bg-[#FFF0F5]">
                  {events.length} logs
                </Badge>
              </div>

              <div className="space-y-3">
                {events.length === 0 ? (
                  <div className="rounded-2xl border border-dashed border-[#F6C6D7] p-8 text-center text-[#6F4B5D]">
                    No cycle check-ins yet.
                  </div>
                ) : (
                  events.map((event) => (
                    <div key={event.id} className="rounded-2xl border border-[#F6C6D7] bg-[#FFF7FA] p-4">
                      <div className="flex items-start justify-between gap-3">
                        <div>
                          <p className="font-black">
                            {event.date} •{" "}
                            {event.status === "period_started"
                              ? "Period started"
                              : event.status === "spotting"
                                ? "Spotting only"
                                : "Not started"}
                          </p>
                          <p className="mt-1 text-sm text-[#6F4B5D]">
                            Last real period: {event.lastPeriodStart} • {event.usualCycleLength} day cycle
                            {event.flow ? ` • ${event.flow} flow` : ""}
                          </p>
                          <p className="mt-2 text-sm">Symptoms: {event.symptoms.join(", ")}</p>
                          {event.note && <p className="mt-2 text-sm text-[#6F4B5D]">{event.note}</p>}
                        </div>

                        <Button variant="ghost" size="icon" onClick={() => deleteEvent(event.id)}>
                          <Trash2 className="h-4 w-4 text-[#F15A24]" />
                        </Button>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </Card>

            <p className="text-xs leading-5 text-[#6F4B5D]">
              HerCatalyst gives educational estimates only. It does not diagnose, treat, or replace medical advice.
            </p>
          </div>
        </div>
      </section>
    </main>
  );
}