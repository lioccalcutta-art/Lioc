import math
from typing import List, Dict, Any, Optional
from datetime import datetime, timezone
from sqlalchemy.orm import Session
from backend.app.schemas.auditor import (
    FacilityAuditRequest,
    FacilityAuditResponse,
    ZoneBreakdown,
    ChemicalConsumptionItem,
    ROISummary,
    HousekeepingSOP,
    AuditLeadSubmit,
)
from backend.app.schemas.leads import QuoteCreate, LeadSubmissionResponse
from backend.app.core.security import generate_reference_id
from backend.app.repositories.leads_repo import LeadsRepository
from backend.app.services.email_service import email_service


FACILITY_NAMES = {
    "hotels_guest_houses": "Hotels, Resorts & Guest Houses",
    "restaurants_cafes": "Restaurants, Cafes & Cloud Kitchens",
    "hospitals_healthcare": "Hospitals, Clinics & Diagnostic Centers",
    "corporate_offices": "Corporate Offices & IT Workspaces",
    "schools_colleges": "Schools, Colleges & Universities",
    "facility_management": "Commercial Facility & Janitorial Cleaning",
    "residential_estate": "Residential Complexes & Estates",
    "other": "Commercial & Industrial Facility",
}

FOOTFALL_MULTIPLIERS = {
    "LOW": 0.85,
    "MODERATE": 1.0,
    "HIGH": 1.35,
    "VERY_HIGH_24X7": 1.65,
}


class AuditorService:
    def __init__(self, db: Optional[Session] = None):
        self.db = db
        self.repo = LeadsRepository(db) if db else None

    def calculate_audit(self, req: FacilityAuditRequest) -> FacilityAuditResponse:
        audit_id = generate_reference_id("LA")
        facility_label = FACILITY_NAMES.get(req.facility_type, "Commercial Facility")
        multiplier = FOOTFALL_MULTIPLIERS.get(req.footfall_level.upper(), 1.0)
        
        # Industry-specific weighting factors
        is_hospital = req.facility_type == "hospitals_healthcare"
        is_fnb = req.facility_type in ["restaurants_cafes", "hotels_guest_houses"] or req.has_commercial_kitchen
        is_hotel = req.facility_type == "hotels_guest_houses"
        is_high_infection = "high_infection_risk" in req.challenges or is_hospital

        # -------------------------------------------------------------
        # 1. ZONE: Floor & Surface Hygiene
        # Formula: Area / 1000 sq ft * days(30) * mop_cycles * multiplier
        # -------------------------------------------------------------
        sqft_factor = req.floor_area_sqft / 1000.0
        mop_cycles = 2 if is_hospital or req.footfall_level in ["HIGH", "VERY_HIGH_24X7"] else 1
        
        # Liters of ready solution needed daily: ~1.5L per 1000 sq ft per cycle
        daily_ready_floor_litres = sqft_factor * 1.5 * mop_cycles * multiplier
        monthly_ready_floor_litres = daily_ready_floor_litres * 30.0

        # At 1:100 dilution (10ml per 1L or 30-50ml in 5L bucket):
        floor_cleaner_litres = max(5.0, math.ceil(monthly_ready_floor_litres / 100.0 / 5.0) * 5.0)
        pink_soap_litres = max(5.0, math.ceil((floor_cleaner_litres * 0.3) / 5.0) * 5.0) if ("marble_floors" in req.challenges or req.footfall_level in ["HIGH", "VERY_HIGH_24X7"]) else 5.0

        floor_items: List[ChemicalConsumptionItem] = [
            ChemicalConsumptionItem(
                zone="Floor & Surface Care",
                product_name="LIOC White Herbal Disinfectant Floor Cleaner",
                product_slug="lioc-white-herbal-floor-cleaner-5l",
                sku="LIOC-WFC-5L",
                monthly_concentrate_litres=floor_cleaner_litres,
                ready_to_use_yield_litres=floor_cleaner_litres * 100.0,
                dilution_ratio="1:100 (30-50ml in 5 Litres water)",
                packaging_recommendation=f"{int(floor_cleaner_litres // 20)}x 20L Jerry Cans + {int((floor_cleaner_litres % 20) // 5)}x 5L Cans" if floor_cleaner_litres >= 20 else f"{int(floor_cleaner_litres // 5)}x 5L Cans",
                estimated_retail_cost=round(floor_cleaner_litres * 220.0, 2),
                lioc_direct_cost=round(floor_cleaner_litres * 85.0, 2),
                monthly_savings=round(floor_cleaner_litres * 135.0, 2),
                usage_guideline="Daily surface mopping & natural insect defense. Safe on Italian marble and vitrified tiles.",
            ),
            ChemicalConsumptionItem(
                zone="Floor & Surface Care",
                product_name="LIOC Heavy-Duty Pink Liquid Floor Soap",
                product_slug="lioc-heavy-duty-pink-floor-soap-5l",
                sku="LIOC-LFS-5L",
                monthly_concentrate_litres=pink_soap_litres,
                ready_to_use_yield_litres=pink_soap_litres * 50.0,
                dilution_ratio="1:50 (50ml per bucket for deep wash)",
                packaging_recommendation=f"{int(pink_soap_litres // 5)}x 5L Cans",
                estimated_retail_cost=round(pink_soap_litres * 240.0, 2),
                lioc_direct_cost=round(pink_soap_litres * 95.0, 2),
                monthly_savings=round(pink_soap_litres * 145.0, 2),
                usage_guideline="Weekly heavy grime lifting, corridor foot-traffic scuffs, and staircase scrubbing.",
            ),
        ]

        # -------------------------------------------------------------
        # 2. ZONE: Restroom & Sanitaryware Hygiene
        # Formula based on number of washroom blocks & footfall
        # -------------------------------------------------------------
        washrooms = max(1, req.restrooms_count)
        washroom_litres_per_block = 3.5 * multiplier
        if "hard_water" in req.challenges:
            washroom_litres_per_block *= 1.3
        
        toilet_cleaner_litres = max(5.0, math.ceil((washrooms * washroom_litres_per_block) / 5.0) * 5.0)
        
        restroom_items: List[ChemicalConsumptionItem] = [
            ChemicalConsumptionItem(
                zone="Restroom & Washroom Hygiene",
                product_name="LIOC Ultra Disinfectant Toilet & Ceramic Cleaner",
                product_slug="lioc-ultra-toilet-cleaner-5l",
                sku="LIOC-UTC-5L",
                monthly_concentrate_litres=toilet_cleaner_litres,
                ready_to_use_yield_litres=toilet_cleaner_litres * 10.0,
                dilution_ratio="Direct for bowl scale / 1:10 for wall tiles",
                packaging_recommendation=f"{int(toilet_cleaner_litres // 5)}x 5L Cans",
                estimated_retail_cost=round(toilet_cleaner_litres * 260.0, 2),
                lioc_direct_cost=round(toilet_cleaner_litres * 95.0, 2),
                monthly_savings=round(toilet_cleaner_litres * 165.0, 2),
                usage_guideline="High-viscosity acidic descaler eliminating hard-water white rings, uric scale, and bacteria.",
            )
        ]

        # -------------------------------------------------------------
        # 3. ZONE: Hand Hygiene & Dispenser Care
        # Formula based on units/people & washroom dispensers
        # -------------------------------------------------------------
        dispensers = max(2, washrooms * 2)
        handwash_litres = max(5.0, math.ceil((dispensers * 2.0 * multiplier) / 5.0) * 5.0)

        hand_items: List[ChemicalConsumptionItem] = [
            ChemicalConsumptionItem(
                zone="Hand Hygiene & Guest Amenities",
                product_name="Finch Rose Pearl Antibacterial Hand Wash (5L)",
                product_slug="finch-rose-hand-wash-5l",
                sku="FNC-RHW-5L",
                monthly_concentrate_litres=handwash_litres,
                ready_to_use_yield_litres=handwash_litres,
                dilution_ratio="Ready-to-use dispenser refill",
                packaging_recommendation=f"{int(handwash_litres // 5)}x 5L Dispenser Refill Cans",
                estimated_retail_cost=round(handwash_litres * 280.0, 2),
                lioc_direct_cost=round(handwash_litres * 110.0, 2),
                monthly_savings=round(handwash_litres * 170.0, 2),
                usage_guideline="Pearlized moisturizing antibacterial formula for wall dispensers in guest & staff washrooms.",
            )
        ]

        # -------------------------------------------------------------
        # 4. ZONE: Commercial Kitchen & Degreasing (if applicable)
        # -------------------------------------------------------------
        kitchen_items: List[ChemicalConsumptionItem] = []
        if is_fnb or req.has_commercial_kitchen or "heavy_grease" in req.challenges:
            kitchen_intensity = 1.5 if req.facility_type == "restaurants_cafes" else 1.0
            degreaser_litres = max(5.0, math.ceil((10.0 * kitchen_intensity * multiplier) / 5.0) * 5.0)
            dishwash_litres = max(5.0, math.ceil((15.0 * kitchen_intensity * multiplier) / 5.0) * 5.0)

            kitchen_items.append(
                ChemicalConsumptionItem(
                    zone="Kitchen & Food Service Degreasing",
                    product_name="LIOC KitchenMaster Heavy-Duty Degreaser",
                    product_slug="lioc-kitchenmaster-degreaser-5l",
                    sku="LIOC-KMD-5L",
                    monthly_concentrate_litres=degreaser_litres,
                    ready_to_use_yield_litres=degreaser_litres * 20.0,
                    dilution_ratio="1:5 for deep fryer carbon / 1:20 for kitchen tiles",
                    packaging_recommendation=f"{int(degreaser_litres // 5)}x 5L Cans",
                    estimated_retail_cost=round(degreaser_litres * 320.0, 2),
                    lioc_direct_cost=round(degreaser_litres * 125.0, 2),
                    monthly_savings=round(degreaser_litres * 195.0, 2),
                    usage_guideline="Heavy caustic grease cutter for chimney hoods, deep fryers, and slippery kitchen floors.",
                )
            )
            kitchen_items.append(
                ChemicalConsumptionItem(
                    zone="Kitchen & Food Service Degreasing",
                    product_name="LIOC Ultra Concentrated Dishwash Liquid",
                    product_slug="lioc-ultra-concentrated-dishwash-liquid-5l",
                    sku="LIOC-UDW-5L",
                    monthly_concentrate_litres=dishwash_litres,
                    ready_to_use_yield_litres=dishwash_litres * 40.0,
                    dilution_ratio="1 teaspoon (5ml) per 1 Litre wash water",
                    packaging_recommendation=f"{int(dishwash_litres // 5)}x 5L Cans",
                    estimated_retail_cost=round(dishwash_litres * 230.0, 2),
                    lioc_direct_cost=round(dishwash_litres * 80.0, 2),
                    monthly_savings=round(dishwash_litres * 150.0, 2),
                    usage_guideline="Food-grade lemon surfactant dissolving stubborn oil and charred food residue on cookware.",
                )
            )

        # -------------------------------------------------------------
        # 5. ZONE: Ambient Air Perfume & Odor Control
        # -------------------------------------------------------------
        aircare_litres = 5.0
        if req.floor_area_sqft >= 30000 or req.units_count >= 50:
            aircare_litres = 10.0
        
        air_items: List[ChemicalConsumptionItem] = [
            ChemicalConsumptionItem(
                zone="Air Care & Deodorization",
                product_name="LIOC Jasmine Bloom & Litchi Ambient Fresheners",
                product_slug="lioc-jasmine-bloom-air-freshener-5l",
                sku="LIOC-AFJ-5L",
                monthly_concentrate_litres=aircare_litres,
                ready_to_use_yield_litres=aircare_litres * 5.0,
                dilution_ratio="Ready-to-use trigger spray or 1:5 ambient mist",
                packaging_recommendation=f"{int(aircare_litres // 5)}x 5L Can + Refillable Trigger Sprayers",
                estimated_retail_cost=round(aircare_litres * 350.0, 2),
                lioc_direct_cost=round(aircare_litres * 140.0, 2),
                monthly_savings=round(aircare_litres * 210.0, 2),
                usage_guideline="Long-lasting natural botanical aromas for guest lobbies, conference rooms, and hallways.",
            )
        ]

        # Compile all zones
        zones: List[ZoneBreakdown] = [
            ZoneBreakdown(
                zone_name="Floor & Surface Care",
                zone_icon="Sparkles",
                primary_focus="Marble, vitrified tile mopping, and natural fly/insect deterrence",
                monthly_litres=floor_cleaner_litres + pink_soap_litres,
                items=floor_items,
            ),
            ZoneBreakdown(
                zone_name="Restroom & Ceramic Hygiene",
                zone_icon="Droplets",
                primary_focus="Hard-water descaling, bowl sanitization, and uric odor control",
                monthly_litres=toilet_cleaner_litres,
                items=restroom_items,
            ),
            ZoneBreakdown(
                zone_name="Hand Hygiene & Guest Amenities",
                zone_icon="ShieldCheck",
                primary_focus="High-traffic dispenser refills with skin conditioning",
                monthly_litres=handwash_litres,
                items=hand_items,
            ),
        ]

        if kitchen_items:
            zones.append(
                ZoneBreakdown(
                    zone_name="Kitchen & Food Service Degreasing",
                    zone_icon="Flame",
                    primary_focus="Exhaust grease cutting, fryer descaling, and food-grade dishware",
                    monthly_litres=sum(i.monthly_concentrate_litres for i in kitchen_items),
                    items=kitchen_items,
                )
            )

        zones.append(
            ZoneBreakdown(
                zone_name="Ambient Air Perfuming",
                zone_icon="Wind",
                primary_focus="Odor neutralization and signature institutional fragrance",
                monthly_litres=aircare_litres,
                items=air_items,
            )
        )

        # -------------------------------------------------------------
        # 6. Aggregate Financial ROI Calculations
        # -------------------------------------------------------------
        all_items: List[ChemicalConsumptionItem] = []
        for z in zones:
            all_items.extend(z.items)

        total_concentrate_litres = sum(item.monthly_concentrate_litres for item in all_items)
        total_ready_solution_litres = sum(item.ready_to_use_yield_litres for item in all_items)
        total_retail_cost = sum(item.estimated_retail_cost for item in all_items)
        total_lioc_cost = sum(item.lioc_direct_cost for item in all_items)
        monthly_savings = total_retail_cost - total_lioc_cost
        annual_savings = monthly_savings * 12.0
        savings_percentage = round((monthly_savings / total_retail_cost) * 100.0, 1) if total_retail_cost > 0 else 40.0
        cost_per_diluted_litre = round(total_lioc_cost / total_ready_solution_litres, 2) if total_ready_solution_litres > 0 else 1.20

        roi = ROISummary(
            estimated_monthly_retail_cost=round(total_retail_cost, 2),
            lioc_monthly_direct_cost=round(total_lioc_cost, 2),
            monthly_savings=round(monthly_savings, 2),
            annual_savings=round(annual_savings, 2),
            savings_percentage=savings_percentage,
            total_diluted_cleaning_solution_litres=round(total_ready_solution_litres, 1),
            cost_per_litre_diluted=cost_per_diluted_litre,
        )

        # -------------------------------------------------------------
        # 7. Housekeeping SOP (Standard Operating Procedure)
        # -------------------------------------------------------------
        sops: List[HousekeepingSOP] = [
            HousekeepingSOP(
                frequency="Daily Morning Shift (07:00 - 10:00)",
                shift="Morning Shift",
                area="Main Foyers, Lobby, Corridors & Workstations",
                chemical_used="LIOC White Herbal Floor Cleaner",
                dilution_ratio="30-50ml in 5L clean water (1:100)",
                application_method="Even double-bucket mopping with 360° spin mop. Allow to dry naturally without rinsing.",
                safety_gear="Rubber gloves, non-slip housekeeping footwear",
            ),
            HousekeepingSOP(
                frequency="Midday Refresh (13:00 - 15:00)",
                shift="Afternoon Shift",
                area="Public & Staff Washrooms / Ceramic Fixtures",
                chemical_used="LIOC Ultra Toilet & Ceramic Descaler",
                dilution_ratio="Direct around rim / 1:10 for wall splash tiles",
                application_method="Apply along rim, allow 3-minute dwell time, scrub with nylon brush, flush and dry fixtures.",
                safety_gear="Chemical-resistant nitrile gloves, eye safety goggles",
            ),
            HousekeepingSOP(
                frequency="Daily Evening Shift (18:00 - 20:00)",
                shift="Evening Shift",
                area="Elevators, Conference Rooms & Reception Lounge",
                chemical_used="LIOC Jasmine Bloom / Litchi Ambient Spray",
                dilution_ratio="Ready-to-use fine mist trigger spray",
                application_method="Mist into high-air-flow zones 1 meter away from upholstery. Refill hand wash dispensers.",
                safety_gear="Standard housekeeping apron",
            ),
            HousekeepingSOP(
                frequency="Weekly Deep Cycle (Saturday / Sunday)",
                shift="Night / Maintenance Shift",
                area="Heavy Traffic Grooves, Staircases & Food Prep Zones",
                chemical_used="LIOC Pink Floor Soap & KitchenMaster Degreaser",
                dilution_ratio="1:20 in warm water for heavy grease",
                application_method="Floor scrubber or hard deck brush scrub. Dwell for 5 mins, squeegee water, and clean mop.",
                safety_gear="Heavy-duty rubber boots, long PVC gloves",
            ),
        ]

        summary = (
            f"Based on your {req.floor_area_sqft:,.0f} sq.ft. {facility_label.lower()} with "
            f"{req.units_count} active operational units and {req.restrooms_count} washrooms, "
            f"your facility requires approximately {total_concentrate_litres:.0f} Litres of concentrated formulations monthly. "
            f"By switching directly to LIOC manufacturer wholesale supply, you reduce your chemical budget by "
            f"{savings_percentage}%—saving an estimated ₹{monthly_savings:,.0f} every month (₹{annual_savings:,.0f} annually)."
        )

        recommended_slugs = [item.product_slug for item in all_items]

        return FacilityAuditResponse(
            audit_id=audit_id,
            facility_type_label=facility_label,
            floor_area_sqft=req.floor_area_sqft,
            units_count=req.units_count,
            restrooms_count=req.restrooms_count,
            footfall_multiplier=multiplier,
            total_monthly_concentrate_litres=total_concentrate_litres,
            total_ready_solution_litres=total_ready_solution_litres,
            zones=zones,
            roi=roi,
            sops=sops,
            executive_summary=summary,
            recommended_product_slugs=list(set(recommended_slugs)),
        )

    def submit_audit_lead(self, lead_in: AuditLeadSubmit) -> LeadSubmissionResponse:
        """
        Saves the generated audit report as an audited quote lead in the database,
        dispatches customer confirmation with audit details, and alerts sales team.
        """
        if not self.repo:
            raise RuntimeError("Database session not available in AuditorService")

        # Convert audit submission to QuoteRequest with source AI_AUDITOR
        quote_in = QuoteCreate(
            full_name=lead_in.full_name,
            company_name=lead_in.company_name,
            phone_number=lead_in.phone_number,
            email=lead_in.email,
            business_type="AI Virtual Hygiene Audit Lead",
            city=lead_in.city,
            product_interested_in="Institutional Chemical Audit & Bulk Supply Package",
            estimated_quantity=f"Audit ID: {lead_in.audit_id}",
            monthly_requirement="Full Facility Consumption Plan",
            message=f"AI Audit Ref: {lead_in.audit_id}. Customer requested institutional chemical supply proposal. Notes: {lead_in.additional_notes or 'None'}",
            source="AI_AUDITOR",
            turnstile_token=lead_in.turnstile_token,
        )

        quote = self.repo.create_quote(quote_in)
        # Use existing reference ID from quote for tracking
        audit_ref = quote.reference_id

        # Dispatch internal team alert & customer email confirmation
        email_service.send_quote_notification(quote)
        email_service.send_quote_customer_confirmation(quote)

        return LeadSubmissionResponse(
            success=True,
            message="Your facility hygiene audit report and institutional quote request have been logged. A confirmation email with your Reference ID has been sent, and our technical chemical engineer will reach out to you shortly.",
            reference_id=audit_ref,
        )
