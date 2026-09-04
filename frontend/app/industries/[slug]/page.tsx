import React from "react";
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import { api } from "@/lib/api";
import { SITE_CONFIG } from "@/lib/config";
import { getWhatsAppUrl } from "@/lib/whatsapp";
import {
  Building2,
  UtensilsCrossed,
  GraduationCap,
  Briefcase,
  Factory,
  Home,
  CheckCircle2,
  ShieldCheck,
  Package,
  FileText,
  MessageSquare,
  ArrowRight,
  ChevronRight,
  AlertCircle,
} from "lucide-react";
import ProductCard from "@/components/products/ProductCard";

interface IndustryPageProps {
  params: {
    slug: string;
  };
}

export async function generateMetadata({ params }: IndustryPageProps): Promise<Metadata> {
  const industry = await api.getIndustryBySlug(params.slug);
  if (!industry) {
    return { title: "Industry Not Found" };
  }

  return {
    title: `${industry.name} Cleaning & Hygiene Solutions`,
    description: industry.description || `Commercial cleaning solutions for ${industry.name} by Lioc in Kolkata.`,
  };
}

const industryIcons: Record<string, any> = {
  "hotels-guest-houses": Building2,
  "restaurants-cafes": UtensilsCrossed,
  "schools-colleges": GraduationCap,
  "corporate-offices": Briefcase,
  "facility-management": Factory,
  "hospitals-healthcare": ShieldCheck,
  "residential-homes": Home,
};

export default async function IndustryDetailPage({ params }: IndustryPageProps) {
  const [industry, products] = await Promise.all([
    api.getIndustryBySlug(params.slug),
    api.getProducts({ industry: params.slug }),
  ]);

  if (!industry) {
    notFound();
  }

  const IconComponent = industryIcons[industry.slug] || Building2;

  return (
    <div className="py-10 space-y-16">
      {/* Breadcrumb Navigation */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <nav className="flex items-center space-x-2 text-xs font-semibold text-slate-500">
          <Link href="/" className="hover:text-lioc-teal">
            Home
          </Link>
          <ChevronRight className="w-3.5 h-3.5" />
          <Link href="/industries" className="hover:text-lioc-teal">
            Industries
          </Link>
          <ChevronRight className="w-3.5 h-3.5" />
          <span className="text-slate-900">{industry.name}</span>
        </nav>
      </div>

      {/* Hero Header for Sector */}
      <div className="bg-lioc-navy text-white py-14">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            <div className="lg:col-span-8 space-y-4">
              <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-teal-500/10 border border-teal-500/30 text-teal-300 text-xs font-bold">
                <IconComponent className="w-4 h-4" />
                <span>Sector Hygiene Regimen</span>
              </div>
              <h1 className="text-3xl sm:text-4xl font-black tracking-tight text-white">
                {industry.name}
              </h1>
              <p className="text-base text-teal-300 font-semibold">{industry.tagline}</p>
              <p className="text-sm text-slate-300 leading-relaxed max-w-2xl">
                {industry.description}
              </p>
            </div>

            <div className="lg:col-span-4 bg-white/10 backdrop-blur-md p-6 rounded-3xl border border-white/20 space-y-4">
              <h3 className="text-sm font-bold text-white flex items-center space-x-2">
                <FileText className="w-4 h-4 text-teal-300" />
                <span>Need an Institutional Facility Package?</span>
              </h3>
              <p className="text-xs text-slate-300">
                Get a single consolidated wholesale quote for all cleaning consumables required in your facility.
              </p>
              <Link
                href={`/request-quote?product=${encodeURIComponent(industry.name + " Complete Supply Kit")}`}
                className="w-full py-3 px-4 bg-lioc-teal hover:bg-lioc-tealLight text-white rounded-xl text-xs font-bold flex items-center justify-center space-x-2 transition-all shadow-md"
              >
                <span>Request Facility Quote</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Sector Challenges & Solutions */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="bg-white p-8 rounded-3xl border border-slate-200 shadow-sm space-y-3">
            <div className="flex items-center space-x-2 text-rose-600 font-bold text-sm">
              <AlertCircle className="w-5 h-5" />
              <span>Operational Challenges We Solve</span>
            </div>
            <p className="text-xs text-slate-600 leading-relaxed whitespace-pre-line">
              {industry.key_challenges || "High footfall cleaning maintenance, mineral water stains, and controlling per-square-foot housekeeping cost."}
            </p>
          </div>

          <div className="bg-white p-8 rounded-3xl border border-slate-200 shadow-sm space-y-3">
            <div className="flex items-center space-x-2 text-lioc-teal font-bold text-sm">
              <ShieldCheck className="w-5 h-5" />
              <span>Recommended Cleaning Protocol</span>
            </div>
            <p className="text-xs text-slate-600 leading-relaxed whitespace-pre-line">
              {industry.recommended_solutions || "Combined high-dilution floor master, viscous toilet descaler gel, and streak-free glass gleam."}
            </p>
          </div>
        </div>
      </div>

      {/* Matching Formulations Grid */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
        <div className="flex justify-between items-end">
          <div>
            <h2 className="text-2xl font-black text-lioc-navy">
              Recommended Products for {industry.name}
            </h2>
            <p className="text-xs text-slate-500 mt-1">
              Commercial-grade formulations proven in this operational environment.
            </p>
          </div>
        </div>

        {products.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {products.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        ) : (
          <div className="p-8 text-center bg-white rounded-2xl border border-slate-200">
            <p className="text-xs text-slate-500">Explore our complete catalog for compatible formulations.</p>
          </div>
        )}
      </div>
    </div>
  );
}
