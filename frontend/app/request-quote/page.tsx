import React from "react";
import type { Metadata } from "next";
import QuoteForm from "@/components/forms/QuoteForm";
import { ShieldCheck, Truck, Clock, CheckCircle2 } from "lucide-react";
import { SITE_CONFIG } from "@/lib/config";

export const metadata: Metadata = {
  title: "Request Wholesale Quote | B2B Commercial Cleaning Chemicals",
  description:
    "Request factory-direct bulk wholesale pricing for commercial floor cleaners, disinfectants, dishwash, and washroom hygiene products from Lioc in Kolkata.",
};

interface RequestQuotePageProps {
  searchParams?: {
    product?: string;
  };
}

export default function RequestQuotePage({ searchParams }: RequestQuotePageProps) {
  const initialProduct = searchParams?.product || "";

  return (
    <div className="py-12 space-y-12">
      {/* Header Banner */}
      <div className="bg-lioc-navy text-white py-12 border-b border-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center max-w-3xl">
          <div className="inline-flex items-center space-x-1.5 px-3 py-1 rounded-full bg-teal-500/10 border border-teal-500/30 text-teal-300 text-xs font-bold mb-3">
            <span>Direct Commercial Pricing Desk</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-black text-white">
            Request B2B Wholesale Quotation
          </h1>
          <p className="text-sm text-slate-300 mt-2 leading-relaxed">
            Get transparent factory-direct pricing for hotels, restaurants, schools, corporate offices, and cleaning contractors in Kolkata & Eastern India.
          </p>
        </div>
      </div>

      {/* Main Form & Benefits Grid */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
          {/* Left Form */}
          <div className="lg:col-span-8">
            <QuoteForm initialProduct={initialProduct} />
          </div>

          {/* Right Trust Column */}
          <div className="lg:col-span-4 space-y-6">
            <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm space-y-4">
              <h3 className="text-base font-bold text-lioc-navy">What Happens Next?</h3>
              <div className="space-y-4 text-xs text-slate-600">
                <div className="flex items-start space-x-3">
                  <div className="w-6 h-6 rounded-full bg-teal-50 text-lioc-teal font-bold flex items-center justify-center flex-shrink-0 mt-0.5">
                    1
                  </div>
                  <div>
                    <div className="font-bold text-slate-800">Lead Registered in System</div>
                    <div>A unique reference tracking ID is created instantly in our database.</div>
                  </div>
                </div>

                <div className="flex items-start space-x-3">
                  <div className="w-6 h-6 rounded-full bg-teal-50 text-lioc-teal font-bold flex items-center justify-center flex-shrink-0 mt-0.5">
                    2
                  </div>
                  <div>
                    <div className="font-bold text-slate-800">Volume Analysis</div>
                    <div>Our commercial sales manager calculates optimized bulk discounts and freight logistics for your city.</div>
                  </div>
                </div>

                <div className="flex items-start space-x-3">
                  <div className="w-6 h-6 rounded-full bg-teal-50 text-lioc-teal font-bold flex items-center justify-center flex-shrink-0 mt-0.5">
                    3
                  </div>
                  <div>
                    <div className="font-bold text-slate-800">Direct Proposal</div>
                    <div>You receive a customized wholesale rate sheet and TDS via email & WhatsApp within 24 business hours.</div>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-teal-50 rounded-3xl p-6 border border-teal-200 space-y-3 text-xs text-teal-950">
              <div className="font-bold text-sm text-teal-900 flex items-center space-x-2">
                <ShieldCheck className="w-4 h-4 text-lioc-teal" />
                <span>Lioc Commercial Assurance</span>
              </div>
              <ul className="space-y-2 text-slate-700">
                <li className="flex items-center space-x-2">
                  <CheckCircle2 className="w-3.5 h-3.5 text-lioc-teal flex-shrink-0" />
                  <span>GST invoicing for full tax credit claims</span>
                </li>
                <li className="flex items-center space-x-2">
                  <CheckCircle2 className="w-3.5 h-3.5 text-lioc-teal flex-shrink-0" />
                  <span>Batch test reports & safety sheets provided</span>
                </li>
                <li className="flex items-center space-x-2">
                  <CheckCircle2 className="w-3.5 h-3.5 text-lioc-teal flex-shrink-0" />
                  <span>Immediate dispatch for urgent maintenance</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
