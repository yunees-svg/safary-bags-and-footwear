"use client";

import { useEffect, useState } from "react";
import { ShoppingBag, Footprints, Sparkles } from "lucide-react";

const SPLASH_KEY = "safary_splash_shown";

export function AppSplashScreen() {
  const [visible, setVisible] = useState(false);
  const [exiting, setExiting] = useState(false);

  useEffect(() => {
    try {
      if (sessionStorage.getItem(SPLASH_KEY)) return;
      sessionStorage.setItem(SPLASH_KEY, "1");
    } catch {
      // Continue even if sessionStorage is unavailable
    }

    const prefersReduced =
      typeof window !== "undefined" &&
      window.matchMedia?.("(prefers-reduced-motion: reduce)").matches;

    if (prefersReduced) return;

    setVisible(true);

    const exitTimer = setTimeout(() => setExiting(true), 1750);
    const hideTimer = setTimeout(() => setVisible(false), 2150);

    return () => {
      clearTimeout(exitTimer);
      clearTimeout(hideTimer);
    };
  }, []);

  if (!visible) return null;

  return (
    <div
      onClick={() => {
        setExiting(true);
        setTimeout(() => setVisible(false), 300);
      }}
      className={`fixed inset-0 z-[100] flex flex-col items-center justify-center bg-[#0b1120] text-[#f4f7fc] overflow-hidden select-none transition-opacity duration-400 ${
        exiting ? "opacity-0 pointer-events-none" : "opacity-100"
      }`}
      role="status"
      aria-label="Loading Safary Bags and Footwear"
    >
      {/* Ambient Radial Glows */}
      <div className="pointer-events-none absolute -top-32 -right-32 w-96 h-96 rounded-full bg-[#1f5fff]/20 blur-[110px] animate-pulse" />
      <div className="pointer-events-none absolute -bottom-32 -left-32 w-96 h-96 rounded-full bg-[#5b8cff]/15 blur-[110px] animate-pulse" />

      {/* Subtle Tech Grid */}
      <div
        className="pointer-events-none absolute inset-0 opacity-[0.06]"
        style={{
          backgroundImage:
            "linear-gradient(to right, #5b8cff 1px, transparent 1px), linear-gradient(to bottom, #5b8cff 1px, transparent 1px)",
          backgroundSize: "44px 44px",
        }}
      />

      {/* Center Motion Graphic */}
      <div className="relative flex flex-col items-center text-center px-6 animate-scale-in">
        <div className="relative flex items-center justify-center mb-7">
          {/* Outer Rotating Rings */}
          <div className="absolute w-32 h-32 rounded-full border border-dashed border-[#1f5fff]/45 animate-[spin_10s_linear_infinite]" />
          <div className="absolute w-28 h-28 rounded-full border border-dotted border-[#5b8cff]/35 animate-[spin_14s_linear_infinite_reverse]" />
          {/* Inner Glow Halo */}
          <div className="absolute w-24 h-24 rounded-3xl bg-[#1f5fff]/25 blur-xl animate-pulse" />

          {/* Floating Bag & Footwear Motion Badges */}
          <div className="absolute -left-10 -top-2 w-9 h-9 rounded-xl bg-[#111a2e] border border-[#1e2a44] text-[#5b8cff] flex items-center justify-center shadow-lg animate-[bounce_2.6s_ease-in-out_infinite]">
            <ShoppingBag className="w-4 h-4" />
          </div>
          <div
            className="absolute -right-10 -bottom-2 w-9 h-9 rounded-xl bg-[#111a2e] border border-[#1e2a44] text-[#2ad69a] flex items-center justify-center shadow-lg animate-[bounce_2.6s_ease-in-out_infinite]"
            style={{ animationDelay: "0.4s" }}
          >
            <Footprints className="w-4 h-4" />
          </div>

          {/* Core Brand Emblem */}
          <div className="relative w-20 h-20 rounded-[22px] bg-gradient-to-br from-[#162036] to-[#0d1424] border-2 border-[#1f5fff] flex items-center justify-center shadow-[0_0_36px_rgba(31,95,255,0.55)]">
            <span className="text-3xl font-extrabold tracking-tight text-[#f4f7fc]">
              S
            </span>
            <Sparkles className="w-3.5 h-3.5 text-[#5b8cff] absolute top-2 right-2 animate-pulse" />
          </div>
        </div>

        {/* Brand Title & Tagline */}
        <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-[#f4f7fc] animate-fade-up">
          Safary{" "}
          <span className="bg-gradient-to-r from-[#5b8cff] to-[#1f5fff] bg-clip-text text-transparent">
            Bags &amp; Footwear
          </span>
        </h1>
        <p className="mt-2 text-[11px] sm:text-xs font-semibold uppercase tracking-[0.24em] text-[#8896b3]">
          POS • Inventory • Smart Retail
        </p>

        {/* Animated Loading Sweep Bar */}
        <div className="mt-7 w-48 h-1.5 rounded-full bg-[#162036] border border-[#1e2a44] overflow-hidden">
          <div className="h-full rounded-full bg-gradient-to-r from-[#1f5fff] via-[#5b8cff] to-[#2ad69a] animate-[splashLoad_1.25s_ease-out_forwards]" />
        </div>
      </div>

      <style jsx>{`
        @keyframes splashLoad {
          0% {
            width: 0%;
          }
          100% {
            width: 100%;
          }
        }
      `}</style>
    </div>
  );
}
