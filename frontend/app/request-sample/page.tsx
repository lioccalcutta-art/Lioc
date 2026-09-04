import React from "react";
import type { Metadata } from "next";
import SampleForm from "@/components/forms/SampleForm";
import { Package, Truck, ShieldCheck, CheckCircle2 } from "lucide-react";

export const metadata: Metadata = {
  title: "Request Free Sample Kit | Commercial Cleaning Products",
  description:
    "Request a free evaluation sample kit of Lioc commercial cleaning chemicals for your hotel, restaurant, school, or corporate facility in Kolkata.",
};

interface RequestSamplePageProps {
  searchParams?: {
    product?: string;
  };
}

export default function RequestSamplePage({ searchParams }: RequestSamplePageProps) {
  const initialProduct = searchParams?.product || "";

  return (
    <div className="py-12 space-y-12">
      {/* Header Banner */}
      <div className="bg-lioc-navy text-white py-12 border-b border-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center max-w-3xl">
          <div className="inline-flex items-center space-x-1.5 px-3 py-1 rounded-full bg-teal-500/10 border border-teal-500/30 text-teal-300 text-xs font-bold mb-3">
            <Package className="w-3.5 h-3.5" />
            <span>Commercial Quality Evaluation</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-black text-white">
            Request Free Commercial Sample Kit
          </h1>
          <p className="text-sm text-slate-300 mt-2 leading-relaxed">
            Test the fragrance, high dilution ratio, and grease-cutting efficacy of Lioc products at your facility before committing to bulk purchases.
          </p>
        </div>
      </div>

      {/* Main Grid */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
          <div className="lg:col-span-8">
            <SampleForm initialProduct={initialProduct} />
          </div>

          <div className="lg:col-span-4 space-y-6">
            <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm space-y-4">
              <h3 className="text-base font-bold text-lioc-navy">What is in the Sample Kit?</h3>
              <ul className="space-y-2.5 text-xs text-slate-600">
                <li className="flex items-start space-x-2">
                  <CheckCircle2 className="w-4 h-4 text-lioc-teal flex-shrink-0 mt-0.5" />
                  <span>500ml concentrated sample bottles for testing</span>
                </li>
                <li className="flex items-start space-x-2">
                  <CheckCircle2 className="w-4 h-4 text-lioc-teal flex-shrink-0 mt-0.5" />
                  <span>Technical dilution dosing guides for housekeeping crews</span>
                </li>
                <li className="flex items-start space-x-2">
                  <CheckCircle2 className="w-4 h-4 text-lioc-teal flex-shrink-0 mt-0.5" />
                  <span>Material Safety Data Sheet (MSDS)</span>
                </li>
                <li className="flex items-start space-x-2">
                  <CheckCircle2 className="w-4 h-4 text-lioc-teal flex-shrink-0 mt-0.5" />
                  <span>Wholesale bulk price matrix for 5L, 20L, and 50L drums</span>
                </li>
              </ul>
            </div>

            <div className="bg-slate-900 text-white rounded-3xl p-6 space-y-3 text-xs">
              <div className="font-bold text-sm text-teal-300 flex items-center space-x-2">
                <Truck className="w-4 h-4" />
                <span>Eligibility Criteria</span>
              </div>
              <p className="text-slate-300 leading-relaxed">
                Sample kits are provided exclusively to commercial businesses, hotels, cloud kitchens, schools, hospitals, and cleaning service contractors with active premises.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
