"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { ArrowLeft, Sparkles } from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export default function LoginPage() {
  const supabase = createClient();
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleLogin(event: React.FormEvent) {
    event.preventDefault();
    setLoading(true);
    setMessage("");

    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      setMessage(error.message);
    } else {
      router.push("/dashboard");
      router.refresh();
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
          <div className="hidden bg-[#26111D] p-10 text-white md:block">
            <div className="mb-12 inline-flex rounded-full bg-white/10 px-4 py-2 text-sm font-bold text-[#F48FB1]">
              HerCatalyst ID
            </div>
            <h1 className="text-4xl font-black leading-tight">
              Welcome back to your intelligent STEM workspace.
            </h1>
            <p className="mt-5 leading-7 text-white/65">
              Sign in with your verified email to open your private dashboard.
            </p>
          </div>

          <div className="p-8 md:p-10">
            <div className="mb-8 flex h-12 w-12 items-center justify-center rounded-2xl bg-[#EC3A7A] text-white">
              <Sparkles className="h-6 w-6" />
            </div>

            <h2 className="text-3xl font-black">Log in</h2>
            <p className="mt-2 text-[#6F4B5D]">Use your verified email and password.</p>

            <form onSubmit={handleLogin} className="mt-8 space-y-5">
              <div className="space-y-2">
                <Label>Email</Label>
                <Input type="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
              </div>

              <div className="space-y-2">
                <Label>Password</Label>
                <Input type="password" value={password} onChange={(e) => setPassword(e.target.value)} required />
              </div>

              <Button disabled={loading} className="w-full bg-[#EC3A7A] text-white hover:bg-[#d82f6d]">
                {loading ? "Opening..." : "Log in"}
              </Button>
            </form>

            {message && <p className="mt-5 text-center text-sm font-bold text-[#EC3A7A]">{message}</p>}

            <p className="mt-6 text-center text-sm text-[#6F4B5D]">
              New here?{" "}
              <Link href="/auth/signup" className="font-bold text-[#EC3A7A]">
                Create an account
              </Link>
            </p>
          </div>
        </Card>
      </section>
    </main>
  );
}
