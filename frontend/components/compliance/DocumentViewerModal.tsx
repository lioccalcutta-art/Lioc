"use client";

import React, { useRef } from "react";
import { ProductComplianceDoc } from "@/lib/complianceData";
import { X, Printer, Download, ShieldCheck, AlertTriangle, FileText, CheckCircle2, Factory, Droplets } from "lucide-react";

interface DocumentViewerModalProps {
  doc: ProductComplianceDoc;
  type: "TDS" | "MSDS";
  onClose: () => void;
}

export default function DocumentViewerModal({ doc, type, onClose }: DocumentViewerModalProps) {
  const printRef = useRef<HTMLDivElement>(null);

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-2 sm:p-4 print:p-0 print:bg-white print:static">
      <div className="relative w-full max-w-4xl bg-white rounded-2xl shadow-2xl border border-slate-200 overflow-hidden flex flex-col max-h-[92vh] print:max-h-none print:shadow-none print:border-none print:rounded-none">
        
        {/* Modal Action Header (Hidden on Print) */}
        <div className="flex items-center justify-between px-6 py-4 bg-slate-900 text-white border-b border-slate-800 print:hidden">
          <div className="flex items-center space-x-3">
            <div className={`p-2 rounded-lg ${type === "TDS" ? "bg-teal-500/20 text-teal-300" : "bg-amber-500/20 text-amber-300"}`}>
              {type === "TDS" ? <FileText className="w-5 h-5" /> : <ShieldCheck className="w-5 h-5" />}
            </div>
            <div>
              <span className="text-xs font-bold uppercase tracking-wider text-teal-400">
                {type === "TDS" ? "Technical Data Sheet" : "Material Safety Data Sheet (GHS 16-Section)"}
              </span>
              <h3 className="text-sm sm:text-base font-bold text-white truncate max-w-md">{doc.name}</h3>
            </div>
          </div>

          <div className="flex items-center space-x-2">
            <button
              onClick={handlePrint}
              className="flex items-center space-x-1.5 px-3.5 py-1.5 bg-teal-600 hover:bg-teal-500 text-white text-xs sm:text-sm font-semibold rounded-lg shadow-sm transition"
              title="Print or Save as PDF"
            >
              <Printer className="w-4 h-4" />
              <span>Print / Save PDF</span>
            </button>
            <button
              onClick={onClose}
              className="p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 transition"
              title="Close"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Printable Document Content */}
        <div ref={printRef} className="p-6 sm:p-10 overflow-y-auto print:p-0 print:overflow-visible text-slate-800 text-sm leading-relaxed bg-white">
          
          {/* Institutional Document Header */}
          <div className="border-b-2 border-slate-900 pb-4 mb-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <div className="flex items-center space-x-2">
                  <span className="text-2xl font-black tracking-tight text-slate-950 font-heading">LIOC</span>
                  <span className="text-xs uppercase tracking-widest bg-slate-100 text-slate-700 px-2 py-0.5 rounded font-bold">
                    Chemical & Hygiene Industries
                  </span>
                </div>
                <p className="text-xs text-slate-500 mt-1">
                  Manufacturer of Commercial & Institutional Disinfectants, Hygiene Chemicals & Guest Amenities
                </p>
                <p className="text-[11px] text-slate-400">Kolkata, West Bengal, India | ISO 9001:2015 Certified Production</p>
              </div>

              <div className="text-left sm:text-right border-l-2 sm:border-l-0 pl-3 sm:pl-0 border-teal-600">
                <div className="text-xs font-bold text-slate-500">DOCUMENT CODE</div>
                <div className="text-sm font-mono font-bold text-teal-800">
                  {type === "TDS" ? doc.tds.documentId : doc.msds.sdsNumber}
                </div>
                <div className="text-[11px] text-slate-500">
                  Rev Date: {type === "TDS" ? doc.tds.revisionDate : doc.msds.effectiveDate} | Ver {type === "TDS" ? doc.tds.version : "2026.1"}
                </div>
              </div>
            </div>

            <div className="mt-4 pt-3 border-t border-slate-200 flex flex-wrap items-center justify-between gap-2">
              <h1 className="text-lg sm:text-xl font-bold text-slate-900">
                {type === "TDS" ? `TECHNICAL DATA SHEET (TDS): ${doc.name}` : `SAFETY DATA SHEET (SDS/MSDS): ${doc.name}`}
              </h1>
              <div className="flex items-center space-x-2">
                <span className="text-xs font-semibold px-2.5 py-0.5 rounded bg-slate-100 text-slate-700">SKU: {doc.sku}</span>
                <span className={`text-xs font-bold px-2.5 py-0.5 rounded ${
                  doc.ghsSignalWord === "DANGER" ? "bg-red-100 text-red-800 border border-red-200" :
                  doc.ghsSignalWord === "WARNING" ? "bg-amber-100 text-amber-800 border border-amber-200" :
                  "bg-emerald-100 text-emerald-800 border border-emerald-200"
                }`}>
                  GHS: {doc.ghsSignalWord}
                </span>
              </div>
            </div>
          </div>

          {/* ========================================================
              TDS DOCUMENT VIEW
              ======================================================== */}
          {type === "TDS" && (
            <div className="space-y-6">
              {/* Product Overview */}
              <section>
                <h2 className="text-xs font-bold uppercase tracking-wider text-teal-800 border-b border-teal-200 pb-1 mb-2">
                  1. Product Description & Formulation
                </h2>
                <p className="text-slate-700">{doc.tds.description}</p>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 mt-3">
                  {doc.tds.keyFeatures.map((feat, idx) => (
                    <div key={idx} className="flex items-start space-x-2 text-xs text-slate-600 bg-slate-50 p-2 rounded">
                      <CheckCircle2 className="w-3.5 h-3.5 text-teal-600 flex-shrink-0 mt-0.5" />
                      <span>{feat}</span>
                    </div>
                  ))}
                </div>
              </section>

              {/* Physical & Chemical Specifications */}
              <section>
                <h2 className="text-xs font-bold uppercase tracking-wider text-teal-800 border-b border-teal-200 pb-1 mb-3">
                  2. Physical & Chemical Specifications
                </h2>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                  <div className="p-2.5 bg-slate-50 border border-slate-200 rounded">
                    <div className="text-[10px] uppercase font-bold text-slate-400">Appearance</div>
                    <div className="text-xs font-semibold text-slate-800">{doc.tds.technicalProperties.appearance}</div>
                  </div>
                  <div className="p-2.5 bg-slate-50 border border-slate-200 rounded">
                    <div className="text-[10px] uppercase font-bold text-slate-400">Color</div>
                    <div className="text-xs font-semibold text-slate-800">{doc.tds.technicalProperties.color}</div>
                  </div>
                  <div className="p-2.5 bg-slate-50 border border-slate-200 rounded">
                    <div className="text-[10px] uppercase font-bold text-slate-400">Fragrance / Odor</div>
                    <div className="text-xs font-semibold text-slate-800">{doc.tds.technicalProperties.odor}</div>
                  </div>
                  <div className="p-2.5 bg-slate-50 border border-slate-200 rounded">
                    <div className="text-[10px] uppercase font-bold text-slate-400">pH Value (25°C)</div>
                    <div className="text-xs font-bold text-teal-700">{doc.tds.technicalProperties.ph}</div>
                  </div>
                  <div className="p-2.5 bg-slate-50 border border-slate-200 rounded">
                    <div className="text-[10px] uppercase font-bold text-slate-400">Specific Gravity</div>
                    <div className="text-xs font-semibold text-slate-800">{doc.tds.technicalProperties.specificGravity}</div>
                  </div>
                  <div className="p-2.5 bg-slate-50 border border-slate-200 rounded">
                    <div className="text-[10px] uppercase font-bold text-slate-400">Water Solubility</div>
                    <div className="text-xs font-semibold text-slate-800">{doc.tds.technicalProperties.solubility}</div>
                  </div>
                  <div className="p-2.5 bg-slate-50 border border-slate-200 rounded">
                    <div className="text-[10px] uppercase font-bold text-slate-400">Shelf Life</div>
                    <div className="text-xs font-semibold text-slate-800">{doc.tds.technicalProperties.shelfLife}</div>
                  </div>
                  <div className="p-2.5 bg-slate-50 border border-slate-200 rounded">
                    <div className="text-[10px] uppercase font-bold text-slate-400">Flash Point</div>
                    <div className="text-xs font-semibold text-slate-800">{doc.tds.technicalProperties.flashPoint || "Non-Combustible"}</div>
                  </div>
                </div>
              </section>

              {/* Dilution & Application Matrix */}
              <section>
                <h2 className="text-xs font-bold uppercase tracking-wider text-teal-800 border-b border-teal-200 pb-1 mb-2">
                  3. Standard Institutional Dilution Matrix
                </h2>
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs border border-slate-200">
                    <thead className="bg-slate-100 text-slate-700 font-bold">
                      <tr>
                        <th className="p-2 border-b border-r border-slate-200">Application Area</th>
                        <th className="p-2 border-b border-r border-slate-200">Dilution Ratio</th>
                        <th className="p-2 border-b border-slate-200">Application Method</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-200">
                      {doc.tds.dilutionMatrix.map((row, idx) => (
                        <tr key={idx} className={idx % 2 === 0 ? "bg-white" : "bg-slate-50/60"}>
                          <td className="p-2 font-semibold text-slate-800 border-r border-slate-200">{row.application}</td>
                          <td className="p-2 font-mono font-bold text-teal-700 border-r border-slate-200">{row.ratio}</td>
                          <td className="p-2 text-slate-600">{row.method}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </section>

              {/* Surface Compatibility Matrix */}
              <section>
                <h2 className="text-xs font-bold uppercase tracking-wider text-teal-800 border-b border-teal-200 pb-1 mb-2">
                  4. Surface Compatibility Guide
                </h2>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
                  <div className="p-3 bg-emerald-50/70 border border-emerald-200 rounded-lg">
                    <div className="font-bold text-emerald-800 mb-1 flex items-center space-x-1">
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                      <span>Safe For Use</span>
                    </div>
                    <ul className="list-disc list-inside text-emerald-950 space-y-0.5">
                      {doc.tds.surfaceCompatibility.safe.map((s, i) => (
                        <li key={i}>{s}</li>
                      ))}
                    </ul>
                  </div>

                  <div className="p-3 bg-amber-50/70 border border-amber-200 rounded-lg">
                    <div className="font-bold text-amber-800 mb-1 flex items-center space-x-1">
                      <AlertTriangle className="w-3.5 h-3.5 text-amber-600" />
                      <span>Caution / Pre-test</span>
                    </div>
                    <ul className="list-disc list-inside text-amber-950 space-y-0.5">
                      {doc.tds.surfaceCompatibility.caution.length > 0 ? (
                        doc.tds.surfaceCompatibility.caution.map((s, i) => <li key={i}>{s}</li>)
                      ) : (
                        <li className="text-slate-400 italic">None noted</li>
                      )}
                    </ul>
                  </div>

                  <div className="p-3 bg-red-50/70 border border-red-200 rounded-lg">
                    <div className="font-bold text-red-800 mb-1 flex items-center space-x-1">
                      <X className="w-3.5 h-3.5 text-red-600" />
                      <span>Avoid Application</span>
                    </div>
                    <ul className="list-disc list-inside text-red-950 space-y-0.5">
                      {doc.tds.surfaceCompatibility.avoid.length > 0 ? (
                        doc.tds.surfaceCompatibility.avoid.map((s, i) => <li key={i}>{s}</li>)
                      ) : (
                        <li className="text-slate-400 italic">None noted</li>
                      )}
                    </ul>
                  </div>
                </div>
              </section>

              {/* Commercial Packaging Specifications */}
              <section>
                <h2 className="text-xs font-bold uppercase tracking-wider text-teal-800 border-b border-teal-200 pb-1 mb-2">
                  5. Institutional Packaging Sizes
                </h2>
                <div className="flex flex-wrap gap-2">
                  {doc.tds.packagingSpecs.map((pkg, idx) => (
                    <span key={idx} className="text-xs px-3 py-1 bg-slate-100 border border-slate-200 text-slate-700 rounded-md font-medium">
                      📦 {pkg}
                    </span>
                  ))}
                </div>
              </section>
            </div>
          )}

          {/* ========================================================
              16-SECTION GHS MSDS / SDS DOCUMENT VIEW
              ======================================================== */}
          {type === "MSDS" && (
            <div className="space-y-5 text-xs">
              
              {/* Section 1 */}
              <section className="border-b border-slate-200 pb-3">
                <h3 className="font-bold text-slate-900 uppercase text-[11px] tracking-wider mb-1">
                  Section 1: Chemical Product & Company Identification
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-slate-700">
                  <div><strong>Product Name:</strong> {doc.msds.sections.section1_identification.productName}</div>
                  <div><strong>Manufacturer:</strong> {doc.msds.sections.section1_identification.manufacturer}</div>
                  <div><strong>Recommended Use:</strong> {doc.msds.sections.section1_identification.recommendedUse}</div>
                  <div><strong>Emergency Hotline:</strong> {doc.msds.sections.section1_identification.emergencyPhone}</div>
                </div>
              </section>

              {/* Section 2 */}
              <section className="border-b border-slate-200 pb-3">
                <h3 className="font-bold text-slate-900 uppercase text-[11px] tracking-wider mb-1">
                  Section 2: Hazard(s) Identification (GHS Classification)
                </h3>
                <div className="p-2.5 bg-slate-50 border border-slate-200 rounded mb-2">
                  <div className="font-semibold text-slate-900">GHS Classification:</div>
                  <div className="text-slate-700">{doc.msds.sections.section2_hazardIdentification.classification}</div>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <div className="font-bold text-red-800 text-[10px] uppercase">Hazard Statements:</div>
                    <ul className="list-disc list-inside text-slate-700">
                      {doc.msds.sections.section2_hazardIdentification.hazardStatements.map((h, i) => (
                        <li key={i}>{h}</li>
                      ))}
                    </ul>
                  </div>
                  <div>
                    <div className="font-bold text-teal-800 text-[10px] uppercase">Precautionary Statements:</div>
                    <ul className="list-disc list-inside text-slate-700">
                      {doc.msds.sections.section2_hazardIdentification.precautionaryStatements.map((p, i) => (
                        <li key={i}>{p}</li>
                      ))}
                    </ul>
                  </div>
                </div>
              </section>

              {/* Section 3 */}
              <section className="border-b border-slate-200 pb-3">
                <h3 className="font-bold text-slate-900 uppercase text-[11px] tracking-wider mb-1">
                  Section 3: Composition / Information on Ingredients
                </h3>
                <table className="w-full text-left border border-slate-200 mt-1">
                  <thead className="bg-slate-100 text-slate-700 font-bold">
                    <tr>
                      <th className="p-1.5 border-b border-r border-slate-200">Chemical / Ingredient</th>
                      <th className="p-1.5 border-b border-r border-slate-200">CAS Registry No.</th>
                      <th className="p-1.5 border-b border-slate-200">Concentration Range</th>
                    </tr>
                  </thead>
                  <tbody>
                    {Array.isArray(doc.msds.sections.section3_composition) ? (
                      doc.msds.sections.section3_composition.map((comp, i) => (
                        <tr key={i} className="border-b border-slate-200">
                          <td className="p-1.5 border-r border-slate-200">{comp.chemicalName}</td>
                          <td className="p-1.5 border-r border-slate-200 font-mono">{comp.casNumber}</td>
                          <td className="p-1.5">{comp.concentration}</td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td colSpan={3} className="p-1.5 text-slate-500">Standard institutional active formulation</td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </section>

              {/* Section 4 */}
              <section className="border-b border-slate-200 pb-3">
                <h3 className="font-bold text-slate-900 uppercase text-[11px] tracking-wider mb-1">
                  Section 4: First-Aid Measures
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-slate-700">
                  <div className="p-2 bg-slate-50 rounded"><strong>Inhalation:</strong> {doc.msds.sections.section4_firstAid.inhalation}</div>
                  <div className="p-2 bg-slate-50 rounded"><strong>Skin Contact:</strong> {doc.msds.sections.section4_firstAid.skinContact}</div>
                  <div className="p-2 bg-slate-50 rounded"><strong>Eye Contact:</strong> {doc.msds.sections.section4_firstAid.eyeContact}</div>
                  <div className="p-2 bg-slate-50 rounded"><strong>Ingestion:</strong> {doc.msds.sections.section4_firstAid.ingestion}</div>
                </div>
              </section>

              {/* Section 7 & 8 */}
              <section className="border-b border-slate-200 pb-3">
                <h3 className="font-bold text-slate-900 uppercase text-[11px] tracking-wider mb-1">
                  Section 7 & 8: Handling, Storage & Personal Protective Equipment (PPE)
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-slate-700">
                  <div>
                    <div className="font-semibold text-slate-900 mb-0.5">Handling & Storage:</div>
                    <p>{doc.msds.sections.section7_handlingStorage.handling}</p>
                    <p className="mt-1 text-slate-600">{doc.msds.sections.section7_handlingStorage.storageConditions}</p>
                  </div>
                  <div>
                    <div className="font-semibold text-slate-900 mb-0.5">Recommended PPE:</div>
                    <ul className="list-disc list-inside space-y-0.5 text-slate-600">
                      <li><strong>Eyes:</strong> {doc.msds.sections.section8_exposureControlsPPE.eyeProtection}</li>
                      <li><strong>Hands:</strong> {doc.msds.sections.section8_exposureControlsPPE.handProtection}</li>
                      <li><strong>Skin:</strong> {doc.msds.sections.section8_exposureControlsPPE.skinProtection}</li>
                      <li><strong>Respiratory:</strong> {doc.msds.sections.section8_exposureControlsPPE.respiratoryProtection}</li>
                    </ul>
                  </div>
                </div>
              </section>

              {/* Section 9 & 10 */}
              <section className="border-b border-slate-200 pb-3">
                <h3 className="font-bold text-slate-900 uppercase text-[11px] tracking-wider mb-1">
                  Section 9 & 10: Physical/Chemical Properties & Stability/Reactivity
                </h3>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-slate-700 mb-2">
                  <div><strong>State:</strong> {doc.msds.sections.section9_physicalChemical.physicalState}</div>
                  <div><strong>Color:</strong> {doc.msds.sections.section9_physicalChemical.color}</div>
                  <div><strong>pH:</strong> {doc.msds.sections.section9_physicalChemical.ph}</div>
                  <div><strong>Flash Point:</strong> {doc.msds.sections.section9_physicalChemical.flashPoint}</div>
                </div>
                <div className="text-slate-600">
                  <strong>Incompatible Materials:</strong> {doc.msds.sections.section10_stabilityReactivity.incompatibleMaterials} | 
                  <strong className="ml-2">Hazardous Decomposition:</strong> {doc.msds.sections.section10_stabilityReactivity.hazardousDecomposition}
                </div>
              </section>

              {/* Section 14 & 16 */}
              <section>
                <h3 className="font-bold text-slate-900 uppercase text-[11px] tracking-wider mb-1">
                  Section 14 & 16: Transport & Regulatory Information
                </h3>
                <div className="flex flex-wrap gap-4 text-slate-700">
                  <div><strong>UN Number:</strong> {doc.msds.sections.section14_transport.unNumber}</div>
                  <div><strong>Shipping Name:</strong> {doc.msds.sections.section14_transport.properShippingName}</div>
                  <div><strong>Hazard Class:</strong> {doc.msds.sections.section14_transport.transportHazardClass}</div>
                  <div><strong>NFPA 704 Rating:</strong> Health: {doc.msds.sections.section16_otherInfo.nfpaRating.health}, Flammability: {doc.msds.sections.section16_otherInfo.nfpaRating.flammability}, Reactivity: {doc.msds.sections.section16_otherInfo.nfpaRating.reactivity}</div>
                </div>
              </section>

            </div>
          )}

          {/* Institutional Compliance Seal Footer */}
          <div className="mt-8 pt-4 border-t-2 border-slate-900 flex flex-col sm:flex-row items-center justify-between text-[11px] text-slate-500 gap-2">
            <div>
              <span>© {new Date().getFullYear()} LIOC Chemical Industries. All Rights Reserved.</span>
              <span className="mx-2">|</span>
              <span>ISO 9001:2015 Quality Certified</span>
            </div>
            <div className="italic text-slate-400">
              Generated for Institutional Safety Audits & Facility Compliance
            </div>
          </div>

        </div>

      </div>
    </div>
  );
}
