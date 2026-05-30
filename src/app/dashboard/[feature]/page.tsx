import Link from "next/link";
import { ArrowLeft, Sparkles } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

const copy: Record<string, { title: string; body: string; actions: string[] }> = {
  library: {
    title: "E-Library Hub",
    body: "A calm resource space for notes, PYQs, textbooks, research links, and study collections.",
    actions: ["Save resources", "Organize subjects", "Build study shelves"],
  },
  gamification: {
    title: "Study Gamification",
    body: "A motivation layer for streaks, badges, focus quests, and academic momentum.",
    actions: ["Earn streaks", "Unlock badges", "Track consistency"],
  },
  tutors: {
    title: "Tutor Connect",
    body: "Find peer mentors, book study support, and get unstuck faster.",
    actions: ["Find mentors", "Request support", "Match by subject"],
  },
  diet: {
    title: "Cycle-Synced Diet Planner",
    body: "Gentle food guidance based on energy, cycle signals, and student routine.",
    actions: ["Plan meals", "Support energy", "Track patterns"],
  },
  fitness: {
    title: "Fitness Windows",
    body: "Movement suggestions that adapt to cycle phase, sleep, and workload.",
    actions: ["Choose workout", "Protect recovery", "Track energy"],
  },
  medical: {
    title: "Medical Vault",
    body: "A private space for health notes, reports, medications, and clinic visits.",
    actions: ["Save notes", "Track reports", "Prepare appointments"],
  },
  shuttle: {
    title: "Shuttle Trace",
    body: "Campus mobility support for shuttle timing, safer routes, and location-aware planning.",
    actions: ["Check routes", "Save stops", "Plan return"],
  },
  writing: {
    title: "Writing Lab",
    body: "Support for essays, abstracts, research drafts, citations, and application writing.",
    actions: ["Draft better", "Review tone", "Structure ideas"],
  },
  focus: {
    title: "Focus Timers",
    body: "Soft sprint timers for deep work, recovery-aware studying, and deadline days.",
    actions: ["Start sprint", "Take reset", "Build rhythm"],
  },
  events: {
    title: "Event RSVP System",
    body: "Discover workshops, tech talks, club events, wellness sessions, and campus opportunities.",
    actions: ["Save events", "RSVP", "Track attendance"],
  },
  volunteer: {
    title: "Volunteer Portal",
    body: "Track service hours, social impact projects, campus volunteering, and leadership proof.",
    actions: ["Log hours", "Find projects", "Build proof"],
  },
  radio: {
    title: "Campus Radio",
    body: "Student stories, campus news, women-in-STEM conversations, and community audio.",
    actions: ["Browse shows", "Save episodes", "Submit ideas"],
  },
};

export default function FeaturePage({ params }: { params: { feature: string } }) {
  const feature = copy[params.feature] || {
    title: "HerCatalyst Feature",
    body: "A connected student tool designed to support ambition, wellbeing, safety, and growth.",
    actions: ["Explore", "Personalize", "Connect"],
  };

  return (
    <main className="relative min-h-screen overflow-hidden bg-[#F7F4EA] px-6 py-6 text-[#26111D] md:px-10">
      <div className="pointer-events-none fixed inset-0">
        <div className="absolute -left-20 top-20 h-80 w-80 rounded-full bg-[#FFE7FF]/80 blur-3xl" />
        <div className="absolute right-0 top-28 h-96 w-96 rounded-full bg-[#B2F9E7]/70 blur-3xl" />
        <div className="absolute bottom-0 left-1/3 h-96 w-96 rounded-full bg-[#BFC4FF]/70 blur-3xl" />
      </div>

      <Link href="/dashboard" className="relative z-10 inline-flex items-center gap-2 font-bold text-[#EC3A7A]">
        <ArrowLeft className="h-4 w-4" />
        Back to dashboard
      </Link>

      <section className="relative z-10 mx-auto mt-16 max-w-5xl">
        <Card className="border-white/70 bg-white/45 p-8 shadow-xl shadow-[#C0B9DD]/20 backdrop-blur-2xl md:p-12">
          <div className="mb-6 flex h-16 w-16 items-center justify-center rounded-3xl bg-[#EC3A7A] text-white">
            <Sparkles className="h-8 w-8" />
          </div>

          <p className="font-bold text-[#EC3A7A]">HerCatalyst ecosystem</p>
          <h1 className="mt-3 text-4xl font-black md:text-6xl">{feature.title}</h1>
          <p className="mt-5 max-w-3xl text-lg leading-8 text-[#6F4B5D]">{feature.body}</p>

          <div className="mt-8 grid gap-3 md:grid-cols-3">
            {feature.actions.map((action) => (
              <div key={action} className="rounded-2xl bg-white/60 p-4 font-bold text-[#6F4B5D] backdrop-blur-xl">
                {action}
              </div>
            ))}
          </div>

          <Link href="/dashboard/insights">
            <Button className="mt-8 bg-[#EC3A7A] text-white hover:bg-[#d82f6d]">
              Open AI insights
            </Button>
          </Link>
        </Card>
      </section>
    </main>
  );
}