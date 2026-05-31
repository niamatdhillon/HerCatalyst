"use client";

import Link from "next/link";
import { useState } from "react";
import { ArrowLeft, Rocket } from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export default function SignupPage() {
  const supabase = createClient();
  const [displayName, setDisplayName] = useState("");
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

async function handleSignup(event: React.FormEvent) {
  event.preventDefault();

  setLoading(true);
  setMessage("");

  try {
    const cleanUsername = username
      .toLowerCase()
      .trim()
      .replace(/\s+/g, ".");

    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        emailRedirectTo: `${window.location.origin}/auth/callback`,
        data: {
          username: cleanUsername,
          display_name: displayName,
        },
      },
    });

    console.log("SIGNUP DATA:", data);
    console.log("SIGNUP ERROR:", error);

    if (error) {
      setMessage(error.message);
    } else {
      setMessage("Signup successful! Check your email.");
    }
  } catch (err) {
    console.error(err);
    setMessage("Something went wrong during signup.");
  }

  setLoading(false);
}

  return (
    <main className="min-h-screen bg-[#FFF7FA] px-6 py-8 text-[#26111D]">
      <Link href="/" className="inline-flex items-center gap-2 font-semibold text-[#EC3A7A]">
        <ArrowLeft className="h-4 w-4" />
        Back to home
      </Link>

      <section className="mx-auto flex min-h-[80vh] max-w-6xl items-center justify-center">
        <Card className="grid w-full max-w-5xl overflow-hidden border-[#F6C6D7] bg-white/80 shadow-2xl shadow-[#EC3A7A]/10 md:grid-cols-2">
          <div className="hidden bg-gradient-to-br from-[#EC3A7A] via-[#F15A24] to-[#1E9CD7] p-10 text-white md:block">
            <div className="mb-12 inline-flex rounded-full bg-white/15 px-4 py-2 text-sm font-bold">
              Begin your catalyst era
            </div>
            <h1 className="text-4xl font-black leading-tight">
              Create your private student OS.
            </h1>
            <p className="mt-5 leading-7 text-white/80">
              Verify your email, claim your username, and enter HerCatalyst.
            </p>
          </div>

          <div className="p-8 md:p-10">
            <div className="mb-8 flex h-12 w-12 items-center justify-center rounded-2xl bg-[#EC3A7A] text-white">
              <Rocket className="h-6 w-6" />
            </div>

            <h2 className="text-3xl font-black">Create account</h2>
            <p className="mt-2 text-[#6F4B5D]">Your email must be verified before login.</p>

            <form onSubmit={handleSignup} className="mt-8 space-y-5">
              <div className="space-y-2">
                <Label>Name</Label>
                <Input value={displayName} onChange={(e) => setDisplayName(e.target.value)} required />
              </div>

              <div className="space-y-2">
                <Label>Username</Label>
                <Input value={username} onChange={(e) => setUsername(e.target.value)} placeholder="niamat.codes" required />
              </div>

              <div className="space-y-2">
                <Label>Email</Label>
                <Input type="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
              </div>

              <div className="space-y-2">
                <Label>Password</Label>
                <Input type="password" value={password} onChange={(e) => setPassword(e.target.value)} required minLength={6} />
              </div>

              <Button disabled={loading} className="w-full bg-[#EC3A7A] text-white hover:bg-[#d82f6d]">
                {loading ? "Creating..." : "Create account"}
              </Button>
            </form>

            {message && <p className="mt-5 text-center text-sm font-bold text-[#EC3A7A]">{message}</p>}

            <p className="mt-6 text-center text-sm text-[#6F4B5D]">
              Already have an account?{" "}
              <Link href="/auth/login" className="font-bold text-[#EC3A7A]">
                Log in
              </Link>
            </p>
          </div>
        </Card>
      </section>
    </main>
  );
}
