"use client";

import React, { useState, useMemo } from "react";
import Image from "next/image";
import Link from "next/link";
import { COMPLIANCE_DOCS, ProductComplianceDoc } from "@/lib/complianceData";
import DocumentViewerModal from "@/components/compliance/DocumentViewerModal";
import {
  ShieldCheck,
  FileText,
  Search,
  Download,
  Printer,
  CheckCircle2,
  Building2,
  Award,
  AlertCircle,
  Sparkles,
  ArrowRight,
  Droplets,
  Flame,
  Wrench,
  Shield,
  Filter
} from "lucide-react";

export default function CompliancePage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [activeModal, setActiveModal] = useState<{
    doc: ProductComplianceDoc;
    type: "TDS" | "MSDS";
  } | null>(null);

  // Categories list
  const categories = [
    { id: "all", label: "All Formulations & Amenities" },
    { id: "floor-cleaners", label: "Floor Care & Disinfectants" },
    { id: "toilet-washroom", label: "Washroom & Descalers" },
    { id: "hand-hygiene", label: "Hand Hygiene & Soaps" },
    { id: "kitchen-degreasers", label: "Kitchen & Degreasers" },
    { id: "air-fresheners", label: "Air Fresheners" },
  ];

  // Filtered documents
  const filteredDocs = useMemo(() => {
    return COMPLIANCE_DOCS.filter((doc) => {
      const matchesCategory =
        selectedCategory === "all" || doc.categorySlug === selectedCategory;
      const matchesSearch =
        doc.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        doc.sku.toLowerCase().includes(searchQuery.toLowerCase()) ||
        doc.category.toLowerCase().includes(searchQuery.toLowerCase()) ||
        doc.formulationType.toLowerCase().includes(searchQuery.toLowerCase());
      return matchesCategory && matchesSearch;
    });
  }, [searchQuery, selectedCategory]);

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 pb-20">
      
      {/* Hero Header */}
      <div className="relative overflow-hidden bg-gradient-to-b from-slate-900 via-slate-900/90 to-slate-950 border-b border-slate-800 pt-28 pb-16 px-4 sm:px-6 lg:px-8">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_80%_80%_at_50%_-20%,rgba(13,148,136,0.15),rgba(255,255,255,0))]" />
        
        <div className="relative max-w-6xl mx-auto text-center">
          <div className="inline-flex items-center space-x-2 px-3.5 py-1.5 rounded-full bg-teal-500/10 border border-teal-500/30 text-teal-300 text-xs font-semibold mb-6">
            <ShieldCheck className="w-4 h-4 text-teal-400" />
            <span>Institutional Audit & Safety Compliance Hub</span>
          </div>

          <h1 className="text-3xl sm:text-5xl font-extrabold tracking-tight text-white mb-4">
            Technical Data & <span className="text-transparent bg-clip-text bg-gradient-to-r from-teal-400 to-cyan-400">Safety Data Sheets (MSDS)</span>
          </h1>

          <p className="max-w-2xl mx-auto text-sm sm:text-base text-slate-300 mb-8 leading-relaxed">
            Download and print official institutional compliance documentation, GHS 16-section Safety Data Sheets (SDS), and Technical Data Sheets (TDS) for hospital, pharmaceutical, hotel, and corporate safety audits.
          </p>

          {/* Compliance Badges Strip */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-4xl mx-auto">
            <div className="p-3.5 rounded-xl bg-slate-900/60 border border-slate-800 flex items-center space-x-3 text-left">
              <Award className="w-6 h-6 text-teal-400 flex-shrink-0" />
              <div>
                <div className="text-xs font-bold text-white">ISO 9001:2015</div>
                <div className="text-[11px] text-slate-400">Certified Quality Control</div>
              </div>
            </div>

            <div className="p-3.5 rounded-xl bg-slate-900/60 border border-slate-800 flex items-center space-x-3 text-left">
              <ShieldCheck className="w-6 h-6 text-cyan-400 flex-shrink-0" />
              <div>
                <div className="text-xs font-bold text-white">GHS Compliant</div>
                <div className="text-[11px] text-slate-400">Standard 16-Section SDS</div>
              </div>
            </div>

            <div className="p-3.5 rounded-xl bg-slate-900/60 border border-slate-800 flex items-center space-x-3 text-left">
              <Building2 className="w-6 h-6 text-emerald-400 flex-shrink-0" />
              <div>
                <div className="text-xs font-bold text-white">Hospital Grade</div>
                <div className="text-[11px] text-slate-400">Infection Control Standards</div>
              </div>
            </div>

            <div className="p-3.5 rounded-xl bg-slate-900/60 border border-slate-800 flex items-center space-x-3 text-left">
              <CheckCircle2 className="w-6 h-6 text-amber-400 flex-shrink-0" />
              <div>
                <div className="text-xs font-bold text-white">FSSAI Safe</div>
                <div className="text-[11px] text-slate-400">Kitchen & Food-Area Safe</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Container */}
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 mt-10">
        
        {/* Search & Category Filter Bar */}
        <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-4 sm:p-6 mb-8 backdrop-blur shadow-xl">
          <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
            {/* Search Input */}
            <div className="relative w-full md:w-80">
              <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              <input
                type="text"
                placeholder="Search formulation, SKU, or chemical..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-xs sm:text-sm text-slate-200 placeholder-slate-500 focus:outline-none focus:border-teal-500 transition"
              />
            </div>

            {/* Category Filter Pills */}
            <div className="flex flex-wrap gap-2 w-full md:w-auto">
              {categories.map((cat) => (
                <button
                  key={cat.id}
                  onClick={() => setSelectedCategory(cat.id)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition ${
                    selectedCategory === cat.id
                      ? "bg-teal-600 text-white shadow-sm"
                      : "bg-slate-950 border border-slate-800 text-slate-400 hover:text-white hover:border-slate-700"
                  }`}
                >
                  {cat.label}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Document Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredDocs.map((doc) => (
            <div
              key={doc.slug}
              className="bg-slate-900/60 border border-slate-800 hover:border-slate-700 rounded-2xl p-5 flex flex-col justify-between transition-all duration-200 hover:shadow-xl hover:shadow-teal-950/20 group"
            >
              <div>
                {/* Header Strip */}
                <div className="flex items-center justify-between gap-2 mb-3">
                  <span className="text-[10px] font-mono uppercase tracking-wider px-2 py-0.5 rounded bg-slate-800 text-slate-300">
                    {doc.sku}
                  </span>
                  <span
                    className={`text-[10px] font-bold px-2 py-0.5 rounded ${
                      doc.ghsSignalWord === "DANGER"
                        ? "bg-red-500/15 text-red-400 border border-red-500/30"
                        : doc.ghsSignalWord === "WARNING"
                        ? "bg-amber-500/15 text-amber-400 border border-amber-500/30"
                        : "bg-emerald-500/15 text-emerald-400 border border-emerald-500/30"
                    }`}
                  >
                    GHS: {doc.ghsSignalWord}
                  </span>
                </div>

                {/* Product Info */}
                <div className="flex items-start space-x-3.5 mb-4">
                  <div className="relative w-14 h-14 rounded-xl overflow-hidden bg-slate-950 border border-slate-800 flex-shrink-0">
                    <Image
                      src={doc.productImage}
                      alt={doc.name}
                      fill
                      className="object-cover group-hover:scale-105 transition duration-300"
                    />
                  </div>
                  <div>
                    <h3 className="text-sm font-bold text-white group-hover:text-teal-300 transition line-clamp-2">
                      {doc.name}
                    </h3>
                    <p className="text-xs text-slate-400 mt-1">{doc.formulationType}</p>
                  </div>
                </div>

                {/* Quick Specs Snippet */}
                <div className="p-3 rounded-xl bg-slate-950/60 border border-slate-800/80 mb-5 space-y-1.5 text-xs text-slate-300">
                  <div className="flex justify-between">
                    <span className="text-slate-500">pH Value:</span>
                    <span className="font-semibold text-teal-400">{doc.tds.technicalProperties.ph}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-500">Dilution Ratio:</span>
                    <span className="font-semibold text-slate-200">{doc.tds.dilutionMatrix[0]?.ratio || "Direct Use"}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-500">Document ID:</span>
                    <span className="font-mono text-slate-400 text-[11px]">{doc.tds.documentId}</span>
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="grid grid-cols-2 gap-2 pt-2 border-t border-slate-800/80">
                <button
                  onClick={() => setActiveModal({ doc, type: "TDS" })}
                  className="flex items-center justify-center space-x-1.5 py-2 px-3 bg-teal-500/10 hover:bg-teal-500/20 text-teal-300 border border-teal-500/30 rounded-xl text-xs font-semibold transition"
                >
                  <FileText className="w-3.5 h-3.5 text-teal-400" />
                  <span>View TDS</span>
                </button>

                <button
                  onClick={() => setActiveModal({ doc, type: "MSDS" })}
                  className="flex items-center justify-center space-x-1.5 py-2 px-3 bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 rounded-xl text-xs font-semibold transition"
                >
                  <ShieldCheck className="w-3.5 h-3.5 text-cyan-400" />
                  <span>View MSDS</span>
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* Empty State */}
        {filteredDocs.length === 0 && (
          <div className="text-center py-16 bg-slate-900/40 rounded-2xl border border-slate-800">
            <AlertCircle className="w-10 h-10 text-slate-600 mx-auto mb-3" />
            <h3 className="text-base font-semibold text-white">No compliance documents found</h3>
            <p className="text-xs text-slate-400 mt-1">Try searching with a different chemical name or select "All Formulations".</p>
          </div>
        )}

        {/* Need Custom Audit Documentation CTA */}
        <div className="mt-14 p-6 sm:p-8 rounded-3xl bg-gradient-to-r from-teal-950/40 via-slate-900 to-slate-900 border border-teal-500/20 flex flex-col md:flex-row items-center justify-between gap-6">
          <div>
            <div className="inline-flex items-center space-x-2 text-teal-400 text-xs font-bold uppercase tracking-wider mb-2">
              <Sparkles className="w-4 h-4" />
              <span>Institutional Safety Compliance Support</span>
            </div>
            <h3 className="text-lg sm:text-xl font-bold text-white">
              Need a Custom COA (Certificate of Analysis) or Audit Dossier?
            </h3>
            <p className="text-xs sm:text-sm text-slate-300 mt-1 max-w-xl">
              Our laboratory formulation team issues batch-specific Certificates of Analysis (COA), microbiological challenge reports, and tailored hospital hygiene dossiers.
            </p>
          </div>

          <div className="flex flex-wrap gap-3">
            <Link
              href="/contact"
              className="px-5 py-2.5 bg-teal-600 hover:bg-teal-500 text-white font-semibold text-xs sm:text-sm rounded-xl shadow-lg shadow-teal-900/30 transition flex items-center space-x-1.5"
            >
              <span>Contact Lab Team</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>

      </div>

      {/* Document Viewer Modal */}
      {activeModal && (
        <DocumentViewerModal
          doc={activeModal.doc}
          type={activeModal.type}
          onClose={() => setActiveModal(null)}
        />
      )}

    </div>
  );
}
