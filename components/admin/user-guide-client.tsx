"use client";

import { useState } from "react";
import Link from "next/link";
import { GUIDE_ENTRIES, GuideGroup } from "@/lib/data/user-guide-data";
import {
  BookOpen,
  CreditCard,
  Sparkles,
  ArrowRight,
  ArrowLeft,
  Search,
  Info,
  CheckCircle2,
  ChevronRight,
  HelpCircle,
} from "lucide-react";

export function UserGuideClient() {
  const [search, setSearch] = useState("");
  const [group, setGroup] = useState<GuideGroup>("all");
  const [activeId, setActiveId] = useState<string>(GUIDE_ENTRIES[1].id); // Default to Overview

  const filtered = GUIDE_ENTRIES.filter((entry) => {
    const matchesGroup = group === "all" || entry.group === group;
    const q = search.toLowerCase();
    const matchesSearch =
      !q ||
      entry.title.toLowerCase().includes(q) ||
      entry.summary.toLowerCase().includes(q) ||
      entry.route.toLowerCase().includes(q) ||
      entry.steps.some((s) => s.toLowerCase().includes(q)) ||
      entry.tip.toLowerCase().includes(q);
    return matchesGroup && matchesSearch;
  });

  const activeEntry =
    filtered.find((e) => e.id === activeId) || filtered[0] || GUIDE_ENTRIES[0];

  const currentIdx = filtered.findIndex((e) => e.id === activeEntry.id);
  const prevEntry = currentIdx > 0 ? filtered[currentIdx - 1] : null;
  const nextEntry =
    currentIdx >= 0 && currentIdx < filtered.length - 1 ? filtered[currentIdx + 1] : null;

  return (
    <div className="space-y-5 max-w-6xl mx-auto pb-10">
      {/* Top Header Banner */}
      <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="space-y-1">
          <h1 className="text-xl font-bold text-slate-900 tracking-tight flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-blue-600 text-white flex items-center justify-center shrink-0">
              <BookOpen className="w-5 h-5" />
            </div>
            User Guide & Operations Manual
          </h1>
          <p className="text-xs text-slate-500">
            Select any module from the chapter list to view step-by-step instructions, tips, and shortcuts.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2 shrink-0">
          <Link
            href="/admin/pos"
            className="inline-flex items-center gap-1.5 px-3.5 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-semibold shadow-xs transition"
          >
            <CreditCard className="w-4 h-4" /> Open POS
          </Link>
          <Link
            href="/admin/purchases/new"
            className="inline-flex items-center gap-1.5 px-3.5 py-2 bg-slate-100 hover:bg-slate-200 text-slate-800 rounded-xl text-xs font-semibold transition"
          >
            <Sparkles className="w-4 h-4 text-blue-600" /> AI Invoice Agent
          </Link>
        </div>
      </div>

      {/* Search & Category Tabs */}
      <div className="bg-white p-3.5 rounded-xl border border-slate-200 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="relative flex-1 max-w-md">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
          <input
            type="text"
            placeholder="Search any page or feature (e.g. GPay, Khata, Return, AI)..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-9 pr-3 py-1.5 text-xs bg-slate-50 border border-slate-200 rounded-lg text-slate-900 focus:outline-none focus:ring-1 focus:ring-blue-500"
          />
        </div>

        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 sm:pb-0 text-xs">
          {(
            [
              { id: "all", label: `All (${GUIDE_ENTRIES.length})` },
              { id: "sales", label: "POS & Ops" },
              { id: "inventory", label: "Stock & AI" },
              { id: "customers", label: "Customers" },
              { id: "finance", label: "Finance" },
            ] as { id: GuideGroup; label: string }[]
          ).map((tab) => (
            <button
              key={tab.id}
              type="button"
              onClick={() => setGroup(tab.id)}
              className={`px-3 py-1.5 rounded-lg font-semibold transition shrink-0 ${
                group === tab.id
                  ? "bg-blue-600 text-white"
                  : "bg-slate-100 text-slate-600 hover:bg-slate-200"
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* Velom-Style Split Documentation Reader: Chapter Index + Reading Pane */}
      {filtered.length === 0 ? (
        <div className="bg-white p-10 rounded-2xl border border-slate-200 text-center space-y-2">
          <p className="text-sm font-semibold text-slate-800">
            No guide sections matched &ldquo;{search}&rdquo;
          </p>
          <button
            type="button"
            onClick={() => {
              setSearch("");
              setGroup("all");
            }}
            className="text-xs font-semibold text-blue-600 hover:underline"
          >
            Reset search & filters
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-start">
          {/* Left Chapter Index Sidebar */}
          <aside className="lg:col-span-4 bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden lg:sticky lg:top-4">
            <div className="p-3.5 border-b border-slate-100 bg-slate-50 flex items-center justify-between">
              <span className="text-2xs font-bold text-slate-500 uppercase tracking-wider">
                Chapters ({filtered.length})
              </span>
              <span className="text-2xs text-slate-400">Tap to read</span>
            </div>
            <div className="divide-y divide-slate-100 max-h-[340px] lg:max-h-[620px] overflow-y-auto">
              {filtered.map((item) => {
                const isSelected = item.id === activeEntry.id;
                return (
                  <button
                    key={item.id}
                    type="button"
                    onClick={() => setActiveId(item.id)}
                    className={`w-full px-4 py-3 text-left flex items-center justify-between gap-2 transition ${
                      isSelected
                        ? "bg-blue-50 text-blue-700 font-semibold border-l-4 border-l-blue-600"
                        : "text-slate-700 hover:bg-slate-50"
                    }`}
                  >
                    <div className="min-w-0">
                      <p className="text-xs truncate">{item.title}</p>
                      <span className="text-2xs font-mono text-slate-400">
                        {item.route}
                      </span>
                    </div>
                    <ChevronRight
                      className={`w-4 h-4 shrink-0 ${
                        isSelected ? "text-blue-600" : "text-slate-300"
                      }`}
                    />
                  </button>
                );
              })}
            </div>
          </aside>

          {/* Right Detailed Reading Pane */}
          <div className="lg:col-span-8 bg-white rounded-2xl border border-slate-200 shadow-xs p-5 sm:p-7 space-y-6">
            {/* Chapter Header */}
            <div className="space-y-3 pb-5 border-b border-slate-100">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <div className="flex items-center gap-2">
                  <span className="px-2.5 py-1 rounded-full text-2xs font-mono bg-slate-100 text-slate-600 border border-slate-200">
                    {activeEntry.route}
                  </span>
                  <span
                    className={`px-2.5 py-1 rounded-full text-2xs font-semibold border ${
                      activeEntry.role === "Owner Only"
                        ? "bg-blue-50 text-blue-700 border-blue-200"
                        : "bg-emerald-50 text-emerald-700 border-emerald-200"
                    }`}
                  >
                    {activeEntry.role}
                  </span>
                </div>

                <Link
                  href={activeEntry.route}
                  className="inline-flex items-center gap-1.5 px-3.5 py-1.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-semibold shadow-2xs transition"
                >
                  {activeEntry.cta} <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </div>

              <h2 className="text-lg sm:text-xl font-bold text-slate-900">
                {activeEntry.title}
              </h2>
              <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                {activeEntry.summary}
              </p>
            </div>

            {/* Step-by-Step Guide */}
            <div className="space-y-3">
              <h3 className="text-xs font-bold text-slate-500 uppercase tracking-wider">
                Step-by-Step Instructions
              </h3>
              <div className="space-y-3">
                {activeEntry.steps.map((step, idx) => (
                  <div
                    key={idx}
                    className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 flex items-start gap-3"
                  >
                    <span className="w-6 h-6 rounded-full bg-blue-600 text-white font-bold text-xs flex items-center justify-center shrink-0 mt-0.5">
                      {idx + 1}
                    </span>
                    <p className="text-xs sm:text-sm text-slate-800 leading-relaxed">
                      {step}
                    </p>
                  </div>
                ))}
              </div>
            </div>

            {/* Pro Tip */}
            <div className="p-4 rounded-xl bg-blue-50 border border-blue-200 flex items-start gap-3">
              <Info className="w-4 h-4 text-blue-600 shrink-0 mt-0.5" />
              <div className="text-xs text-blue-900 leading-relaxed">
                <strong className="font-bold">Pro Tip:</strong> {activeEntry.tip}
              </div>
            </div>

            {/* FAQs if present */}
            {activeEntry.faqs && activeEntry.faqs.length > 0 && (
              <div className="space-y-2.5 pt-2">
                <h3 className="text-xs font-bold text-slate-500 uppercase tracking-wider flex items-center gap-1.5">
                  <HelpCircle className="w-3.5 h-3.5 text-blue-600" /> Frequently Asked
                </h3>
                {activeEntry.faqs.map((faq, idx) => (
                  <div
                    key={idx}
                    className="p-3.5 rounded-xl border border-slate-200 bg-white space-y-1"
                  >
                    <p className="text-xs font-bold text-slate-900">{faq.q}</p>
                    <p className="text-xs text-slate-600 leading-relaxed">{faq.a}</p>
                  </div>
                ))}
              </div>
            )}

            {/* Previous / Next Chapter Navigation */}
            <div className="pt-4 border-t border-slate-100 flex items-center justify-between gap-3">
              {prevEntry ? (
                <button
                  type="button"
                  onClick={() => setActiveId(prevEntry.id)}
                  className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-600 hover:text-blue-600 transition"
                >
                  <ArrowLeft className="w-3.5 h-3.5" />
                  <span className="truncate max-w-[160px] sm:max-w-xs">{prevEntry.title}</span>
                </button>
              ) : (
                <span />
              )}

              {nextEntry && (
                <button
                  type="button"
                  onClick={() => setActiveId(nextEntry.id)}
                  className="inline-flex items-center gap-1.5 text-xs font-semibold text-blue-600 hover:text-blue-700 transition ml-auto"
                >
                  <span className="truncate max-w-[160px] sm:max-w-xs">{nextEntry.title}</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
