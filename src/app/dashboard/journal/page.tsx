"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { ArrowLeft, BookHeart, CalendarDays, Plus, Trash2 } from "lucide-react";
import { Bar, BarChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

type PulseEntry = {
  id: string;
  date: string;
  vibe: string;
  tags: string[];
  note: string;
  win: string;
  drained: string;
  helped: string;
};

const vibes = [
  { label: "Glowing", emoji: "✨", color: "#F7931E", score: 5 },
  { label: "Steady", emoji: "🌸", color: "#EC3A7A", score: 4 },
  { label: "Tired", emoji: "🌙", color: "#1E9CD7", score: 3 },
  { label: "Stressed", emoji: "🔥", color: "#F15A24", score: 2 },
  { label: "Low", emoji: "🫧", color: "#0D47A1", score: 1 },
  { label: "Chaotic", emoji: "⚡", color: "#8B5CF6", score: 2 },
];

const tags = [
  "Studied",
  "Deep focus",
  "Deadline",
  "Skipped class",
  "Socialized",
  "Exercised",
  "Good food",
  "Low sleep",
  "Cried",
  "Period symptoms",
  "Family call",
  "Mentor talk",
  "Anxious",
  "Cleaned room",
  "Went out",
];

function toggleItem(list: string[], item: string) {
  return list.includes(item) ? list.filter((value) => value !== item) : [...list, item];
}

function getVibe(label: string) {
  return vibes.find((vibe) => vibe.label === label) || vibes[1];
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

export default function JournalPage() {
  const [entries, setEntries] = useState<PulseEntry[]>([]);
  const [date, setDate] = useState(new Date().toISOString().slice(0, 10));
  const [vibe, setVibe] = useState("Steady");
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [note, setNote] = useState("");
  const [win, setWin] = useState("");
  const [drained, setDrained] = useState("");
  const [helped, setHelped] = useState("");

  useEffect(() => {
    const saved = localStorage.getItem("hercatalyst_daily_pulse");
    if (saved) setEntries(JSON.parse(saved));
  }, []);

  useEffect(() => {
    localStorage.setItem("hercatalyst_daily_pulse", JSON.stringify(entries));
  }, [entries]);

  function saveEntry() {
    const entry: PulseEntry = {
      id: crypto.randomUUID(),
      date,
      vibe,
      tags: selectedTags,
      note,
      win,
      drained,
      helped,
    };

    setEntries([entry, ...entries]);
    setSelectedTags([]);
    setNote("");
    setWin("");
    setDrained("");
    setHelped("");
  }

  function deleteEntry(id: string) {
    setEntries(entries.filter((entry) => entry.id !== id));
  }

  const calendarDays = useMemo(() => {
    const today = new Date();
    return Array.from({ length: 28 }).map((_, index) => {
      const dateObject = new Date(today);
      dateObject.setDate(today.getDate() - (27 - index));
      const day = dateObject.toISOString().slice(0, 10);
      const entry = entries.find((item) => item.date === day);
      return { day, entry };
    });
  }, [entries]);

  const vibeChart = useMemo(() => {
    return vibes.map((item) => ({
      vibe: item.label,
      count: entries.filter((entry) => entry.vibe === item.label).length,
    }));
  }, [entries]);

  const insight = useMemo(() => {
    if (entries.length < 2) return "Log a few days to unlock pattern insights.";

    const lowSleepDays = entries.filter((entry) => entry.tags.includes("Low sleep"));
    const stressedDays = entries.filter((entry) => entry.vibe === "Stressed" || entry.tags.includes("Anxious"));
    const focusDays = entries.filter((entry) => entry.tags.includes("Deep focus"));

    if (lowSleepDays.length >= 2) return "Low sleep is appearing repeatedly. Protecting sleep may improve focus and mood climate.";
    if (stressedDays.length >= 2) return "Stress signals are repeating. Try smaller task blocks and earlier deadline planning.";
    if (focusDays.length >= 2) return "Deep focus is showing up. Notice what conditions helped those days.";
    return "Your entries are building a useful emotional pattern map.";
  }, [entries]);

  const selectedVibe = getVibe(vibe);

  return (
    <main className="min-h-screen bg-[#FFF7FA] px-6 py-6 text-[#26111D] md:px-10">
      <Link href="/dashboard" className="inline-flex items-center gap-2 font-bold text-[#EC3A7A]">
        <ArrowLeft className="h-4 w-4" />
        Back to dashboard
      </Link>

      <section className="mx-auto mt-8 max-w-7xl">
        <div className="mb-8">
          <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-[#EC3A7A] text-white">
            <BookHeart className="h-7 w-7" />
          </div>

          <h1 className="text-4xl font-black md:text-6xl">Daily Pulse</h1>

          <p className="mt-3 max-w-3xl text-[#6F4B5D]">
            A DailyBean-inspired tap journal for tiny check-ins, emotional patterns, wins, and what helped you.
          </p>
        </div>

        <div className="grid gap-5 lg:grid-cols-[0.9fr_1.1fr]">
          <Card className="border-[#F6C6D7] bg-white/80 p-6 shadow-sm">
            <h2 className="text-2xl font-black">Today’s pulse</h2>

            <div className="mt-6 space-y-7">
              <div className="space-y-2">
                <Label>Date</Label>
                <Input type="date" value={date} onChange={(event) => setDate(event.target.value)} />
              </div>

              <div>
                <Label>Choose your vibe</Label>
                <div className="mt-3 grid grid-cols-2 gap-3 sm:grid-cols-3">
                  {vibes.map((item) => (
                    <button
                      key={item.label}
                      type="button"
                      onClick={() => setVibe(item.label)}
                      className={`rounded-3xl border p-4 text-left transition ${
                        vibe === item.label
                          ? "border-[#EC3A7A] bg-[#FFF0F5] shadow-lg shadow-[#EC3A7A]/15"
                          : "border-[#F6C6D7] bg-white hover:border-[#EC3A7A]/60"
                      }`}
                    >
                      <div className="text-3xl">{item.emoji}</div>
                      <div className="mt-2 font-black">{item.label}</div>
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <Label>Tags</Label>
                <div className="mt-3 flex flex-wrap gap-2">
                  {tags.map((tag) => (
                    <Chip key={tag} active={selectedTags.includes(tag)} onClick={() => setSelectedTags(toggleItem(selectedTags, tag))}>
                      {tag}
                    </Chip>
                  ))}
                </div>
              </div>

              <div className="space-y-2">
                <Label>One-line note</Label>
                <Textarea value={note} onChange={(event) => setNote(event.target.value)} placeholder="Today felt like..." />
              </div>

              <div className="space-y-2">
                <Label>Win of the day</Label>
                <Input value={win} onChange={(event) => setWin(event.target.value)} placeholder="I finished..." />
              </div>

              <div className="space-y-2">
                <Label>What drained me?</Label>
                <Input value={drained} onChange={(event) => setDrained(event.target.value)} placeholder="Deadline, conflict, low sleep..." />
              </div>

              <div className="space-y-2">
                <Label>What helped?</Label>
                <Input value={helped} onChange={(event) => setHelped(event.target.value)} placeholder="Walk, food, friend, music..." />
              </div>

              <Button onClick={saveEntry} className="w-full bg-[#EC3A7A] text-white hover:bg-[#d82f6d]">
                <Plus className="mr-2 h-4 w-4" />
                Save pulse
              </Button>
            </div>
          </Card>

          <div className="space-y-5">
            <Card className="border-[#F6C6D7] bg-[#26111D] p-6 text-white shadow-sm">
              <p className="font-bold text-[#F48FB1]">Today’s selected vibe</p>
              <div className="mt-4 flex items-center gap-4">
                <div className="flex h-20 w-20 items-center justify-center rounded-3xl text-5xl" style={{ backgroundColor: selectedVibe.color }}>
                  {selectedVibe.emoji}
                </div>
                <div>
                  <h2 className="text-4xl font-black">{selectedVibe.label}</h2>
                  <p className="mt-2 text-white/65">Your quick emotional weather for the day.</p>
                </div>
              </div>
            </Card>

            <Card className="border-[#F6C6D7] bg-white/80 p-6 shadow-sm">
              <div className="mb-5 flex items-center gap-2">
                <CalendarDays className="h-5 w-5 text-[#EC3A7A]" />
                <h2 className="text-2xl font-black">28-day pulse calendar</h2>
              </div>

              <div className="grid grid-cols-7 gap-2">
                {calendarDays.map(({ day, entry }) => {
                  const item = entry ? getVibe(entry.vibe) : null;

                  return (
                    <div
                      key={day}
                      className="flex aspect-square flex-col items-center justify-center rounded-2xl border border-[#F6C6D7] bg-white text-xs font-bold"
                      title={day}
                    >
                      <span className="text-lg">{item?.emoji || ""}</span>
                      <span className="text-[#6F4B5D]">{Number(day.slice(-2))}</span>
                    </div>
                  );
                })}
              </div>
            </Card>

            <Card className="border-[#F6C6D7] bg-white/80 p-6 shadow-sm">
              <h2 className="mb-5 text-2xl font-black">Vibe patterns</h2>
              <div className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={vibeChart}>
                    <XAxis dataKey="vibe" />
                    <YAxis allowDecimals={false} />
                    <Tooltip />
                    <Bar dataKey="count" fill="#EC3A7A" radius={[12, 12, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </Card>

            <Card className="border-[#F6C6D7] bg-white/80 p-6 shadow-sm">
              <p className="text-sm font-bold text-[#EC3A7A]">Pattern insight</p>
              <p className="mt-2 text-lg font-black">{insight}</p>
            </Card>

            <Card className="border-[#F6C6D7] bg-white/80 p-6 shadow-sm">
              <div className="mb-5 flex items-center justify-between">
                <h2 className="text-2xl font-black">Saved pulses</h2>
                <Badge className="bg-[#FFF0F5] text-[#EC3A7A] hover:bg-[#FFF0F5]">
                  {entries.length} entries
                </Badge>
              </div>

              <div className="space-y-3">
                {entries.length === 0 ? (
                  <div className="rounded-2xl border border-dashed border-[#F6C6D7] p-8 text-center text-[#6F4B5D]">
                    No journal entries yet.
                  </div>
                ) : (
                  entries.map((entry) => {
                    const item = getVibe(entry.vibe);

                    return (
                      <div key={entry.id} className="rounded-2xl border border-[#F6C6D7] bg-[#FFF7FA] p-4">
                        <div className="flex items-start justify-between gap-3">
                          <div>
                            <p className="font-black">
                              {item.emoji} {entry.date} • {entry.vibe}
                            </p>
                            <p className="mt-1 text-sm text-[#6F4B5D]">{entry.tags.join(", ") || "No tags"}</p>
                            {entry.note && <p className="mt-2 text-sm">{entry.note}</p>}
                            {entry.win && <p className="mt-2 text-sm text-[#047857]">Win: {entry.win}</p>}
                            {entry.drained && <p className="mt-2 text-sm text-[#B45309]">Drained: {entry.drained}</p>}
                            {entry.helped && <p className="mt-2 text-sm text-[#0D47A1]">Helped: {entry.helped}</p>}
                          </div>

                          <Button variant="ghost" size="icon" onClick={() => deleteEntry(entry.id)}>
                            <Trash2 className="h-4 w-4 text-[#F15A24]" />
                          </Button>
                        </div>
                      </div>
                    );
                  })
                )}
              </div>
            </Card>
          </div>
        </div>
      </section>
    </main>
  );
}