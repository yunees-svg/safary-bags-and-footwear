"use client";

import { useState } from "react";
import { loginWithEmail } from "@/lib/actions/auth";
import {
  Footprints,
  ShoppingBag,
  Sparkles,
  Lock,
  Mail,
  AlertCircle,
  Loader2,
  ArrowRight,
  ShieldCheck,
} from "lucide-react";

export default function LoginPage() {
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError(null);
    setIsLoading(true);
    const formData = new FormData(e.currentTarget);
    const res = await loginWithEmail(formData);
    if (res?.error) {
      setError(res.error);
      setIsLoading(false);
    }
  }

  return (
    <div className="relative min-h-screen bg-[#0b1120] text-[#f4f7fc] flex flex-col justify-center px-4 py-10 sm:px-6 lg:px-8 overflow-hidden">
      {/* Ambient Animated Background Glows */}
      <div className="pointer-events-none absolute -top-36 -right-32 w-[420px] h-[420px] rounded-full bg-[#1f5fff]/20 blur-[120px] animate-pulse" />
      <div className="pointer-events-none absolute -bottom-36 -left-32 w-[380px] h-[380px] rounded-full bg-[#5b8cff]/15 blur-[120px] animate-pulse" />

      {/* Subtle Tech Grid */}
      <div
        className="pointer-events-none absolute inset-0 opacity-[0.05]"
        style={{
          backgroundImage:
            "linear-gradient(to right, #5b8cff 1px, transparent 1px), linear-gradient(to bottom, #5b8cff 1px, transparent 1px)",
          backgroundSize: "44px 44px",
        }}
      />

      {/* Brand Hero with Motion Graphics */}
      <div className="relative sm:mx-auto sm:w-full sm:max-w-md text-center animate-fade-up">
        <div className="relative inline-flex items-center justify-center mb-5">
          {/* Rotating Orbital Ring */}
          <div className="absolute w-24 h-24 rounded-full border border-dashed border-[#1f5fff]/45 animate-[spin_12s_linear_infinite]" />
          <div className="absolute w-20 h-20 rounded-2xl bg-[#1f5fff]/20 blur-xl animate-pulse" />

          {/* Floating Category Badges */}
          <div className="absolute -left-8 -top-1 w-8 h-8 rounded-xl bg-[#111a2e] border border-[#1e2a44] text-[#5b8cff] flex items-center justify-center shadow-lg animate-[bounce_2.8s_ease-in-out_infinite]">
            <ShoppingBag className="w-3.5 h-3.5" />
          </div>
          <div
            className="absolute -right-8 -bottom-1 w-8 h-8 rounded-xl bg-[#111a2e] border border-[#1e2a44] text-[#2ad69a] flex items-center justify-center shadow-lg animate-[bounce_2.8s_ease-in-out_infinite]"
            style={{ animationDelay: "0.4s" }}
          >
            <Footprints className="w-3.5 h-3.5" />
          </div>

          {/* Core Emblem */}
          <div className="relative w-16 h-16 rounded-[18px] bg-gradient-to-br from-[#162036] to-[#0d1424] border-2 border-[#1f5fff] text-[#f4f7fc] font-extrabold text-2xl flex items-center justify-center shadow-[0_0_28px_rgba(31,95,255,0.5)]">
            S
            <Sparkles className="w-3 h-3 text-[#5b8cff] absolute top-1.5 right-1.5 animate-pulse" />
          </div>
        </div>

        <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-[#f4f7fc]">
          Safary{" "}
          <span className="bg-gradient-to-r from-[#5b8cff] to-[#1f5fff] bg-clip-text text-transparent">
            Bags &amp; Footwear
          </span>
        </h1>
        <p className="mt-1.5 text-xs sm:text-sm text-[#8896b3]">
          POS Billing • Inventory • AI Invoice Console
        </p>
      </div>

      {/* Login Card */}
      <div className="relative mt-7 sm:mx-auto sm:w-full sm:max-w-md animate-scale-in">
        <div className="bg-[#111a2e]/95 backdrop-blur-md py-7 px-6 shadow-[0_20px_60px_rgba(0,0,0,0.45)] border border-[#1e2a44] rounded-[22px] sm:px-9">
          <div className="flex items-center justify-between pb-4 mb-5 border-b border-[#1e2a44]">
            <div>
              <h2 className="text-sm font-bold text-[#f4f7fc]">Owner &amp; Staff Sign In</h2>
              <p className="text-2xs text-[#8896b3] mt-0.5">Access your live store console</p>
            </div>
            <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-[#162036] border border-[#1e2a44] text-2xs font-semibold text-[#2ad69a]">
              <ShieldCheck className="w-3.5 h-3.5" /> Secure
            </span>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            {error && (
              <div className="p-3 rounded-xl bg-red-950/60 border border-red-500/40 flex items-start gap-2 text-xs text-red-200">
                <AlertCircle className="w-4 h-4 shrink-0 text-red-400 mt-0.5" />
                <span>{error}</span>
              </div>
            )}

            <div>
              <label className="block text-xs font-semibold text-[#8896b3] mb-1.5">
                Email Address
              </label>
              <div className="relative">
                <Mail className="w-4 h-4 text-[#8896b3] absolute left-3.5 top-3" />
                <input
                  type="email"
                  name="email"
                  required
                  placeholder="you@example.com"
                  className="w-full pl-10 pr-3.5 py-2.5 bg-[#162036] border border-[#1e2a44] rounded-xl text-sm text-[#f4f7fc] placeholder-[#8896b3]/60 focus:outline-none focus:ring-2 focus:ring-[#1f5fff] focus:border-[#1f5fff] transition"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-[#8896b3] mb-1.5">
                Password
              </label>
              <div className="relative">
                <Lock className="w-4 h-4 text-[#8896b3] absolute left-3.5 top-3" />
                <input
                  type="password"
                  name="password"
                  required
                  placeholder="••••••••"
                  className="w-full pl-10 pr-3.5 py-2.5 bg-[#162036] border border-[#1e2a44] rounded-xl text-sm text-[#f4f7fc] placeholder-[#8896b3]/60 focus:outline-none focus:ring-2 focus:ring-[#1f5fff] focus:border-[#1f5fff] transition"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full flex items-center justify-center gap-2 py-3 px-4 rounded-xl text-sm font-semibold text-white bg-gradient-to-r from-[#1f5fff] to-[#3b76ff] hover:brightness-110 shadow-[0_6px_22px_rgba(31,95,255,0.4)] focus:outline-none focus:ring-2 focus:ring-[#5b8cff] disabled:opacity-50 transition-all duration-150"
            >
              {isLoading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  Authenticating...
                </>
              ) : (
                <>
                  Sign In to Dashboard
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </form>
        </div>

        {/* Bottom Feature Pills */}
        <div className="mt-5 flex flex-wrap items-center justify-center gap-2 text-2xs text-[#8896b3]">
          <span className="px-2.5 py-1 rounded-full bg-[#111a2e] border border-[#1e2a44]">⚡ Fast POS Billing</span>
          <span className="px-2.5 py-1 rounded-full bg-[#111a2e] border border-[#1e2a44]">📦 Live Stock Tracking</span>
          <span className="px-2.5 py-1 rounded-full bg-[#111a2e] border border-[#1e2a44]">🧾 AI Bill Scanner</span>
        </div>
      </div>
    </div>
  );
}
