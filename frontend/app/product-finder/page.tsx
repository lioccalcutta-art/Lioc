import React from "react";
import { Metadata } from "next";
import Link from "next/link";
import { Sparkles, ShieldCheck, CheckCircle2, ChevronRight, Award, Factory } from "lucide-react";
import ProductFinderWizard from "@/components/product-finder/ProductFinderWizard";

export const metadata: Metadata = {
  title: "Product Finder | Commercial Cleaning Solutions Selector | Lioc",
  description:
    "Use the Lioc Product Finder to discover the optimal commercial cleaning formulations and hygiene regimens for your hotel, cloud kitchen, school, office, or facility.",
  openGraph: {
    title: "Lioc Product Finder — Commercial Chemical Selection Assistant",
    description:
      "Find commercial-grade floor cleaners, degreasers, sanitizers, and washroom descalers tailored to your specific industry.",
    url: "https://lioc.in/product-finder",
    siteName: "Lioc",
    locale: "en_IN",
    type: "website",
  },
};

export default function ProductFinderPage() {
  return (
    <div className="min-h-screen bg-slate-50/50 pb-20">
      {/* Breadcrumb Navigation */}
      <div className="bg-white border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3.5">
          <nav className="flex items-center gap-2 text-xs sm:text-sm text-text-muted">
            <Link href="/" className="hover:text-primary transition-colors">
              Home
            </Link>
            <ChevronRight className="w-3.5 h-3.5 text-slate-400" />
            <Link href="/products" className="hover:text-primary transition-colors">
              Products
            </Link>
            <ChevronRight className="w-3.5 h-3.5 text-slate-400" />
            <span className="font-semibold text-primary">Product Finder</span>
          </nav>
        </div>
      </div>

      {/* Hero Header Section */}
      <section className="bg-gradient-to-b from-white to-slate-50/80 border-b border-slate-200/80 pt-10 pb-12">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 text-center">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full text-xs font-bold bg-primary/10 text-primary mb-4 border border-primary/20">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Interactive Commercial Selector</span>
          </div>

          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-text-main tracking-tight">
            Find the Right Cleaning Chemical Solution
          </h1>

          <p className="text-base sm:text-lg text-text-muted mt-3 max-w-2xl mx-auto">
            Select your business type and operational challenge to discover high-potency, institutional-grade Lioc formulations engineered for your hygiene compliance.
          </p>

          {/* Quick Trust Highlights */}
          <div className="flex flex-wrap items-center justify-center gap-6 mt-6 text-xs sm:text-sm text-slate-600 font-medium">
            <div className="flex items-center gap-1.5">
              <CheckCircle2 className="w-4 h-4 text-emerald-600" />
              <span>Direct Manufacturer Wholesale</span>
            </div>
            <div className="flex items-center gap-1.5">
              <ShieldCheck className="w-4 h-4 text-primary" />
              <span>Commercial FSSAI / Institutional Safe</span>
            </div>
            <div className="flex items-center gap-1.5">
              <Factory className="w-4 h-4 text-cyan-600" />
              <span>Bulk 5L, 20L & 50L Drum Supply</span>
            </div>
          </div>
        </div>
      </section>

      {/* Main Interactive Wizard Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-6">
        <ProductFinderWizard />
      </section>
    </div>
  );
}
