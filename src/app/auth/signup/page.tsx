import Link from "next/link";
import { ArrowLeft, Rocket } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export default function SignupPage() {
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
              Build a dashboard that understands your ambition and your real life.
            </h1>
            <p className="mt-5 leading-7 text-white/80">
              Academics, wellness, safety, career, money, and community in one place.
            </p>
          </div>

          <div className="p-8 md:p-10">
            <div className="mb-8 flex h-12 w-12 items-center justify-center rounded-2xl bg-[#EC3A7A] text-white">
              <Rocket className="h-6 w-6" />
            </div>

            <h2 className="text-3xl font-black">Create account</h2>
            <p className="mt-2 text-[#6F4B5D]">Start your HerCatalyst workspace.</p>

            <form className="mt-8 space-y-5">
              <div className="space-y-2">
                <Label>Name</Label>
                <Input placeholder="Your name" />
              </div>

              <div className="space-y-2">
                <Label>Email</Label>
                <Input type="email" placeholder="you@example.com" />
              </div>

              <div className="space-y-2">
                <Label>Password</Label>
                <Input type="password" placeholder="Create a password" />
              </div>

              <Link href="/dashboard">
                <Button className="mt-2 w-full bg-[#EC3A7A] text-white hover:bg-[#d82f6d]">
                  Create workspace
                </Button>
              </Link>
            </form>

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