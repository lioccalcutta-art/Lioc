import React from "react";
import type { Metadata } from "next";
import Link from "next/link";
import {
  FileText,
  ShieldCheck,
  AlertCircle,
  Building2,
  Package,
  Truck,
  CheckCircle2,
  Scale,
  Mail,
  Phone,
} from "lucide-react";
import { SITE_CONFIG } from "@/lib/config";

export const metadata: Metadata = {
  title: "Terms & Commercial Conditions | Lioc Commercial Hygiene Solutions",
  description:
    "Commercial terms, quotation rules, sample evaluation conditions, and wholesale policies for Lioc Commercial Cleaning Chemicals.",
};

export default function TermsPage() {
  return (
    <div className="py-12 space-y-12">
      {/* Header Banner */}
      <div className="bg-lioc-navy text-white py-14 border-b border-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 max-w-4xl text-center space-y-3">
          <div className="inline-flex items-center space-x-1.5 px-3 py-1 rounded-full bg-teal-500/10 border border-teal-500/30 text-teal-300 text-xs font-bold">
            <Scale className="w-3.5 h-3.5" />
            <span>Commercial Policies & Agreement</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-black text-white">
            Terms & Conditions of Commercial Supply
          </h1>
          <p className="text-sm text-slate-300 max-w-2xl mx-auto leading-relaxed">
            Standard terms governing website usage, wholesale B2B quotations, product evaluation sample kits, and territorial distribution partnerships with <span className="text-teal-400 font-semibold">{SITE_CONFIG.companyName}</span>.
          </p>
          <div className="text-xs text-slate-400 font-mono pt-1">
            Last Updated: August 27, 2026 • Version 1.0 (B2B Institutional Supply)
          </div>
        </div>
      </div>

      {/* Notice on Legal Review */}
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="p-4 rounded-2xl bg-amber-50 border border-amber-200 text-amber-900 text-xs flex items-start space-x-3">
          <AlertCircle className="w-4 h-4 text-amber-600 flex-shrink-0 mt-0.5" />
          <div>
            <span className="font-bold">[LEGAL REVIEW REQUIRED]:</span> The terms below govern digital inquiries, bulk RFQs, and commercial sample evaluations. Formal supply contracts, annual rate contracts (ARCs), and distributor deeds will be executed as separate bilateral legal agreements.
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8 text-slate-700 text-sm leading-relaxed">

        {/* Section 1: Acceptance */}
        <div className="bg-white rounded-3xl p-8 border border-slate-200 shadow-sm space-y-4">
          <h2 className="text-xl font-bold text-lioc-navy flex items-center space-x-2">
            <Building2 className="w-5 h-5 text-lioc-teal" />
            <span>1. Website Usage & Commercial Scope</span>
          </h2>
          <p>
            By accessing this website, requesting quotes, or submitting evaluation sample requests, you represent that you are an authorized representative of a commercial facility, hospitality establishment, educational institution, corporate entity, healthcare clinic, or commercial cleaning contractor.
          </p>
          <p>
            All products listed on this website are formulated for commercial and institutional cleaning operations.
          </p>
        </div>

        {/* Section 2: Quotations & Pricing */}
        <div className="bg-white rounded-3xl p-8 border border-slate-200 shadow-sm space-y-4">
          <h2 className="text-xl font-bold text-lioc-navy flex items-center space-x-2">
            <FileText className="w-5 h-5 text-lioc-teal" />
            <span>2. B2B Quotations & Wholesale Pricing (RFQ)</span>
          </h2>
          <ul className="space-y-2 text-xs text-slate-600">
            <li className="flex items-start space-x-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 flex-shrink-0 mt-0.5" />
              <span><strong>Quotation Validity:</strong> Formal commercial price estimates provided by Lioc sales executives are valid for 30 calendar days from the date of quotation issuance, unless specified otherwise in written communication.</span>
            </li>
            <li className="flex items-start space-x-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 flex-shrink-0 mt-0.5" />
              <span><strong>Taxes & Freight:</strong> Unless explicitly itemized, prices are ex-factory Kolkata. Applicable GST (Goods & Services Tax) and freight/delivery charges will be detailed on the proforma invoice.</span>
            </li>
            <li className="flex items-start space-x-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 flex-shrink-0 mt-0.5" />
              <span><strong>Minimum Order Quantities (MOQ):</strong> Tiered wholesale discounts apply based on order volumes (5L institutional cans, 20L cans, 50L/200L drums).</span>
            </li>
          </ul>
        </div>

        {/* Section 3: Evaluation Sample Kit Policy */}
        <div className="bg-white rounded-3xl p-8 border border-slate-200 shadow-sm space-y-4">
          <h2 className="text-xl font-bold text-lioc-navy flex items-center space-x-2">
            <Package className="w-5 h-5 text-lioc-teal" />
            <span>3. Product Sample Evaluation Policy</span>
          </h2>
          <p className="text-xs text-slate-600">
            Lioc provides complimentary product trial kits to qualified commercial businesses (Hotels, Cloud Kitchens, Facilities, Hospitals, Schools) for institutional performance evaluation.
          </p>
          <ul className="list-disc pl-5 space-y-1 text-xs text-slate-600">
            <li>Sample requests are subject to verification of business credentials and delivery address feasibility.</li>
            <li>Lioc reserves the right to decline or limit sample allocations if commercial eligibility criteria are not met.</li>
            <li>Sample formulations must be evaluated according to provided Technical Data Sheets (TDS) and dilution instructions.</li>
          </ul>
        </div>

        {/* Section 4: Distributor Partnerships */}
        <div className="bg-white rounded-3xl p-8 border border-slate-200 shadow-sm space-y-4">
          <h2 className="text-xl font-bold text-lioc-navy flex items-center space-x-2">
            <Truck className="w-5 h-5 text-lioc-teal" />
            <span>4. Territorial Distributor Applications</span>
          </h2>
          <p className="text-xs text-slate-600 leading-relaxed">
            Submission of a distributor application does not create a binding dealership agreement. Exclusive territorial rights, credit terms, and minimum monthly sales commitments (MOC) are established solely through a formally executed bilateral Distribution Agreement signed by authorized company directors.
          </p>
        </div>

        {/* Section 5: Safety & Technical Specifications */}
        <div className="bg-white rounded-3xl p-8 border border-slate-200 shadow-sm space-y-4">
          <h2 className="text-xl font-bold text-lioc-navy flex items-center space-x-2">
            <ShieldCheck className="w-5 h-5 text-lioc-teal" />
            <span>5. Chemical Handling, Safety & Liability</span>
          </h2>
          <p className="text-xs text-slate-600 leading-relaxed">
            Commercial cleaning formulations must be handled strictly by trained housekeeping or janitorial personnel using appropriate Personal Protective Equipment (PPE). Lioc is not liable for damages resulting from improper dilution, mixing of incompatible chemical agents, or usage on surfaces contrary to product directions.
          </p>
        </div>

        {/* Section 6: Contact & Inquiries */}
        <div className="bg-gradient-to-r from-slate-900 to-lioc-navy text-white rounded-3xl p-8 space-y-4">
          <h2 className="text-xl font-bold flex items-center space-x-2">
            <Mail className="w-5 h-5 text-teal-400" />
            <span>6. Commercial & Legal Inquiries</span>
          </h2>
          <p className="text-xs text-slate-300 leading-relaxed">
            For contractual queries, rate negotiations, or institutional supply tenders, please contact our corporate desk:
          </p>
          <div className="pt-2 flex flex-col sm:flex-row gap-4 text-xs font-semibold">
            <div className="flex items-center space-x-2">
              <Mail className="w-4 h-4 text-teal-400" />
              <span>{SITE_CONFIG.email}</span>
            </div>
            <div className="flex items-center space-x-2">
              <Phone className="w-4 h-4 text-teal-400" />
              <span>{SITE_CONFIG.phone}</span>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
