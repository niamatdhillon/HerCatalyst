"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  FiActivity, FiCheckSquare, FiTrendingUp, 
  FiSmile, FiLock, FiMail, FiUser, FiArrowRight, FiCompass 
} from "react-icons/fi";

export default function HomePage() {
  const [isAuthOpen, setIsAuthOpen] = useState(false);
  const [authMode, setAuthMode] = useState<"login" | "signup">("login");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");

  const handleAuthSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Smooth transition straight to the dashboard workspace code
    window.location.href = "/dashboard";
  };

  return (
    <div className="relative min-h-screen bg-[#FFF7FA] text-[#0D47A1] font-sans overflow-x-hidden selection:bg-[#F48FB1] selection:text-white">
      
      {/* CINEMATIC ANIMATED AURA BLOBS */}
      <div className="absolute top-0 left-0 right-0 h-[700px] overflow-hidden pointer-events-none z-0">
        <div className="absolute -top-40 -left-20 w-[600px] h-[600px] rounded-full bg-[#F48FB1] opacity-30 blur-[130px] animate-aura-one" />
        <div className="absolute top-40 right-[-10%] w-[650px] h-[650px] rounded-full bg-[#EC3A7A] opacity-25 blur-[140px] animate-aura-two" />
        <div className="absolute top-[350px] left-[15%] w-[500px] h-[500px] rounded-full bg-[#1E9CD7] opacity-20 blur-[110px] animate-glow-slow" />
      </div>

      {/* STICKY PLATFORM BRAND HEADER */}
      <header className="relative z-10 max-w-7xl mx-auto px-6 py-6 flex justify-between items-center">
        <div className="flex items-center space-x-3">
          <span className="text-2xl font-black tracking-tight bg-gradient-to-r from-[#EC3A7A] via-[#F15A24] to-[#1E9CD7] bg-clip-text text-transparent">
            HerCatalyst
          </span>
          <span className="text-[10px] uppercase tracking-widest font-bold px-2.5 py-0.5 rounded-full bg-[#EC3A7A]/10 text-[#EC3A7A] backdrop-blur-md border border-[#EC3A7A]/20">
            STEM OS v1.0
          </span>
        </div>
        <div className="flex items-center space-x-6">
          <button 
            onClick={() => { setAuthMode("login"); setIsAuthOpen(true); }}
            className="text-sm font-bold text-slate-700 hover:text-[#EC3A7A] transition-colors"
          >
            Sign In
          </button>
          <button 
            onClick={() => { setAuthMode("signup"); setIsAuthOpen(true); }}
            className="bg-[#EC3A7A] text-white text-sm font-bold px-5 py-2.5 rounded-full shadow-lg shadow-[#EC3A7A]/20 hover:bg-[#EC3A7A]/90 hover:scale-105 transition-all"
          >
            Create Account
          </button>
        </div>
      </header>

      {/* HERO HEROICS & ECOSYSTEM SHOWCASE */}
      <main className="relative z-10 max-w-7xl mx-auto px-6 pt-16 pb-24 grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
        
        {/* VALUE PROPOSITION TEXT FRAME */}
        <div className="lg:col-span-6 space-y-8 text-center lg:text-left">
          <div className="inline-flex items-center space-x-2 bg-white/80 backdrop-blur-md px-4 py-2 rounded-full border border-[#EC3A7A]/10 shadow-sm">
            <span className="flex h-2 w-2 rounded-full bg-[#F15A24] animate-pulse" />
            <p className="text-xs font-bold tracking-wide uppercase text-slate-600">
              The Intelligent Ecosystem
            </p>
          </div>
          
          <h1 className="text-5xl sm:text-6xl font-black tracking-tight text-slate-900 leading-[1.1]">
            An emotionally intelligent <br/>
            <span className="bg-gradient-to-r from-[#EC3A7A] to-[#F15A24] bg-clip-text text-transparent">
              operating system
            </span> <br/>
            for women in STEM.
          </h1>

          <p className="text-lg text-slate-600 font-medium max-w-xl mx-auto lg:mx-0 leading-relaxed">
            Built beautifully for ambitious students balancing brilliance and burnout. 
            Finally, your academics, cycle-aware flow state, wellness diagnostics, and future portfolio live in one premium workspace.
          </p>

          <div className="flex flex-col sm:flex-row justify-center lg:justify-start items-center gap-4 pt-2">
            <button
              onClick={() => { setAuthMode("signup"); setIsAuthOpen(true); }}
              className="w-full sm:w-auto bg-slate-900 text-white text-base font-bold px-8 py-4 rounded-2xl shadow-xl shadow-slate-900/10 hover:bg-slate-800 hover:-translate-y-0.5 transition-all flex items-center justify-center space-x-3"
            >
              <span>Get Started Now</span>
              <FiArrowRight className="w-5 h-5" />
            </button>
            <a
              href="/dashboard"
              className="w-full sm:w-auto bg-white/80 backdrop-blur-md border border-slate-200 text-slate-800 text-base font-bold px-8 py-4 rounded-2xl hover:bg-white shadow-sm flex items-center justify-center space-x-2 hover:-translate-y-0.5 transition-all"
            >
              <FiCompass className="w-5 h-5 text-[#1E9CD7]" />
              <span>Explore Dashboard</span>
            </a>
          </div>
        </div>

        {/* RIGHT DECK: FLOATING APP PREVIEW CARDS */}
        <div className="lg:col-span-6 relative flex flex-col items-center justify-center">
          
          {/* Main Container Built with Custom Glassmorphism */}
          <div className="w-full max-w-[520px] glass-panel rounded-3xl p-6 shadow-2xl shadow-[#EC3A7A]/5 space-y-6 relative z-10 animate-float-ui">
            
            {/* Widget 1: AI Readiness Index Card */}
            <div className="bg-gradient-to-br from-slate-900 via-slate-850 to-slate-800 text-white p-5 rounded-2xl shadow-xl relative overflow-hidden">
              <div className="absolute -right-6 -bottom-6 w-24 h-24 bg-[#1E9CD7]/20 rounded-full blur-xl" />
              <div className="flex justify-between items-start">
                <div>
                  <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">Cognitive Analytics</p>
                  <h3 className="text-2xl font-black mt-1">AI Readiness Index</h3>
                </div>
                <span className="bg-[#1E9CD7]/20 text-[#1E9CD7] text-xs font-black px-2.5 py-1 rounded-lg border border-[#1E9CD7]/30">
                  Peak Focus Phase
                </span>
              </div>
              <div className="mt-6 flex items-baseline space-x-2">
                <span className="text-5xl font-black tracking-tight bg-gradient-to-r from-white to-slate-300 bg-clip-text text-transparent">94%</span>
                <span className="text-xs text-emerald-400 font-bold flex items-center">
                  <FiTrendingUp className="mr-1" /> +12% Efficiency
                </span>
              </div>
              <p className="text-xs text-slate-300 mt-2 font-medium leading-relaxed">
                Your biological profile targets optimal neural recall conditions today. Ideal for running high-intensity algorithmic parsing and system compilation.
              </p>
            </div>

            {/* Split Grid Trackers */}
            <div className="grid grid-cols-2 gap-4">
              
              {/* Widget 2: Cycle Interface */}
              <div className="bg-white/90 backdrop-blur-md p-4 rounded-2xl shadow-md border border-slate-100/80 animate-float-ui-delayed">
                <div className="flex items-center space-x-2 text-[#EC3A7A]">
                  <FiActivity className="w-4 h-4 animate-pulse" />
                  <span className="text-xs font-bold uppercase tracking-wider text-slate-400">Bio Metric</span>
                </div>
                <h4 className="text-lg font-black mt-2 text-slate-800">Follicular Phase</h4>
                <div className="w-full bg-slate-100 h-2 rounded-full mt-3 overflow-hidden">
                  <div className="bg-[#EC3A7A] h-full w-[75%] rounded-full" />
                </div>
                <p className="text-[11px] text-slate-500 mt-2 font-medium">Day 9 — High Estrogen Drive</p>
              </div>

              {/* Widget 3: Mood Tracker */}
              <div className="bg-white/90 backdrop-blur-md p-4 rounded-2xl shadow-md border border-slate-100/80 animate-float-ui">
                <div className="flex items-center space-x-2 text-[#F7931E]">
                  <FiSmile className="w-4 h-4" />
                  <span className="text-xs font-bold uppercase tracking-wider text-slate-400">Mind Balance</span>
                </div>
                <h4 className="text-lg font-black mt-2 text-slate-800">Grounded & Calm</h4>
                <div className="flex space-x-1 mt-3">
                  {[4, 5, 5, 4, 5].map((val, idx) => (
                    <div 
                      key={idx} 
                      className={`h-4 w-full rounded-md ${idx === 4 ? 'bg-[#F7931E]' : 'bg-[#F7931E]/20'}`} 
                    />
                  ))}
                </div>
                <p className="text-[11px] text-slate-500 mt-2 font-medium">14 Day Logging Streak</p>
              </div>

            </div>

            {/* Widget 4: Core Tasks Ecosystem */}
            <div className="bg-white/90 backdrop-blur-md p-4 rounded-2xl shadow-md border border-slate-100/80 space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-xs font-bold uppercase tracking-wider text-slate-400 flex items-center">
                  <FiCheckSquare className="mr-1.5 text-[#1E9CD7]" /> Dynamic Planner
                </span>
                <span className="text-[11px] font-bold text-slate-400">Today</span>
              </div>
              <div className="space-y-2">
                <div className="flex items-center justify-between p-2 rounded-xl bg-slate-50/80 border-l-4 border-[#EC3A7A]">
                  <p className="text-xs font-bold text-slate-700">Compile Lab Frameworks</p>
                  <span className="text-[10px] bg-[#EC3A7A]/10 text-[#EC3A7A] px-2 py-0.5 rounded font-bold">14:00</span>
                </div>
                <div className="flex items-center justify-between p-2 rounded-xl bg-slate-50/80 border-l-4 border-[#1E9CD7]">
                  <p className="text-xs font-bold text-slate-700">STEM Strategy Alliance Meet</p>
                  <span className="text-[10px] bg-[#1E9CD7]/10 text-[#1E9CD7] px-2 py-0.5 rounded font-bold">16:30</span>
                </div>
              </div>
            </div>

          </div>

          {/* Deep Underlying Atmosphere Light Ring */}
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[115%] h-[115%] bg-gradient-to-tr from-[#F48FB1]/10 via-transparent to-[#1E9CD7]/10 blur-3xl pointer-events-none rounded-full" />
        </div>

      </main>

      {/* OVERLAY: HIGH-FIDELITY INTERACTIVE AUTH MODAL */}
      <AnimatePresence>
        {isAuthOpen && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-slate-900/40 backdrop-blur-md z-50 flex items-center justify-center p-4"
          >
            <motion.div 
              initial={{ scale: 0.95, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.95, y: 20 }}
              className="glass-modal w-full max-w-md rounded-3xl p-8 shadow-2xl relative overflow-hidden"
            >
              {/* Colored Ribbon Border Accent */}
              <div className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-[#EC3A7A] via-[#F15A24] to-[#1E9CD7]" />
              
              <button 
                onClick={() => setIsAuthOpen(false)}
                className="absolute top-5 right-5 text-slate-400 hover:text-slate-600 font-bold text-sm bg-slate-100/80 h-7 w-7 rounded-full flex items-center justify-center"
              >
                ✕
              </button>

              <div className="text-center space-y-2 mb-8">
                <h2 className="text-3xl font-black text-slate-900 tracking-tight">
                  {authMode === "login" ? "Welcome Back" : "Create Account"}
                </h2>
                <p className="text-sm text-slate-500 font-medium">
                  {authMode === "login" ? "Enter your connected ecosystem credentials" : "Initialize your academic & wellness node"}
                </p>
              </div>

              <form onSubmit={handleAuthSubmit} className="space-y-4">
                {authMode === "signup" && (
                  <div className="space-y-1">
                    <label className="text-xs font-bold text-slate-600 uppercase tracking-wide">Full Name</label>
                    <div className="relative">
                      <FiUser className="absolute left-4 top-3.5 text-slate-400" />
                      <input 
                        type="text" 
                        required
                        placeholder="Ada Lovelace"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        className="w-full bg-white/80 border border-slate-200 rounded-xl py-3 pl-11 pr-4 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-[#EC3A7A]/20 focus:border-[#EC3A7A]"
                      />
                    </div>
                  </div>
                )}

                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-600 uppercase tracking-wide">University Email</label>
                  <div className="relative">
                    <FiMail className="absolute left-4 top-3.5 text-slate-400" />
                    <input 
                      type="email" 
                      required
                      placeholder="you@university.edu"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="w-full bg-white/80 border border-slate-200 rounded-xl py-3 pl-11 pr-4 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-[#EC3A7A]/20 focus:border-[#EC3A7A]"
                    />
                  </div>
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-600 uppercase tracking-wide">Password</label>
                  <div className="relative">
                    <FiLock className="absolute left-4 top-3.5 text-slate-400" />
                    <input 
                      type="password" 
                      required
                      placeholder="••••••••"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="w-full bg-white/80 border border-slate-200 rounded-xl py-3 pl-11 pr-4 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-[#EC3A7A]/20 focus:border-[#EC3A7A]"
                    />
                  </div>
                </div>

                <button 
                  type="submit"
                  className="w-full bg-slate-900 text-white font-bold py-3.5 rounded-xl shadow-lg hover:bg-slate-800 transition-all mt-6"
                >
                  {authMode === "login" ? "Launch Platform Dashboard" : "Join the Movement"}
                </button>
              </form>

              <div className="mt-6 text-center">
                <button
                  onClick={() => setAuthMode(authMode === "login" ? "signup" : "login")}
                  className="text-xs font-bold text-[#EC3A7A] hover:underline"
                >
                  {authMode === "login" ? "New to the platform? Initialize an account" : "Already registered? Sign back in"}
                </button>
              </div>

            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}