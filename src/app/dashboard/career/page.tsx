"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { ArrowLeft, BriefcaseBusiness, ExternalLink, Plus, Trash2, UserRoundSearch } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

type Opportunity = {
  id: string;
  title: string;
  type: string;
  organization: string;
  deadline: string;
  link: string;
  status: "Saved" | "Applied" | "Interviewing" | "Accepted" | "Rejected";
  notes: string;
};

type PortfolioItem = {
  id: string;
  title: string;
  category: string;
  summary: string;
  link: string;
};

const curatedOpportunities = [
  {
    title: "Google Women Techmakers Scholarship",
    type: "Scholarship",
    organization: "Google",
    fit: "Women in computer science and engineering",
  },
  {
    title: "Adobe Women-in-Technology Scholarship",
    type: "Scholarship",
    organization: "Adobe",
    fit: "Engineering students with strong tech projects",
  },
  {
    title: "Society of Women Engineers Awards",
    type: "Grant",
    organization: "SWE",
    fit: "Women pursuing engineering disciplines",
  },
  {
    title: "Research Internship - ML / Data",
    type: "Internship",
    organization: "University Lab",
    fit: "Python, data analysis, research writing",
  },
  {
    title: "Frontend Product Intern",
    type: "Internship",
    organization: "Startup",
    fit: "React, UI, accessibility, product thinking",
  },
];

const mentorTracks = [
  "AI / ML Research",
  "Frontend Engineering",
  "Product Design",
  "Cybersecurity",
  "Data Analytics",
  "Higher Studies",
  "Technical Writing",
];

function daysUntil(deadline: string) {
  if (!deadline) return null;

  const today = new Date(new Date().toISOString().slice(0, 10));
  const target = new Date(`${deadline}T00:00:00`);
  return Math.ceil((target.getTime() - today.getTime()) / 86400000);
}

export default function CareerPage() {
  const [opportunities, setOpportunities] = useState<Opportunity[]>([]);
  const [portfolio, setPortfolio] = useState<PortfolioItem[]>([]);

  const [title, setTitle] = useState("");
  const [type, setType] = useState("Internship");
  const [organization, setOrganization] = useState("");
  const [deadline, setDeadline] = useState("");
  const [link, setLink] = useState("");
  const [status, setStatus] = useState<Opportunity["status"]>("Saved");
  const [notes, setNotes] = useState("");

  const [projectTitle, setProjectTitle] = useState("");
  const [category, setCategory] = useState("Project");
  const [summary, setSummary] = useState("");
  const [projectLink, setProjectLink] = useState("");

  const [mentorTrack, setMentorTrack] = useState("AI / ML Research");
  const [goal, setGoal] = useState("");

  useEffect(() => {
    const savedOpportunities = localStorage.getItem("hercatalyst_opportunities");
    const savedPortfolio = localStorage.getItem("hercatalyst_portfolio");

    if (savedOpportunities) setOpportunities(JSON.parse(savedOpportunities));
    if (savedPortfolio) setPortfolio(JSON.parse(savedPortfolio));
  }, []);

  useEffect(() => {
    localStorage.setItem("hercatalyst_opportunities", JSON.stringify(opportunities));
  }, [opportunities]);

  useEffect(() => {
    localStorage.setItem("hercatalyst_portfolio", JSON.stringify(portfolio));
  }, [portfolio]);

  function addOpportunity() {
    if (!title.trim()) return;

    const item: Opportunity = {
      id: crypto.randomUUID(),
      title,
      type,
      organization,
      deadline,
      link,
      status,
      notes,
    };

    setOpportunities([item, ...opportunities]);
    setTitle("");
    setOrganization("");
    setDeadline("");
    setLink("");
    setNotes("");
    setStatus("Saved");
  }

  function deleteOpportunity(id: string) {
    setOpportunities(opportunities.filter((opportunity) => opportunity.id !== id));
  }

  function updateStatus(id: string, nextStatus: Opportunity["status"]) {
    setOpportunities(
      opportunities.map((opportunity) =>
        opportunity.id === id ? { ...opportunity, status: nextStatus } : opportunity
      )
    );
  }

  function addPortfolioItem() {
    if (!projectTitle.trim()) return;

    const item: PortfolioItem = {
      id: crypto.randomUUID(),
      title: projectTitle,
      category,
      summary,
      link: projectLink,
    };

    setPortfolio([item, ...portfolio]);
    setProjectTitle("");
    setSummary("");
    setProjectLink("");
  }

  function deletePortfolioItem(id: string) {
    setPortfolio(portfolio.filter((item) => item.id !== id));
  }

  function saveCurated(item: (typeof curatedOpportunities)[number]) {
    const opportunity: Opportunity = {
      id: crypto.randomUUID(),
      title: item.title,
      type: item.type,
      organization: item.organization,
      deadline: "",
      link: "",
      status: "Saved",
      notes: item.fit,
    };

    setOpportunities([opportunity, ...opportunities]);
  }

  const summaryStats = useMemo(() => {
    const applied = opportunities.filter((item) => item.status === "Applied").length;
    const interviews = opportunities.filter((item) => item.status === "Interviewing").length;
    const accepted = opportunities.filter((item) => item.status === "Accepted").length;

    const urgent = opportunities.filter((item) => {
      const days = daysUntil(item.deadline);
      return days !== null && days >= 0 && days <= 7;
    }).length;

    return { applied, interviews, accepted, urgent };
  }, [opportunities]);

  const mentorMatch = useMemo(() => {
    const projectCount = portfolio.length;
    const applicationCount = opportunities.length;

    if (!goal.trim()) {
      return "Describe your goal to generate a mentor match.";
    }

    if (projectCount >= 2 && applicationCount >= 2) {
      return `Strong match: ${mentorTrack} mentor who can review your portfolio and application strategy.`;
    }

    if (projectCount >= 1) {
      return `Good match: ${mentorTrack} mentor for project polish and next opportunity planning.`;
    }

    return `Starter match: ${mentorTrack} mentor for roadmap building and first portfolio project.`;
  }, [mentorTrack, goal, portfolio.length, opportunities.length]);

  return (
    <main className="min-h-screen bg-[#FFF7FA] px-6 py-6 text-[#26111D] md:px-10">
      <Link href="/dashboard" className="inline-flex items-center gap-2 font-bold text-[#EC3A7A]">
        <ArrowLeft className="h-4 w-4" />
        Back to dashboard
      </Link>

      <section className="mx-auto mt-8 max-w-7xl">
        <div className="mb-8">
          <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-[#EC3A7A] text-white">
            <BriefcaseBusiness className="h-7 w-7" />
          </div>

          <h1 className="text-4xl font-black md:text-6xl">Career + Opportunities</h1>

          <p className="mt-3 max-w-3xl text-[#6F4B5D]">
            Track scholarships, internships, research roles, mentors, applications, and portfolio proof
            in one women-in-STEM career command center.
          </p>
        </div>

        <div className="mb-5 grid gap-4 md:grid-cols-4">
          <Card className="border-[#F6C6D7] bg-white/80 p-5">
            <p className="text-sm font-bold text-[#EC3A7A]">Applications</p>
            <h2 className="mt-2 text-3xl font-black">{summaryStats.applied}</h2>
          </Card>

          <Card className="border-[#F6C6D7] bg-white/80 p-5">
            <p className="text-sm font-bold text-[#EC3A7A]">Interviews</p>
            <h2 className="mt-2 text-3xl font-black">{summaryStats.interviews}</h2>
          </Card>

          <Card className="border-[#F6C6D7] bg-white/80 p-5">
            <p className="text-sm font-bold text-[#EC3A7A]">Portfolio items</p>
            <h2 className="mt-2 text-3xl font-black">{portfolio.length}</h2>
          </Card>

          <Card className="border-[#F6C6D7] bg-[#26111D] p-5 text-white">
            <p className="text-sm font-bold text-[#F48FB1]">Urgent deadlines</p>
            <h2 className="mt-2 text-3xl font-black">{summaryStats.urgent}</h2>
          </Card>
        </div>

        <div className="grid gap-5 xl:grid-cols-[0.82fr_1.18fr]">
          <div className="space-y-5">
            <Card className="border-[#F6C6D7] bg-white/80 p-6 shadow-sm">
              <h2 className="text-2xl font-black">Add opportunity</h2>

              <div className="mt-6 space-y-5">
                <div className="space-y-2">
                  <Label>Title</Label>
                  <Input value={title} onChange={(event) => setTitle(event.target.value)} placeholder="ML Research Intern" />
                </div>

                <div className="space-y-2">
                  <Label>Type</Label>
                  <select
                    value={type}
                    onChange={(event) => setType(event.target.value)}
                    className="h-10 w-full rounded-md border border-[#F6C6D7] bg-white px-3 text-sm"
                  >
                    <option>Internship</option>
                    <option>Scholarship</option>
                    <option>Grant</option>
                    <option>Research</option>
                    <option>Competition</option>
                    <option>Job</option>
                  </select>
                </div>

                <div className="space-y-2">
                  <Label>Organization</Label>
                  <Input value={organization} onChange={(event) => setOrganization(event.target.value)} placeholder="Google, Adobe, Lab..." />
                </div>

                <div className="space-y-2">
                  <Label>Deadline</Label>
                  <Input type="date" value={deadline} onChange={(event) => setDeadline(event.target.value)} />
                </div>

                <div className="space-y-2">
                  <Label>Link</Label>
                  <Input value={link} onChange={(event) => setLink(event.target.value)} placeholder="https://..." />
                </div>

                <div className="space-y-2">
                  <Label>Status</Label>
                  <select
                    value={status}
                    onChange={(event) => setStatus(event.target.value as Opportunity["status"])}
                    className="h-10 w-full rounded-md border border-[#F6C6D7] bg-white px-3 text-sm"
                  >
                    <option>Saved</option>
                    <option>Applied</option>
                    <option>Interviewing</option>
                    <option>Accepted</option>
                    <option>Rejected</option>
                  </select>
                </div>

                <div className="space-y-2">
                  <Label>Notes</Label>
                  <Textarea value={notes} onChange={(event) => setNotes(event.target.value)} placeholder="Requirements, essay ideas, referral notes..." />
                </div>

                <Button onClick={addOpportunity} className="w-full bg-[#EC3A7A] text-white hover:bg-[#d82f6d]">
                  <Plus className="mr-2 h-4 w-4" />
                  Save opportunity
                </Button>
              </div>
            </Card>

            <Card className="border-[#F6C6D7] bg-white/80 p-6 shadow-sm">
              <div className="mb-1 flex items-center gap-2">
                <UserRoundSearch className="h-5 w-5 text-[#EC3A7A]" />
                <h2 className="text-2xl font-black">Mentor match</h2>
              </div>

              <div className="mt-5 space-y-4">
                <div className="space-y-2">
                  <Label>Track</Label>
                  <select
                    value={mentorTrack}
                    onChange={(event) => setMentorTrack(event.target.value)}
                    className="h-10 w-full rounded-md border border-[#F6C6D7] bg-white px-3 text-sm"
                  >
                    {mentorTracks.map((track) => (
                      <option key={track}>{track}</option>
                    ))}
                  </select>
                </div>

                <div className="space-y-2">
                  <Label>Goal</Label>
                  <Textarea value={goal} onChange={(event) => setGoal(event.target.value)} placeholder="I want a summer ML internship..." />
                </div>

                <div className="rounded-2xl bg-[#FFF0F5] p-4 font-semibold text-[#6F4B5D]">
                  {mentorMatch}
                </div>
              </div>
            </Card>
          </div>

          <div className="space-y-5">
            <Card className="border-[#F6C6D7] bg-[#26111D] p-6 text-white shadow-sm">
              <h2 className="text-2xl font-black">Curated women-in-STEM board</h2>

              <div className="mt-5 grid gap-3 md:grid-cols-2">
                {curatedOpportunities.map((item) => (
                  <div key={item.title} className="rounded-2xl bg-white/10 p-4">
                    <div className="flex items-start justify-between gap-3">
                      <div>
                        <p className="font-black">{item.title}</p>
                        <p className="mt-1 text-sm text-white/60">
                          {item.organization} • {item.type}
                        </p>
                        <p className="mt-2 text-sm text-white/75">{item.fit}</p>
                      </div>
                    </div>
                    <Button onClick={() => saveCurated(item)} className="mt-4 bg-[#EC3A7A] text-white hover:bg-[#d82f6d]" size="sm">
                      Save
                    </Button>
                  </div>
                ))}
              </div>
            </Card>

            <Card className="border-[#F6C6D7] bg-white/80 p-6 shadow-sm">
              <h2 className="text-2xl font-black">Portfolio builder</h2>

              <div className="mt-6 grid gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <Label>Title</Label>
                  <Input value={projectTitle} onChange={(event) => setProjectTitle(event.target.value)} placeholder="AI period predictor" />
                </div>

                <div className="space-y-2">
                  <Label>Category</Label>
                  <select
                    value={category}
                    onChange={(event) => setCategory(event.target.value)}
                    className="h-10 w-full rounded-md border border-[#F6C6D7] bg-white px-3 text-sm"
                  >
                    <option>Project</option>
                    <option>Research</option>
                    <option>Hackathon</option>
                    <option>Publication</option>
                    <option>Leadership</option>
                  </select>
                </div>

                <div className="space-y-2 md:col-span-2">
                  <Label>Summary</Label>
                  <Textarea value={summary} onChange={(event) => setSummary(event.target.value)} placeholder="What did you build, learn, or impact?" />
                </div>

                <div className="space-y-2 md:col-span-2">
                  <Label>Link</Label>
                  <Input value={projectLink} onChange={(event) => setProjectLink(event.target.value)} placeholder="GitHub, paper, demo..." />
                </div>
              </div>

              <Button onClick={addPortfolioItem} className="mt-5 bg-[#EC3A7A] text-white hover:bg-[#d82f6d]">
                <Plus className="mr-2 h-4 w-4" />
                Add portfolio item
              </Button>
            </Card>

            <Card className="border-[#F6C6D7] bg-white/80 p-6 shadow-sm">
              <div className="mb-5 flex items-center justify-between">
                <h2 className="text-2xl font-black">Application tracker</h2>
                <Badge className="bg-[#FFF0F5] text-[#EC3A7A] hover:bg-[#FFF0F5]">{opportunities.length} saved</Badge>
              </div>

              <div className="space-y-3">
                {opportunities.length === 0 ? (
                  <div className="rounded-2xl border border-dashed border-[#F6C6D7] p-8 text-center text-[#6F4B5D]">
                    No opportunities saved yet.
                  </div>
                ) : (
                  opportunities.map((item) => {
                    const days = daysUntil(item.deadline);

                    return (
                      <div key={item.id} className="rounded-2xl border border-[#F6C6D7] bg-[#FFF7FA] p-4">
                        <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
                          <div>
                            <p className="font-black">{item.title}</p>
                            <p className="text-sm text-[#6F4B5D]">
                              {item.organization || "No organization"} • {item.type}
                              {item.deadline ? ` • ${days} days left` : ""}
                            </p>
                            {item.notes && <p className="mt-2 text-sm">{item.notes}</p>}
                            {item.link && (
                              <a href={item.link} target="_blank" className="mt-2 inline-flex items-center gap-1 text-sm font-bold text-[#EC3A7A]">
                                Open link <ExternalLink className="h-3 w-3" />
                              </a>
                            )}
                          </div>

                          <div className="flex flex-wrap gap-2">
                            <select
                              value={item.status}
                              onChange={(event) => updateStatus(item.id, event.target.value as Opportunity["status"])}
                              className="h-9 rounded-md border border-[#F6C6D7] bg-white px-2 text-sm"
                            >
                              <option>Saved</option>
                              <option>Applied</option>
                              <option>Interviewing</option>
                              <option>Accepted</option>
                              <option>Rejected</option>
                            </select>

                            <Button variant="ghost" size="icon" onClick={() => deleteOpportunity(item.id)}>
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

            <Card className="border-[#F6C6D7] bg-white/80 p-6 shadow-sm">
              <div className="mb-5 flex items-center justify-between">
                <h2 className="text-2xl font-black">Portfolio proof</h2>
                <Badge className="bg-[#FFF0F5] text-[#EC3A7A] hover:bg-[#FFF0F5]">{portfolio.length} items</Badge>
              </div>

              <div className="space-y-3">
                {portfolio.length === 0 ? (
                  <div className="rounded-2xl border border-dashed border-[#F6C6D7] p-8 text-center text-[#6F4B5D]">
                    Add projects, research, and achievements here.
                  </div>
                ) : (
                  portfolio.map((item) => (
                    <div key={item.id} className="rounded-2xl border border-[#F6C6D7] bg-[#FFF7FA] p-4">
                      <div className="flex items-start justify-between gap-3">
                        <div>
                          <p className="font-black">{item.title}</p>
                          <p className="text-sm text-[#6F4B5D]">{item.category}</p>
                          {item.summary && <p className="mt-2 text-sm">{item.summary}</p>}
                          {item.link && (
                            <a href={item.link} target="_blank" className="mt-2 inline-flex items-center gap-1 text-sm font-bold text-[#EC3A7A]">
                              Open link <ExternalLink className="h-3 w-3" />
                            </a>
                          )}
                        </div>

                        <Button variant="ghost" size="icon" onClick={() => deletePortfolioItem(item.id)}>
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