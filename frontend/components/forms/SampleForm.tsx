"use client";

import React, { useState } from "react";
import { SampleFormData } from "@/types";
import { api } from "@/lib/api";
import {
  Package,
  CheckCircle2,
  AlertCircle,
  Building2,
  Mail,
  Phone,
  User,
  MapPin,
  Truck,
  ArrowRight,
  ShieldCheck,
} from "lucide-react";
import { getWhatsAppUrl } from "@/lib/whatsapp";

interface SampleFormProps {
  initialProduct?: string;
}

export default function SampleForm({ initialProduct = "" }: SampleFormProps) {
  const [formData, setFormData] = useState<SampleFormData>({
    full_name: "",
    company_name: "",
    phone_number: "",
    email: "",
    business_type: "Hotels and Guest Houses",
    business_address: "",
    city: "Kolkata",
    product_interested_in: initialProduct || "Lioc Pro-Clean Floor Cleaner & Toilet Bowl Descaler Sample Kit",
    expected_monthly_requirement: "50-100 Litres",
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
      const res = await api.submitSample(formData);
      setReferenceId(res.reference_id);
    } catch (err: any) {
      setError(err.message || "Failed to submit sample request. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  if (referenceId) {
    return (
      <div className="bg-white rounded-3xl p-8 sm:p-12 border border-teal-200 shadow-card text-center max-w-2xl mx-auto">
        <div className="w-16 h-16 bg-teal-100 text-lioc-teal rounded-full flex items-center justify-center mx-auto mb-6">
          <Truck className="w-10 h-10" />
        </div>
        <span className="px-3 py-1 bg-teal-50 text-lioc-teal text-xs font-mono font-bold rounded-full border border-teal-200">
          Sample ID: {referenceId}
        </span>
        <h3 className="text-2xl font-black text-lioc-navy mt-4">
          Sample Request Received!
        </h3>
        <p className="text-sm text-slate-600 mt-3 leading-relaxed">
          We have registered your evaluation request for <span className="font-bold text-slate-800">{formData.product_interested_in}</span>. An acknowledgment email with your Reference ID (<strong>{referenceId}</strong>) has been dispatched to <span className="font-bold text-teal-700">{formData.email}</span>. Our team will verify your facility details and reach out to you shortly.
        </p>

        <div className="mt-8 p-4 bg-slate-50 rounded-2xl border border-slate-200 text-left text-xs space-y-1.5 text-slate-600">
          <div><span className="font-semibold text-slate-800">Reference ID:</span> {referenceId}</div>
          <div><span className="font-semibold text-slate-800">Deliver To:</span> {formData.company_name} ({formData.full_name})</div>
          <div><span className="font-semibold text-slate-800">Email Address:</span> {formData.email}</div>
          <div><span className="font-semibold text-slate-800">Address:</span> {formData.business_address}, {formData.city}</div>
          <div><span className="font-semibold text-slate-800">Phone:</span> {formData.phone_number}</div>
        </div>

        <div className="mt-8 flex flex-col sm:flex-row gap-3 justify-center">
          <a
            href={getWhatsAppUrl({
              customMessage: `Hello Lioc Team, I have requested sample kit #${referenceId} for ${formData.company_name}. Please let us know the dispatch timeline.`,
            })}
            target="_blank"
            rel="noopener noreferrer"
            className="px-6 py-3 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold shadow-md transition-all flex items-center justify-center space-x-2"
          >
            <span>Track via WhatsApp</span>
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
          <Package className="w-5 h-5" />
        </div>
        <div>
          <h2 className="text-lg font-bold text-lioc-navy">Request Commercial Sample Kit</h2>
          <p className="text-xs text-slate-500">
            Evaluate cleaning power, scent, and dilution quality before bulk purchasing.
          </p>
        </div>
      </div>

      {error && (
        <div className="p-4 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs flex items-start space-x-2">
          <AlertCircle className="w-4 h-4 flex-shrink-0 mt-0.5" />
          <span>{error}</span>
        </div>
      )}

      {/* Grid Fields */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {/* Full Name */}
        <div>
          <label className="block text-xs font-bold text-slate-700 mb-1.5">
            Full Name / Decision Maker <span className="text-rose-500">*</span>
          </label>
          <div className="relative">
            <User className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              required
              placeholder="e.g. Somnath Mukherjee"
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
              placeholder="e.g. Royal Bengal Residency"
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
              placeholder="e.g. +91 98311 22334"
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
              placeholder="e.g. housekeeping@royalbengal.com"
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              className="w-full pl-10 pr-3.5 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-lioc-teal/30 focus:border-lioc-teal text-xs bg-slate-50/50"
            />
          </div>
        </div>

        {/* Business Type */}
        <div>
          <label className="block text-xs font-bold text-slate-700 mb-1.5">
            Business Type <span className="text-rose-500">*</span>
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
            City <span className="text-rose-500">*</span>
          </label>
          <div className="relative">
            <MapPin className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              required
              placeholder="e.g. Kolkata"
              value={formData.city}
              onChange={(e) => setFormData({ ...formData, city: e.target.value })}
              className="w-full pl-10 pr-3.5 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-lioc-teal/30 focus:border-lioc-teal text-xs bg-slate-50/50"
            />
          </div>
        </div>
      </div>

      {/* Business Delivery Address */}
      <div>
        <label className="block text-xs font-bold text-slate-700 mb-1.5">
          Delivery Address (Where the sample package will be dispatched) <span className="text-rose-500">*</span>
        </label>
        <textarea
          rows={2}
          required
          placeholder="Building name, Floor/Unit number, Street, Landmark, Pin Code..."
          value={formData.business_address}
          onChange={(e) => setFormData({ ...formData, business_address: e.target.value })}
          className="w-full p-3.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-lioc-teal/30 focus:border-lioc-teal text-xs bg-slate-50/50"
        ></textarea>
      </div>

      {/* Product Interested In */}
      <div>
        <label className="block text-xs font-bold text-slate-700 mb-1.5">
          Target Product for Evaluation <span className="text-rose-500">*</span>
        </label>
        <input
          type="text"
          required
          placeholder="e.g. Lioc Floor Cleaner, Kitchen Degreaser, Toilet Descaler"
          value={formData.product_interested_in}
          onChange={(e) => setFormData({ ...formData, product_interested_in: e.target.value })}
          className="w-full p-3.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-lioc-teal/30 focus:border-lioc-teal text-xs bg-slate-50/50"
        />
      </div>

      {/* Expected Monthly Volume */}
      <div>
        <label className="block text-xs font-bold text-slate-700 mb-1.5">
          Anticipated Monthly Consumption if Satisfied
        </label>
        <select
          value={formData.expected_monthly_requirement || ""}
          onChange={(e) => setFormData({ ...formData, expected_monthly_requirement: e.target.value })}
          className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-lioc-teal/30 focus:border-lioc-teal text-xs bg-slate-50/50 text-slate-800"
        >
          <option value="20-50 Litres/mo">20 – 50 Litres / month</option>
          <option value="50-100 Litres/mo">50 – 100 Litres / month</option>
          <option value="100-500 Litres/mo">100 – 500 Litres / month</option>
          <option value="500+ Litres/mo">500+ Litres / month</option>
        </select>
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
              <span>Dispatch Evaluation Sample Kit</span>
              <ArrowRight className="w-4 h-4" />
            </>
          )}
        </button>
        <div className="flex items-center justify-center space-x-1.5 text-[11px] text-slate-400 mt-3">
          <ShieldCheck className="w-3.5 h-3.5 text-lioc-teal" />
          <span>Reserved for commercial facilities, hotels, restaurants & cleaning contractors</span>
        </div>
      </div>
    </form>
  );
}
