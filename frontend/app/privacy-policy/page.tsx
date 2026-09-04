import React from "react";
import type { Metadata } from "next";
import Link from "next/link";
import {
  ShieldCheck,
  FileText,
  Lock,
  Mail,
  Phone,
  AlertCircle,
  Building2,
  Database,
  CheckCircle2,
} from "lucide-react";
import { SITE_CONFIG } from "@/lib/config";

export const metadata: Metadata = {
  title: "Privacy Policy | Lioc Commercial Hygiene Solutions",
  description:
    "Privacy Policy for Lioc Commercial Cleaning Chemicals. Learn how we collect, handle, and protect your commercial inquiry data.",
};

export default function PrivacyPolicyPage() {
  return (
    <div className="py-12 space-y-12">
      {/* Header Banner */}
      <div className="bg-lioc-navy text-white py-14 border-b border-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 max-w-4xl text-center space-y-3">
          <div className="inline-flex items-center space-x-1.5 px-3 py-1 rounded-full bg-teal-500/10 border border-teal-500/30 text-teal-300 text-xs font-bold">
            <ShieldCheck className="w-3.5 h-3.5" />
            <span>Data Protection & Privacy Policy</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-black text-white">
            Privacy Policy
          </h1>
          <p className="text-sm text-slate-300 max-w-2xl mx-auto leading-relaxed">
            This Privacy Policy describes how <span className="text-teal-400 font-semibold">{SITE_CONFIG.companyName}</span> collects, uses, and safeguards information provided by commercial clients, distributors, and website visitors.
          </p>
          <div className="text-xs text-slate-400 font-mono pt-1">
            Last Updated: August 27, 2026 • Version 1.0 (B2B Commercial)
          </div>
        </div>
      </div>

      {/* Notice on Legal Review */}
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="p-4 rounded-2xl bg-amber-50 border border-amber-200 text-amber-900 text-xs flex items-start space-x-3">
          <AlertCircle className="w-4 h-4 text-amber-600 flex-shrink-0 mt-0.5" />
          <div>
            <span className="font-bold">[LEGAL NOTICE / REVIEW REQUIREMENT]:</span> This policy outlines standard commercial practices for business-to-business (B2B) inquiries, sample dispatches, and dealership applications in India. Specific jurisdiction clauses should be reviewed by qualified legal counsel prior to high-volume commercial expansion.
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8 text-slate-700 text-sm leading-relaxed">
        
        {/* Section 1: Overview */}
        <div className="bg-white rounded-3xl p-8 border border-slate-200 shadow-sm space-y-4">
          <h2 className="text-xl font-bold text-lioc-navy flex items-center space-x-2">
            <Building2 className="w-5 h-5 text-lioc-teal" />
            <span>1. Commercial Entity & Scope</span>
          </h2>
          <p>
            This website is operated by <strong>{SITE_CONFIG.companyName}</strong>, having its operational hub and distribution center located at {SITE_CONFIG.address}. We manufacture and distribute industrial, institutional, and commercial cleaning chemical formulations.
          </p>
          <p>
            We are committed to respecting your business privacy and ensuring all proprietary facility information, volume requirements, and contact data submitted through our digital channels are handled with enterprise security.
          </p>
        </div>

        {/* Section 2: Information We Collect */}
        <div className="bg-white rounded-3xl p-8 border border-slate-200 shadow-sm space-y-4">
          <h2 className="text-xl font-bold text-lioc-navy flex items-center space-x-2">
            <Database className="w-5 h-5 text-lioc-teal" />
            <span>2. Information We Collect</span>
          </h2>
          <p>
            When you interact with our website, request quotes, order evaluation sample kits, or submit dealership applications, we collect the following business information:
          </p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
            <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-1">
              <h3 className="font-bold text-slate-900 text-xs uppercase tracking-wider">Contact & Personnel</h3>
              <p className="text-xs text-slate-600">Contact person name, designated designation, direct phone number, business email address.</p>
            </div>
            <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-1">
              <h3 className="font-bold text-slate-900 text-xs uppercase tracking-wider">Facility & Business Details</h3>
              <p className="text-xs text-slate-600">Company legal name, GSTIN (optional/distributors), facility physical address, city, state, pincode.</p>
            </div>
            <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-1">
              <h3 className="font-bold text-slate-900 text-xs uppercase tracking-wider">Product & Consumption Specs</h3>
              <p className="text-xs text-slate-600">Product formulation interests, estimated monthly consumption volume (Litres/Kgs), packaging preference.</p>
            </div>
            <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-1">
              <h3 className="font-bold text-slate-900 text-xs uppercase tracking-wider">Technical Log Data</h3>
              <p className="text-xs text-slate-600">IP address, browser user-agent, anti-spam validation tokens, and request transaction timestamps.</p>
            </div>
          </div>
        </div>

        {/* Section 3: How We Use Collected Data */}
        <div className="bg-white rounded-3xl p-8 border border-slate-200 shadow-sm space-y-4">
          <h2 className="text-xl font-bold text-lioc-navy flex items-center space-x-2">
            <FileText className="w-5 h-5 text-lioc-teal" />
            <span>3. How We Use Collected Information</span>
          </h2>
          <p>We process your submitted data strictly for legitimate commercial purposes:</p>
          <ul className="space-y-2 text-xs">
            <li className="flex items-start space-x-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 flex-shrink-0 mt-0.5" />
              <span><strong>Generating B2B Quotations:</strong> Calculating wholesale and tiered institutional pricing based on facility volume.</span>
            </li>
            <li className="flex items-start space-x-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 flex-shrink-0 mt-0.5" />
              <span><strong>Sample Kit Logistics:</strong> Verifying business legitimacy and organizing courier dispatch of product evaluation kits.</span>
            </li>
            <li className="flex items-start space-x-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 flex-shrink-0 mt-0.5" />
              <span><strong>Distributor Evaluation:</strong> Assessing territorial dealership qualifications, logistics compatibility, and financial tiers.</span>
            </li>
            <li className="flex items-start space-x-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 flex-shrink-0 mt-0.5" />
              <span><strong>Customer Support & Technical Advisory:</strong> Providing chemical dilution directions, Material Safety Data Sheets (MSDS), and compliance advice.</span>
            </li>
          </ul>
        </div>

        {/* Section 4: Data Security & Retention */}
        <div className="bg-white rounded-3xl p-8 border border-slate-200 shadow-sm space-y-4">
          <h2 className="text-xl font-bold text-lioc-navy flex items-center space-x-2">
            <Lock className="w-5 h-5 text-lioc-teal" />
            <span>4. Data Security, Protection & Non-Disclosure</span>
          </h2>
          <p>
            We implement stringent technological and administrative measures to secure your information against unauthorized access, loss, or alteration.
          </p>
          <ul className="list-disc pl-5 space-y-1 text-xs text-slate-600">
            <li><strong>No Third-Party Sale:</strong> We NEVER sell, rent, or trade customer contact information or volume inquiries to third-party marketing companies.</li>
            <li><strong>Encrypted Transport:</strong> All data submitted through forms is encrypted in transit via Transport Layer Security (TLS/HTTPS).</li>
            <li><strong>Restricted Executive Access:</strong> Only authorized Lioc management and assigned regional sales executives have access to inquiry records.</li>
          </ul>
        </div>

        {/* Section 5: Contact Channel */}
        <div className="bg-gradient-to-r from-slate-900 to-lioc-navy text-white rounded-3xl p-8 space-y-4">
          <h2 className="text-xl font-bold flex items-center space-x-2">
            <Mail className="w-5 h-5 text-teal-400" />
            <span>5. Privacy Officer & Grievance Contact</span>
          </h2>
          <p className="text-xs text-slate-300 leading-relaxed">
            If you have questions regarding this Privacy Policy, wish to update your business contact records, or request deletion of your inquiry details, please reach out to our administration desk:
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
