"use client";

import React, { useState } from "react";
import { QuoteFormData } from "@/types";
import { api } from "@/lib/api";
import {
  FileText,
  CheckCircle2,
  AlertCircle,
  Building2,
  Mail,
  Phone,
  User,
  MapPin,
  Package,
  Layers,
  ArrowRight,
  ShieldCheck,
} from "lucide-react";
import { getWhatsAppUrl } from "@/lib/whatsapp";

interface QuoteFormProps {
  initialProduct?: string;
}

export default function QuoteForm({ initialProduct = "" }: QuoteFormProps) {
  const [formData, setFormData] = useState<QuoteFormData>({
    full_name: "",
    company_name: "",
    phone_number: "",
    email: "",
    business_type: "Hotels and Guest Houses",
    city: "Kolkata",
    product_interested_in: initialProduct,
    estimated_quantity: "50-100 Litres",
    monthly_requirement: "Regular Monthly Supply",
    message: "",
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [referenceId, setReferenceId] = useState<string | null>(null);

  const businessTypes = [
    "Hotels and Guest Houses",
    "Restaurants, Cafes & Cloud Kitchens",
    "Schools, Colleges & Universities",
    "Corporate Offices & IT Parks",
    "Cleaning & Facility Service Providers",
    "Hospitals & Healthcare Clinics",
    "Manufacturing & Industrial Facilities",
    "Other Commercial Business",
  ];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const res = await api.submitQuote(formData);
      setReferenceId(res.reference_id);
    } catch (err: any) {
      setError(err.message || "Failed to submit quotation request. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  if (referenceId) {
    return (
      <div className="bg-white rounded-3xl p-8 sm:p-12 border border-teal-200 shadow-card text-center max-w-2xl mx-auto">
        <div className="w-16 h-16 bg-teal-100 text-lioc-teal rounded-full flex items-center justify-center mx-auto mb-6">
          <CheckCircle2 className="w-10 h-10" />
        </div>
        <span className="px-3 py-1 bg-teal-50 text-lioc-teal text-xs font-mono font-bold rounded-full border border-teal-200">
          Tracking ID: {referenceId}
        </span>
        <h3 className="text-2xl font-black text-lioc-navy mt-4">
          Quotation Request Submitted Successfully!
        </h3>
        <p className="text-sm text-slate-600 mt-3 leading-relaxed">
          Thank you for choosing <span className="font-bold text-slate-800">LIOC</span>. An acknowledgment email with your Reference ID (<strong>{referenceId}</strong>) has been dispatched to <span className="font-bold text-teal-700">{formData.email}</span>. Our commercial sales team will review your requirement and reach out to you shortly.
        </p>

        <div className="mt-8 p-4 bg-slate-50 rounded-2xl border border-slate-200 text-left text-xs space-y-1.5 text-slate-600">
          <div><span className="font-semibold text-slate-800">Reference ID:</span> {referenceId}</div>
          <div><span className="font-semibold text-slate-800">Company:</span> {formData.company_name}</div>
          <div><span className="font-semibold text-slate-800">Contact Person:</span> {formData.full_name} ({formData.phone_number})</div>
          <div><span className="font-semibold text-slate-800">Email Address:</span> {formData.email}</div>
          <div><span className="font-semibold text-slate-800">Location:</span> {formData.city}</div>
          {formData.product_interested_in && (
            <div><span className="font-semibold text-slate-800">Requirement:</span> {formData.product_interested_in}</div>
          )}
        </div>

        <div className="mt-8 flex flex-col sm:flex-row gap-3 justify-center">
          <a
            href={getWhatsAppUrl({
              customMessage: `Hello Lioc Sales, I have submitted Quote Request #${referenceId} for ${formData.company_name}. Please prioritize our bulk quotation.`,
            })}
            target="_blank"
            rel="noopener noreferrer"
            className="px-6 py-3 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold shadow-md transition-all flex items-center justify-center space-x-2"
          >
            <span>Speed up on WhatsApp</span>
            <ArrowRight className="w-4 h-4" />
          </a>
          <button
            onClick={() => {
              setReferenceId(null);
              setFormData({
                full_name: "",
                company_name: "",
                phone_number: "",
                email: "",
                business_type: "Hotels and Guest Houses",
                city: "Kolkata",
                product_interested_in: "",
                estimated_quantity: "50-100 Litres",
                monthly_requirement: "Regular Monthly Supply",
                message: "",
              });
            }}
            className="px-6 py-3 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-bold transition-all"
          >
            Submit Another Request
          </button>
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
          <FileText className="w-5 h-5" />
        </div>
        <div>
          <h2 className="text-lg font-bold text-lioc-navy">Direct Factory Bulk Quotation</h2>
          <p className="text-xs text-slate-500">
            Wholesale institutional rates for hotels, restaurants & businesses.
          </p>
        </div>
      </div>

      {error && (
        <div className="p-4 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs flex items-start space-x-2">
          <AlertCircle className="w-4 h-4 flex-shrink-0 mt-0.5" />
          <span>{error}</span>
        </div>
      )}

      {/* Grid Rows */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {/* Full Name */}
        <div>
          <label className="block text-xs font-bold text-slate-700 mb-1.5">
            Full Name <span className="text-rose-500">*</span>
          </label>
          <div className="relative">
            <User className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              required
              placeholder="e.g. Rajesh Sharma"
              value={formData.full_name}
              onChange={(e) => setFormData({ ...formData, full_name: e.target.value })}
              className="w-full pl-10 pr-3.5 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-lioc-teal/30 focus:border-lioc-teal text-xs bg-slate-50/50"
            />
          </div>
        </div>

        {/* Company Name */}
        <div>
          <label className="block text-xs font-bold text-slate-700 mb-1.5">
            Company / Facility Name <span className="text-rose-500">*</span>
          </label>
          <div className="relative">
            <Building2 className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              required
              placeholder="e.g. Parkview Hotel & Suites"
              value={formData.company_name}
              onChange={(e) => setFormData({ ...formData, company_name: e.target.value })}
              className="w-full pl-10 pr-3.5 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-lioc-teal/30 focus:border-lioc-teal text-xs bg-slate-50/50"
            />
          </div>
        </div>

        {/* Phone */}
        <div>
          <label className="block text-xs font-bold text-slate-700 mb-1.5">
            Phone Number <span className="text-rose-500">*</span>
          </label>
          <div className="relative">
            <Phone className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="tel"
              required
              placeholder="e.g. +91 98300 12345"
              value={formData.phone_number}
              onChange={(e) => setFormData({ ...formData, phone_number: e.target.value })}
              className="w-full pl-10 pr-3.5 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-lioc-teal/30 focus:border-lioc-teal text-xs bg-slate-50/50"
            />
          </div>
        </div>

        {/* Email */}
        <div>
          <label className="block text-xs font-bold text-slate-700 mb-1.5">
            Official Email Address <span className="text-rose-500">*</span>
          </label>
          <div className="relative">
            <Mail className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="email"
              required
              placeholder="e.g. purchase@parkviewhotel.in"
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              className="w-full pl-10 pr-3.5 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-lioc-teal/30 focus:border-lioc-teal text-xs bg-slate-50/50"
            />
          </div>
        </div>

        {/* Business Type */}
        <div>
          <label className="block text-xs font-bold text-slate-700 mb-1.5">
            Business / Industry Type <span className="text-rose-500">*</span>
          </label>
          <select
            value={formData.business_type}
            onChange={(e) => setFormData({ ...formData, business_type: e.target.value })}
            className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-lioc-teal/30 focus:border-lioc-teal text-xs bg-slate-50/50 text-slate-800"
          >
            {businessTypes.map((type) => (
              <option key={type} value={type}>
                {type}
              </option>
            ))}
          </select>
        </div>

        {/* City */}
        <div>
          <label className="block text-xs font-bold text-slate-700 mb-1.5">
            City / Location <span className="text-rose-500">*</span>
          </label>
          <div className="relative">
            <MapPin className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              required
              placeholder="e.g. Kolkata, Howrah, Salt Lake"
              value={formData.city}
              onChange={(e) => setFormData({ ...formData, city: e.target.value })}
              className="w-full pl-10 pr-3.5 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-lioc-teal/30 focus:border-lioc-teal text-xs bg-slate-50/50"
            />
          </div>
        </div>
      </div>

      {/* Product Interested In */}
      <div>
        <label className="block text-xs font-bold text-slate-700 mb-1.5">
          Product(s) Interested In
        </label>
        <div className="relative">
          <Package className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="e.g. Floor Cleaner (20L Can), Toilet Descaler, Glass Gleam"
            value={formData.product_interested_in || ""}
            onChange={(e) => setFormData({ ...formData, product_interested_in: e.target.value })}
            className="w-full pl-10 pr-3.5 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-lioc-teal/30 focus:border-lioc-teal text-xs bg-slate-50/50"
          />
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {/* Estimated Volume */}
        <div>
          <label className="block text-xs font-bold text-slate-700 mb-1.5">
            Initial Order Volume
          </label>
          <select
            value={formData.estimated_quantity || ""}
            onChange={(e) => setFormData({ ...formData, estimated_quantity: e.target.value })}
            className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-lioc-teal/30 focus:border-lioc-teal text-xs bg-slate-50/50 text-slate-800"
          >
            <option value="20-50 Litres">20 – 50 Litres (Trial Bulk)</option>
            <option value="50-100 Litres">50 – 100 Litres</option>
            <option value="100-500 Litres">100 – 500 Litres (Medium Commercial)</option>
            <option value="500-2000 Litres">500 – 2000 Litres (Large Enterprise / Institutional)</option>
            <option value="2000+ Litres">2000+ Litres (Distributor / Heavy Volume)</option>
          </select>
        </div>

        {/* Monthly Frequency */}
        <div>
          <label className="block text-xs font-bold text-slate-700 mb-1.5">
            Expected Order Cycle
          </label>
          <select
            value={formData.monthly_requirement || ""}
            onChange={(e) => setFormData({ ...formData, monthly_requirement: e.target.value })}
            className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-lioc-teal/30 focus:border-lioc-teal text-xs bg-slate-50/50 text-slate-800"
          >
            <option value="One-Time Bulk Purchase">One-Time Bulk Purchase</option>
            <option value="Monthly Recurring Supply">Monthly Recurring Supply</option>
            <option value="Quarterly Contract">Quarterly Contract</option>
            <option value="Annual Institutional Contract">Annual Institutional Supply</option>
          </select>
        </div>
      </div>

      {/* Message / Specific Requirements */}
      <div>
        <label className="block text-xs font-bold text-slate-700 mb-1.5">
          Specific Cleaning Requirements or Special Instructions
        </label>
        <textarea
          rows={3}
          placeholder="Mention specific surface challenges (hard water stains, heavy grease, specific fragrance preferences, delivery location details)..."
          value={formData.message || ""}
          onChange={(e) => setFormData({ ...formData, message: e.target.value })}
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
              <span>Get Wholesale Price Quotation</span>
              <ArrowRight className="w-4 h-4" />
            </>
          )}
        </button>
        <div className="flex items-center justify-center space-x-1.5 text-[11px] text-slate-400 mt-3">
          <ShieldCheck className="w-3.5 h-3.5 text-lioc-teal" />
          <span>No spam guarantee • Direct factory pricing • Fast response within 24h</span>
        </div>
      </div>
    </form>
  );
}
