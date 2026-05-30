"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { ArrowLeft, Brain, HeartPulse, Plus, Sparkles, Trash2 } from "lucide-react";
import { Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

type CheckInLog = {
  id: string;
  date: string;
  sleep: number;
  wakeState: string;
  hydration: string;
  meals: string;
  focusState: string;
  emotionalState: string[];
  symptoms: string[];
  workload: string;
  cyclePhase: string;
  note: string;
  readiness: number;
  moodClimate: string;
  stressLoad: string;
  energyBattery: string;
  studyMode: string;
  reasons: string[];
};

const wakeStates = ["Refreshed", "Okay", "Tired", "Exhausted"];
const hydrationStates = ["Hydrated", "Some water", "Barely drank water"];
const mealStates = ["Ate well", "Skipped one meal", "Barely ate"];
const focusStates = ["Deep focus", "Normal focus", "Distracted", "Brain fog", "Avoiding work"];
const emotionalStates = ["Calm", "Motivated", "Anxious", "Irritable", "Sad", "Overwhelmed", "Sensitive"];
const symptomOptions = ["Cramps", "Headache", "Back pain", "Bloating", "Nausea", "Heavy body", "Restless", "None"];
const workloads = ["Light", "Normal", "High", "Deadline storm"];
const cyclePhases = ["Not sure", "Menstrual", "Follicular", "Ovulation", "Luteal"];

function toggleItem(list: string[], item: string) {
  if (item === "None") return list.includes("None") ? [] : ["None"];

  const cleanList = list.filter((value) => value !== "None");
  return cleanList.includes(item) ? cleanList.filter((value) => value !== item) : [...cleanList, item];
}

function calculateInsight(input: {
  sleep: number;
  wakeState: string;
  hydration: string;
  meals: string;
  focusState: string;
  emotionalState: string[];
  symptoms: string[];
  workload: string;
  cyclePhase: string;
}) {
  let readiness = 82;
  const reasons: string[] = [];

  if (input.sleep < 5.5) {
    readiness -= 18;
    reasons.push("Sleep was below 5.5 hours, so recovery may be limited.");
  } else if (input.sleep < 7) {
    readiness -= 8;
    reasons.push("Sleep was under 7 hours, so focus may need shorter blocks.");
  } else {
    readiness += 5;
    reasons.push("Sleep is supporting recovery today.");
  }

  if (input.wakeState === "Tired") {
    readiness -= 8;
    reasons.push("You woke up tired.");
  }

  if (input.wakeState === "Exhausted") {
    readiness -= 16;
    reasons.push("You woke up exhausted, which usually lowers energy capacity.");
  }

  if (input.hydration === "Barely drank water") {
    readiness -= 8;
    reasons.push("Low hydration can affect headache risk and concentration.");
  }

  if (input.meals === "Skipped one meal") {
    readiness -= 6;
    reasons.push("Skipping a meal can make energy less stable.");
  }

  if (input.meals === "Barely ate") {
    readiness -= 12;
    reasons.push("Very low food intake can reduce stamina and emotional regulation.");
  }

  if (input.focusState === "Brain fog") {
    readiness -= 14;
    reasons.push("Brain fog suggests deep work may feel harder right now.");
  }

  if (input.focusState === "Avoiding work") {
    readiness -= 10;
    reasons.push("Avoidance can signal cognitive overload or low task clarity.");
  }

  if (input.focusState === "Deep focus") {
    readiness += 8;
    reasons.push("Deep focus is available, so this may be a strong work window.");
  }

  const highStressEmotions = input.emotionalState.filter((state) =>
    ["Anxious", "Irritable", "Overwhelmed", "Sensitive"].includes(state)
  );

  if (highStressEmotions.length >= 2) {
    readiness -= 10;
    reasons.push("Multiple high-load emotional signals were selected.");
  }

  const symptomCount = input.symptoms.filter((symptom) => symptom !== "None").length;
  if (symptomCount >= 3) {
    readiness -= 12;
    reasons.push("Several body symptoms are present today.");
  } else if (symptomCount > 0) {
    readiness -= 6;
    reasons.push("Body symptoms may require a gentler plan.");
  }

  if (input.workload === "High") {
    readiness -= 6;
    reasons.push("Workload is high, so pacing matters.");
  }

  if (input.workload === "Deadline storm") {
    readiness -= 14;
    reasons.push("Deadline pressure is high, which raises stress load.");
  }

  if (input.cyclePhase === "Menstrual") {
    readiness -= 6;
    reasons.push("Menstrual phase may call for recovery-aware planning.");
  }

  if (input.cyclePhase === "Luteal") {
    readiness -= 4;
    reasons.push("Luteal phase can make planning and emotional pacing more important.");
  }

  readiness = Math.max(12, Math.min(98, readiness));

  const moodClimate =
    input.emotionalState.includes("Motivated") || input.emotionalState.includes("Calm")
      ? "steady"
      : highStressEmotions.length >= 2
        ? "activated"
        : input.emotionalState.includes("Sad")
          ? "low"
          : "mixed";

  const stressLoad =
    input.workload === "Deadline storm" || highStressEmotions.length >= 2
      ? "elevated"
      : input.workload === "High" || input.focusState === "Avoiding work"
        ? "moderate"
        : "light";

  const energyBattery =
    readiness >= 80
      ? "high"
      : readiness >= 60
        ? "medium"
        : readiness >= 40
          ? "low"
          : "recovery mode";

  const studyMode =
    readiness >= 80
      ? "Deep work: use this window for your hardest STEM task."
      : readiness >= 60
        ? "Steady blocks: use 35-minute focus sessions with short resets."
        : readiness >= 40
          ? "Short bursts: use 20-minute low-friction tasks and protect breaks."
          : "Recovery-aware: prioritize essentials, review, hydration, and support.";

  return {
    readiness,
    moodClimate,
    stressLoad,
    energyBattery,
    studyMode,
    reasons,
  };
}

function Chip({
  active,
  children,
  onClick,
}: {
  active: boolean;
  children: React.ReactNode;
  onClick: () => void;
}) {
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

export default function WellnessPage() {
  const [logs, setLogs] = useState<CheckInLog[]>([]);
  const [date, setDate] = useState(new Date().toISOString().slice(0, 10));
  const [sleep, setSleep] = useState(7);
  const [wakeState, setWakeState] = useState("Okay");
  const [hydration, setHydration] = useState("Some water");
  const [meals, setMeals] = useState("Ate well");
  const [focusState, setFocusState] = useState("Normal focus");
  const [emotionalState, setEmotionalState] = useState<string[]>(["Calm"]);
  const [symptoms, setSymptoms] = useState<string[]>(["None"]);
  const [workload, setWorkload] = useState("Normal");
  const [cyclePhase, setCyclePhase] = useState("Not sure");
  const [note, setNote] = useState("");

  useEffect(() => {
    const saved = localStorage.getItem("hercatalyst_checkin_logs");
    if (saved) setLogs(JSON.parse(saved));
  }, []);

  useEffect(() => {
    localStorage.setItem("hercatalyst_checkin_logs", JSON.stringify(logs));
  }, [logs]);

  const insight = useMemo(
    () =>
      calculateInsight({
        sleep,
        wakeState,
        hydration,
        meals,
        focusState,
        emotionalState,
        symptoms,
        workload,
        cyclePhase,
      }),
    [sleep, wakeState, hydration, meals, focusState, emotionalState, symptoms, workload, cyclePhase]
  );

  function saveLog() {
    const log: CheckInLog = {
      id: crypto.randomUUID(),
      date,
      sleep,
      wakeState,
      hydration,
      meals,
      focusState,
      emotionalState,
      symptoms,
      workload,
      cyclePhase,
      note,
      ...insight,
    };

    setLogs([log, ...logs]);
    setNote("");
  }

  function deleteLog(id: string) {
    setLogs(logs.filter((log) => log.id !== id));
  }

  const chartData = [...logs]
    .reverse()
    .slice(-10)
    .map((log) => ({
      date: log.date.slice(5),
      readiness: log.readiness,
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
          <h1 className="text-4xl font-black md:text-6xl">Check-In Engine</h1>
          <p className="mt-3 max-w-3xl text-[#6F4B5D]">
            Instead of asking you to guess a mood score, HerCatalyst reads real-life signals and
            converts them into readiness, stress, energy, and study guidance.
          </p>
        </div>

        <div className="grid gap-5 lg:grid-cols-[0.95fr_1.05fr]">
          <Card className="border-[#F6C6D7] bg-white/80 p-6 shadow-sm">
            <h2 className="text-2xl font-black">Today’s signals</h2>

            <div className="mt-6 space-y-7">
              <div className="space-y-2">
                <Label>Date</Label>
                <Input type="date" value={date} onChange={(event) => setDate(event.target.value)} />
              </div>

              <div className="space-y-2">
                <Label>Sleep hours</Label>
                <Input
                  type="number"
                  min="0"
                  max="14"
                  step="0.5"
                  value={sleep}
                  onChange={(event) => setSleep(Number(event.target.value))}
                />
              </div>

              <div>
                <Label>How did you wake up?</Label>
                <div className="mt-3 flex flex-wrap gap-2">
                  {wakeStates.map((state) => (
                    <Chip key={state} active={wakeState === state} onClick={() => setWakeState(state)}>
                      {state}
                    </Chip>
                  ))}
                </div>
              </div>

              <div>
                <Label>Hydration</Label>
                <div className="mt-3 flex flex-wrap gap-2">
                  {hydrationStates.map((state) => (
                    <Chip key={state} active={hydration === state} onClick={() => setHydration(state)}>
                      {state}
                    </Chip>
                  ))}
                </div>
              </div>

              <div>
                <Label>Meals</Label>
                <div className="mt-3 flex flex-wrap gap-2">
                  {mealStates.map((state) => (
                    <Chip key={state} active={meals === state} onClick={() => setMeals(state)}>
                      {state}
                    </Chip>
                  ))}
                </div>
              </div>

              <div>
                <Label>Focus state</Label>
                <div className="mt-3 flex flex-wrap gap-2">
                  {focusStates.map((state) => (
                    <Chip key={state} active={focusState === state} onClick={() => setFocusState(state)}>
                      {state}
                    </Chip>
                  ))}
                </div>
              </div>

              <div>
                <Label>Emotional signals</Label>
                <div className="mt-3 flex flex-wrap gap-2">
                  {emotionalStates.map((state) => (
                    <Chip
                      key={state}
                      active={emotionalState.includes(state)}
                      onClick={() => setEmotionalState(toggleItem(emotionalState, state))}
                    >
                      {state}
                    </Chip>
                  ))}
                </div>
              </div>

              <div>
                <Label>Body signals</Label>
                <div className="mt-3 flex flex-wrap gap-2">
                  {symptomOptions.map((symptom) => (
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

              <div>
                <Label>Academic load</Label>
                <div className="mt-3 flex flex-wrap gap-2">
                  {workloads.map((state) => (
                    <Chip key={state} active={workload === state} onClick={() => setWorkload(state)}>
                      {state}
                    </Chip>
                  ))}
                </div>
              </div>

              <div>
                <Label>Cycle phase</Label>
                <div className="mt-3 flex flex-wrap gap-2">
                  {cyclePhases.map((phase) => (
                    <Chip key={phase} active={cyclePhase === phase} onClick={() => setCyclePhase(phase)}>
                      {phase}
                    </Chip>
                  ))}
                </div>
              </div>

              <div className="space-y-2">
                <Label>Optional context</Label>
                <Textarea
                  value={note}
                  onChange={(event) => setNote(event.target.value)}
                  placeholder="Anything unusual today?"
                />
              </div>

              <Button onClick={saveLog} className="w-full bg-[#EC3A7A] text-white hover:bg-[#d82f6d]">
                <Plus className="mr-2 h-4 w-4" />
                Save interpreted check-in
              </Button>
            </div>
          </Card>

          <div className="space-y-5">
            <Card className="border-[#F6C6D7] bg-[#26111D] p-6 text-white shadow-sm">
              <div className="flex items-start justify-between gap-5">
                <div>
                  <p className="font-bold text-[#F48FB1]">Generated readiness</p>
                  <h2 className="mt-2 text-6xl font-black">{insight.readiness}%</h2>
                </div>
                <Sparkles className="h-8 w-8 text-[#F48FB1]" />
              </div>

              <div className="mt-6 grid gap-3 md:grid-cols-3">
                <div className="rounded-2xl bg-white/10 p-4">
                  <p className="text-sm text-white/60">Mood climate</p>
                  <p className="text-xl font-black capitalize">{insight.moodClimate}</p>
                </div>
                <div className="rounded-2xl bg-white/10 p-4">
                  <p className="text-sm text-white/60">Stress load</p>
                  <p className="text-xl font-black capitalize">{insight.stressLoad}</p>
                </div>
                <div className="rounded-2xl bg-white/10 p-4">
                  <p className="text-sm text-white/60">Energy battery</p>
                  <p className="text-xl font-black capitalize">{insight.energyBattery}</p>
                </div>
              </div>

              <div className="mt-6 rounded-2xl bg-white/10 p-5">
                <div className="mb-2 flex items-center gap-2 font-black text-[#F48FB1]">
                  <Brain className="h-5 w-5" />
                  Recommended study mode
                </div>
                <p className="leading-7 text-white/80">{insight.studyMode}</p>
              </div>
            </Card>

            <Card className="border-[#F6C6D7] bg-white/80 p-6 shadow-sm">
              <h2 className="text-2xl font-black">Why HerCatalyst thinks this</h2>
              <div className="mt-4 space-y-2">
                {insight.reasons.map((reason) => (
                  <div key={reason} className="rounded-2xl bg-[#FFF0F5] px-4 py-3 text-sm font-semibold text-[#6F4B5D]">
                    {reason}
                  </div>
                ))}
              </div>
            </Card>

            <Card className="border-[#F6C6D7] bg-white/80 p-6 shadow-sm">
              <h2 className="mb-5 text-2xl font-black">Readiness trend</h2>
              <div className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={chartData}>
                    <XAxis dataKey="date" />
                    <YAxis domain={[0, 100]} />
                    <Tooltip />
                    <Line type="monotone" dataKey="readiness" stroke="#EC3A7A" strokeWidth={3} />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </Card>

            <Card className="border-[#F6C6D7] bg-white/80 p-6 shadow-sm">
              <div className="mb-5 flex items-center justify-between">
                <h2 className="text-2xl font-black">Saved check-ins</h2>
                <Badge className="bg-[#FFF0F5] text-[#EC3A7A] hover:bg-[#FFF0F5]">
                  {logs.length} logs
                </Badge>
              </div>

              <div className="space-y-3">
                {logs.length === 0 ? (
                  <div className="rounded-2xl border border-dashed border-[#F6C6D7] p-8 text-center text-[#6F4B5D]">
                    No check-ins saved yet.
                  </div>
                ) : (
                  logs.map((log) => (
                    <div key={log.id} className="rounded-2xl border border-[#F6C6D7] bg-[#FFF7FA] p-4">
                      <div className="flex items-start justify-between gap-3">
                        <div>
                          <p className="font-black">
                            {log.date} • {log.readiness}% readiness
                          </p>
                          <p className="mt-1 text-sm text-[#6F4B5D]">
                            {log.wakeState} • {log.focusState} • {log.workload} load • {log.cyclePhase}
                          </p>
                          <p className="mt-2 text-sm">
                            Mood {log.moodClimate}, stress {log.stressLoad}, energy {log.energyBattery}
                          </p>
                          {log.note && <p className="mt-2 text-sm text-[#6F4B5D]">{log.note}</p>}
                        </div>

                        <Button variant="ghost" size="icon" onClick={() => deleteLog(log.id)}>
                          <Trash2 className="h-4 w-4 text-[#F15A24]" />
                        </Button>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </Card>
          </div>
        </div>
      </section>
    </main>
  );
}