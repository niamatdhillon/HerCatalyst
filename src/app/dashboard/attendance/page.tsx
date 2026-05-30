"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { ArrowLeft, GraduationCap, Plus, Trash2 } from "lucide-react";
import { Bar, BarChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Progress } from "@/components/ui/progress";

type Subject = {
  id: string;
  name: string;
  held: number;
  attended: number;
};

const REQUIRED_PERCENT = 75;

function attendancePercent(attended: number, held: number) {
  if (held === 0) return 0;
  return Math.round((attended / held) * 100);
}

function classesCanMiss(attended: number, held: number) {
  let missable = 0;
  while ((attended / (held + missable + 1)) * 100 >= REQUIRED_PERCENT) {
    missable += 1;
  }
  return missable;
}

function classesNeeded(attended: number, held: number) {
  let needed = 0;
  while (((attended + needed) / (held + needed)) * 100 < REQUIRED_PERCENT) {
    needed += 1;
    if (needed > 200) break;
  }
  return needed;
}

export default function AttendancePage() {
  const [subjects, setSubjects] = useState<Subject[]>([]);
  const [name, setName] = useState("");
  const [held, setHeld] = useState("");
  const [attended, setAttended] = useState("");

  useEffect(() => {
    const saved = localStorage.getItem("hercatalyst_attendance_subjects");
    if (saved) setSubjects(JSON.parse(saved));
  }, []);

  useEffect(() => {
    localStorage.setItem("hercatalyst_attendance_subjects", JSON.stringify(subjects));
  }, [subjects]);

  function addSubject() {
    const heldNumber = Number(held);
    const attendedNumber = Number(attended);

    if (!name.trim() || heldNumber < 0 || attendedNumber < 0 || attendedNumber > heldNumber) return;

    const subject: Subject = {
      id: crypto.randomUUID(),
      name: name.trim(),
      held: heldNumber,
      attended: attendedNumber,
    };

    setSubjects([subject, ...subjects]);
    setName("");
    setHeld("");
    setAttended("");
  }

  function deleteSubject(id: string) {
    setSubjects(subjects.filter((subject) => subject.id !== id));
  }

  function markAttended(id: string) {
    setSubjects(
      subjects.map((subject) =>
        subject.id === id
          ? { ...subject, held: subject.held + 1, attended: subject.attended + 1 }
          : subject
      )
    );
  }

  function markMissed(id: string) {
    setSubjects(
      subjects.map((subject) =>
        subject.id === id ? { ...subject, held: subject.held + 1 } : subject
      )
    );
  }

  const summary = useMemo(() => {
    const totalHeld = subjects.reduce((sum, subject) => sum + subject.held, 0);
    const totalAttended = subjects.reduce((sum, subject) => sum + subject.attended, 0);
    const overall = attendancePercent(totalAttended, totalHeld);

    return {
      totalHeld,
      totalAttended,
      overall,
      risky: subjects.filter((subject) => attendancePercent(subject.attended, subject.held) < REQUIRED_PERCENT).length,
    };
  }, [subjects]);

  const chartData = subjects.map((subject) => ({
    subject: subject.name,
    percent: attendancePercent(subject.attended, subject.held),
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
            <GraduationCap className="h-7 w-7" />
          </div>

          <h1 className="text-4xl font-black md:text-6xl">Attendance Guardian</h1>

          <p className="mt-3 max-w-3xl text-[#6F4B5D]">
            Track attendance by subject and know exactly whether you are safe, how many classes you can miss,
            or how many you need to attend to recover.
          </p>
        </div>

        <div className="mb-5 grid gap-4 md:grid-cols-4">
          <Card className="border-[#F6C6D7] bg-white/80 p-5">
            <p className="text-sm font-bold text-[#EC3A7A]">Overall attendance</p>
            <h2 className="mt-2 text-3xl font-black">{summary.overall}%</h2>
          </Card>

          <Card className="border-[#F6C6D7] bg-white/80 p-5">
            <p className="text-sm font-bold text-[#EC3A7A]">Classes held</p>
            <h2 className="mt-2 text-3xl font-black">{summary.totalHeld}</h2>
          </Card>

          <Card className="border-[#F6C6D7] bg-white/80 p-5">
            <p className="text-sm font-bold text-[#EC3A7A]">Classes attended</p>
            <h2 className="mt-2 text-3xl font-black">{summary.totalAttended}</h2>
          </Card>

          <Card className="border-[#F6C6D7] bg-[#26111D] p-5 text-white">
            <p className="text-sm font-bold text-[#F48FB1]">Risk subjects</p>
            <h2 className="mt-2 text-3xl font-black">{summary.risky}</h2>
          </Card>
        </div>

        <div className="grid gap-5 lg:grid-cols-[0.82fr_1.18fr]">
          <Card className="border-[#F6C6D7] bg-white/80 p-6 shadow-sm">
            <h2 className="text-2xl font-black">Add subject</h2>

            <div className="mt-6 space-y-5">
              <div className="space-y-2">
                <Label>Subject</Label>
                <Input value={name} onChange={(event) => setName(event.target.value)} placeholder="Data Structures" />
              </div>

              <div className="space-y-2">
                <Label>Classes held</Label>
                <Input type="number" min="0" value={held} onChange={(event) => setHeld(event.target.value)} placeholder="20" />
              </div>

              <div className="space-y-2">
                <Label>Classes attended</Label>
                <Input type="number" min="0" value={attended} onChange={(event) => setAttended(event.target.value)} placeholder="17" />
              </div>

              <Button onClick={addSubject} className="w-full bg-[#EC3A7A] text-white hover:bg-[#d82f6d]">
                <Plus className="mr-2 h-4 w-4" />
                Add subject
              </Button>
            </div>
          </Card>

          <div className="space-y-5">
            <Card className="border-[#F6C6D7] bg-white/80 p-6 shadow-sm">
              <h2 className="mb-5 text-2xl font-black">Attendance chart</h2>

              <div className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={chartData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="subject" />
                    <YAxis domain={[0, 100]} />
                    <Tooltip />
                    <Bar dataKey="percent" fill="#EC3A7A" radius={[12, 12, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </Card>

            <Card className="border-[#F6C6D7] bg-white/80 p-6 shadow-sm">
              <div className="mb-5 flex items-center justify-between">
                <h2 className="text-2xl font-black">Subjects</h2>
                <Badge className="bg-[#FFF0F5] text-[#EC3A7A] hover:bg-[#FFF0F5]">
                  Required: {REQUIRED_PERCENT}%
                </Badge>
              </div>

              <div className="space-y-3">
                {subjects.length === 0 ? (
                  <div className="rounded-2xl border border-dashed border-[#F6C6D7] p-8 text-center text-[#6F4B5D]">
                    No subjects yet.
                  </div>
                ) : (
                  subjects.map((subject) => {
                    const percent = attendancePercent(subject.attended, subject.held);
                    const safe = percent >= REQUIRED_PERCENT;
                    const missable = classesCanMiss(subject.attended, subject.held);
                    const needed = classesNeeded(subject.attended, subject.held);

                    return (
                      <div key={subject.id} className="rounded-2xl border border-[#F6C6D7] bg-[#FFF7FA] p-4">
                        <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
                          <div className="flex-1">
                            <div className="flex flex-wrap items-center gap-2">
                              <h3 className="text-lg font-black">{subject.name}</h3>
                              <Badge className={safe ? "bg-[#E9FFF5] text-[#047857]" : "bg-[#FFF0F5] text-[#EC3A7A]"}>
                                {safe ? "Safe" : "At risk"}
                              </Badge>
                            </div>

                            <p className="mt-1 text-sm text-[#6F4B5D]">
                              {subject.attended}/{subject.held} classes attended
                            </p>

                            <div className="mt-4">
                              <Progress value={percent} />
                            </div>

                            <p className="mt-3 text-sm font-semibold text-[#6F4B5D]">
                              {safe
                                ? `You can miss about ${missable} more class${missable === 1 ? "" : "es"} and stay above 75%.`
                                : `Attend the next ${needed} class${needed === 1 ? "" : "es"} to recover to 75%.`}
                            </p>
                          </div>

                          <div className="flex flex-wrap gap-2">
                            <Button variant="outline" size="sm" onClick={() => markAttended(subject.id)}>
                              Attended
                            </Button>
                            <Button variant="outline" size="sm" onClick={() => markMissed(subject.id)}>
                              Missed
                            </Button>
                            <Button variant="ghost" size="icon" onClick={() => deleteSubject(subject.id)}>
                              <Trash2 className="h-4 w-4 text-[#F15A24]" />
                            </Button>
                          </div>
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