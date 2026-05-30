"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { ArrowLeft, MessageCircle, Plus, Search, Star, Trash2, UsersRound } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

type CampusProfile = {
  id: string;
  username: string;
  displayName: string;
  branch: string;
  year: string;
  interests: string[];
  lookingFor: string;
  bio: string;
  visibility: "Public" | "Private";
  saved: boolean;
};

type ForumPost = {
  id: string;
  username: string;
  topic: string;
  anonymous: boolean;
  body: string;
  createdAt: string;
};

const interestOptions = [
  "AI/ML",
  "Frontend",
  "Research",
  "Dance",
  "Music",
  "Hackathons",
  "Startups",
  "Fitness",
  "Reading",
  "Design",
  "Robotics",
  "Cybersecurity",
  "Writing",
  "Mental wellness",
  "Women in STEM",
];

const sampleProfiles: CampusProfile[] = [
  {
    id: "sample-1",
    username: "aanya.codes",
    displayName: "Aanya",
    branch: "CSE",
    year: "2nd year",
    interests: ["AI/ML", "Hackathons", "Women in STEM"],
    lookingFor: "Hackathon teammates",
    bio: "Building ML projects and looking for research buddies.",
    visibility: "Public",
    saved: false,
  },
  {
    id: "sample-2",
    username: "riya.designs",
    displayName: "Riya",
    branch: "IT",
    year: "1st year",
    interests: ["Frontend", "Design", "Startups"],
    lookingFor: "Project collaborators",
    bio: "Frontend learner, loves clean UI and campus product ideas.",
    visibility: "Public",
    saved: false,
  },
  {
    id: "sample-3",
    username: "meera.robotics",
    displayName: "Meera",
    branch: "ECE",
    year: "3rd year",
    interests: ["Robotics", "Research", "Cybersecurity"],
    lookingFor: "Research group",
    bio: "ECE student exploring embedded systems and secure devices.",
    visibility: "Public",
    saved: false,
  },
];

const clubDirectory = [
  { name: "Women in Tech Circle", focus: "Mentorship, peer support, tech talks" },
  { name: "CodeCell", focus: "Coding contests, hackathons, dev projects" },
  { name: "Robotics Club", focus: "Robotics, embedded systems, competitions" },
  { name: "Design Studio", focus: "UI/UX, product design, creative tech" },
  { name: "Research Forum", focus: "Papers, labs, research opportunities" },
];

function toggleItem(list: string[], item: string) {
  return list.includes(item) ? list.filter((value) => value !== item) : [...list, item];
}

function nowStamp() {
  return new Date().toLocaleString("en-IN", {
    dateStyle: "medium",
    timeStyle: "short",
  });
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

export default function CommunityPage() {
  const [profiles, setProfiles] = useState<CampusProfile[]>(sampleProfiles);
  const [posts, setPosts] = useState<ForumPost[]>([]);
  const [username, setUsername] = useState("");
  const [displayName, setDisplayName] = useState("");
  const [branch, setBranch] = useState("CSE");
  const [year, setYear] = useState("1st year");
  const [interests, setInterests] = useState<string[]>([]);
  const [lookingFor, setLookingFor] = useState("Study buddies");
  const [bio, setBio] = useState("");
  const [visibility, setVisibility] = useState<CampusProfile["visibility"]>("Public");

  const [search, setSearch] = useState("");
  const [postTopic, setPostTopic] = useState("Academics");
  const [anonymous, setAnonymous] = useState(false);
  const [postBody, setPostBody] = useState("");

  useEffect(() => {
    const savedProfiles = localStorage.getItem("hercatalyst_campus_profiles");
    const savedPosts = localStorage.getItem("hercatalyst_forum_posts");

    if (savedProfiles) setProfiles(JSON.parse(savedProfiles));
    if (savedPosts) setPosts(JSON.parse(savedPosts));
  }, []);

  useEffect(() => {
    localStorage.setItem("hercatalyst_campus_profiles", JSON.stringify(profiles));
  }, [profiles]);

  useEffect(() => {
    localStorage.setItem("hercatalyst_forum_posts", JSON.stringify(posts));
  }, [posts]);

  function saveProfile() {
    if (!username.trim()) return;

    const cleanUsername = username.trim().toLowerCase().replace(/\s+/g, ".");
    const existing = profiles.find((profile) => profile.username === cleanUsername);

    const profile: CampusProfile = {
      id: existing?.id || crypto.randomUUID(),
      username: cleanUsername,
      displayName: displayName.trim() || cleanUsername,
      branch,
      year,
      interests,
      lookingFor,
      bio,
      visibility,
      saved: existing?.saved || false,
    };

    if (existing) {
      setProfiles(profiles.map((item) => (item.id === existing.id ? profile : item)));
    } else {
      setProfiles([profile, ...profiles]);
    }
  }

  function toggleSaved(id: string) {
    setProfiles(
      profiles.map((profile) =>
        profile.id === id ? { ...profile, saved: !profile.saved } : profile
      )
    );
  }

  function addPost() {
    if (!postBody.trim()) return;

    const post: ForumPost = {
      id: crypto.randomUUID(),
      username: username.trim() || "campus.user",
      topic: postTopic,
      anonymous,
      body: postBody,
      createdAt: nowStamp(),
    };

    setPosts([post, ...posts]);
    setPostBody("");
  }

  function deletePost(id: string) {
    setPosts(posts.filter((post) => post.id !== id));
  }

  const visibleProfiles = useMemo(() => {
    const query = search.toLowerCase().trim();

    return profiles
      .filter((profile) => profile.visibility === "Public")
      .filter((profile) => {
        if (!query) return true;

        const haystack = [
          profile.username,
          profile.displayName,
          profile.branch,
          profile.year,
          profile.lookingFor,
          profile.bio,
          profile.interests.join(" "),
        ]
          .join(" ")
          .toLowerCase();

        return haystack.includes(query);
      });
  }, [profiles, search]);

  const savedProfiles = profiles.filter((profile) => profile.saved);

  return (
    <main className="min-h-screen bg-[#FFF7FA] px-6 py-6 text-[#26111D] md:px-10">
      <Link href="/dashboard" className="inline-flex items-center gap-2 font-bold text-[#EC3A7A]">
        <ArrowLeft className="h-4 w-4" />
        Back to dashboard
      </Link>

      <section className="mx-auto mt-8 max-w-7xl">
        <div className="mb-8">
          <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-[#EC3A7A] text-white">
            <UsersRound className="h-7 w-7" />
          </div>

          <h1 className="text-4xl font-black md:text-6xl">Community Hub</h1>

          <p className="mt-3 max-w-3xl text-[#6F4B5D]">
            A safer Instagram-style student discovery layer: usernames, interests, study buddies,
            forums, clubs, and saved campus profiles.
          </p>
        </div>

        <div className="mb-5 grid gap-4 md:grid-cols-4">
          <Card className="border-[#F6C6D7] bg-white/80 p-5">
            <p className="text-sm font-bold text-[#EC3A7A]">Public profiles</p>
            <h2 className="mt-2 text-3xl font-black">{visibleProfiles.length}</h2>
          </Card>

          <Card className="border-[#F6C6D7] bg-white/80 p-5">
            <p className="text-sm font-bold text-[#EC3A7A]">Saved profiles</p>
            <h2 className="mt-2 text-3xl font-black">{savedProfiles.length}</h2>
          </Card>

          <Card className="border-[#F6C6D7] bg-white/80 p-5">
            <p className="text-sm font-bold text-[#EC3A7A]">Forum posts</p>
            <h2 className="mt-2 text-3xl font-black">{posts.length}</h2>
          </Card>

          <Card className="border-[#F6C6D7] bg-[#26111D] p-5 text-white">
            <p className="text-sm font-bold text-[#F48FB1]">Safety design</p>
            <p className="mt-2 font-semibold">No phone numbers exposed by default.</p>
          </Card>
        </div>

        <div className="grid gap-5 xl:grid-cols-[0.82fr_1.18fr]">
          <div className="space-y-5">
            <Card className="border-[#F6C6D7] bg-white/80 p-6 shadow-sm">
              <h2 className="text-2xl font-black">Create campus profile</h2>

              <div className="mt-6 space-y-5">
                <div className="space-y-2">
                  <Label>Username</Label>
                  <Input value={username} onChange={(event) => setUsername(event.target.value)} placeholder="niamat.codes" />
                </div>

                <div className="space-y-2">
                  <Label>Display name</Label>
                  <Input value={displayName} onChange={(event) => setDisplayName(event.target.value)} placeholder="Niamat" />
                </div>

                <div className="grid gap-4 md:grid-cols-2">
                  <div className="space-y-2">
                    <Label>Branch</Label>
                    <Input value={branch} onChange={(event) => setBranch(event.target.value)} placeholder="CSE" />
                  </div>

                  <div className="space-y-2">
                    <Label>Year</Label>
                    <select
                      value={year}
                      onChange={(event) => setYear(event.target.value)}
                      className="h-10 w-full rounded-md border border-[#F6C6D7] bg-white px-3 text-sm"
                    >
                      <option>1st year</option>
                      <option>2nd year</option>
                      <option>3rd year</option>
                      <option>4th year</option>
                      <option>Alumni</option>
                    </select>
                  </div>
                </div>

                <div>
                  <Label>Interests</Label>
                  <div className="mt-3 flex flex-wrap gap-2">
                    {interestOptions.map((interest) => (
                      <Chip
                        key={interest}
                        active={interests.includes(interest)}
                        onClick={() => setInterests(toggleItem(interests, interest))}
                      >
                        {interest}
                      </Chip>
                    ))}
                  </div>
                </div>

                <div className="space-y-2">
                  <Label>Looking for</Label>
                  <Input value={lookingFor} onChange={(event) => setLookingFor(event.target.value)} placeholder="Study buddies, hackathon team..." />
                </div>

                <div className="space-y-2">
                  <Label>Bio</Label>
                  <Textarea value={bio} onChange={(event) => setBio(event.target.value)} placeholder="What should other students know about you?" />
                </div>

                <div className="space-y-2">
                  <Label>Visibility</Label>
                  <select
                    value={visibility}
                    onChange={(event) => setVisibility(event.target.value as CampusProfile["visibility"])}
                    className="h-10 w-full rounded-md border border-[#F6C6D7] bg-white px-3 text-sm"
                  >
                    <option>Public</option>
                    <option>Private</option>
                  </select>
                </div>

                <Button onClick={saveProfile} className="w-full bg-[#EC3A7A] text-white hover:bg-[#d82f6d]">
                  <Plus className="mr-2 h-4 w-4" />
                  Save profile
                </Button>
              </div>
            </Card>

            <Card className="border-[#F6C6D7] bg-white/80 p-6 shadow-sm">
              <div className="mb-1 flex items-center gap-2">
                <MessageCircle className="h-5 w-5 text-[#EC3A7A]" />
                <h2 className="text-2xl font-black">Campus forum</h2>
              </div>

              <div className="mt-5 space-y-4">
                <div className="space-y-2">
                  <Label>Topic</Label>
                  <select
                    value={postTopic}
                    onChange={(event) => setPostTopic(event.target.value)}
                    className="h-10 w-full rounded-md border border-[#F6C6D7] bg-white px-3 text-sm"
                  >
                    <option>Academics</option>
                    <option>Safety</option>
                    <option>Roommates</option>
                    <option>Career</option>
                    <option>Wellness</option>
                    <option>Campus life</option>
                  </select>
                </div>

                <div className="space-y-2">
                  <Label>Post</Label>
                  <Textarea value={postBody} onChange={(event) => setPostBody(event.target.value)} placeholder="Ask, share, or vent safely..." />
                </div>

                <label className="flex items-center gap-2 text-sm font-bold text-[#6F4B5D]">
                  <input type="checkbox" checked={anonymous} onChange={(event) => setAnonymous(event.target.checked)} />
                  Post anonymously
                </label>

                <Button onClick={addPost} className="w-full bg-[#EC3A7A] text-white hover:bg-[#d82f6d]">
                  <Plus className="mr-2 h-4 w-4" />
                  Add post
                </Button>
              </div>
            </Card>
          </div>

          <div className="space-y-5">
            <Card className="border-[#F6C6D7] bg-[#26111D] p-6 text-white shadow-sm">
              <div className="mb-5 flex items-center gap-2">
                <Search className="h-5 w-5 text-[#F48FB1]" />
                <h2 className="text-2xl font-black">Find students</h2>
              </div>

              <Input
                value={search}
                onChange={(event) => setSearch(event.target.value)}
                placeholder="Search username, interest, branch, year..."
                className="bg-white text-[#26111D]"
              />

              <div className="mt-5 grid gap-3 md:grid-cols-2">
                {visibleProfiles.length === 0 ? (
                  <div className="rounded-2xl bg-white/10 p-6 text-white/70 md:col-span-2">
                    No profiles match your search.
                  </div>
                ) : (
                  visibleProfiles.map((profile) => (
                    <div key={profile.id} className="rounded-2xl bg-white/10 p-4">
                      <div className="flex items-start justify-between gap-3">
                        <div>
                          <p className="text-lg font-black">@{profile.username}</p>
                          <p className="text-sm text-white/60">
                            {profile.displayName} • {profile.branch} • {profile.year}
                          </p>
                          <p className="mt-2 text-sm text-white/80">{profile.bio || "No bio yet."}</p>
                          <p className="mt-2 text-sm text-[#F48FB1]">Looking for: {profile.lookingFor}</p>
                        </div>

                        <Button size="icon" variant="ghost" onClick={() => toggleSaved(profile.id)}>
                          <Star className={`h-4 w-4 ${profile.saved ? "fill-[#F48FB1] text-[#F48FB1]" : "text-white"}`} />
                        </Button>
                      </div>

                      <div className="mt-3 flex flex-wrap gap-2">
                        {profile.interests.map((interest) => (
                          <Badge key={interest} className="bg-white/10 text-white hover:bg-white/10">
                            {interest}
                          </Badge>
                        ))}
                      </div>

                      <Button variant="outline" className="mt-4 border-white/30 bg-white text-[#26111D]" size="sm">
                        Request connect
                      </Button>
                    </div>
                  ))
                )}
              </div>
            </Card>

            <Card className="border-[#F6C6D7] bg-white/80 p-6 shadow-sm">
              <div className="mb-5 flex items-center justify-between">
                <h2 className="text-2xl font-black">Saved profiles</h2>
                <Badge className="bg-[#FFF0F5] text-[#EC3A7A] hover:bg-[#FFF0F5]">
                  {savedProfiles.length} saved
                </Badge>
              </div>

              <div className="space-y-3">
                {savedProfiles.length === 0 ? (
                  <div className="rounded-2xl border border-dashed border-[#F6C6D7] p-8 text-center text-[#6F4B5D]">
                    Save profiles from search to find them again.
                  </div>
                ) : (
                  savedProfiles.map((profile) => (
                    <div key={profile.id} className="rounded-2xl border border-[#F6C6D7] bg-[#FFF7FA] p-4">
                      <div className="flex items-center justify-between gap-3">
                        <div>
                          <p className="font-black">@{profile.username}</p>
                          <p className="text-sm text-[#6F4B5D]">{profile.lookingFor}</p>
                        </div>
                        <Button variant="ghost" size="icon" onClick={() => toggleSaved(profile.id)}>
                          <Star className="h-4 w-4 fill-[#EC3A7A] text-[#EC3A7A]" />
                        </Button>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </Card>

            <Card className="border-[#F6C6D7] bg-white/80 p-6 shadow-sm">
              <h2 className="text-2xl font-black">Clubs directory</h2>
              <div className="mt-5 grid gap-3 md:grid-cols-2">
                {clubDirectory.map((club) => (
                  <div key={club.name} className="rounded-2xl border border-[#F6C6D7] bg-[#FFF7FA] p-4">
                    <p className="font-black">{club.name}</p>
                    <p className="mt-1 text-sm text-[#6F4B5D]">{club.focus}</p>
                  </div>
                ))}
              </div>
            </Card>

            <Card className="border-[#F6C6D7] bg-white/80 p-6 shadow-sm">
              <div className="mb-5 flex items-center justify-between">
                <h2 className="text-2xl font-black">Forum posts</h2>
                <Badge className="bg-[#FFF0F5] text-[#EC3A7A] hover:bg-[#FFF0F5]">{posts.length} posts</Badge>
              </div>

              <div className="space-y-3">
                {posts.length === 0 ? (
                  <div className="rounded-2xl border border-dashed border-[#F6C6D7] p-8 text-center text-[#6F4B5D]">
                    No posts yet.
                  </div>
                ) : (
                  posts.map((post) => (
                    <div key={post.id} className="rounded-2xl border border-[#F6C6D7] bg-[#FFF7FA] p-4">
                      <div className="flex items-start justify-between gap-3">
                        <div>
                          <p className="font-black">
                            {post.anonymous ? "Anonymous" : `@${post.username}`} • {post.topic}
                          </p>
                          <p className="text-xs text-[#6F4B5D]">{post.createdAt}</p>
                          <p className="mt-2 text-sm">{post.body}</p>
                        </div>

                        <Button variant="ghost" size="icon" onClick={() => deletePost(post.id)}>
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