"use client";

import React, { useState } from "react";
import { DistributorFormData } from "@/types";
import { api } from "@/lib/api";
import {
  Handshake,
  CheckCircle2,
  AlertCircle,
  Building2,
  Mail,
  Phone,
  User,
  MapPin,
  Briefcase,
  Coins,
  ArrowRight,
  ShieldCheck,
} from "lucide-react";
import { getWhatsAppUrl } from "@/lib/whatsapp";

export default function DistributorForm() {
  const [formData, setFormData] = useState<DistributorFormData>({
    applicant_name: "",
    company_name: "",
    phone_number: "",
    email: "",
    gst_number: "",
    city: "Kolkata",
    state: "West Bengal",
    years_experience: "3-5 Years",
    current_products_distributed: "Cleaning supplies, tissue rolls & housekeeping items",
    investment_capacity: "₹3 Lakhs – ₹5 Lakhs",
    message: "",
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [referenceId, setReferenceId] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const res = await api.submitDistributor(formData);
      setReferenceId(res.reference_id);
    } catch (err: any) {
      setError(err.message || "Failed to submit distributor application. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  if (referenceId) {
    return (
      <div className="bg-white rounded-3xl p-8 sm:p-12 border border-teal-200 shadow-card text-center max-w-2xl mx-auto">
        <div className="w-16 h-16 bg-teal-100 text-lioc-teal rounded-full flex items-center justify-center mx-auto mb-6">
          <Handshake className="w-10 h-10" />
        </div>
        <span className="px-3 py-1 bg-teal-50 text-lioc-teal text-xs font-mono font-bold rounded-full border border-teal-200">
          Partner Application ID: {referenceId}
        </span>
        <h3 className="text-2xl font-black text-lioc-navy mt-4">
          Partnership Application Submitted!
        </h3>
        <p className="text-sm text-slate-600 mt-3 leading-relaxed">
          Thank you for your interest in partnering with <span className="font-bold text-slate-800">LIOC</span>. An acknowledgment email with your Reference ID (<strong>{referenceId}</strong>) has been dispatched to <span className="font-bold text-teal-700">{formData.email}</span>. Our Channel Development Manager will review your application and reach out to you shortly.
        </p>

        <div className="mt-8 p-4 bg-slate-50 rounded-2xl border border-slate-200 text-left text-xs space-y-1.5 text-slate-600">
          <div><span className="font-semibold text-slate-800">Reference ID:</span> {referenceId}</div>
          <div><span className="font-semibold text-slate-800">Applicant Name:</span> {formData.applicant_name} ({formData.phone_number})</div>
          <div><span className="font-semibold text-slate-800">Firm / Company:</span> {formData.company_name}</div>
          <div><span className="font-semibold text-slate-800">Email Address:</span> {formData.email}</div>
          <div><span className="font-semibold text-slate-800">Territory:</span> {formData.city}, {formData.state}</div>
        </div>

        <div className="mt-8 flex flex-col sm:flex-row gap-3 justify-center">
          <a
            href={getWhatsAppUrl({
              customMessage: `Hello LIOC Expansion Team, I submitted Dealership Application #${referenceId} for ${formData.company_name} in ${formData.city}. Let's connect.`,
            })}
            target="_blank"
            rel="noopener noreferrer"
            className="px-6 py-3 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold shadow-md transition-all flex items-center justify-center space-x-2"
          >
            <span>Connect on WhatsApp</span>
            <ArrowRight className="w-4 h-4" />
          </a>
        </div>
      </div>
    );
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="bg-white rounded-3xl p-6 sm:p-10 border border-slate-200 shadow-card space-y-6"
    >
      <div className="flex items-center space-x-3 pb-4 border-b border-slate-100">
        <div className="w-10 h-10 rounded-xl bg-teal-50 text-lioc-teal flex items-center justify-center">
          <Handshake className="w-5 h-5" />
        </div>
        <div>
          <h2 className="text-lg font-bold text-lioc-navy">Distributor & Dealership Application</h2>
          <p className="text-xs text-slate-500">
            Partner with Lioc for high-margin cleaning products in your district / territory.
          </p>
        </div>
      </div>

      {error && (
        <div className="p-4 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs flex items-start space-x-2">
          <AlertCircle className="w-4 h-4 flex-shrink-0 mt-0.5" />
          <span>{error}</span>
        </div>
      )}

      {/* Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {/* Applicant Name */}
        <div>
          <label className="block text-xs font-bold text-slate-700 mb-1.5">
            Applicant / Proprietor Name <span className="text-rose-500">*</span>
          </label>
          <div className="relative">
            <User className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              required
              placeholder="e.g. Vikram Agarwal"
              value={formData.applicant_name}
              onChange={(e) => setFormData({ ...formData, applicant_name: e.target.value })}
              className="w-full pl-10 pr-3.5 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-lioc-teal/30 focus:border-lioc-teal text-xs bg-slate-50/50"
            />
          </div>
        </div>

        {/* Company Name */}
        <div>
          <label className="block text-xs font-bold text-slate-700 mb-1.5">
            Firm / Enterprise Name <span className="text-rose-500">*</span>
          </label>
          <div className="relative">
            <Building2 className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              required
              placeholder="e.g. Agarwal Hygiene Supplies"
              value={formData.company_name}
              onChange={(e) => setFormData({ ...formData, company_name: e.target.value })}
              className="w-full pl-10 pr-3.5 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-lioc-teal/30 focus:border-lioc-teal text-xs bg-slate-50/50"
            />
          </div>
        </div>

        {/* Phone */}
        <div>
          <label className="block text-xs font-bold text-slate-700 mb-1.5">
            Phone / WhatsApp Number <span className="text-rose-500">*</span>
          </label>
          <div className="relative">
            <Phone className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="tel"
              required
              placeholder="e.g. +91 98322 45678"
              value={formData.phone_number}
              onChange={(e) => setFormData({ ...formData, phone_number: e.target.value })}
              className="w-full pl-10 pr-3.5 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-lioc-teal/30 focus:border-lioc-teal text-xs bg-slate-50/50"
            />
          </div>
        </div>

        {/* Email */}
        <div>
          <label className="block text-xs font-bold text-slate-700 mb-1.5">
            Email Address <span className="text-rose-500">*</span>
          </label>
          <div className="relative">
            <Mail className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="email"
              required
              placeholder="e.g. vikram@agarwalsupplies.in"
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              className="w-full pl-10 pr-3.5 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-lioc-teal/30 focus:border-lioc-teal text-xs bg-slate-50/50"
            />
          </div>
        </div>

        {/* GST */}
        <div>
          <label className="block text-xs font-bold text-slate-700 mb-1.5">
            GSTIN (Optional)
          </label>
          <input
            type="text"
            placeholder="e.g. 19AAAAA0000A1Z5"
            value={formData.gst_number || ""}
            onChange={(e) => setFormData({ ...formData, gst_number: e.target.value })}
            className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-lioc-teal/30 focus:border-lioc-teal text-xs bg-slate-50/50"
          />
        </div>

        {/* City & State */}
        <div>
          <label className="block text-xs font-bold text-slate-700 mb-1.5">
            City & Target Territory <span className="text-rose-500">*</span>
          </label>
          <div className="relative">
            <MapPin className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              required
              placeholder="e.g. Howrah / North 24 Parganas"
              value={formData.city}
              onChange={(e) => setFormData({ ...formData, city: e.target.value })}
              className="w-full pl-10 pr-3.5 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-lioc-teal/30 focus:border-lioc-teal text-xs bg-slate-50/50"
            />
          </div>
        </div>

        {/* State */}
        <div>
          <label className="block text-xs font-bold text-slate-700 mb-1.5">
            State <span className="text-rose-500">*</span>
          </label>
          <input
            type="text"
            required
            value={formData.state}
            onChange={(e) => setFormData({ ...formData, state: e.target.value })}
            className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-lioc-teal/30 focus:border-lioc-teal text-xs bg-slate-50/50"
          />
        </div>

        {/* Experience */}
        <div>
          <label className="block text-xs font-bold text-slate-700 mb-1.5">
            Years in Chemical / FMCG Distribution
          </label>
          <div className="relative">
            <Briefcase className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <select
              value={formData.years_experience || ""}
              onChange={(e) => setFormData({ ...formData, years_experience: e.target.value })}
              className="w-full pl-10 pr-3.5 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-lioc-teal/30 focus:border-lioc-teal text-xs bg-slate-50/50 text-slate-800"
            >
              <option value="New Business Venture">New Business Venture</option>
              <option value="1-3 Years">1 – 3 Years</option>
              <option value="3-5 Years">3 – 5 Years</option>
              <option value="5-10 Years">5 – 10 Years</option>
              <option value="10+ Years">10+ Years in Distribution</option>
            </select>
          </div>
        </div>
      </div>

      {/* Investment Capacity */}
      <div>
        <label className="block text-xs font-bold text-slate-700 mb-1.5">
          Planned Initial Working Capital / Stocking Capacity
        </label>
        <div className="relative">
          <Coins className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <select
            value={formData.investment_capacity || ""}
            onChange={(e) => setFormData({ ...formData, investment_capacity: e.target.value })}
            className="w-full pl-10 pr-3.5 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-lioc-teal/30 focus:border-lioc-teal text-xs bg-slate-50/50 text-slate-800"
          >
            <option value="₹1 Lakh – ₹3 Lakhs">₹1 Lakh – ₹3 Lakhs (Dealer)</option>
            <option value="₹3 Lakhs – ₹5 Lakhs">₹3 Lakhs – ₹5 Lakhs (City Distributor)</option>
            <option value="₹5 Lakhs – ₹10 Lakhs">₹5 Lakhs – ₹10 Lakhs (District Stockist)</option>
            <option value="₹10 Lakhs+">₹10 Lakhs+ (Regional Super Stockist)</option>
          </select>
        </div>
      </div>

      {/* Current Portfolio */}
      <div>
        <label className="block text-xs font-bold text-slate-700 mb-1.5">
          Current Product Portfolio & Client Network
        </label>
        <textarea
          rows={2}
          placeholder="Mention customer types you currently supply to (hotels, hospitals, local retailers, facilities)..."
          value={formData.current_products_distributed || ""}
          onChange={(e) => setFormData({ ...formData, current_products_distributed: e.target.value })}
          className="w-full p-3.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-lioc-teal/30 focus:border-lioc-teal text-xs bg-slate-50/50"
        ></textarea>
      </div>

      {/* Submit Button */}
      <div className="pt-2">
        <button
          type="submit"
          disabled={loading}
          className="w-full py-3.5 px-6 rounded-xl bg-lioc-teal hover:bg-lioc-tealDark text-white font-bold text-sm shadow-md shadow-teal-700/20 transition-all flex items-center justify-center space-x-2 disabled:opacity-50"
        >
          {loading ? (
            <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
          ) : (
            <>
              <span>Apply for Dealership / Distribution</span>
              <ArrowRight className="w-4 h-4" />
            </>
          )}
        </button>
        <div className="flex items-center justify-center space-x-1.5 text-[11px] text-slate-400 mt-3">
          <ShieldCheck className="w-3.5 h-3.5 text-lioc-teal" />
          <span>Attractive margins • Territory protection • Marketing & sales collateral support</span>
        </div>
      </div>
    </form>
  );
}
