"use client";

import React, { useState } from "react";
import { ContactFormData } from "@/types";
import { api } from "@/lib/api";
import {
  MessageSquare,
  CheckCircle2,
  AlertCircle,
  Building2,
  Mail,
  Phone,
  User,
  ArrowRight,
  Send,
} from "lucide-react";

export default function ContactForm() {
  const [formData, setFormData] = useState<ContactFormData>({
    full_name: "",
    email: "",
    phone_number: "",
    company_name: "",
    subject: "General Inquiry",
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
      const res = await api.submitContact(formData);
      setReferenceId(res.reference_id);
    } catch (err: any) {
      setError(err.message || "Failed to send message. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  if (referenceId) {
    return (
      <div className="bg-white rounded-3xl p-8 border border-teal-200 shadow-card text-center">
        <div className="w-14 h-14 bg-teal-100 text-lioc-teal rounded-full flex items-center justify-center mx-auto mb-4">
          <CheckCircle2 className="w-8 h-8" />
        </div>
        <span className="px-3 py-1 bg-teal-50 text-lioc-teal text-xs font-mono font-bold rounded-full border border-teal-200">
          Inquiry Ref: {referenceId}
        </span>
        <h3 className="text-xl font-black text-lioc-navy mt-3">Inquiry Received Successfully!</h3>
        <p className="text-xs text-slate-600 mt-2 leading-relaxed">
          Thank you for contacting <span className="font-bold text-slate-800">LIOC</span>. An acknowledgment email with your Reference ID (<strong>{referenceId}</strong>) has been sent to <span className="font-bold text-teal-700">{formData.email}</span>. Our team will reach out to you shortly.
        </p>

        <div className="mt-5 p-3.5 bg-slate-50 rounded-2xl border border-slate-200 text-left text-xs space-y-1 text-slate-600">
          <div><span className="font-semibold text-slate-800">Reference ID:</span> {referenceId}</div>
          <div><span className="font-semibold text-slate-800">Contact:</span> {formData.full_name} ({formData.phone_number})</div>
          <div><span className="font-semibold text-slate-800">Email:</span> {formData.email}</div>
          {formData.company_name && <div><span className="font-semibold text-slate-800">Company:</span> {formData.company_name}</div>}
        </div>

        <div className="mt-6 flex flex-col sm:flex-row gap-2.5 justify-center">
          <a
            href={`https://wa.me/919007381804?text=Hello%20LIOC%20Team%2C%20I%20have%20an%20inquiry%20regarding%20Ref%3A%20${referenceId}`}
            target="_blank"
            rel="noopener noreferrer"
            className="px-5 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold rounded-xl shadow-sm transition-all inline-flex items-center justify-center space-x-1.5"
          >
            <span>Track on WhatsApp</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </a>
          <button
            onClick={() => {
              setReferenceId(null);
              setFormData({
                full_name: "",
                email: "",
                phone_number: "",
                company_name: "",
                subject: "General Inquiry",
                message: "",
              });
            }}
            className="px-5 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold rounded-xl"
          >
            Send Another Message
          </button>
        </div>
      </div>
    );
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-card space-y-4"
    >
      <div className="flex items-center space-x-3 pb-3 border-b border-slate-100">
        <div className="w-9 h-9 rounded-xl bg-teal-50 text-lioc-teal flex items-center justify-center">
          <MessageSquare className="w-5 h-5" />
        </div>
        <div>
          <h2 className="text-base font-bold text-lioc-navy">Send Us a Direct Message</h2>
          <p className="text-[11px] text-slate-500">
            Have questions regarding our product lines or dispatch timelines?
          </p>
        </div>
      </div>

      {error && (
        <div className="p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs flex items-start space-x-2">
          <AlertCircle className="w-4 h-4 flex-shrink-0 mt-0.5" />
          <span>{error}</span>
        </div>
      )}

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
        <div>
          <label className="block text-xs font-bold text-slate-700 mb-1">
            Your Name <span className="text-rose-500">*</span>
          </label>
          <div className="relative">
            <User className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              required
              placeholder="e.g. Joydeep Ghosh"
              value={formData.full_name}
              onChange={(e) => setFormData({ ...formData, full_name: e.target.value })}
              className="w-full pl-9 pr-3 py-2 rounded-xl border border-slate-200 text-xs focus:ring-2 focus:ring-lioc-teal/30 focus:border-lioc-teal bg-slate-50/50"
            />
          </div>
        </div>

        <div>
          <label className="block text-xs font-bold text-slate-700 mb-1">
            Company / Business Name
          </label>
          <div className="relative">
            <Building2 className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="e.g. Ghosh Caterers & Events"
              value={formData.company_name || ""}
              onChange={(e) => setFormData({ ...formData, company_name: e.target.value })}
              className="w-full pl-9 pr-3 py-2 rounded-xl border border-slate-200 text-xs focus:ring-2 focus:ring-lioc-teal/30 focus:border-lioc-teal bg-slate-50/50"
            />
          </div>
        </div>

        <div>
          <label className="block text-xs font-bold text-slate-700 mb-1">
            Email Address <span className="text-rose-500">*</span>
          </label>
          <div className="relative">
            <Mail className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="email"
              required
              placeholder="e.g. joydeep@gmail.com"
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              className="w-full pl-9 pr-3 py-2 rounded-xl border border-slate-200 text-xs focus:ring-2 focus:ring-lioc-teal/30 focus:border-lioc-teal bg-slate-50/50"
            />
          </div>
        </div>

        <div>
          <label className="block text-xs font-bold text-slate-700 mb-1">
            Phone Number <span className="text-rose-500">*</span>
          </label>
          <div className="relative">
            <Phone className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="tel"
              required
              placeholder="e.g. +91 98300 00000"
              value={formData.phone_number}
              onChange={(e) => setFormData({ ...formData, phone_number: e.target.value })}
              className="w-full pl-9 pr-3 py-2 rounded-xl border border-slate-200 text-xs focus:ring-2 focus:ring-lioc-teal/30 focus:border-lioc-teal bg-slate-50/50"
            />
          </div>
        </div>
      </div>

      <div>
        <label className="block text-xs font-bold text-slate-700 mb-1">
          Subject
        </label>
        <input
          type="text"
          placeholder="e.g. Inquiry regarding commercial dishwash concentrate"
          value={formData.subject || ""}
          onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
          className="w-full px-3.5 py-2 rounded-xl border border-slate-200 text-xs focus:ring-2 focus:ring-lioc-teal/30 focus:border-lioc-teal bg-slate-50/50"
        />
      </div>

      <div>
        <label className="block text-xs font-bold text-slate-700 mb-1">
          Message <span className="text-rose-500">*</span>
        </label>
        <textarea
          rows={3}
          required
          placeholder="How can our commercial hygiene team help your business?"
          value={formData.message}
          onChange={(e) => setFormData({ ...formData, message: e.target.value })}
          className="w-full p-3 rounded-xl border border-slate-200 text-xs focus:ring-2 focus:ring-lioc-teal/30 focus:border-lioc-teal bg-slate-50/50"
        ></textarea>
      </div>

      <button
        type="submit"
        disabled={loading}
        className="w-full py-3 px-4 rounded-xl bg-lioc-teal hover:bg-lioc-tealDark text-white font-bold text-xs shadow-md transition-all flex items-center justify-center space-x-2 disabled:opacity-50"
      >
        {loading ? (
          <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
        ) : (
          <>
            <Send className="w-3.5 h-3.5" />
            <span>Send Message</span>
          </>
        )}
      </button>
    </form>
  );
}
