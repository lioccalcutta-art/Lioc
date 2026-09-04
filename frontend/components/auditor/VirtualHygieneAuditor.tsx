"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import {
  Building2,
  UtensilsCrossed,
  ShieldCheck,
  Briefcase,
  GraduationCap,
  Factory,
  Sparkles,
  Droplets,
  Flame,
  Wind,
  Layers,
  ArrowRight,
  ArrowLeft,
  CheckCircle2,
  AlertCircle,
  TrendingDown,
  FileSpreadsheet,
  Clock,
  Printer,
  Share2,
  Phone,
  Mail,
  User,
  Send,
  HelpCircle,
  Award,
  ChevronDown,
  ChevronUp,
  RotateCcw,
  Zap,
} from "lucide-react";
import {
  FacilityAuditRequest,
  FacilityAuditResponse,
  AuditLeadSubmit,
} from "@/types";
import { api } from "@/lib/api";
import { getWhatsAppUrl } from "@/lib/whatsapp";

const FACILITY_OPTIONS = [
  {
    id: "hotels_guest_houses",
    name: "Hotels, Resorts & Guest Houses",
    description: "Guest rooms, marble lobbies, restaurants, and luxury washrooms.",
    icon: Building2,
    color: "from-blue-600 to-indigo-700",
    defaultSqft: 35000,
    defaultUnits: 45,
    defaultRestrooms: 12,
    defaultKitchen: true,
  },
  {
    id: "restaurants_cafes",
    name: "Restaurants, Cafes & Cloud Kitchens",
    description: "Commercial cooking, heavy fryer grease, FSSAI hygiene, and dining floors.",
    icon: UtensilsCrossed,
    color: "from-amber-500 to-orange-600",
    defaultSqft: 4500,
    defaultUnits: 80,
    defaultRestrooms: 4,
    defaultKitchen: true,
  },
  {
    id: "hospitals_healthcare",
    name: "Hospitals, Clinics & Healthcare",
    description: "Infection control, multi-drug resistant pathogen kill, and patient wards.",
    icon: ShieldCheck,
    color: "from-emerald-600 to-teal-700",
    defaultSqft: 50000,
    defaultUnits: 80,
    defaultRestrooms: 25,
    defaultKitchen: true,
  },
  {
    id: "corporate_offices",
    name: "Corporate Offices & IT Workspaces",
    description: "High-density workstations, glass facades, conference rooms, and washrooms.",
    icon: Briefcase,
    color: "from-cyan-600 to-blue-700",
    defaultSqft: 25000,
    defaultUnits: 150,
    defaultRestrooms: 8,
    defaultKitchen: false,
  },
  {
    id: "schools_colleges",
    name: "Schools, Colleges & Universities",
    description: "Classroom corridors, high-traffic washrooms, auditoriums, and canteens.",
    icon: GraduationCap,
    color: "from-violet-600 to-purple-800",
    defaultSqft: 60000,
    defaultUnits: 30,
    defaultRestrooms: 16,
    defaultKitchen: true,
  },
  {
    id: "facility_management",
    name: "Commercial Cleaning & Janitorial Contractors",
    description: "Professional cleaning crews managing high-square-footage facilities.",
    icon: Factory,
    color: "from-slate-700 to-slate-900",
    defaultSqft: 80000,
    defaultUnits: 10,
    defaultRestrooms: 30,
    defaultKitchen: false,
  },
];

const CHALLENGES_LIST = [
  { id: "hard_water", label: "Hard-Water Scale / White Rings", icon: Droplets },
  { id: "heavy_grease", label: "Heavy Kitchen Oil & Fryer Grease", icon: Flame },
  { id: "high_infection_risk", label: "Strict Pathogen / Disinfection Protocol", icon: ShieldCheck },
  { id: "marble_floors", label: "Sensitive Italian Marble / Polished Granite", icon: Sparkles },
  { id: "odor_issues", label: "High-Traffic Restroom Odor & Dampness", icon: Wind },
  { id: "insect_pest_risk", label: "Flies, Mosquitoes & Pest Deterrence", icon: Zap },
];

export default function VirtualHygieneAuditor() {
  const [step, setStep] = useState<number>(1);
  const [formData, setFormData] = useState<FacilityAuditRequest>({
    facility_type: "hotels_guest_houses",
    floor_area_sqft: 35000,
    units_count: 45,
    restrooms_count: 12,
    footfall_level: "HIGH",
    has_commercial_kitchen: true,
    challenges: ["hard_water", "marble_floors", "odor_issues"],
    current_monthly_spend: undefined,
  });

  const [loading, setLoading] = useState<boolean>(false);
  const [auditResult, setAuditResult] = useState<FacilityAuditResponse | null>(null);
  const [activeZoneIndex, setActiveZoneIndex] = useState<number>(0);

  // Lead Submission State
  const [leadForm, setLeadForm] = useState({
    full_name: "",
    company_name: "",
    email: "",
    phone_number: "",
    city: "Kolkata",
    additional_notes: "",
  });
  const [submittingLead, setSubmittingLead] = useState<boolean>(false);
  const [submittedRefId, setSubmittedRefId] = useState<string | null>(null);
  const [leadError, setLeadError] = useState<string | null>(null);

  const [calcError, setCalcError] = useState<string | null>(null);

  // Handle facility type change
  const handleFacilitySelect = (facilityId: string) => {
    const selected = FACILITY_OPTIONS.find((f) => f.id === facilityId);
    if (selected) {
      setFormData((prev) => ({
        ...prev,
        facility_type: selected.id,
        floor_area_sqft: selected.defaultSqft,
        units_count: selected.defaultUnits,
        restrooms_count: selected.defaultRestrooms,
        has_commercial_kitchen: selected.defaultKitchen,
      }));
    }
  };

  const toggleChallenge = (id: string) => {
    setFormData((prev) => {
      const exists = prev.challenges.includes(id);
      return {
        ...prev,
        challenges: exists
          ? prev.challenges.filter((c) => c !== id)
          : [...prev.challenges, id],
      };
    });
  };

  // Run calculation
  const handleRunAudit = async () => {
    setLoading(true);
    setCalcError(null);
    try {
      const res = await api.calculateAudit(formData);
      setAuditResult(res);
      setStep(3); // Jump to dashboard
    } catch (err: any) {
      setCalcError(err.message || "Failed to compute audit. Please verify inputs.");
    } finally {
      setLoading(false);
    }
  };

  // Submit Lead & Email Report
  const handleSubmitLead = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!auditResult) return;

    setSubmittingLead(true);
    setLeadError(null);

    try {
      const submitPayload: AuditLeadSubmit = {
        audit_id: auditResult.audit_id,
        full_name: leadForm.full_name,
        company_name: leadForm.company_name,
        email: leadForm.email,
        phone_number: leadForm.phone_number,
        city: leadForm.city,
        additional_notes: leadForm.additional_notes,
        audit_summary: {
          facility_type: auditResult.facility_type_label,
          floor_area_sqft: auditResult.floor_area_sqft,
          monthly_litres: auditResult.total_monthly_concentrate_litres,
          monthly_savings: auditResult.roi.monthly_savings,
          annual_savings: auditResult.roi.annual_savings,
        },
      };

      const res = await api.submitAudit(submitPayload);
      setSubmittedRefId(res.reference_id);
    } catch (err: any) {
      setLeadError(err.message || "Failed to submit audit report. Please try again.");
    } finally {
      setSubmittingLead(false);
    }
  };

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
      {/* Top Hero Pill & Title */}
      <div className="text-center max-w-3xl mx-auto mb-10">
        <div className="inline-flex items-center space-x-2 px-3.5 py-1.5 rounded-full bg-teal-50 border border-teal-200/80 text-lioc-tealDark text-xs font-bold uppercase tracking-wider mb-4 shadow-sm">
          <Sparkles className="w-3.5 h-3.5 text-teal-600 animate-pulse" />
          <span>Institutional Facility Planner & ROI Engine</span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-black text-lioc-navy tracking-tight">
          AI Virtual Hygiene Auditor
        </h1>
        <p className="text-sm sm:text-base text-slate-600 mt-3 leading-relaxed">
          Input your facility dimensions and operational parameters to instantly calculate exact monthly chemical requirements, dilution yield, housekeeping SOP schedules, and direct manufacturer cost savings.
        </p>

        {/* Progress Tracker */}
        <div className="mt-8 flex items-center justify-center space-x-2 sm:space-x-4 text-xs font-bold">
          <button
            onClick={() => setStep(1)}
            className={`px-4 py-2 rounded-xl transition-all flex items-center space-x-2 ${
              step === 1
                ? "bg-lioc-navy text-white shadow-md"
                : "bg-slate-100 text-slate-600 hover:bg-slate-200"
            }`}
          >
            <span className="w-5 h-5 rounded-full bg-white/20 flex items-center justify-center text-[10px]">1</span>
            <span>Facility Size</span>
          </button>

          <span className="text-slate-300">➔</span>

          <button
            onClick={() => setStep(2)}
            className={`px-4 py-2 rounded-xl transition-all flex items-center space-x-2 ${
              step === 2
                ? "bg-lioc-navy text-white shadow-md"
                : "bg-slate-100 text-slate-600 hover:bg-slate-200"
            }`}
          >
            <span className="w-5 h-5 rounded-full bg-white/20 flex items-center justify-center text-[10px]">2</span>
            <span>Operations & Challenges</span>
          </button>

          <span className="text-slate-300">➔</span>

          <button
            disabled={!auditResult}
            onClick={() => auditResult && setStep(3)}
            className={`px-4 py-2 rounded-xl transition-all flex items-center space-x-2 ${
              step === 3
                ? "bg-teal-600 text-white shadow-md"
                : auditResult
                ? "bg-slate-100 text-slate-600 hover:bg-slate-200"
                : "bg-slate-50 text-slate-300 cursor-not-allowed"
            }`}
          >
            <span className="w-5 h-5 rounded-full bg-white/20 flex items-center justify-center text-[10px]">3</span>
            <span>Audit Plan & ROI</span>
          </button>
        </div>
      </div>

      {/* ================================================================= */}
      {/* STEP 1: Facility Type & Size                                      */}
      {/* ================================================================= */}
      {step === 1 && (
        <div className="bg-white rounded-3xl p-6 sm:p-10 border border-slate-200/90 shadow-card space-y-8 animate-fadeIn">
          <div>
            <h2 className="text-lg font-bold text-lioc-navy mb-1 flex items-center gap-2">
              <span>Step 1: Select Facility Classification</span>
            </h2>
            <p className="text-xs text-slate-500">
              Chemical formulations and dilution rates are automatically tuned to your specific commercial sector.
            </p>
          </div>

          {/* Industry Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {FACILITY_OPTIONS.map((f) => {
              const Icon = f.icon;
              const isSelected = formData.facility_type === f.id;
              return (
                <button
                  key={f.id}
                  type="button"
                  onClick={() => handleFacilitySelect(f.id)}
                  className={`p-5 rounded-2xl border text-left transition-all relative overflow-hidden flex flex-col justify-between ${
                    isSelected
                      ? "border-teal-500 bg-teal-50/40 ring-2 ring-teal-500/20 shadow-sm"
                      : "border-slate-200 bg-white hover:border-slate-300 hover:bg-slate-50/50"
                  }`}
                >
                  <div className="flex items-start space-x-3.5 mb-3">
                    <div
                      className={`w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 text-white bg-gradient-to-br ${f.color}`}
                    >
                      <Icon className="w-5 h-5" />
                    </div>
                    <div>
                      <h3 className="font-bold text-sm text-slate-900 leading-snug">{f.name}</h3>
                      <p className="text-[11px] text-slate-500 mt-1 leading-relaxed">{f.description}</p>
                    </div>
                  </div>
                  {isSelected && (
                    <span className="self-end text-[10px] font-bold text-teal-700 bg-teal-100/80 px-2 py-0.5 rounded-full border border-teal-300 flex items-center gap-1">
                      <CheckCircle2 className="w-3 h-3" /> Selected
                    </span>
                  )}
                </button>
              );
            })}
          </div>

          {/* Sliders and Dimensions */}
          <div className="pt-6 border-t border-slate-100 space-y-6">
            <h3 className="text-sm font-bold text-slate-800 uppercase tracking-wider">
              Facility Dimensions & Scale
            </h3>

            {/* Floor Area Slider */}
            <div className="p-5 bg-slate-50 rounded-2xl border border-slate-200/80 space-y-3">
              <div className="flex items-center justify-between">
                <div>
                  <label className="text-xs font-bold text-slate-800">
                    Total Cleanable Floor Area
                  </label>
                  <p className="text-[11px] text-slate-500">Including lobbies, corridors, rooms & utility areas</p>
                </div>
                <div className="text-right">
                  <span className="text-lg font-mono font-black text-lioc-tealDark">
                    {formData.floor_area_sqft.toLocaleString()}
                  </span>{" "}
                  <span className="text-xs font-bold text-slate-500">sq.ft.</span>
                </div>
              </div>
              <input
                type="range"
                min={2000}
                max={200000}
                step={2500}
                value={formData.floor_area_sqft}
                onChange={(e) =>
                  setFormData({ ...formData, floor_area_sqft: Number(e.target.value) })
                }
                className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-lioc-teal"
              />
              <div className="flex justify-between text-[10px] text-slate-400 font-mono">
                <span>2,000 sq ft</span>
                <span>50,000 sq ft</span>
                <span>100,000 sq ft</span>
                <span>200,000 sq ft</span>
              </div>
            </div>

            {/* Units & Restroom Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200/80">
                <label className="block text-xs font-bold text-slate-800 mb-1">
                  Active Units (Rooms / Beds / Workstations / Tables)
                </label>
                <input
                  type="number"
                  min={1}
                  max={5000}
                  value={formData.units_count}
                  onChange={(e) =>
                    setFormData({ ...formData, units_count: Math.max(1, Number(e.target.value)) })
                  }
                  className="w-full p-2.5 rounded-xl border border-slate-300 text-xs font-bold bg-white focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500"
                />
              </div>

              <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200/80">
                <label className="block text-xs font-bold text-slate-800 mb-1">
                  Total Washrooms & Restroom Blocks
                </label>
                <input
                  type="number"
                  min={1}
                  max={500}
                  value={formData.restrooms_count}
                  onChange={(e) =>
                    setFormData({ ...formData, restrooms_count: Math.max(1, Number(e.target.value)) })
                  }
                  className="w-full p-2.5 rounded-xl border border-slate-300 text-xs font-bold bg-white focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500"
                />
              </div>
            </div>
          </div>

          {/* Navigation Action */}
          <div className="pt-4 flex justify-end">
            <button
              type="button"
              onClick={() => setStep(2)}
              className="px-6 py-3 bg-lioc-navy hover:bg-slate-800 text-white text-xs font-bold rounded-xl shadow-md transition-all flex items-center space-x-2"
            >
              <span>Continue to Operational Challenges</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {/* ================================================================= */}
      {/* STEP 2: Operations & Specific Challenges                          */}
      {/* ================================================================= */}
      {step === 2 && (
        <div className="bg-white rounded-3xl p-6 sm:p-10 border border-slate-200/90 shadow-card space-y-8 animate-fadeIn">
          <div>
            <h2 className="text-lg font-bold text-lioc-navy mb-1 flex items-center gap-2">
              <span>Step 2: Operational Conditions & Hygiene Challenges</span>
            </h2>
            <p className="text-xs text-slate-500">
              Identify footfall patterns, kitchen operations, and specific soil conditions for precision dosage.
            </p>
          </div>

          {/* Footfall Level */}
          <div>
            <label className="block text-xs font-bold text-slate-800 uppercase tracking-wider mb-3">
              Daily Footfall Intensity & Shift Schedule
            </label>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
              {[
                { id: "LOW", title: "Low Intensity", desc: "Single 8-hr shift, controlled access" },
                { id: "MODERATE", title: "Moderate Traffic", desc: "Standard business footfall (10-12 hrs)" },
                { id: "HIGH", title: "High Volume", desc: "Constant public transit / double shift" },
                { id: "VERY_HIGH_24X7", title: "24x7 High Density", desc: "Continuous hospital/hotel 3-shift rotation" },
              ].map((lvl) => (
                <button
                  key={lvl.id}
                  type="button"
                  onClick={() => setFormData({ ...formData, footfall_level: lvl.id })}
                  className={`p-4 rounded-xl border text-left transition-all ${
                    formData.footfall_level === lvl.id
                      ? "border-teal-500 bg-teal-50/60 ring-2 ring-teal-500/20 shadow-sm"
                      : "border-slate-200 bg-white hover:border-slate-300"
                  }`}
                >
                  <div className="font-bold text-xs text-slate-900">{lvl.title}</div>
                  <div className="text-[10px] text-slate-500 mt-1">{lvl.desc}</div>
                </button>
              ))}
            </div>
          </div>

          {/* Commercial Kitchen Toggle */}
          <div className="p-4 bg-amber-50/50 border border-amber-200/70 rounded-2xl flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="w-9 h-9 rounded-xl bg-amber-100 text-amber-700 flex items-center justify-center flex-shrink-0">
                <Flame className="w-5 h-5" />
              </div>
              <div>
                <h4 className="text-xs font-bold text-slate-900">Commercial Kitchen / Pantry Operations</h4>
                <p className="text-[11px] text-slate-600">Requires food-safe heavy degreasers and commercial dishwashing liquids.</p>
              </div>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={formData.has_commercial_kitchen}
                onChange={(e) => setFormData({ ...formData, has_commercial_kitchen: e.target.checked })}
                className="sr-only peer"
              />
              <div className="w-11 h-6 bg-slate-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-teal-600"></div>
            </label>
          </div>

          {/* Specific Challenges */}
          <div>
            <label className="block text-xs font-bold text-slate-800 uppercase tracking-wider mb-3">
              Facility Pain Points (Select all that apply)
            </label>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
              {CHALLENGES_LIST.map((c) => {
                const Icon = c.icon;
                const active = formData.challenges.includes(c.id);
                return (
                  <button
                    key={c.id}
                    type="button"
                    onClick={() => toggleChallenge(c.id)}
                    className={`p-3.5 rounded-xl border text-left transition-all flex items-center space-x-3 ${
                      active
                        ? "border-teal-500 bg-teal-50/50 text-teal-900 ring-1 ring-teal-500/30 font-semibold"
                        : "border-slate-200 bg-white hover:border-slate-300 text-slate-700"
                    }`}
                  >
                    <Icon className={`w-4 h-4 flex-shrink-0 ${active ? "text-teal-600" : "text-slate-400"}`} />
                    <span className="text-xs">{c.label}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {calcError && (
            <div className="p-3.5 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs flex items-start space-x-2">
              <AlertCircle className="w-4 h-4 flex-shrink-0 mt-0.5" />
              <span>{calcError}</span>
            </div>
          )}

          {/* Navigation Action */}
          <div className="pt-4 flex items-center justify-between border-t border-slate-100">
            <button
              type="button"
              onClick={() => setStep(1)}
              className="px-5 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold rounded-xl transition-all flex items-center space-x-1.5"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Back</span>
            </button>

            <button
              type="button"
              disabled={loading}
              onClick={handleRunAudit}
              className="px-6 py-3 bg-gradient-to-r from-teal-600 to-emerald-600 hover:from-teal-700 hover:to-emerald-700 text-white text-xs font-bold rounded-xl shadow-lg transition-all flex items-center space-x-2 disabled:opacity-50"
            >
              {loading ? (
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
              ) : (
                <>
                  <Sparkles className="w-4 h-4" />
                  <span>Generate AI Chemical Plan & ROI</span>
                </>
              )}
            </button>
          </div>
        </div>
      )}

      {/* ================================================================= */}
      {/* STEP 3: Audit Results & ROI Dashboard                             */}
      {/* ================================================================= */}
      {step === 3 && auditResult && (
        <div className="space-y-8 animate-fadeIn">
          {/* Top Banner with Audit ID */}
          <div className="bg-lioc-navy text-white rounded-3xl p-6 sm:p-8 relative overflow-hidden shadow-xl border border-slate-800">
            <div className="absolute right-0 top-0 w-96 h-96 bg-teal-500/10 rounded-full blur-3xl pointer-events-none"></div>

            <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
              <div>
                <div className="flex items-center space-x-2 mb-2">
                  <span className="px-2.5 py-0.5 rounded-full bg-teal-500/20 text-teal-300 font-mono text-[11px] font-bold border border-teal-500/30">
                    Audit Ref: #{auditResult.audit_id}
                  </span>
                  <span className="text-xs text-slate-400">Institutional Plan Generated</span>
                </div>
                <h2 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
                  Facility Hygiene Audit Report
                </h2>
                <p className="text-xs sm:text-sm text-slate-300 mt-2 max-w-2xl leading-relaxed">
                  {auditResult.executive_summary}
                </p>
              </div>

              <div className="flex items-center gap-3">
                <button
                  onClick={() => window.print()}
                  className="px-4 py-2.5 bg-slate-800/80 hover:bg-slate-700 text-slate-200 rounded-xl text-xs font-bold border border-slate-700 transition-all flex items-center space-x-1.5"
                >
                  <Printer className="w-3.5 h-3.5" />
                  <span>Print SOP</span>
                </button>
                <button
                  onClick={() => setStep(1)}
                  className="px-4 py-2.5 bg-slate-800/80 hover:bg-slate-700 text-slate-200 rounded-xl text-xs font-bold border border-slate-700 transition-all flex items-center space-x-1.5"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                  <span>Recalculate</span>
                </button>
              </div>
            </div>
          </div>

          {/* Big Financial ROI Badges */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="p-6 bg-gradient-to-br from-emerald-500 to-teal-700 text-white rounded-3xl shadow-md relative overflow-hidden">
              <div className="text-xs font-bold text-emerald-100 uppercase tracking-wider">
                Monthly Savings vs Retail
              </div>
              <div className="text-3xl font-black mt-2 tracking-tight">
                ₹{auditResult.roi.monthly_savings.toLocaleString()}
              </div>
              <div className="text-[11px] text-emerald-100 mt-1 flex items-center gap-1 font-medium">
                <TrendingDown className="w-3.5 h-3.5" />
                <span>{auditResult.roi.savings_percentage}% chemical cost reduction</span>
              </div>
            </div>

            <div className="p-6 bg-white border border-slate-200 rounded-3xl shadow-sm">
              <div className="text-xs font-bold text-slate-500 uppercase tracking-wider">
                Annual Projected Savings
              </div>
              <div className="text-3xl font-black text-lioc-navy mt-2 tracking-tight">
                ₹{auditResult.roi.annual_savings.toLocaleString()}
              </div>
              <div className="text-[11px] text-slate-500 mt-1 font-medium">
                Direct factory wholesale billing
              </div>
            </div>

            <div className="p-6 bg-white border border-slate-200 rounded-3xl shadow-sm">
              <div className="text-xs font-bold text-slate-500 uppercase tracking-wider">
                Total Monthly Concentrate
              </div>
              <div className="text-3xl font-black text-slate-800 mt-2 tracking-tight">
                {auditResult.total_monthly_concentrate_litres}{" "}
                <span className="text-sm font-semibold text-slate-400">Litres</span>
              </div>
              <div className="text-[11px] text-slate-500 mt-1 font-medium">
                Packaged in heavy-duty 5L & 20L cans
              </div>
            </div>

            <div className="p-6 bg-white border border-slate-200 rounded-3xl shadow-sm">
              <div className="text-xs font-bold text-slate-500 uppercase tracking-wider">
                Diluted Ready Solution Yield
              </div>
              <div className="text-3xl font-black text-teal-600 mt-2 tracking-tight">
                {auditResult.total_ready_solution_litres.toLocaleString()}{" "}
                <span className="text-sm font-semibold text-slate-400">Litres</span>
              </div>
              <div className="text-[11px] text-slate-500 mt-1 font-medium">
                Effective cost: ₹{auditResult.roi.cost_per_litre_diluted}/L diluted
              </div>
            </div>
          </div>

          {/* Departmental Chemical Consumption Plan */}
          <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-card space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-100">
              <div>
                <h3 className="text-lg font-bold text-lioc-navy">Departmental Chemical Plan & Dilution Matrix</h3>
                <p className="text-xs text-slate-500">
                  Formulation quantities engineered for your facility area and daily cleaning frequency.
                </p>
              </div>

              {/* Zone Pills */}
              <div className="flex flex-wrap gap-2">
                {auditResult.zones.map((z, idx) => (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => setActiveZoneIndex(idx)}
                    className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
                      activeZoneIndex === idx
                        ? "bg-lioc-navy text-white shadow-sm"
                        : "bg-slate-100 text-slate-600 hover:bg-slate-200"
                    }`}
                  >
                    {z.zone_name} ({z.monthly_litres}L)
                  </button>
                ))}
              </div>
            </div>

            {/* Active Zone Detail Table */}
            {auditResult.zones[activeZoneIndex] && (
              <div className="space-y-4">
                <div className="p-4 bg-teal-50/60 rounded-2xl border border-teal-200/80 flex items-center justify-between">
                  <div>
                    <h4 className="text-sm font-bold text-teal-900">
                      {auditResult.zones[activeZoneIndex].zone_name}
                    </h4>
                    <p className="text-xs text-teal-700 mt-0.5">
                      {auditResult.zones[activeZoneIndex].primary_focus}
                    </p>
                  </div>
                  <div className="text-right">
                    <span className="text-xs font-semibold text-teal-800">Zone Total:</span>{" "}
                    <span className="text-sm font-bold text-teal-950">
                      {auditResult.zones[activeZoneIndex].monthly_litres} Litres / Month
                    </span>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {auditResult.zones[activeZoneIndex].items.map((item, iIdx) => (
                    <div
                      key={iIdx}
                      className="p-5 bg-white rounded-2xl border border-slate-200 hover:border-slate-300 transition-all space-y-3"
                    >
                      <div className="flex items-start justify-between">
                        <div>
                          <span className="text-[10px] font-mono font-bold text-slate-400 bg-slate-100 px-2 py-0.5 rounded">
                            {item.sku}
                          </span>
                          <h5 className="font-bold text-sm text-slate-900 mt-1">
                            {item.product_name}
                          </h5>
                        </div>
                        <div className="text-right">
                          <span className="text-base font-black text-lioc-navy">
                            {item.monthly_concentrate_litres}L
                          </span>
                          <span className="text-[10px] text-slate-400 block">per month</span>
                        </div>
                      </div>

                      <div className="grid grid-cols-2 gap-2 text-xs p-3 bg-slate-50 rounded-xl">
                        <div>
                          <span className="text-[10px] font-bold text-slate-500 block uppercase">Dilution Ratio</span>
                          <span className="font-semibold text-slate-800">{item.dilution_ratio}</span>
                        </div>
                        <div>
                          <span className="text-[10px] font-bold text-slate-500 block uppercase">Ready Solution</span>
                          <span className="font-semibold text-teal-700">{item.ready_to_use_yield_litres.toLocaleString()} Litres</span>
                        </div>
                        <div className="col-span-2 pt-1 border-t border-slate-200/60">
                          <span className="text-[10px] font-bold text-slate-500 block uppercase">Recommended Packaging</span>
                          <span className="font-semibold text-slate-800">{item.packaging_recommendation}</span>
                        </div>
                      </div>

                      <p className="text-[11px] text-slate-500 leading-relaxed italic">
                        "{item.usage_guideline}"
                      </p>

                      <div className="pt-2 flex items-center justify-between border-t border-slate-100 text-xs">
                        <span className="text-slate-500">Retail Brand: <del>₹{item.estimated_retail_cost}</del></span>
                        <span className="font-bold text-emerald-700">LIOC Direct: ₹{item.lioc_direct_cost} (Save ₹{item.monthly_savings})</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Housekeeping Standard Operating Procedure (SOP) Chart */}
          <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-card space-y-4">
            <div className="flex items-center space-x-3 pb-3 border-b border-slate-100">
              <div className="w-9 h-9 rounded-xl bg-indigo-50 text-indigo-700 flex items-center justify-center flex-shrink-0">
                <FileSpreadsheet className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-base font-bold text-lioc-navy">
                  Housekeeping Staff Daily SOP & Dilution Chart
                </h3>
                <p className="text-xs text-slate-500">
                  Standard operating procedures ready for facility housekeeping supervisors and training boards.
                </p>
              </div>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs border-collapse">
                <thead>
                  <tr className="bg-slate-100/80 text-slate-700 border-b border-slate-200">
                    <th className="p-3 font-bold">Shift / Timing</th>
                    <th className="p-3 font-bold">Target Area</th>
                    <th className="p-3 font-bold">Chemical Formulation</th>
                    <th className="p-3 font-bold">Precise Dilution Ratio</th>
                    <th className="p-3 font-bold">Application Protocol</th>
                    <th className="p-3 font-bold">Safety Equipment</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {auditResult.sops.map((sop, sIdx) => (
                    <tr key={sIdx} className="hover:bg-slate-50/80 transition-colors">
                      <td className="p-3 font-bold text-slate-900 whitespace-nowrap">{sop.frequency}</td>
                      <td className="p-3 text-slate-700">{sop.area}</td>
                      <td className="p-3 font-semibold text-lioc-navy">{sop.chemical_used}</td>
                      <td className="p-3 font-mono font-bold text-teal-700">{sop.dilution_ratio}</td>
                      <td className="p-3 text-slate-600 max-w-xs">{sop.application_method}</td>
                      <td className="p-3 text-slate-500 text-[11px]">{sop.safety_gear}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Lead Submission & Email Full Audit Box */}
          <div className="bg-gradient-to-br from-slate-900 to-lioc-navy text-white rounded-3xl p-6 sm:p-10 shadow-xl border border-slate-800">
            {submittedRefId ? (
              <div className="text-center py-6 space-y-4">
                <div className="w-16 h-16 bg-teal-500/20 text-teal-400 rounded-full flex items-center justify-center mx-auto mb-2 border border-teal-500/30">
                  <CheckCircle2 className="w-10 h-10" />
                </div>
                <span className="px-3 py-1 rounded-full bg-teal-500/20 text-teal-300 text-xs font-mono font-bold border border-teal-500/30">
                  Audit Lead Ref: #{submittedRefId}
                </span>
                <h3 className="text-2xl font-black text-white">Facility Audit Proposal Registered!</h3>
                <p className="text-xs sm:text-sm text-slate-300 max-w-lg mx-auto leading-relaxed">
                  An automated confirmation email containing your complete Chemical Consumption Breakdown and Reference ID has been dispatched to <span className="font-bold text-teal-300">{leadForm.email}</span>. Our technical institutional engineer will reach out to you shortly with contracted wholesale pricing.
                </p>

                <div className="pt-4 flex flex-col sm:flex-row gap-3 justify-center">
                  <a
                    href={getWhatsAppUrl({
                      customMessage: `Hello LIOC Commercial Desk, I have completed the Facility Hygiene Audit #${submittedRefId} for ${leadForm.company_name}. Please prioritize our wholesale contract pricing.`,
                    })}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="px-6 py-3 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold shadow-md transition-all inline-flex items-center justify-center space-x-2"
                  >
                    <span>Connect with Chemical Engineer on WhatsApp</span>
                    <ArrowRight className="w-4 h-4" />
                  </a>
                </div>
              </div>
            ) : (
              <form onSubmit={handleSubmitLead} className="space-y-6">
                <div className="max-w-2xl">
                  <div className="inline-flex items-center space-x-1.5 px-3 py-1 rounded-full bg-teal-500/20 text-teal-300 text-[11px] font-bold uppercase tracking-wider mb-2">
                    <span>1-Click Institutional Proposal</span>
                  </div>
                  <h3 className="text-2xl font-black text-white">
                    Receive Full Audit Report & Formal Wholesale Proposal
                  </h3>
                  <p className="text-xs text-slate-300 mt-1 leading-relaxed">
                    Get this audit report, customized SDS sheets, and institutional wholesale rate contracts delivered directly to your email inbox.
                  </p>
                </div>

                {leadError && (
                  <div className="p-3.5 rounded-xl bg-rose-900/40 border border-rose-700 text-rose-200 text-xs flex items-start space-x-2">
                    <AlertCircle className="w-4 h-4 flex-shrink-0 mt-0.5" />
                    <span>{leadError}</span>
                  </div>
                )}

                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-slate-300 mb-1">
                      Your Full Name <span className="text-rose-400">*</span>
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Joydeep Ghosh"
                      value={leadForm.full_name}
                      onChange={(e) => setLeadForm({ ...leadForm, full_name: e.target.value })}
                      className="w-full px-3.5 py-2.5 rounded-xl bg-slate-800/80 border border-slate-700 text-xs text-white placeholder-slate-500 focus:ring-2 focus:ring-teal-500 focus:border-teal-500"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-300 mb-1">
                      Company / Facility Name <span className="text-rose-400">*</span>
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Park Bengal Hotel & Banquets"
                      value={leadForm.company_name}
                      onChange={(e) => setLeadForm({ ...leadForm, company_name: e.target.value })}
                      className="w-full px-3.5 py-2.5 rounded-xl bg-slate-800/80 border border-slate-700 text-xs text-white placeholder-slate-500 focus:ring-2 focus:ring-teal-500 focus:border-teal-500"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-300 mb-1">
                      Work Email Address <span className="text-rose-400">*</span>
                    </label>
                    <input
                      type="email"
                      required
                      placeholder="e.g. joydeep@hotel.com"
                      value={leadForm.email}
                      onChange={(e) => setLeadForm({ ...leadForm, email: e.target.value })}
                      className="w-full px-3.5 py-2.5 rounded-xl bg-slate-800/80 border border-slate-700 text-xs text-white placeholder-slate-500 focus:ring-2 focus:ring-teal-500 focus:border-teal-500"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-300 mb-1">
                      Phone Number <span className="text-rose-400">*</span>
                    </label>
                    <input
                      type="tel"
                      required
                      placeholder="e.g. +91 98300 12345"
                      value={leadForm.phone_number}
                      onChange={(e) => setLeadForm({ ...leadForm, phone_number: e.target.value })}
                      className="w-full px-3.5 py-2.5 rounded-xl bg-slate-800/80 border border-slate-700 text-xs text-white placeholder-slate-500 focus:ring-2 focus:ring-teal-500 focus:border-teal-500"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-300 mb-1">
                      City / Industrial Hub <span className="text-rose-400">*</span>
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Kolkata (Salt Lake / New Town)"
                      value={leadForm.city}
                      onChange={(e) => setLeadForm({ ...leadForm, city: e.target.value })}
                      className="w-full px-3.5 py-2.5 rounded-xl bg-slate-800/80 border border-slate-700 text-xs text-white placeholder-slate-500 focus:ring-2 focus:ring-teal-500 focus:border-teal-500"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-300 mb-1">
                      Specific Notes / Procurement Requirements
                    </label>
                    <input
                      type="text"
                      placeholder="e.g. Need trial kit before bulk PO"
                      value={leadForm.additional_notes}
                      onChange={(e) => setLeadForm({ ...leadForm, additional_notes: e.target.value })}
                      className="w-full px-3.5 py-2.5 rounded-xl bg-slate-800/80 border border-slate-700 text-xs text-white placeholder-slate-500 focus:ring-2 focus:ring-teal-500 focus:border-teal-500"
                    />
                  </div>
                </div>

                <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-2">
                  <p className="text-[11px] text-slate-400">
                    🔒 Direct manufacturer confidentiality. No spam. Instant email confirmation with Reference ID.
                  </p>
                  <button
                    type="submit"
                    disabled={submittingLead}
                    className="w-full sm:w-auto px-8 py-3.5 rounded-xl bg-gradient-to-r from-teal-500 to-emerald-500 hover:from-teal-600 hover:to-emerald-600 text-white font-bold text-xs shadow-lg transition-all flex items-center justify-center space-x-2 disabled:opacity-50"
                  >
                    {submittingLead ? (
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    ) : (
                      <>
                        <Send className="w-4 h-4" />
                        <span>Email Audit Report & Request Contract Proposal</span>
                      </>
                    )}
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
