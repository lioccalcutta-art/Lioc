import React from "react";
import type { Metadata } from "next";
import Link from "next/link";
import { api } from "@/lib/api";
import {
  Building2,
  UtensilsCrossed,
  GraduationCap,
  Briefcase,
  Factory,
  Home,
  ChevronRight,
  ArrowRight,
  ShieldCheck,
  CheckCircle2,
} from "lucide-react";

export const metadata: Metadata = {
  title: "Industries We Serve | Commercial Hygiene Solutions",
  description:
    "Explore customized cleaning and hygiene regimens for Hotels, Guest Houses, Restaurants, Cafes, Schools, Corporate Offices, Healthcare Facilities, and Facility Management teams in Kolkata.",
};

const industryIcons: Record<string, any> = {
  "hotels-guest-houses": Building2,
  "restaurants-cafes": UtensilsCrossed,
  "schools-colleges": GraduationCap,
  "corporate-offices": Briefcase,
  "facility-management": Factory,
  "hospitals-healthcare": ShieldCheck,
  "residential-homes": Home,
};

export default async function IndustriesPage() {
  const industries = await api.getIndustries();

  return (
    <div className="py-12 space-y-16">
      {/* Top Banner */}
      <div className="bg-lioc-navy text-white py-14 border-b border-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl space-y-4">
            <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-teal-500/10 border border-teal-500/30 text-teal-300 text-xs font-bold">
              <ShieldCheck className="w-3.5 h-3.5" />
              <span>Targeted Commercial Cleaning Protocols</span>
            </div>
            <h1 className="text-3xl sm:text-4xl font-black tracking-tight text-white">
              Hygiene Solutions by Industry & Sector
            </h1>
            <p className="text-sm text-slate-300 leading-relaxed">
              Every facility has distinct hygiene challenges—from high guest turnover in boutique hotels to heavy grease in cloud kitchens and safe student disinfection in schools. Explore Lioc's sector-tailored product regimens.
            </p>
          </div>
        </div>
      </div>

      {/* Industries Grid */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {industries.map((ind) => {
            const IconComponent = industryIcons[ind.slug] || Building2;
            return (
              <div
                key={ind.id}
                className="bg-white rounded-3xl p-8 border border-slate-200 shadow-sm hover:shadow-card transition-all flex flex-col justify-between"
              >
                <div className="space-y-4">
                  <div className="w-14 h-14 rounded-2xl bg-teal-50 text-lioc-teal flex items-center justify-center shadow-sm">
                    <IconComponent className="w-7 h-7" />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-lioc-navy">{ind.name}</h3>
                    <p className="text-xs font-semibold text-lioc-teal mt-1">{ind.tagline}</p>
                  </div>
                  <p className="text-xs text-slate-600 leading-relaxed">{ind.description}</p>

                  {ind.key_challenges && (
                    <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-100 text-xs space-y-1">
                      <div className="font-bold text-slate-700">Key Focus Areas:</div>
                      <div className="text-slate-500 line-clamp-2">{ind.key_challenges}</div>
                    </div>
                  )}
                </div>

                <div className="mt-8 pt-4 border-t border-slate-100 flex items-center justify-between">
                  <Link
                    href={`/industries/${ind.slug}`}
                    className="text-xs font-bold text-lioc-teal hover:text-lioc-tealDark flex items-center space-x-1"
                  >
                    <span>View Product Regimen</span>
                    <ChevronRight className="w-4 h-4" />
                  </Link>
                  <Link
                    href={`/request-quote?product=${encodeURIComponent(ind.name + " Package")}`}
                    className="text-xs font-semibold text-slate-600 hover:text-slate-900"
                  >
                    Get Package Quote
                  </Link>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
