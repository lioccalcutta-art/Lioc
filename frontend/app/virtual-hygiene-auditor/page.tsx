import React from "react";
import { Metadata } from "next";
import Link from "next/link";
import { Sparkles, ShieldCheck, CheckCircle2, ChevronRight, Calculator, Factory, TrendingDown } from "lucide-react";
import VirtualHygieneAuditor from "@/components/auditor/VirtualHygieneAuditor";

export const metadata: Metadata = {
  title: "AI Virtual Hygiene Auditor & Chemical Consumption Planner | LIOC",
  description:
    "Instant algorithmic facility chemical planning and ROI cost calculator. Calculate exact monthly cleaning chemical consumption, staff SOP dilution charts, and wholesale cost savings for hotels, hospitals, cloud kitchens, and corporate offices.",
  openGraph: {
    title: "AI Virtual Hygiene Auditor — Institutional Chemical Consumption & ROI Engine",
    description:
      "Calculate monthly chemical requirements, housekeeping SOP schedules, and direct manufacturer cost savings for commercial facilities.",
    url: "https://lioc.in/virtual-hygiene-auditor",
    siteName: "LIOC",
    locale: "en_IN",
    type: "website",
  },
};

export default function VirtualHygieneAuditorPage() {
  return (
    <div className="min-h-screen bg-slate-50/50 pb-20">
      {/* Breadcrumb Navigation */}
      <div className="bg-white border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3.5">
          <nav className="flex items-center gap-2 text-xs sm:text-sm text-slate-500">
            <Link href="/" className="hover:text-lioc-teal transition-colors">
              Home
            </Link>
            <ChevronRight className="w-3.5 h-3.5 text-slate-400" />
            <Link href="/products" className="hover:text-lioc-teal transition-colors">
              Solutions
            </Link>
            <ChevronRight className="w-3.5 h-3.5 text-slate-400" />
            <span className="font-semibold text-lioc-navy">AI Virtual Hygiene Auditor</span>
          </nav>
        </div>
      </div>

      {/* Main Interactive Auditor Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <VirtualHygieneAuditor />
      </section>
    </div>
  );
}
