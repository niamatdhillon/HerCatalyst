"use client";

import { LogoutButton } from "@/components/auth/logout-button";
import Link from "next/link";
import { motion } from "framer-motion";
import {
  BookOpen,
  Brain,
  BriefcaseBusiness,
  Bus,
  CalendarCheck,
  Dumbbell,
  GraduationCap,
  HeartPulse,
  Library,
  Map,
  MessageCircle,
  Moon,
  NotebookPen,
  Phone,
  Radio,
  Route,
  Shield,
  Sparkles,
  Stethoscope,
  Trophy,
  UsersRound,
  Wallet,
} from "lucide-react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

const featureGroups = [
  {
    group: "Academics",
    accent: "#EC3A7A",
    features: [
      { title: "Cycle-Aware Brain", href: "/dashboard/cycle", icon: Brain, status: "Live" },
      { title: "E-Library Hub", href: "/dashboard/library", icon: Library, status: "Ready" },
      { title: "Study Gamification", href: "/dashboard/gamification", icon: Trophy, status: "Ready" },
      { title: "Attendance Tracker", href: "/dashboard/attendance", icon: GraduationCap, status: "Live" },
      { title: "Tutor Connect", href: "/dashboard/tutors", icon: UsersRound, status: "Ready" },
      { title: "Research Portfolio", href: "/dashboard/career", icon: BookOpen, status: "Live" },
    ],
  },
  {
    group: "Health & Wellness",
    accent: "#75C9C8",
    features: [
      { title: "Symptom Tracker", href: "/dashboard/wellness", icon: HeartPulse, status: "Live" },
      { title: "Mental Health Hub", href: "/dashboard/wellness", icon: Sparkles, status: "Live" },
      { title: "Cycle-Synced Diet Planner", href: "/dashboard/diet", icon: HeartPulse, status: "Ready" },
      { title: "Fitness Windows", href: "/dashboard/fitness", icon: Dumbbell, status: "Ready" },
      { title: "Medical Vault", href: "/dashboard/medical", icon: Stethoscope, status: "Ready" },
      { title: "Sleep Tracker", href: "/dashboard/wellness", icon: Moon, status: "Live" },
    ],
  },
  {
    group: "Safety",
    accent: "#80A1D4",
    features: [
      { title: "Safe-Path Map", href: "/dashboard/safety", icon: Map, status: "Live" },
      { title: "Fake Call Generator", href: "/dashboard/safety", icon: Phone, status: "Live" },
      { title: "Shuttle Trace", href: "/dashboard/shuttle", icon: Bus, status: "Ready" },
      { title: "Security Escort Requests", href: "/dashboard/safety", icon: Shield, status: "Live" },
      { title: "SOS Beacon", href: "/dashboard/safety", icon: Route, status: "Live" },
    ],
  },
  {
    group: "Career & Growth",
    accent: "#F4ADCF",
    features: [
      { title: "STEM Grants Hub", href: "/dashboard/career", icon: BriefcaseBusiness, status: "Live" },
      { title: "Internship & Job Board", href: "/dashboard/career", icon: BriefcaseBusiness, status: "Live" },
      { title: "Writing Lab", href: "/dashboard/writing", icon: NotebookPen, status: "Ready" },
      { title: "Alumni Network", href: "/dashboard/career", icon: UsersRound, status: "Live" },
      { title: "Portfolio Builder", href: "/dashboard/career", icon: BookOpen, status: "Live" },
    ],
  },
  {
    group: "Productivity",
    accent: "#FFFABF",
    features: [
      { title: "Budget AI", href: "/dashboard/budget", icon: Wallet, status: "Live" },
      { title: "Focus Timers", href: "/dashboard/focus", icon: CalendarCheck, status: "Ready" },
      { title: "Smart Alerts", href: "/dashboard/insights", icon: Sparkles, status: "Live" },
      { title: "Personal Diary", href: "/dashboard/journal", icon: NotebookPen, status: "Live" },
      { title: "Event RSVP System", href: "/dashboard/events", icon: CalendarCheck, status: "Ready" },
    ],
  },
  {
    group: "Community & Social",
    accent: "#BFC4FF",
    features: [
      { title: "Women-Only Forums", href: "/dashboard/community", icon: MessageCircle, status: "Live" },
      { title: "Roommate Finder", href: "/dashboard/community", icon: UsersRound, status: "Live" },
      { title: "Club Hub", href: "/dashboard/community", icon: UsersRound, status: "Live" },
      { title: "Volunteer Portal", href: "/dashboard/volunteer", icon: Sparkles, status: "Ready" },
      { title: "Campus Radio", href: "/dashboard/radio", icon: Radio, status: "Ready" },
    ],
  },
];

const quickLinks = [
  { label: "AI Insights", href: "/dashboard/insights" },
  { label: "Cycle", href: "/dashboard/cycle" },
  { label: "Planner", href: "/dashboard/planner" },
  { label: "Safety", href: "/dashboard/safety" },
];

export default function DashboardPage() {
  const featureCount = featureGroups.reduce((total, group) => total + group.features.length, 0);

  return (
    <main className="relative min-h-screen overflow-hidden bg-[#F7F4EA] px-6 py-6 text-[#26111D] md:px-10">
      <div className="pointer-events-none fixed inset-0">
        <motion.div
          animate={{ x: [0, 70, -40, 0], y: [0, 60, -20, 0] }}
          transition={{ duration: 18, repeat: Infinity, ease: "easeInOut" }}
          className="absolute -left-24 top-24 h-80 w-80 rounded-full bg-[#FFE7FF]/80 blur-3xl"
        />
        <motion.div
          animate={{ x: [0, -60, 40, 0], y: [0, -30, 80, 0] }}
          transition={{ duration: 20, repeat: Infinity, ease: "easeInOut" }}
          className="absolute right-0 top-16 h-96 w-96 rounded-full bg-[#B2F9E7]/70 blur-3xl"
        />
        <motion.div
          animate={{ x: [0, 40, -70, 0], y: [0, 80, 20, 0] }}
          transition={{ duration: 22, repeat: Infinity, ease: "easeInOut" }}
          className="absolute bottom-0 left-1/3 h-96 w-96 rounded-full bg-[#BFC4FF]/70 blur-3xl"
        />
      </div>

      <nav className="relative z-10 mx-auto mb-10 flex max-w-7xl items-center justify-between gap-3 rounded-full border border-white/70 bg-white/45 px-5 py-3 shadow-sm backdrop-blur-2xl">
        <Link href="/" className="text-xl font-black">
          HerCatalyst
        </Link>

        <div className="flex items-center gap-2">
          <div className="hidden gap-2 md:flex">
            {quickLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="rounded-full px-4 py-2 text-sm font-bold text-[#6F4B5D] hover:bg-white/70"
              >
                {link.label}
              </Link>
            ))}
          </div>

          <LogoutButton />
        </div>
      </nav>

      <section className="relative z-10 mx-auto max-w-7xl">
        <div className="mb-8">
          <p className="font-bold text-[#EC3A7A]">Your student OS</p>
          <h1 className="mt-2 max-w-5xl text-4xl font-black tracking-tight md:text-6xl">
            Everything you need to move through college with clarity, care, and momentum.
          </h1>
          <p className="mt-4 max-w-3xl text-[#6F4B5D]">
            HerCatalyst brings together academics, cycle intelligence, wellbeing, safety, money,
            community, and career growth inside one connected campus platform.
          </p>
        </div>

        <div className="mb-6 grid gap-4 lg:grid-cols-[1fr_0.85fr]">
          <Card className="border-white/70 bg-white/45 p-6 shadow-sm backdrop-blur-2xl">
            <p className="font-bold text-[#EC3A7A]">Today’s focus</p>
            <h2 className="mt-3 text-4xl font-black md:text-5xl">Soft sprint, steady progress.</h2>
            <p className="mt-4 max-w-2xl leading-7 text-[#6F4B5D]">
              Start with one meaningful task, check your body signals, and keep your next move small enough to begin.
            </p>

            <div className="mt-8 grid gap-3 md:grid-cols-3">
              {["Check cycle status", "Review planner", "Open AI insights"].map((item) => (
                <div key={item} className="rounded-2xl bg-white/55 p-4 font-semibold backdrop-blur-xl">
                  {item}
                </div>
              ))}
            </div>
          </Card>

          <Card className="border-[#26111D]/10 bg-[#26111D] p-6 text-white shadow-sm">
            <p className="font-bold text-[#F4ADCF]">Ecosystem</p>
            <h2 className="mt-3 text-6xl font-black">{featureCount}</h2>
            <p className="mt-2 text-lg font-semibold text-white/70">connected tools across six life zones</p>
            <div className="mt-6 rounded-2xl bg-white/10 p-4 text-white/75">
              Built to feel less like a productivity app and more like a support system.
            </div>
          </Card>
        </div>

        <div className="space-y-6 pb-20">
          {featureGroups.map((group) => (
            <section key={group.group}>
              <div className="mb-3 flex items-center gap-3">
                <div className="h-3 w-3 rounded-full" style={{ backgroundColor: group.accent }} />
                <h2 className="text-2xl font-black">{group.group}</h2>
              </div>

              <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
                {group.features.map((feature) => (
                  <Link key={feature.title} href={feature.href}>
                    <Card className="group h-full border-white/70 bg-white/45 p-5 shadow-sm backdrop-blur-2xl transition duration-300 hover:-translate-y-1 hover:shadow-xl hover:shadow-[#C0B9DD]/25">
                      <feature.icon className="mb-5 h-7 w-7 text-[#EC3A7A]" />
                      <div className="flex items-start justify-between gap-3">
                        <h3 className="text-lg font-black">{feature.title}</h3>
                        <Badge className={feature.status === "Live" ? "bg-[#E9FFF5] text-[#047857]" : "bg-[#FFF0F5] text-[#EC3A7A]"}>
                          {feature.status}
                        </Badge>
                      </div>
                    </Card>
                  </Link>
                ))}
              </div>
            </section>
          ))}
        </div>
      </section>
    </main>
  );
}
