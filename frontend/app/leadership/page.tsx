import React from "react";
import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import {
  ShieldCheck,
  Award,
  Factory,
  Mail,
  Phone,
  MessageSquare,
  Sparkles,
  ArrowRight,
  FlaskConical,
  Truck,
  Users,
  Target,
  Linkedin,
  Instagram,
  CheckCircle2,
  Quote,
} from "lucide-react";
import { SITE_CONFIG } from "@/lib/config";
import { getWhatsAppUrl } from "@/lib/whatsapp";

export const metadata: Metadata = {
  title: "Founders & Leadership | LIOC Commercial Cleaning Chemicals",
  description:
    "Meet the founder and leadership team behind LIOC—pioneering direct chemical manufacturing, surface-safe science, and institutional hygiene supply across Kolkata and Eastern India.",
};

const LEADERS = [
  {
    name: "Founder & Chief Executive Officer",
    role: "Founder & CEO",
    focus: "Chemical Formulation R&D, Direct Manufacturing Strategy & Enterprise Vision",
    image: "/images/team/founder.jpg",
    bio: "With a foundational dedication to industrial chemistry and manufacturing precision, our Founder established LIOC to bridge a critical gap in the commercial hygiene sector: providing institutional buyers with high-potency, surface-safe cleaning chemical concentrates direct from the factory without inflated middleman distribution markups.",
    quote:
      "Our mission is simple: commercial facilities should never have to choose between cost efficiency and uncompromising cleaning potency. At LIOC, we formulate every batch to institutional standards.",
    highlights: [
      "Pioneered high-dilution industrial chemical concentrates yielding up to 500L usable solution per can",
      "Direct oversight of TDS & MSDS lab testing and surface-safety formulation standards",
      "Expanded LIOC manufacturing and direct dispatch corridors across Kolkata and Eastern India",
    ],
    contactEmail: SITE_CONFIG.email,
    whatsappContext: "leadership_founder",
  },
  {
    name: "Co-Founder & Chief Operating Officer",
    role: "Co-Founder & COO",
    focus: "Commercial Operations, Institutional Supply Chains & Dealership Networks",
    image: "/images/team/co-founder.jpg",
    bio: "Spearheading commercial sales, rapid logistics, and territorial dealership alliances, our Co-Founder drives LIOC's seamless distribution infrastructure. Under his leadership, LIOC supplies high-footfall hotels, hospitals, cloud kitchens, and facility management firms with guaranteed 24-hour supply cycles.",
    quote:
      "A great chemical formulation is only as good as the supply chain behind it. We ensure every hotel, hospital, and corporate facility receives uninterrupted, timely delivery every single time.",
    highlights: [
      "Architected the 24-hour direct factory dispatch network across Kolkata, Howrah, and Hooghly",
      "Established strategic B2B supply agreements with 100+ hotels, cloud kitchens, and schools",
      "Leads authorized dealership onboarding and customized OEM private-label packaging programs",
    ],
    contactEmail: SITE_CONFIG.email,
    whatsappContext: "leadership_cofounder",
  },
];

const LEADERSHIP_VALUES = [
  {
    icon: Factory,
    title: "Direct Chemical Manufacturing",
    description:
      "Eliminating multiple tiers of brokers and third-party traders to pass direct factory-gate savings to commercial buyers.",
  },
  {
    icon: FlaskConical,
    title: "Surface-Safe Formulations",
    description:
      "Engineered to remove deep grease and limescale without corroding expensive marble, granite, epoxy floors, or stainless steel.",
  },
  {
    icon: Truck,
    title: "Unbroken Supply Chains",
    description:
      "Dedicated logistics infrastructure ensuring prompt dispatch and stock availability for high-demand institutional regimens.",
  },
  {
    icon: Award,
    title: "Lab-Tested Batch Consistency",
    description:
      "Every single batch undergoes stringent pH, active-surfactant, and antimicrobial efficacy testing before leaving our facility.",
  },
];

export default function LeadershipPage() {
  return (
    <div className="py-12 space-y-16">
      {/* Hero Header */}
      <div className="bg-lioc-navy text-white py-16 border-b border-slate-800 relative overflow-hidden">
        <div className="absolute inset-0 opacity-10 bg-[radial-gradient(#14b8a6_1px,transparent_1px)] [background-size:24px_24px]" />
        
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 max-w-3xl text-center space-y-4 relative z-10">
          <div className="inline-flex items-center space-x-1.5 px-3 py-1 rounded-full bg-teal-500/10 border border-teal-500/30 text-teal-300 text-xs font-bold">
            <Users className="w-3.5 h-3.5" />
            <span>Executive Leadership & Founding Vision</span>
          </div>
          <h1 className="text-3xl sm:text-5xl font-black text-white tracking-tight">
            The Leadership Behind {SITE_CONFIG.companyName}
          </h1>
          <p className="text-sm sm:text-base text-slate-300 mt-4 leading-relaxed">
            Driven by industrial chemistry expertise, operational excellence, and a commitment to providing commercial establishments with dependable, factory-direct hygiene formulations.
          </p>
        </div>
      </div>

      {/* Founders Showcase Grid */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="space-y-12">
          {LEADERS.map((leader, index) => {
            const isEven = index % 2 === 0;
            return (
              <div
                key={leader.role}
                className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden p-6 sm:p-10 transition-all hover:shadow-md"
              >
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
                  {/* Photo Column */}
                  <div className={`lg:col-span-4 ${isEven ? "lg:order-1" : "lg:order-2"}`}>
                    <div className="relative mx-auto max-w-sm rounded-3xl overflow-hidden shadow-xl border-4 border-slate-100 bg-slate-900 group">
                      <div className="aspect-square relative w-full overflow-hidden">
                        <Image
                          src={leader.image}
                          alt={leader.name}
                          fill
                          className="object-cover group-hover:scale-105 transition-transform duration-500"
                          priority
                        />
                      </div>
                      
                      <div className="absolute top-4 left-4">
                        <span className="px-3 py-1 rounded-full bg-lioc-navy/90 backdrop-blur-md text-teal-300 text-xs font-bold border border-teal-500/30 shadow-lg">
                          {leader.role}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Information Column */}
                  <div className={`lg:col-span-8 space-y-6 ${isEven ? "lg:order-2" : "lg:order-1"}`}>
                    <div className="space-y-2">
                      <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-teal-50 text-lioc-teal text-xs font-bold">
                        <Target className="w-3.5 h-3.5" />
                        <span>Executive Pillar</span>
                      </div>
                      <h2 className="text-2xl sm:text-3xl font-black text-lioc-navy">
                        {leader.name}
                      </h2>
                      <p className="text-xs sm:text-sm font-semibold text-teal-700">
                        {leader.focus}
                      </p>
                    </div>

                    <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                      {leader.bio}
                    </p>

                    {/* Executive Quote Block */}
                    <div className="bg-slate-50 border-l-4 border-lioc-teal p-4 rounded-r-2xl space-y-2">
                      <div className="flex items-start space-x-2">
                        <Quote className="w-4 h-4 text-lioc-teal flex-shrink-0 mt-0.5" />
                        <p className="text-xs text-slate-700 italic font-medium">
                          "{leader.quote}"
                        </p>
                      </div>
                    </div>

                    {/* Key Contributions & Highlights */}
                    <div className="space-y-2">
                      <h4 className="text-xs font-bold uppercase tracking-wider text-slate-800">
                        Key Leadership Contributions:
                      </h4>
                      <ul className="space-y-2 text-xs text-slate-600">
                        {leader.highlights.map((h, i) => (
                          <li key={i} className="flex items-start space-x-2">
                            <CheckCircle2 className="w-4 h-4 text-lioc-teal flex-shrink-0 mt-0.5" />
                            <span>{h}</span>
                          </li>
                        ))}
                      </ul>
                    </div>

                    {/* Direct Connect Action Strip */}
                    <div className="pt-4 border-t border-slate-100 flex flex-wrap items-center gap-3">
                      <a
                        href={getWhatsAppUrl({
                          context: "general",
                          source: leader.role,
                        })}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center space-x-2 px-4 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold transition-all shadow-sm"
                      >
                        <MessageSquare className="w-3.5 h-3.5" />
                        <span>Direct WhatsApp Desk</span>
                      </a>
                      <a
                        href={`mailto:${leader.contactEmail}?subject=Direct%20Inquiry%20to%20${encodeURIComponent(leader.role)}`}
                        className="inline-flex items-center space-x-2 px-4 py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-bold transition-all border border-slate-200"
                      >
                        <Mail className="w-3.5 h-3.5 text-lioc-teal" />
                        <span>Email Office</span>
                      </a>
                      <a
                        href={SITE_CONFIG.instagramUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center space-x-1.5 px-3.5 py-2.5 rounded-xl bg-pink-50 hover:bg-pink-100 text-pink-700 text-xs font-bold transition-all border border-pink-200/60"
                      >
                        <Instagram className="w-3.5 h-3.5" />
                        <span>{SITE_CONFIG.instagramHandle}</span>
                      </a>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Leadership Values & Guiding Philosophy */}
      <div className="bg-slate-100 py-16 border-y border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto space-y-4 mb-12">
            <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-white border border-slate-200 text-lioc-teal text-xs font-bold uppercase tracking-wider">
              <span>Operational Philosophy</span>
            </div>
            <h2 className="text-2xl sm:text-4xl font-black text-lioc-navy tracking-tight">
              Founding Principles That Drive LIOC
            </h2>
            <p className="text-xs sm:text-sm text-slate-600">
              Our founders structured every aspect of the company to solve common pain points in commercial procurement: excessive costs, inconsistent chemical strength, and erratic shipping schedules.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {LEADERSHIP_VALUES.map((val, idx) => {
              const Icon = val.icon;
              return (
                <div
                  key={idx}
                  className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm space-y-3.5 flex flex-col justify-between"
                >
                  <div className="space-y-3">
                    <div className="w-11 h-11 rounded-2xl bg-teal-50 text-lioc-teal flex items-center justify-center">
                      <Icon className="w-5 h-5" />
                    </div>
                    <h3 className="text-base font-bold text-lioc-navy">
                      {val.title}
                    </h3>
                    <p className="text-xs text-slate-600 leading-relaxed">
                      {val.description}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Bottom Direct CTA */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <div className="bg-lioc-navy text-white rounded-3xl p-10 max-w-4xl mx-auto space-y-6 shadow-xl relative overflow-hidden">
          <div className="space-y-3 relative z-10">
            <div className="inline-flex items-center space-x-1.5 px-3 py-1 rounded-full bg-teal-500/20 text-teal-300 text-xs font-bold border border-teal-500/30">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Direct Commercial Partnerships</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-black">
              Connect Directly with {SITE_CONFIG.companyName} Leadership
            </h2>
            <p className="text-xs sm:text-sm text-slate-300 max-w-2xl mx-auto leading-relaxed">
              Looking for long-term contract manufacturing, high-volume institutional chemical supply, or territorial dealership distribution rights? Our leadership team is ready to discuss your requirements.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row gap-3.5 justify-center relative z-10">
            <Link
              href="/request-quote"
              className="px-6 py-3.5 bg-lioc-teal hover:bg-lioc-tealDark text-white font-bold text-xs rounded-xl shadow-lg transition-all flex items-center justify-center space-x-2"
            >
              <span>Request Wholesale Quotation</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
            <Link
              href="/become-distributor"
              className="px-6 py-3.5 bg-white text-lioc-navy hover:bg-slate-100 font-bold text-xs rounded-xl shadow-lg transition-all flex items-center justify-center space-x-2"
            >
              <span>Dealership & OEM Inquiries</span>
            </Link>
            <Link
              href="/contact"
              className="px-6 py-3.5 bg-slate-800/80 hover:bg-slate-800 text-slate-200 hover:text-white font-bold text-xs rounded-xl border border-slate-700 transition-all flex items-center justify-center space-x-2"
            >
              <span>Visit Factory Hub</span>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
