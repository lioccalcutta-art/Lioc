import React from "react";
import type { Metadata } from "next";
import ContactForm from "@/components/forms/ContactForm";
import GoogleMapEmbed from "@/components/ui/GoogleMapEmbed";
import { SITE_CONFIG } from "@/lib/config";

import { getWhatsAppUrl } from "@/lib/whatsapp";
import {
  MapPin,
  Phone,
  Mail,
  Clock,
  MessageSquare,
  Building2,
  ShieldCheck,
  Truck,
  Instagram,
} from "lucide-react";


export const metadata: Metadata = {
  title: "Contact Us | Lioc Commercial Cleaning Chemicals Kolkata",
  description:
    "Contact Lioc for wholesale inquiries, product technical support, and commercial cleaning supplies in Kolkata and Eastern India.",
};

export default function ContactPage() {
  return (
    <div className="py-12 space-y-12">
      {/* Header Banner */}
      <div className="bg-lioc-navy text-white py-14 border-b border-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 max-w-3xl text-center">
          <div className="inline-flex items-center space-x-1.5 px-3 py-1 rounded-full bg-teal-500/10 border border-teal-500/30 text-teal-300 text-xs font-bold mb-3">
            <Phone className="w-3.5 h-3.5" />
            <span>Commercial Help & Support Desk</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-black text-white">
            Connect with {SITE_CONFIG.companyName}
          </h1>
          <p className="text-sm text-slate-300 mt-2 leading-relaxed">
            Our commercial sales and technical support desk is available to assist facilities with product selection, bulk logistics, and custom packaging.
          </p>
        </div>
      </div>

      {/* Main Grid */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
          {/* Contact Details Column */}
          <div className="lg:col-span-5 space-y-6">
            <div className="bg-white rounded-3xl p-8 border border-slate-200 shadow-sm space-y-6">
              <h3 className="text-xl font-bold text-lioc-navy">Corporate & Factory Office</h3>
              
              <div className="space-y-4 text-xs text-slate-600">
                <div className="flex items-start space-x-3">
                  <div className="w-8 h-8 rounded-xl bg-teal-50 text-lioc-teal flex items-center justify-center flex-shrink-0 mt-0.5">
                    <MapPin className="w-4 h-4" />
                  </div>
                  <div>
                    <div className="font-bold text-slate-800">Address / Supply Hub:</div>
                    <div>{SITE_CONFIG.address}</div>
                    <div className="text-slate-400 mt-0.5">Direct dispatch across Kolkata, Howrah, Hooghly & Pan-India.</div>
                  </div>
                </div>

                <div className="flex items-start space-x-3">
                  <div className="w-8 h-8 rounded-xl bg-teal-50 text-lioc-teal flex items-center justify-center flex-shrink-0 mt-0.5">
                    <Phone className="w-4 h-4" />
                  </div>
                  <div>
                    <div className="font-bold text-slate-800">Phone Support:</div>
                    <div className="flex flex-col space-y-1.5 mt-1">
                      <div className="flex items-center space-x-2">
                        <a
                          href={`tel:${SITE_CONFIG.phone.replace(/[^0-9+]/g, "")}`}
                          className="text-lioc-teal font-bold hover:underline"
                        >
                          {SITE_CONFIG.phone}
                        </a>
                        <span className="text-[10px] uppercase font-semibold px-1.5 py-0.5 rounded bg-teal-50 text-lioc-teal border border-teal-200/60">
                          Primary / WhatsApp
                        </span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <a
                          href={`tel:${SITE_CONFIG.secondaryPhone.replace(/[^0-9+]/g, "")}`}
                          className="text-lioc-teal font-bold hover:underline"
                        >
                          {SITE_CONFIG.secondaryPhone}
                        </a>
                        <span className="text-[10px] uppercase font-semibold px-1.5 py-0.5 rounded bg-slate-100 text-slate-600 border border-slate-200">
                          Direct Line
                        </span>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="flex items-start space-x-3">
                  <div className="w-8 h-8 rounded-xl bg-teal-50 text-lioc-teal flex items-center justify-center flex-shrink-0 mt-0.5">
                    <Mail className="w-4 h-4" />
                  </div>
                  <div>
                    <div className="font-bold text-slate-800">Email Inquiries:</div>
                    <a
                      href={`mailto:${SITE_CONFIG.email}`}
                      className="text-lioc-teal font-bold hover:underline"
                    >
                      {SITE_CONFIG.email}
                    </a>
                  </div>
                </div>

                <div className="flex items-start space-x-3">
                  <div className="w-8 h-8 rounded-xl bg-pink-50 text-pink-600 flex items-center justify-center flex-shrink-0 mt-0.5">
                    <Instagram className="w-4 h-4" />
                  </div>
                  <div>
                    <div className="font-bold text-slate-800">Instagram:</div>
                    <a
                      href={SITE_CONFIG.instagramUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-pink-600 font-bold hover:underline flex items-center gap-1.5"
                    >
                      <span>{SITE_CONFIG.instagramHandle}</span>
                      <span className="text-[10px] px-1.5 py-0.5 rounded bg-pink-100 text-pink-700 font-medium">Follow & DM</span>
                    </a>
                  </div>
                </div>

                <div className="flex items-start space-x-3">
                  <div className="w-8 h-8 rounded-xl bg-teal-50 text-lioc-teal flex items-center justify-center flex-shrink-0 mt-0.5">
                    <Clock className="w-4 h-4" />
                  </div>
                  <div>
                    <div className="font-bold text-slate-800">Business Hours:</div>
                    <div>{SITE_CONFIG.businessHours}</div>
                  </div>
                </div>
              </div>

              {/* Direct WhatsApp & Instagram CTA Buttons */}
              <div className="pt-2 border-t border-slate-100 space-y-2.5">
                <a
                  href={getWhatsAppUrl({ context: "general" })}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full py-3 px-4 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs rounded-xl flex items-center justify-center space-x-2 transition-all shadow-sm"
                >
                  <MessageSquare className="w-4 h-4" />
                  <span>Chat Directly on WhatsApp</span>
                </a>
                <a
                  href={SITE_CONFIG.instagramUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full py-3 px-4 bg-gradient-to-r from-pink-600 via-rose-500 to-amber-500 hover:opacity-95 text-white font-bold text-xs rounded-xl flex items-center justify-center space-x-2 transition-all shadow-sm"
                >
                  <Instagram className="w-4 h-4" />
                  <span>Follow & DM on Instagram ({SITE_CONFIG.instagramHandle})</span>
                </a>
              </div>
            </div>

            {/* Regional Note */}
            <div className="bg-slate-100 p-6 rounded-3xl border border-slate-200 text-xs text-slate-600 space-y-2">
              <div className="font-bold text-slate-800 flex items-center space-x-1.5">
                <Truck className="w-4 h-4 text-lioc-teal" />
                <span>Regional Supply Logistics</span>
              </div>
              <p>
                Bulk deliveries to North 24 Parganas, South 24 Parganas, Salt Lake Sector V, New Town Rajarhat, Howrah, and Hooghly industrial zones operate on daily dispatch schedules.
              </p>
            </div>
          </div>

          {/* Contact Form Column */}
          <div className="lg:col-span-7">
            <ContactForm />
          </div>
        </div>

        {/* Interactive Google Map & Facility Direction Section */}
        <div className="pt-12 border-t border-slate-200">
          <GoogleMapEmbed
            title="Locate Our Factory & Supply Hub on Google Maps"
            subtitle="Strategically located in Jadavpur, South Kolkata to enable direct bulk dispatches across Eastern India and convenient on-site commercial client consultations."
          />
        </div>
      </div>
    </div>
  );
}

