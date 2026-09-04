"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import {
  Building2,
  UtensilsCrossed,
  GraduationCap,
  Briefcase,
  Factory,
  Sparkles,
  Droplets,
  Sun,
  ShieldCheck,
  Flame,
  CheckCircle2,
  Layers,
  ArrowRight,
  ArrowLeft,
  RotateCcw,
  MessageCircle,
  FileText,
  Check,
  Award,
  Package,
  ChevronRight,
  SlidersHorizontal,
  Info,
} from "lucide-react";
import {
  Industry,
  Category,
  ContextChallengeOption,
  ProductFinderOptions,
  ProductFinderResponse,
  RecommendationItem,
} from "@/types";
import { api } from "@/lib/api";
import { SITE_CONFIG } from "@/lib/config";
import Button from "@/components/ui/Button";

// Icon mapping helper for dynamic backend icons
const getIndustryIcon = (slug: string) => {
  switch (slug) {
    case "hotels-guest-houses":
      return <Building2 className="w-8 h-8 text-primary" />;
    case "restaurants-cafes":
      return <UtensilsCrossed className="w-8 h-8 text-amber-600" />;
    case "schools-colleges":
      return <GraduationCap className="w-8 h-8 text-indigo-600" />;
    case "corporate-offices":
      return <Briefcase className="w-8 h-8 text-emerald-600" />;
    case "facility-management":
      return <Factory className="w-8 h-8 text-cyan-600" />;
    default:
      return <Building2 className="w-8 h-8 text-primary" />;
  }
};

const getCategoryIcon = (slug: string) => {
  switch (slug) {
    case "floor-cleaners":
      return <Sparkles className="w-7 h-7 text-emerald-600" />;
    case "toilet-washroom":
      return <Droplets className="w-7 h-7 text-blue-600" />;
    case "glass-multisurface":
      return <Sun className="w-7 h-7 text-amber-500" />;
    case "hand-hygiene":
      return <ShieldCheck className="w-7 h-7 text-teal-600" />;
    case "kitchen-degreasers":
      return <Flame className="w-7 h-7 text-orange-600" />;
    case "disinfectants":
      return <CheckCircle2 className="w-7 h-7 text-indigo-600" />;
    default:
      return <Package className="w-7 h-7 text-primary" />;
  }
};

const getChallengeIcon = (id: string) => {
  switch (id) {
    case "daily_maintenance":
      return <Sparkles className="w-6 h-6 text-emerald-600" />;
    case "heavy_stains":
      return <Droplets className="w-6 h-6 text-blue-600" />;
    case "grease_oil":
      return <Flame className="w-6 h-6 text-orange-600" />;
    case "germ_disinfection":
      return <ShieldCheck className="w-6 h-6 text-indigo-600" />;
    case "glass_shine":
      return <Sun className="w-6 h-6 text-amber-500" />;
    case "cost_efficiency":
      return <Layers className="w-6 h-6 text-cyan-600" />;
    default:
      return <SlidersHorizontal className="w-6 h-6 text-primary" />;
  }
};

export default function ProductFinderWizard() {
  const [step, setStep] = useState<number>(1);
  const [options, setOptions] = useState<ProductFinderOptions | null>(null);
  const [loadingOptions, setLoadingOptions] = useState<boolean>(true);

  // User Selections
  const [selectedIndustry, setSelectedIndustry] = useState<Industry | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<Category | null>(null);
  const [selectedChallenge, setSelectedChallenge] = useState<ContextChallengeOption | null>(null);

  // Recommendations State
  const [recommendations, setRecommendations] = useState<ProductFinderResponse | null>(null);
  const [loadingRecs, setLoadingRecs] = useState<boolean>(false);
  const [fetchError, setFetchError] = useState<string | null>(null);

  // Fetch initial options on mount
  useEffect(() => {
    async function loadOptions() {
      try {
        setLoadingOptions(true);
        const data = await api.getProductFinderOptions();
        setOptions(data);
      } catch (err) {
        console.error("Error loading product finder options:", err);
      } finally {
        setLoadingOptions(false);
      }
    }
    loadOptions();
  }, []);

  // Fetch recommendations when moving to Step 4 (Results)
  const fetchRecommendations = async (
    industryId?: number,
    categoryId?: number,
    contextId?: string
  ) => {
    setLoadingRecs(true);
    setFetchError(null);
    try {
      const res = await api.getProductRecommendations({
        industryId: industryId || selectedIndustry?.id,
        categoryId: categoryId || selectedCategory?.id,
        context: contextId || selectedChallenge?.id,
        limit: 6,
      });
      setRecommendations(res);
      setStep(4);
    } catch (err: any) {
      setFetchError(err.message || "Failed to load product recommendations");
    } finally {
      setLoadingRecs(false);
    }
  };

  const handleSelectIndustry = (ind: Industry) => {
    setSelectedIndustry(ind);
    setStep(2);
  };

  const handleSelectCategory = (cat: Category) => {
    setSelectedCategory(cat);
    setStep(3);
  };

  const handleSelectChallenge = (ch: ContextChallengeOption) => {
    setSelectedChallenge(ch);
    fetchRecommendations(selectedIndustry?.id, selectedCategory?.id, ch.id);
  };

  const handleSkipChallenge = () => {
    setSelectedChallenge(null);
    fetchRecommendations(selectedIndustry?.id, selectedCategory?.id, undefined);
  };

  const handleReset = () => {
    setSelectedIndustry(null);
    setSelectedCategory(null);
    setSelectedChallenge(null);
    setRecommendations(null);
    setStep(1);
    setFetchError(null);
  };

  // Generate Contextual WhatsApp Link
  const generateWhatsAppLink = () => {
    const indName = selectedIndustry?.name || "Commercial Facility";
    const catName = selectedCategory?.name || "Hygiene Formulation";
    const topProducts = recommendations?.recommendations
      .slice(0, 3)
      .map((r) => `• ${r.product.name}`)
      .join("\n");

    const message = `Hello Lioc Sales Team,\n\nI used the Product Finder on your website for my business:\n🏢 Business Type: ${indName}\n🧴 Cleaning Need: ${catName}\n${
      selectedChallenge ? `⚡ Operational Challenge: ${selectedChallenge.label}\n` : ""
    }\nRecommended Products:\n${topProducts || "• Commercial Cleaning Solutions"}\n\nI would like to request bulk pricing, dilution specifications, and delivery schedule.`;

    const encoded = encodeURIComponent(message);
    const cleanNumber = SITE_CONFIG.whatsappNumber.replace(/[^0-9]/g, "");
    return `https://wa.me/91${cleanNumber}?text=${encoded}`;
  };

  return (
    <div className="w-full max-w-5xl mx-auto">
      {/* Wizard Header Progress Bar */}
      {step < 4 && (
        <div className="mb-8">
          <div className="flex items-center justify-between text-xs sm:text-sm font-semibold text-text-muted mb-2">
            <span className={step >= 1 ? "text-primary font-bold" : ""}>
              1. Business Type
            </span>
            <ChevronRight className="w-4 h-4 text-slate-400" />
            <span className={step >= 2 ? "text-primary font-bold" : ""}>
              2. Cleaning Requirement
            </span>
            <ChevronRight className="w-4 h-4 text-slate-400" />
            <span className={step >= 3 ? "text-primary font-bold" : ""}>
              3. Operational Challenge
            </span>
          </div>

          <div className="w-full bg-slate-200 h-2 rounded-full overflow-hidden">
            <div
              className="bg-primary h-full transition-all duration-300 ease-out rounded-full"
              style={{ width: `${(step / 3) * 100}%` }}
            />
          </div>
        </div>
      )}

      {/* Loading Skeleton */}
      {loadingOptions && (
        <div className="bg-white rounded-2xl border border-slate-200 p-8 text-center animate-pulse">
          <div className="h-8 bg-slate-200 rounded w-1/3 mx-auto mb-4" />
          <div className="h-4 bg-slate-200 rounded w-1/2 mx-auto mb-8" />
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <div key={i} className="h-32 bg-slate-100 rounded-xl" />
            ))}
          </div>
        </div>
      )}

      {!loadingOptions && options && (
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
          {/* STEP 1: BUSINESS TYPE */}
          {step === 1 && (
            <div className="p-6 sm:p-10">
              <div className="text-center max-w-2xl mx-auto mb-8">
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-primary/10 text-primary mb-3">
                  <Building2 className="w-3.5 h-3.5" /> Step 1 of 3
                </span>
                <h2 className="text-2xl sm:text-3xl font-bold text-text-main">
                  What type of commercial facility do you operate?
                </h2>
                <p className="text-text-muted mt-2 text-sm sm:text-base">
                  Lioc formulates industry-specialized regimens tailored to specific hygiene and safety standards.
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {options.industries.map((ind) => {
                  const isSelected = selectedIndustry?.id === ind.id;
                  return (
                    <button
                      key={ind.id}
                      onClick={() => handleSelectIndustry(ind)}
                      className={`text-left p-6 rounded-xl border-2 transition-all duration-200 flex flex-col justify-between group hover:shadow-md ${
                        isSelected
                          ? "border-primary bg-primary/5 shadow-sm"
                          : "border-slate-200 hover:border-primary/50 bg-white"
                      }`}
                    >
                      <div>
                        <div className="p-3 rounded-lg bg-slate-100 w-fit mb-4 group-hover:bg-primary/10 transition-colors">
                          {getIndustryIcon(ind.slug)}
                        </div>
                        <h3 className="font-bold text-lg text-text-main group-hover:text-primary transition-colors">
                          {ind.name}
                        </h3>
                        <p className="text-xs sm:text-sm text-text-muted mt-1.5 line-clamp-2">
                          {ind.tagline || ind.description}
                        </p>
                      </div>

                      <div className="mt-4 flex items-center justify-between pt-3 border-t border-slate-100 text-xs font-semibold text-primary">
                        <span>Select Sector</span>
                        <ArrowRight className="w-4 h-4 transform group-hover:translate-x-1 transition-transform" />
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {/* STEP 2: CLEANING REQUIREMENT */}
          {step === 2 && (
            <div className="p-6 sm:p-10">
              <div className="flex items-center justify-between mb-6">
                <button
                  onClick={() => setStep(1)}
                  className="inline-flex items-center gap-1 text-sm font-medium text-text-muted hover:text-primary transition-colors"
                >
                  <ArrowLeft className="w-4 h-4" /> Back to Business Type
                </button>
                <div className="text-xs text-text-muted">
                  Selected: <span className="font-semibold text-primary">{selectedIndustry?.name}</span>
                </div>
              </div>

              <div className="text-center max-w-2xl mx-auto mb-8">
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-primary/10 text-primary mb-3">
                  <Sparkles className="w-3.5 h-3.5" /> Step 2 of 3
                </span>
                <h2 className="text-2xl sm:text-3xl font-bold text-text-main">
                  What specific area or chemical solution do you require?
                </h2>
                <p className="text-text-muted mt-2 text-sm sm:text-base">
                  Choose the cleaning category to view high-potency formulations.
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {options.categories.map((cat) => {
                  const isSelected = selectedCategory?.id === cat.id;
                  return (
                    <button
                      key={cat.id}
                      onClick={() => handleSelectCategory(cat)}
                      className={`text-left p-6 rounded-xl border-2 transition-all duration-200 flex flex-col justify-between group hover:shadow-md ${
                        isSelected
                          ? "border-primary bg-primary/5 shadow-sm"
                          : "border-slate-200 hover:border-primary/50 bg-white"
                      }`}
                    >
                      <div>
                        <div className="p-3 rounded-lg bg-slate-100 w-fit mb-4 group-hover:bg-primary/10 transition-colors">
                          {getCategoryIcon(cat.slug)}
                        </div>
                        <h3 className="font-bold text-lg text-text-main group-hover:text-primary transition-colors">
                          {cat.name}
                        </h3>
                        <p className="text-xs sm:text-sm text-text-muted mt-1.5 line-clamp-2">
                          {cat.description}
                        </p>
                      </div>

                      <div className="mt-4 flex items-center justify-between pt-3 border-t border-slate-100 text-xs font-semibold text-primary">
                        <span>Select Category</span>
                        <ArrowRight className="w-4 h-4 transform group-hover:translate-x-1 transition-transform" />
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {/* STEP 3: OPERATIONAL CHALLENGE */}
          {step === 3 && (
            <div className="p-6 sm:p-10">
              <div className="flex items-center justify-between mb-6">
                <button
                  onClick={() => setStep(2)}
                  className="inline-flex items-center gap-1 text-sm font-medium text-text-muted hover:text-primary transition-colors"
                >
                  <ArrowLeft className="w-4 h-4" /> Back to Cleaning Category
                </button>
                <button
                  onClick={handleSkipChallenge}
                  className="text-xs text-primary font-semibold hover:underline"
                >
                  Skip this step & view solutions →
                </button>
              </div>

              <div className="text-center max-w-2xl mx-auto mb-8">
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-primary/10 text-primary mb-3">
                  <SlidersHorizontal className="w-3.5 h-3.5" /> Step 3 of 3 (Optional)
                </span>
                <h2 className="text-2xl sm:text-3xl font-bold text-text-main">
                  What is your primary cleaning challenge?
                </h2>
                <p className="text-text-muted mt-2 text-sm sm:text-base">
                  This helps our engine highlight the highest-performing chemical formulation for your facility.
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {options.context_challenges.map((ch) => {
                  const isSelected = selectedChallenge?.id === ch.id;
                  return (
                    <button
                      key={ch.id}
                      onClick={() => handleSelectChallenge(ch)}
                      className={`text-left p-6 rounded-xl border-2 transition-all duration-200 flex flex-col justify-between group hover:shadow-md ${
                        isSelected
                          ? "border-primary bg-primary/5 shadow-sm"
                          : "border-slate-200 hover:border-primary/50 bg-white"
                      }`}
                    >
                      <div>
                        <div className="p-3 rounded-lg bg-slate-100 w-fit mb-4 group-hover:bg-primary/10 transition-colors">
                          {getChallengeIcon(ch.id)}
                        </div>
                        <h3 className="font-bold text-base text-text-main group-hover:text-primary transition-colors">
                          {ch.label}
                        </h3>
                        <p className="text-xs text-text-muted mt-1.5">
                          {ch.description}
                        </p>
                      </div>

                      <div className="mt-4 flex items-center justify-between pt-3 border-t border-slate-100 text-xs font-semibold text-primary">
                        <span>Get Recommendations</span>
                        <ArrowRight className="w-4 h-4 transform group-hover:translate-x-1 transition-transform" />
                      </div>
                    </button>
                  );
                })}
              </div>

              <div className="mt-8 text-center">
                <Button variant="outline" size="md" onClick={handleSkipChallenge}>
                  Skip & View All Matching Formulations
                </Button>
              </div>
            </div>
          )}

          {/* STEP 4: RECOMMENDATIONS RESULTS SCREEN */}
          {step === 4 && (
            <div className="p-6 sm:p-10">
              {/* Selections Pill Bar */}
              <div className="bg-slate-50 border border-slate-200 rounded-xl p-4 mb-8 flex flex-wrap items-center justify-between gap-4">
                <div className="flex flex-wrap items-center gap-2">
                  <span className="text-xs font-semibold text-text-muted uppercase tracking-wider">
                    Your Criteria:
                  </span>
                  {selectedIndustry && (
                    <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium bg-white border border-slate-200 text-text-main shadow-2xs">
                      🏢 {selectedIndustry.name}
                    </span>
                  )}
                  {selectedCategory && (
                    <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium bg-white border border-slate-200 text-text-main shadow-2xs">
                      🧴 {selectedCategory.name}
                    </span>
                  )}
                  {selectedChallenge && (
                    <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium bg-white border border-slate-200 text-text-main shadow-2xs">
                      ⚡ {selectedChallenge.label}
                    </span>
                  )}
                </div>

                <button
                  onClick={handleReset}
                  className="inline-flex items-center gap-1.5 text-xs font-semibold text-primary hover:text-primary-dark transition-colors"
                >
                  <RotateCcw className="w-3.5 h-3.5" /> Start New Search
                </button>
              </div>

              {loadingRecs && (
                <div className="text-center py-16 animate-pulse">
                  <Sparkles className="w-12 h-12 text-primary mx-auto mb-4 animate-spin" />
                  <h3 className="text-xl font-bold text-text-main">
                    Analyzing Chemical Regimens...
                  </h3>
                  <p className="text-sm text-text-muted mt-1">
                    Matching active Lioc formulations for {selectedIndustry?.name}.
                  </p>
                </div>
              )}

              {fetchError && (
                <div className="text-center py-12 bg-red-50 border border-red-200 rounded-xl p-6">
                  <p className="text-red-700 font-semibold mb-3">{fetchError}</p>
                  <Button variant="primary" size="sm" onClick={handleReset}>
                    Try Again
                  </Button>
                </div>
              )}

              {!loadingRecs && recommendations && (
                <div>
                  <div className="mb-8">
                    <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-bold bg-emerald-50 text-emerald-700 border border-emerald-200 mb-2">
                      <CheckCircle2 className="w-3.5 h-3.5" /> {recommendations.total_recommendations} Formulations Recommended
                    </span>
                    <h2 className="text-2xl sm:text-3xl font-bold text-text-main">
                      Recommended Lioc Commercial Solutions
                    </h2>
                    <p className="text-text-muted text-sm sm:text-base mt-1">
                      Ranked by institutional efficacy for {selectedIndustry?.name || "commercial facilities"}.
                    </p>
                  </div>

                  {/* Recommendations Grid */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {recommendations.recommendations.map((item: RecommendationItem) => {
                      const prod = item.product;
                      const isTopRank = item.rank === 1;

                      return (
                        <div
                          key={prod.id}
                          className={`rounded-2xl border transition-all duration-200 p-6 flex flex-col justify-between bg-white relative ${
                            isTopRank
                              ? "border-primary ring-2 ring-primary/20 shadow-md"
                              : "border-slate-200 hover:border-slate-300 shadow-sm"
                          }`}
                        >
                          {/* Rank / Match Badge */}
                          <div className="flex items-center justify-between gap-2 mb-4">
                            <span
                              className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-bold ${
                                isTopRank
                                  ? "bg-primary text-white"
                                  : "bg-slate-100 text-slate-700"
                              }`}
                            >
                              <Award className="w-3.5 h-3.5" /> #{item.rank} {isTopRank ? "Primary Recommendation" : "Complementary Solution"}
                            </span>

                            {prod.category_name && (
                              <span className="text-xs font-medium text-slate-500 bg-slate-100 px-2.5 py-0.5 rounded-md">
                                {prod.category_name}
                              </span>
                            )}
                          </div>

                          {/* Product Details */}
                          <div>
                            <h3 className="font-bold text-xl text-text-main mb-2">
                              {prod.name}
                            </h3>
                            <p className="text-sm text-text-muted mb-4 line-clamp-3">
                              {prod.short_description}
                            </p>

                            {/* Why this is recommended */}
                            <div className="bg-slate-50 border border-slate-200/80 rounded-xl p-3.5 mb-4 text-xs">
                              <div className="font-semibold text-primary flex items-center gap-1.5 mb-1">
                                <Info className="w-3.5 h-3.5" /> Why Recommended:
                              </div>
                              <p className="text-slate-700">{item.reason}</p>
                            </div>

                            {/* Key Benefit */}
                            {item.key_benefit && (
                              <div className="flex items-start gap-2 text-xs text-slate-600 mb-4">
                                <Check className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                                <span>{item.key_benefit}</span>
                              </div>
                            )}

                            {/* Packaging Sizes */}
                            {prod.available_sizes && (
                              <div className="flex items-center gap-1.5 text-xs text-slate-500 mb-6">
                                <Package className="w-3.5 h-3.5 text-slate-400" />
                                <span>Commercial Packaging: {prod.available_sizes}</span>
                              </div>
                            )}
                          </div>

                          {/* Action CTAs */}
                          <div className="pt-4 border-t border-slate-100 flex flex-col gap-2.5">
                            <Link
                              href={`/request-quote?product=${encodeURIComponent(
                                prod.name
                              )}&source=PRODUCT_FINDER`}
                              className="w-full"
                            >
                              <Button variant="primary" size="md" className="w-full justify-center">
                                <FileText className="w-4 h-4 mr-2" /> Request Wholesale Quote
                              </Button>
                            </Link>

                            <div className="grid grid-cols-2 gap-2">
                              <Link href={`/products/${prod.slug}`}>
                                <Button variant="outline" size="sm" className="w-full justify-center text-xs">
                                  View Specs
                                </Button>
                              </Link>
                              <Link
                                href={`/request-sample?product=${encodeURIComponent(
                                  prod.name
                                )}&source=PRODUCT_FINDER`}
                              >
                                <Button variant="ghost" size="sm" className="w-full justify-center text-xs text-primary font-semibold hover:bg-primary/5">
                                  Free Sample
                                </Button>
                              </Link>
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>

                  {/* Fallback Message & Custom Consultation Banner */}
                  <div className="mt-10 bg-linear-to-r from-primary/10 via-primary/5 to-cyan-500/10 border border-primary/20 rounded-2xl p-6 sm:p-8 flex flex-col md:flex-row items-center justify-between gap-6">
                    <div>
                      <h4 className="text-lg font-bold text-text-main">
                        Need Custom Formulations or Bulk Dispenser Systems?
                      </h4>
                      <p className="text-sm text-text-muted mt-1 max-w-xl">
                        Our chemical formulation engineers provide tailored dilution protocols and bulk contract supply across Kolkata and Eastern India.
                      </p>
                    </div>

                    <div className="flex flex-wrap items-center gap-3 shrink-0">
                      <a
                        href={generateWhatsAppLink()}
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        <Button variant="secondary" size="md" className="bg-emerald-600 hover:bg-emerald-700 text-white border-transparent">
                          <MessageCircle className="w-4 h-4 mr-2" /> WhatsApp Specialist
                        </Button>
                      </a>
                      <Link href="/contact">
                        <Button variant="outline" size="md">
                          Contact Sales
                        </Button>
                      </Link>
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
