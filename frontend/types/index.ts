export interface Category {
  id: number;
  name: string;
  slug: string;
  description?: string | null;
  icon?: string | null;
  image_url?: string | null;
  display_order: number;
  is_active: boolean;
  product_count?: number;
}

export interface Industry {
  id: number;
  name: string;
  slug: string;
  tagline?: string | null;
  description?: string | null;
  key_challenges?: string | null;
  recommended_solutions?: string | null;
  icon?: string | null;
  image_url?: string | null;
  display_order: number;
  is_active: boolean;
}

export interface ProductImage {
  id: number;
  image_url: string;
  alt_text?: string | null;
  display_order: number;
  is_primary: boolean;
}

export interface ProductListItem {
  id: number;
  name: string;
  slug: string;
  sku?: string | null;
  category_id: number;
  category_name?: string | null;
  category_slug?: string | null;
  short_description: string;
  product_image?: string | null;
  available_sizes?: string | null;
  status: string;
  is_featured: boolean;
  is_bestseller: boolean;
  display_order: number;
}

export interface ProductDetail extends ProductListItem {
  full_description: string;
  usage_instructions?: string | null;
  benefits?: string | null;
  safety_information?: string | null;
  technical_information?: string | null;
  category?: Category | null;
  images: ProductImage[];
  industries: Industry[];
  created_at: string;
  updated_at: string;
}

export interface LeadSubmissionResponse {
  success: boolean;
  message: string;
  reference_id: string;
}

export interface QuoteFormData {
  full_name: string;
  company_name: string;
  phone_number: string;
  email: string;
  business_type: string;
  city: string;
  product_interested_in?: string;
  estimated_quantity?: string;
  monthly_requirement?: string;
  message?: string;
  source?: string;
  turnstile_token?: string;
}

export interface SampleFormData {
  full_name: string;
  company_name: string;
  phone_number: string;
  email: string;
  business_type: string;
  business_address: string;
  city: string;
  product_interested_in: string;
  expected_monthly_requirement?: string;
  message?: string;
  source?: string;
  turnstile_token?: string;
}

export interface DistributorFormData {
  applicant_name: string;
  company_name: string;
  phone_number: string;
  email: string;
  gst_number?: string;
  city: string;
  state: string;
  years_experience?: string;
  current_products_distributed?: string;
  investment_capacity?: string;
  message?: string;
  source?: string;
  turnstile_token?: string;
}

export interface ContactFormData {
  full_name: string;
  email: string;
  phone_number: string;
  company_name?: string;
  subject?: string;
  message: string;
  source?: string;
  turnstile_token?: string;
}

// ---------------- Product Finder Interfaces ----------------

export interface ContextChallengeOption {
  id: string;
  label: string;
  description: string;
  icon?: string | null;
}

export interface RecommendationProduct {
  id: number;
  name: string;
  slug: string;
  sku?: string | null;
  category_id: number;
  category_name?: string | null;
  category_slug?: string | null;
  short_description: string;
  product_image?: string | null;
  available_sizes?: string | null;
  usage_instructions?: string | null;
  benefits?: string | null;
  is_featured: boolean;
  is_bestseller: boolean;
}

export interface RecommendationItem {
  rank: number;
  score: number;
  match_type: "EXACT_MATCH" | "INDUSTRY_MATCH" | "CATEGORY_MATCH" | "GENERAL_MATCH" | string;
  reason: string;
  key_benefit?: string | null;
  product: RecommendationProduct;
}

export interface ProductFinderOptions {
  industries: Industry[];
  categories: Category[];
  context_challenges: ContextChallengeOption[];
}

export interface ProductFinderResponse {
  industry?: Industry | null;
  category?: Category | null;
  context_challenge?: string | null;
  total_recommendations: number;
  recommendations: RecommendationItem[];
  fallback_message?: string | null;
}

// ---------------- Admin & CEO Portal Interfaces ----------------

export interface AdminUser {
  email: string;
  name: string;
  role: string;
}

export interface AdminAuthResponse {
  access_token: string;
  token_type: string;
  admin_user: AdminUser;
}

export interface AdminStats {
  total_inquiries: number;
  quotes_count: number;
  samples_count: number;
  distributors_count: number;
  contacts_count: number;
  new_leads_count: number;
  action_required_count: number;
  converted_count: number;
}

export interface AdminLeadItem {
  id: number;
  lead_type: "quote" | "sample" | "distributor" | "contact";
  reference_id: string;
  name: string;
  company_name?: string | null;
  phone_number: string;
  email: string;
  city: string;
  state?: string | null;
  business_type?: string | null;
  business_address?: string | null;
  product_or_subject?: string | null;
  quantity_or_detail?: string | null;
  monthly_requirement?: string | null;
  gst_number?: string | null;
  investment_capacity?: string | null;
  experience?: string | null;
  message?: string | null;
  source?: string | null;
  status: string;
  internal_notes?: string | null;
  created_at: string;
  updated_at?: string | null;
}

export interface AdminLeadsResponse {
  total: number;
  quotes_count: number;
  samples_count: number;
  distributors_count: number;
  contacts_count: number;
  items: AdminLeadItem[];
}

// ---------------- AI Virtual Hygiene Auditor Interfaces ----------------

export interface FacilityAuditRequest {
  facility_name?: string;
  facility_type: string;
  floor_area_sqft: number;
  units_count: number;
  restrooms_count: number;
  footfall_level: "LOW" | "MODERATE" | "HIGH" | "VERY_HIGH_24X7" | string;
  has_commercial_kitchen: boolean;
  challenges: string[];
  current_monthly_spend?: number;
}

export interface ChemicalConsumptionItem {
  zone: string;
  product_name: string;
  product_slug: string;
  sku: string;
  monthly_concentrate_litres: number;
  ready_to_use_yield_litres: number;
  dilution_ratio: string;
  packaging_recommendation: string;
  estimated_retail_cost: number;
  lioc_direct_cost: number;
  monthly_savings: number;
  usage_guideline: string;
}

export interface ZoneBreakdown {
  zone_name: string;
  zone_icon: string;
  primary_focus: string;
  monthly_litres: number;
  items: ChemicalConsumptionItem[];
}

export interface ROISummary {
  estimated_monthly_retail_cost: number;
  lioc_monthly_direct_cost: number;
  monthly_savings: number;
  annual_savings: number;
  savings_percentage: number;
  total_diluted_cleaning_solution_litres: number;
  cost_per_litre_diluted: number;
}

export interface HousekeepingSOP {
  frequency: string;
  shift: string;
  area: string;
  chemical_used: string;
  dilution_ratio: string;
  application_method: string;
  safety_gear: string;
}

export interface FacilityAuditResponse {
  audit_id: string;
  facility_type_label: string;
  floor_area_sqft: number;
  units_count: number;
  restrooms_count: number;
  footfall_multiplier: number;
  total_monthly_concentrate_litres: number;
  total_ready_solution_litres: number;
  zones: ZoneBreakdown[];
  roi: ROISummary;
  sops: HousekeepingSOP[];
  executive_summary: string;
  recommended_product_slugs: string[];
}

export interface AuditLeadSubmit {
  audit_id: string;
  full_name: string;
  company_name: string;
  email: string;
  phone_number: string;
  city: string;
  additional_notes?: string;
  audit_summary?: any;
  turnstile_token?: string;
}

