"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import {
  ArrowLeft,
  BellRing,
  CheckCircle2,
  Copy,
  Phone,
  Plus,
  Shield,
  Timer,
  Trash2,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

type Contact = {
  id: string;
  name: string;
  phone: string;
  relation: string;
  priority: "Trusted" | "Hostel" | "Campus" | "Family";
};

type CheckIn = {
  id: string;
  createdAt: string;
  destination: string;
  eta: number;
  status: "active" | "safe" | "missed";
};

const officialHelplines = [
  { label: "India ERSS Emergency", number: "112", detail: "Police, fire, medical, women/child emergency routing" },
  { label: "Police Control Room", number: "100", detail: "Rajasthan police control room" },
  { label: "Rajasthan Women & Senior Citizens", number: "1090", detail: "Women/senior citizen helpline listed by Rajasthan Home Dept" },
  { label: "Women Helpline", number: "181", detail: "Women helpline / Sampark 181" },
  { label: "Emergency Services", number: "108", detail: "Rajasthan emergency services" },
  { label: "Ambulance", number: "102", detail: "Ambulance service" },
  { label: "Fire", number: "101", detail: "Fire brigade" },
  { label: "Cyber Crime", number: "1930", detail: "Cyber crime financial fraud reporting" },
];

const campusAnchors = [
  "MUJ Main Gate",
  "Girls Hostel",
  "Academic Block",
  "Library",
  "Food Court",
  "Mess",
  "Parking",
  "Jaipur-Ajmer Expressway side",
  "Other",
];

const riskLevels = [
  { label: "Low", description: "I am okay, just sharing my route." },
  { label: "Uneasy", description: "I feel uncomfortable and want someone aware." },
  { label: "Urgent", description: "I need immediate help or intervention." },
];

function phoneHref(number: string) {
  return `tel:${number.replace(/\s+/g, "")}`;
}

function nowStamp() {
  return new Date().toLocaleString("en-IN", {
    dateStyle: "medium",
    timeStyle: "short",
  });
}

export default function SafetyPage() {
  const [contacts, setContacts] = useState<Contact[]>([]);
  const [checkIns, setCheckIns] = useState<CheckIn[]>([]);
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [relation, setRelation] = useState("");
  const [priority, setPriority] = useState<Contact["priority"]>("Trusted");

  const [location, setLocation] = useState("Manipal University Jaipur, Dehmi Kalan");
  const [destination, setDestination] = useState("Girls Hostel");
  const [risk, setRisk] = useState("Uneasy");
  const [eta, setEta] = useState("15");
  const [context, setContext] = useState("");
  const [copied, setCopied] = useState(false);
  const [fakeCaller, setFakeCaller] = useState("Roommate");
  const [fakeCallArmed, setFakeCallArmed] = useState(false);

  useEffect(() => {
    const savedContacts = localStorage.getItem("hercatalyst_safety_contacts");
    const savedCheckIns = localStorage.getItem("hercatalyst_safety_checkins");

    if (savedContacts) setContacts(JSON.parse(savedContacts));
    if (savedCheckIns) setCheckIns(JSON.parse(savedCheckIns));
  }, []);

  useEffect(() => {
    localStorage.setItem("hercatalyst_safety_contacts", JSON.stringify(contacts));
  }, [contacts]);

  useEffect(() => {
    localStorage.setItem("hercatalyst_safety_checkins", JSON.stringify(checkIns));
  }, [checkIns]);

  const emergencyMessage = useMemo(() => {
    const riskText = riskLevels.find((item) => item.label === risk)?.description || "";
    return `HER CATALYST SAFETY ALERT
Status: ${risk}
Meaning: ${riskText}
Time: ${nowStamp()}
Current location: ${location}
Destination: ${destination}
ETA: ${eta} minutes
Context: ${context || "No extra context added."}

If I do not confirm I am safe, please call me and contact help.
India emergency: 112
Rajasthan women/senior citizen helpline: 1090
MUJ campus: Dehmi Kalan, Off Jaipur-Ajmer Expressway, Jaipur, Rajasthan 303007`;
  }, [location, destination, eta, risk, context]);

  function addContact() {
    if (!name.trim() || !phone.trim()) return;

    const contact: Contact = {
      id: crypto.randomUUID(),
      name: name.trim(),
      phone: phone.trim(),
      relation: relation.trim() || "Trusted contact",
      priority,
    };

    setContacts([contact, ...contacts]);
    setName("");
    setPhone("");
    setRelation("");
    setPriority("Trusted");
  }

  function deleteContact(id: string) {
    setContacts(contacts.filter((contact) => contact.id !== id));
  }

  async function copyMessage() {
    await navigator.clipboard.writeText(emergencyMessage);
    setCopied(true);
    window.setTimeout(() => setCopied(false), 1800);
  }

  function startCheckIn() {
    const checkIn: CheckIn = {
      id: crypto.randomUUID(),
      createdAt: nowStamp(),
      destination,
      eta: Number(eta) || 15,
      status: "active",
    };

    setCheckIns([checkIn, ...checkIns]);
  }

  function updateCheckIn(id: string, status: CheckIn["status"]) {
    setCheckIns(checkIns.map((checkIn) => (checkIn.id === id ? { ...checkIn, status } : checkIn)));
  }

  const activeCheckIn = checkIns.find((checkIn) => checkIn.status === "active");

  return (
    <main className="min-h-screen bg-[#FFF7FA] px-6 py-6 text-[#26111D] md:px-10">
      <Link href="/dashboard" className="inline-flex items-center gap-2 font-bold text-[#EC3A7A]">
        <ArrowLeft className="h-4 w-4" />
        Back to dashboard
      </Link>

      <section className="mx-auto mt-8 max-w-7xl">
        <div className="mb-8">
          <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-[#EC3A7A] text-white">
            <Shield className="h-7 w-7" />
          </div>
          <h1 className="text-4xl font-black md:text-6xl">Safety Hub</h1>
          <p className="mt-3 max-w-3xl text-[#6F4B5D]">
            Built for MUJ-style campus life in India: trusted contacts, official helplines,
            check-ins, SOS message drafting, fake call support, and route context.
          </p>
        </div>

        <div className="mb-5 grid gap-4 md:grid-cols-4">
          <Card className="border-[#F6C6D7] bg-[#26111D] p-5 text-white">
            <p className="text-sm font-bold text-[#F48FB1]">Emergency</p>
            <h2 className="mt-2 text-4xl font-black">112</h2>
            <a href="tel:112" className="mt-3 inline-flex font-bold text-[#F48FB1]">Call now</a>
          </Card>

          <Card className="border-[#F6C6D7] bg-white/80 p-5">
            <p className="text-sm font-bold text-[#EC3A7A]">Trusted contacts</p>
            <h2 className="mt-2 text-4xl font-black">{contacts.length}</h2>
          </Card>

          <Card className="border-[#F6C6D7] bg-white/80 p-5">
            <p className="text-sm font-bold text-[#EC3A7A]">Active check-in</p>
            <h2 className="mt-2 text-4xl font-black">{activeCheckIn ? "Yes" : "No"}</h2>
          </Card>

          <Card className="border-[#F6C6D7] bg-white/80 p-5">
            <p className="text-sm font-bold text-[#EC3A7A]">Campus context</p>
            <h2 className="mt-2 text-xl font-black">MUJ Jaipur</h2>
            <p className="mt-1 text-sm text-[#6F4B5D]">Dehmi Kalan, Jaipur-Ajmer Expressway</p>
          </Card>
        </div>

        <div className="grid gap-5 xl:grid-cols-[0.82fr_1.18fr]">
          <div className="space-y-5">
            <Card className="border-[#F6C6D7] bg-white/80 p-6 shadow-sm">
              <h2 className="text-2xl font-black">Trusted contacts</h2>
              <p className="mt-1 text-sm text-[#6F4B5D]">
                Add roommate, hostel warden, family, campus security, or a local friend.
              </p>

              <div className="mt-6 space-y-4">
                <div className="space-y-2">
                  <Label>Name</Label>
                  <Input value={name} onChange={(event) => setName(event.target.value)} placeholder="Aanya / Warden / Security desk" />
                </div>

                <div className="space-y-2">
                  <Label>Phone</Label>
                  <Input value={phone} onChange={(event) => setPhone(event.target.value)} placeholder="+91..." />
                </div>

                <div className="space-y-2">
                  <Label>Relation</Label>
                  <Input value={relation} onChange={(event) => setRelation(event.target.value)} placeholder="Roommate, family, hostel, campus..." />
                </div>

                <div className="space-y-2">
                  <Label>Type</Label>
                  <select
                    value={priority}
                    onChange={(event) => setPriority(event.target.value as Contact["priority"])}
                    className="h-10 w-full rounded-md border border-[#F6C6D7] bg-white px-3 text-sm"
                  >
                    <option>Trusted</option>
                    <option>Hostel</option>
                    <option>Campus</option>
                    <option>Family</option>
                  </select>
                </div>

                <Button onClick={addContact} className="w-full bg-[#EC3A7A] text-white hover:bg-[#d82f6d]">
                  <Plus className="mr-2 h-4 w-4" />
                  Add contact
                </Button>
              </div>
            </Card>

            <Card className="border-[#F6C6D7] bg-white/80 p-6 shadow-sm">
              <h2 className="text-2xl font-black">Official quick dial</h2>
              <div className="mt-5 space-y-3">
                {officialHelplines.map((item) => (
                  <div key={item.number + item.label} className="rounded-2xl border border-[#F6C6D7] bg-[#FFF7FA] p-4">
                    <div className="flex items-center justify-between gap-3">
                      <div>
                        <p className="font-black">{item.label}</p>
                        <p className="text-sm text-[#6F4B5D]">{item.detail}</p>
                      </div>
                      <a href={phoneHref(item.number)}>
                        <Button variant="outline" size="sm">
                          <Phone className="mr-2 h-4 w-4" />
                          {item.number}
                        </Button>
                      </a>
                    </div>
                  </div>
                ))}
              </div>
            </Card>
          </div>

          <div className="space-y-5">
            <Card className="border-[#F6C6D7] bg-[#26111D] p-6 text-white shadow-sm">
              <div className="mb-5 flex items-center gap-2">
                <BellRing className="h-5 w-5 text-[#F48FB1]" />
                <h2 className="text-2xl font-black">SOS message builder</h2>
              </div>

              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <Label className="text-white">Current location</Label>
                  <Input value={location} onChange={(event) => setLocation(event.target.value)} className="bg-white text-[#26111D]" />
                </div>

                <div className="space-y-2">
                  <Label className="text-white">Destination</Label>
                  <select
                    value={destination}
                    onChange={(event) => setDestination(event.target.value)}
                    className="h-10 w-full rounded-md border border-white/20 bg-white px-3 text-sm text-[#26111D]"
                  >
                    {campusAnchors.map((anchor) => (
                      <option key={anchor}>{anchor}</option>
                    ))}
                  </select>
                </div>

                <div className="space-y-2">
                  <Label className="text-white">Risk level</Label>
                  <select
                    value={risk}
                    onChange={(event) => setRisk(event.target.value)}
                    className="h-10 w-full rounded-md border border-white/20 bg-white px-3 text-sm text-[#26111D]"
                  >
                    {riskLevels.map((level) => (
                      <option key={level.label}>{level.label}</option>
                    ))}
                  </select>
                </div>

                <div className="space-y-2">
                  <Label className="text-white">ETA minutes</Label>
                  <Input value={eta} onChange={(event) => setEta(event.target.value)} className="bg-white text-[#26111D]" type="number" min="1" />
                </div>
              </div>

              <div className="mt-4 space-y-2">
                <Label className="text-white">Context</Label>
                <Textarea
                  value={context}
                  onChange={(event) => setContext(event.target.value)}
                  className="bg-white text-[#26111D]"
                  placeholder="Example: Leaving library alone; route feels empty."
                />
              </div>

              <div className="mt-5 rounded-2xl bg-white/10 p-4 text-sm leading-6 text-white/80 whitespace-pre-wrap">
                {emergencyMessage}
              </div>

              <div className="mt-5 flex flex-col gap-3 sm:flex-row">
                <Button onClick={copyMessage} className="bg-[#EC3A7A] text-white hover:bg-[#d82f6d]">
                  <Copy className="mr-2 h-4 w-4" />
                  {copied ? "Copied" : "Copy SOS text"}
                </Button>
                <Button onClick={startCheckIn} variant="outline" className="border-white/30 bg-white text-[#26111D]">
                  <Timer className="mr-2 h-4 w-4" />
                  Start check-in
                </Button>
                <a href="tel:112">
                  <Button variant="outline" className="border-white/30 bg-white text-[#26111D]">
                    <Phone className="mr-2 h-4 w-4" />
                    Call 112
                  </Button>
                </a>
              </div>
            </Card>

            <div className="grid gap-5 lg:grid-cols-2">
              <Card className="border-[#F6C6D7] bg-white/80 p-6 shadow-sm">
                <h2 className="text-2xl font-black">Fake call assist</h2>
                <p className="mt-1 text-sm text-[#6F4B5D]">
                  For social escape moments. It does not place a real call.
                </p>

                <div className="mt-5 space-y-3">
                  <Label>Caller name</Label>
                  <Input value={fakeCaller} onChange={(event) => setFakeCaller(event.target.value)} />
                  <Button onClick={() => setFakeCallArmed(true)} className="w-full bg-[#EC3A7A] text-white hover:bg-[#d82f6d]">
                    Arm fake call screen
                  </Button>
                </div>

                {fakeCallArmed && (
                  <div className="mt-5 rounded-3xl bg-[#26111D] p-5 text-center text-white">
                    <p className="text-sm text-white/50">Incoming call</p>
                    <h3 className="mt-2 text-3xl font-black">{fakeCaller}</h3>
                    <div className="mt-5 flex justify-center gap-3">
                      <Button onClick={() => setFakeCallArmed(false)} className="bg-[#16A34A] text-white">Answer</Button>
                      <Button onClick={() => setFakeCallArmed(false)} className="bg-[#DC2626] text-white">Decline</Button>
                    </div>
                  </div>
                )}
              </Card>

              <Card className="border-[#F6C6D7] bg-white/80 p-6 shadow-sm">
                <h2 className="text-2xl font-black">Safe-route notes</h2>
                <div className="mt-4 space-y-3 text-sm font-semibold text-[#6F4B5D]">
                  <p className="rounded-2xl bg-[#FFF0F5] p-4">Prefer populated routes: academic blocks, main roads, hostel gates.</p>
                  <p className="rounded-2xl bg-[#FFF0F5] p-4">Avoid isolated parking/expressway-side stretches when alone at night.</p>
                  <p className="rounded-2xl bg-[#FFF0F5] p-4">Use check-in timer before leaving library, food court, labs, or events.</p>
                </div>
              </Card>
            </div>

            <Card className="border-[#F6C6D7] bg-white/80 p-6 shadow-sm">
              <div className="mb-5 flex items-center justify-between">
                <h2 className="text-2xl font-black">Active contacts</h2>
                <Badge className="bg-[#FFF0F5] text-[#EC3A7A] hover:bg-[#FFF0F5]">{contacts.length} saved</Badge>
              </div>

              <div className="space-y-3">
                {contacts.length === 0 ? (
                  <div className="rounded-2xl border border-dashed border-[#F6C6D7] p-8 text-center text-[#6F4B5D]">
                    Add trusted contacts before relying on SOS copy.
                  </div>
                ) : (
                  contacts.map((contact) => (
                    <div key={contact.id} className="rounded-2xl border border-[#F6C6D7] bg-[#FFF7FA] p-4">
                      <div className="flex items-center justify-between gap-3">
                        <div>
                          <p className="font-black">{contact.name}</p>
                          <p className="text-sm text-[#6F4B5D]">{contact.relation} • {contact.priority}</p>
                        </div>
                        <div className="flex gap-2">
                          <a href={phoneHref(contact.phone)}>
                            <Button variant="outline" size="sm">
                              <Phone className="mr-2 h-4 w-4" />
                              Call
                            </Button>
                          </a>
                          <Button variant="ghost" size="icon" onClick={() => deleteContact(contact.id)}>
                            <Trash2 className="h-4 w-4 text-[#F15A24]" />
                          </Button>
                        </div>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </Card>

            <Card className="border-[#F6C6D7] bg-white/80 p-6 shadow-sm">
              <div className="mb-5 flex items-center justify-between">
                <h2 className="text-2xl font-black">Check-in history</h2>
                <Badge className="bg-[#FFF0F5] text-[#EC3A7A] hover:bg-[#FFF0F5]">{checkIns.length} saved</Badge>
              </div>

              <div className="space-y-3">
                {checkIns.length === 0 ? (
                  <div className="rounded-2xl border border-dashed border-[#F6C6D7] p-8 text-center text-[#6F4B5D]">
                    No check-ins yet.
                  </div>
                ) : (
                  checkIns.map((checkIn) => (
                    <div key={checkIn.id} className="rounded-2xl border border-[#F6C6D7] bg-[#FFF7FA] p-4">
                      <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
                        <div>
                          <p className="font-black">{checkIn.destination} • {checkIn.eta} min</p>
                          <p className="text-sm text-[#6F4B5D]">{checkIn.createdAt}</p>
                        </div>
                        <div className="flex flex-wrap gap-2">
                          <Badge className={checkIn.status === "safe" ? "bg-[#E9FFF5] text-[#047857]" : "bg-[#FFF0F5] text-[#EC3A7A]"}>
                            {checkIn.status}
                          </Badge>
                          {checkIn.status === "active" && (
                            <>
                              <Button variant="outline" size="sm" onClick={() => updateCheckIn(checkIn.id, "safe")}>
                                <CheckCircle2 className="mr-2 h-4 w-4" />
                                I am safe
                              </Button>
                              <Button variant="outline" size="sm" onClick={() => updateCheckIn(checkIn.id, "missed")}>
                                Mark missed
                              </Button>
                            </>
                          )}
                        </div>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </Card>

            <p className="text-xs leading-5 text-[#6F4B5D]">
              Safety Hub prepares calls, text, and check-ins. It cannot guarantee emergency response.
              In immediate danger in India, call 112 directly.
            </p>
          </div>
        </div>
      </section>
    </main>
  );
}