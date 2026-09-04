import React from "react";
import type { Metadata } from "next";
import DistributorForm from "@/components/forms/DistributorForm";
import { Handshake, Award, TrendingUp, ShieldCheck, MapPin, CheckCircle2 } from "lucide-react";
import { SITE_CONFIG } from "@/lib/config";

export const metadata: Metadata = {
  title: "Become a Distributor / Dealer | Lioc Cleaning Chemicals",
  description:
    "Partner with Lioc as an authorized distributor or stockist for commercial cleaning and hygiene products across Kolkata, Howrah, Hooghly, and Eastern India.",
};

export default function BecomeDistributorPage() {
  return (
    <div className="py-12 space-y-12">
      {/* Header Banner */}
      <div className="bg-lioc-navy text-white py-14 border-b border-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center max-w-3xl">
          <div className="inline-flex items-center space-x-1.5 px-3 py-1 rounded-full bg-teal-500/10 border border-teal-500/30 text-teal-300 text-xs font-bold mb-3">
            <Handshake className="w-3.5 h-3.5" />
            <span>Channel Expansion & Dealerships</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-black text-white">
            Grow Your Business as a Lioc Authorized Partner
          </h1>
          <p className="text-sm text-slate-300 mt-2 leading-relaxed">
            Expand your chemical distribution portfolio with high-margin institutional cleaning products engineered for recurring B2B demand.
          </p>
        </div>
      </div>

      {/* Value Pillars */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm space-y-3">
            <div className="w-12 h-12 rounded-2xl bg-teal-50 text-lioc-teal flex items-center justify-center">
              <TrendingUp className="w-6 h-6" />
            </div>
            <h3 className="text-base font-bold text-lioc-navy">High Repeat B2B Margins</h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              Cleaning products are consumable essentials. Hotels, restaurants, and offices reorder monthly, ensuring steady recurring revenue for your firm.
            </p>
          </div>

          <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm space-y-3">
            <div className="w-12 h-12 rounded-2xl bg-teal-50 text-lioc-teal flex items-center justify-center">
              <MapPin className="w-6 h-6" />
            </div>
            <h3 className="text-base font-bold text-lioc-navy">Territory Exclusivity</h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              We protect our dealer network by allocating defined geographic territories across Kolkata, Howrah, Hooghly, and neighboring districts.
            </p>
          </div>

          <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm space-y-3">
            <div className="w-12 h-12 rounded-2xl bg-teal-50 text-lioc-teal flex items-center justify-center">
              <Award className="w-6 h-6" />
            </div>
            <h3 className="text-base font-bold text-lioc-navy">Factory Marketing Support</h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              Receive free sample kits for prospective client meetings, printed technical product catalogs, and active lead forwarding from our central digital campaigns.
            </p>
          </div>
        </div>

        {/* Application Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
          <div className="lg:col-span-8">
            <DistributorForm />
          </div>

          <div className="lg:col-span-4 space-y-6">
            <div className="bg-slate-900 text-white rounded-3xl p-6 space-y-4 text-xs">
              <div className="font-bold text-sm text-teal-300 flex items-center space-x-2">
                <ShieldCheck className="w-4 h-4" />
                <span>Partner Criteria</span>
              </div>
              <ul className="space-y-2 text-slate-300">
                <li className="flex items-start space-x-2">
                  <CheckCircle2 className="w-4 h-4 text-teal-300 flex-shrink-0 mt-0.5" />
                  <span>Existing network or client base in hospitality, institutional, or retail cleaning</span>
                </li>
                <li className="flex items-start space-x-2">
                  <CheckCircle2 className="w-4 h-4 text-teal-300 flex-shrink-0 mt-0.5" />
                  <span>Dedicated storage/stocking space for 5L cans and 50L drums</span>
                </li>
                <li className="flex items-start space-x-2">
                  <CheckCircle2 className="w-4 h-4 text-teal-300 flex-shrink-0 mt-0.5" />
                  <span>Valid GSTIN and commercial billing setup</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
