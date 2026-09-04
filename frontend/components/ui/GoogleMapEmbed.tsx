import React from "react";
import { MapPin, Navigation, ExternalLink, Clock, Building2, ShieldCheck } from "lucide-react";
import { SITE_CONFIG } from "@/lib/config";

interface GoogleMapEmbedProps {
  title?: string;
  subtitle?: string;
  className?: string;
  showDetailsCard?: boolean;
}

export default function GoogleMapEmbed({
  title = "Visit Our Factory & Supply Hub",
  subtitle = "Direct manufacturing facility and supply hub in Jadavpur, Kolkata. Open for commercial B2B inquiries and product evaluations.",
  className = "",
  showDetailsCard = true,
}: GoogleMapEmbedProps) {
  return (
    <div className={`space-y-6 ${className}`}>
      {title && (
        <div className="text-center max-w-2xl mx-auto space-y-2">
          <div className="inline-flex items-center space-x-1.5 px-3 py-1 rounded-full bg-teal-500/10 border border-teal-500/30 text-teal-700 text-xs font-bold">
            <MapPin className="w-3.5 h-3.5 text-lioc-teal" />
            <span>Google Maps Location & Facility Hub</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-black text-lioc-navy tracking-tight">
            {title}
          </h2>
          {subtitle && (
            <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
              {subtitle}
            </p>
          )}
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
        {/* Interactive Map Frame */}
        <div className={`${showDetailsCard ? "lg:col-span-8" : "lg:col-span-12"} rounded-3xl overflow-hidden border border-slate-200 shadow-md bg-white min-h-[380px] relative flex flex-col`}>
          <div className="bg-slate-900 text-white px-5 py-3 flex items-center justify-between text-xs border-b border-slate-800">
            <div className="flex items-center space-x-2">
              <div className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse" />
              <span className="font-semibold text-slate-200">
                {SITE_CONFIG.companyName} Commercial Supply Hub — Jadavpur, Kolkata
              </span>
            </div>
            <a
              href={SITE_CONFIG.googleMapsUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center space-x-1 text-teal-300 hover:text-white transition-colors font-bold"
            >
              <span>Open in Google Maps</span>
              <ExternalLink className="w-3.5 h-3.5" />
            </a>
          </div>

          <div className="flex-grow w-full relative min-h-[340px]">
            <iframe
              title="LIOC Factory & Supply Hub Location Map"
              src={SITE_CONFIG.googleMapsEmbedUrl}
              width="100%"
              height="100%"
              style={{ border: 0, minHeight: "340px" }}
              allowFullScreen={true}
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              className="absolute inset-0 w-full h-full"
            />
          </div>
        </div>

        {/* Location Details Card */}
        {showDetailsCard && (
          <div className="lg:col-span-4 bg-white rounded-3xl p-6 sm:p-7 border border-slate-200 shadow-sm flex flex-col justify-between space-y-6">
            <div className="space-y-5">
              <div className="flex items-center space-x-3 pb-4 border-b border-slate-100">
                <div className="w-10 h-10 rounded-2xl bg-teal-50 text-lioc-teal flex items-center justify-center flex-shrink-0">
                  <Building2 className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-bold text-sm text-lioc-navy">
                    {SITE_CONFIG.companyName} Factory Hub
                  </h3>
                  <p className="text-[11px] text-slate-500">Commercial & Institutional Unit</p>
                </div>
              </div>

              <div className="space-y-3.5 text-xs text-slate-600">
                <div className="flex items-start space-x-3">
                  <MapPin className="w-4 h-4 text-lioc-teal flex-shrink-0 mt-0.5" />
                  <div>
                    <span className="font-bold text-slate-800 block mb-0.5">Physical Address:</span>
                    <span className="leading-relaxed block text-slate-600">{SITE_CONFIG.address}</span>
                  </div>
                </div>

                <div className="flex items-start space-x-3">
                  <Clock className="w-4 h-4 text-lioc-teal flex-shrink-0 mt-0.5" />
                  <div>
                    <span className="font-bold text-slate-800 block mb-0.5">Facility Hours:</span>
                    <span>{SITE_CONFIG.businessHours}</span>
                  </div>
                </div>

                <div className="flex items-start space-x-3">
                  <ShieldCheck className="w-4 h-4 text-lioc-teal flex-shrink-0 mt-0.5" />
                  <div>
                    <span className="font-bold text-slate-800 block mb-0.5">Logistics & Dispatch:</span>
                    <span>Daily dispatches to Central Kolkata, Salt Lake, New Town, Howrah, Hooghly & Pan-India.</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="pt-4 border-t border-slate-100 space-y-2.5">
              <a
                href={SITE_CONFIG.googleMapsUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full py-3 px-4 bg-lioc-navy hover:bg-slate-800 text-white font-bold text-xs rounded-xl flex items-center justify-center space-x-2 transition-all shadow-md group"
              >
                <Navigation className="w-4 h-4 text-teal-400 group-hover:scale-110 transition-transform" />
                <span>Get GPS Driving Directions</span>
              </a>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
