import json
import logging
from typing import List, Optional, Dict, Any
import httpx
from sqlalchemy.orm import Session, joinedload
from backend.app.core.config import settings
from backend.app.models.product import Product
from backend.app.models.category import ProductCategory

logger = logging.getLogger("lioc.ai_service")

SYSTEM_PROMPT = f"""You are the official LIOC AI Chat Support Specialist representing {settings.COMPANY_NAME} ({settings.COMPANY_ADDRESS}).
LIOC is an industrial and commercial cleaning chemicals, disinfectants, and institutional hygiene products manufacturer providing factory-direct pricing across Kolkata and Eastern India.

Your Responsibilities:
1. Help commercial clients (Hotels, Hospitals, Restaurants, Schools, Corporate Offices, Facility Managers) find the right products.
2. Provide exact dilution ratios, application SOPs, and surface safety instructions (e.g., explain why acid should NEVER be used on Italian marble/granite; how to use Caustic Soda for grease traps; how to dilute White Herbal Floor Cleaner 1:100 for daily mopping).
3. Be professional, concise, authoritative, and helpful.
4. Suggest relevant LIOC products from the provided catalog.
5. Provide safety warnings (PPE, chemical handling, incompatibility warnings like never mixing acid with chlorine/bleach or caustic soda).

Format your response as a valid JSON object matching this exact structure:
{{
  "reply": "Clear, markdown-formatted response answering the user question thoroughly.",
  "suggested_product_slugs": ["slug-1", "slug-2"],
  "dilution_guide": {{
    "Daily Mopping": "30-50ml in 5L water (1:100)",
    "Heavy Soil": "100ml in 5L water (1:50)"
  }},
  "safety_warnings": [
    "Always wear rubber gloves when handling concentrated solutions.",
    "Do not mix with acidic cleaners."
  ],
  "suggested_questions": [
    "What is the bulk price for 50L drums?",
    "Can I request a commercial sample kit?"
  ]
}}
"""


class AISupportService:
    def __init__(self, db: Session):
        self.db = db

    def get_catalog_context(self) -> List[Dict[str, Any]]:
        """Retrieve active products from database to ground the LLM with real catalog data."""
        try:
            products = (
                self.db.query(Product)
                .options(joinedload(Product.category))
                .filter(Product.status == "ACTIVE")
                .all()
            )
            catalog = []
            for p in products:
                catalog.append({
                    "name": p.name,
                    "slug": p.slug,
                    "category": p.category.name if p.category else "Hygiene",
                    "short_description": p.short_description,
                    "usage_instructions": p.usage_instructions or "",
                    "technical_information": p.technical_information or "",
                    "safety_information": p.safety_information or "",
                    "benefits": p.benefits or "",
                    "image": p.product_image,
                })
            return catalog
        except Exception as e:
            logger.error(f"Failed to load catalog context: {e}")
            return []

    async def generate_response(self, user_message: str, facility_type: Optional[str] = None) -> Dict[str, Any]:
        """Generate response using Gemini / OpenAI LLM if configured, otherwise smart grounded fallback."""
        catalog = self.get_catalog_context()

        # 1. Try Google Gemini API if key is present
        if settings.GEMINI_API_KEY and settings.GEMINI_API_KEY.strip():
            try:
                gemini_res = await self._call_gemini(user_message, catalog, facility_type)
                if gemini_res:
                    return self._hydrate_products(gemini_res, catalog, user_message)
            except Exception as e:
                logger.warning(f"Gemini API generation failed, falling back to local engine: {e}")

        # 2. Try OpenAI API if key is present
        if settings.OPENAI_API_KEY and settings.OPENAI_API_KEY.strip():
            try:
                openai_res = await self._call_openai(user_message, catalog, facility_type)
                if openai_res:
                    return self._hydrate_products(openai_res, catalog, user_message)
            except Exception as e:
                logger.warning(f"OpenAI API generation failed, falling back to local engine: {e}")

        # 3. Grounded local intelligent response engine
        return self._grounded_local_engine(user_message, catalog, facility_type)

    async def _call_gemini(self, message: str, catalog: List[Dict[str, Any]], facility: Optional[str]) -> Optional[Dict[str, Any]]:
        api_key = settings.GEMINI_API_KEY.strip()
        url = f"https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key={api_key}"
        
        catalog_summary = "\n".join([
            f"- {p['name']} (slug: '{p['slug']}', category: '{p['category']}'): {p['short_description']}. Specs/Dilution: {p['technical_information'] or p['usage_instructions']}"
            for p in catalog[:25]
        ])

        prompt = f"""User Question: "{message}"
User Facility Context: {facility or 'Commercial / Institutional Facility'}

Available LIOC Products for reference:
{catalog_summary}

Respond with JSON only, following the required schema."""

        payload = {
            "contents": [
                {
                    "role": "user",
                    "parts": [{"text": SYSTEM_PROMPT + "\n\n" + prompt}]
                }
            ],
            "generationConfig": {
                "response_mime_type": "application/json",
                "temperature": 0.3,
            }
        }

        async with httpx.AsyncClient(timeout=15.0) as client:
            resp = await client.post(url, json=payload)
            if resp.status_code == 200:
                data = resp.json()
                text = data["candidates"][0]["content"]["parts"][0]["text"]
                return json.loads(text)
            else:
                logger.error(f"Gemini API returned error {resp.status_code}: {resp.text}")
                return None

    async def _call_openai(self, message: str, catalog: List[Dict[str, Any]], facility: Optional[str]) -> Optional[Dict[str, Any]]:
        api_key = settings.OPENAI_API_KEY.strip()
        url = "https://api.openai.com/v1/chat/completions"

        catalog_summary = "\n".join([
            f"- {p['name']} (slug: '{p['slug']}', category: '{p['category']}'): {p['short_description']}"
            for p in catalog[:25]
        ])

        payload = {
            "model": "gpt-4o-mini",
            "messages": [
                {"role": "system", "content": SYSTEM_PROMPT},
                {"role": "user", "content": f"Catalog:\n{catalog_summary}\n\nQuestion: {message}\nFacility: {facility or 'Commercial'}"}
            ],
            "response_format": {"type": "json_object"},
            "temperature": 0.3
        }

        headers = {
            "Authorization": f"Bearer {api_key}",
            "Content-Type": "application/json"
        }

        async with httpx.AsyncClient(timeout=15.0) as client:
            resp = await client.post(url, json=payload, headers=headers)
            if resp.status_code == 200:
                data = resp.json()
                text = data["choices"][0]["message"]["content"]
                return json.loads(text)
            else:
                logger.error(f"OpenAI API returned error {resp.status_code}: {resp.text}")
                return None

    def _hydrate_products(self, ai_output: Dict[str, Any], catalog: List[Dict[str, Any]], query: str) -> Dict[str, Any]:
        """Convert LLM product slugs into fully hydrated product cards."""
        slug_to_product = {p["slug"]: p for p in catalog}
        suggested_slugs = ai_output.get("suggested_product_slugs", [])
        
        products = []
        for slug in suggested_slugs:
            if slug in slug_to_product:
                p = slug_to_product[slug]
                products.append({
                    "name": p["name"],
                    "slug": p["slug"],
                    "category": p["category"],
                    "product_image": p.get("image"),
                    "reason": p["short_description"][:120] + ("..." if len(p["short_description"]) > 120 else "")
                })

        if not products and catalog:
            # Fallback to top 2 products
            products = [
                {
                    "name": catalog[0]["name"],
                    "slug": catalog[0]["slug"],
                    "category": catalog[0]["category"],
                    "product_image": catalog[0].get("image"),
                    "reason": "Popular flagship commercial hygiene product."
                }
            ]

        return {
            "reply": ai_output.get("reply", "Thank you for contacting LIOC Support."),
            "suggested_products": products,
            "dilution_guide": ai_output.get("dilution_guide"),
            "safety_warnings": ai_output.get("safety_warnings", [
                "Always check product TDS and test on an inconspicuous spot before mass application."
            ]),
            "suggested_questions": ai_output.get("suggested_questions", [
                "How do I request a commercial evaluation sample?",
                "What is the bulk price for 50L drums?",
                "Do you provide customized private labeling?"
            ]),
            "whatsapp_message": f"Hi LIOC Support Team, I asked the AI Support Chat regarding: '{query}'. Please provide factory bulk quotation and technical assistance."
        }

    def _grounded_local_engine(self, message: str, catalog: List[Dict[str, Any]], facility: Optional[str]) -> Dict[str, Any]:
        """High-precision grounded semantic engine over LIOC catalog data when external LLM API key is not yet set."""
        import re
        q = message.lower().strip()

        def has_any(keywords: List[str]) -> bool:
            for kw in keywords:
                if " " in kw:
                    if kw in q:
                        return True
                else:
                    if re.search(rf"\b{re.escape(kw)}\b", q):
                        return True
            return False

        # Score catalog items based on query match
        scored_products = []
        for p in catalog:
            text_corpus = f"{p['name']} {p['category']} {p['short_description']} {p['usage_instructions']} {p['technical_information']} {p['benefits']}".lower()
            score = 0
            for word in re.findall(r"\w+", q):
                if len(word) > 2 and word in text_corpus:
                    score += 1
            if score > 0:
                scored_products.append((score, p))

        scored_products.sort(key=lambda x: x[0], reverse=True)
        top_products = [p for _, p in scored_products[:3]]

        # Scenario 1: Marble / Granite / Flooring
        if has_any(["marble", "granite", "tile", "tiles", "vitrified", "floor", "flooring", "mopping", "yellow stain"]):
            return {
                "reply": """### Commercial Floor & Surface Care Advisory:
For **Italian Marble, Polished Granite, and Vitrified Tiles**, it is essential to use a neutral pH, surface-safe cleaner to avoid etching stone polish.

1. **Recommended Product:** **LIOC White Herbal Disinfectant Floor Cleaner (5L)**
   - **Daily Maintenance Mopping:** Dilute **30ml to 50ml** in **5 Litres** clean water (Ratio ~ 1:100).
   - **Heavy Traffic / Footmarks:** Use **LIOC Heavy-Duty Pink Floor Soap** diluted at **1:20** directly on stained grout or stairs, dwell for 3 minutes, and mop clean.
2. **Crucial Stone Protection Guideline:**
   - ⚠️ **Never use acidic toilet cleaners on marble or granite** as acid permanently destroys calcite gloss and creates dull yellow etching.""",
                "suggested_products": [
                    {
                        "name": "LIOC White Herbal Disinfectant Floor Cleaner (5L)",
                        "slug": "lioc-white-herbal-floor-cleaner-5l",
                        "category": "Floor Cleaners & Surface Care",
                        "product_image": "/images/products/lioc-white-floor-cleaner-5l-lifestyle.jpeg",
                        "reason": "pH-neutral pine formula with natural insect deterrent, safe for expensive marble."
                    },
                    {
                        "name": "LIOC Heavy-Duty Liquid Floor Soap (Pink - 5L)",
                        "slug": "lioc-heavy-duty-pink-floor-soap-5l",
                        "category": "Floor Cleaners & Surface Care",
                        "product_image": "/images/products/lioc-liquid-floor-soap-pink-5l.jpeg",
                        "reason": "Penetrates deep into tile grooves and lifts heavy dirt & monsoon stains."
                    }
                ],
                "dilution_guide": {
                    "Daily Mopping": "30-50ml in 5L water (1:100)",
                    "Heavy Foot Traffic": "100ml in 5L water (1:50)",
                    "Single-Disc Scrubbing Machine": "Dilute 1:100 with fresh water"
                },
                "safety_warnings": [
                    "Always use cool or lukewarm water for pine-oil floor cleaners.",
                    "Do not mix floor cleaners with acidic bowl cleaners."
                ],
                "suggested_questions": [
                    "What is the best dilution for hotel lobby marble?",
                    "Can we get 50L drum pricing for floor cleaners?",
                    "How to remove oily footprints in commercial kitchens?"
                ],
                "whatsapp_message": f"Hi LIOC Support Team, I need guidance regarding floor care: '{message}'. Please share product specs and factory pricing."
            }

        # Scenario 2: Drain, Grease Trap, Choke
        elif has_any(["drain", "unclog", "choke", "choked", "fat trap", "grease trap", "caustic", "pipe", "sink block"]):
            return {
                "reply": """### Commercial Drain & Grease Trap Declogging SOP:
For clearing heavy commercial kitchen oil lines, stubborn grease traps, and slow-running drains:

1. **Recommended Agent:** **Industrial Caustic Soda Flakes (99% Pure NaOH)**
2. **Standard Operating Procedure (SOP):**
   - **Step 1:** Clear standing water above drain grate.
   - **Step 2:** Slowly dissolve **150g to 250g** of Caustic Soda Flakes in **1 Litre cold water** in an industrial bucket. (⚠️ *Exothermic heat reaction; never add boiling water directly to dry flakes*).
   - **Step 3:** Pour solution directly into drain trap.
   - **Step 4:** Allow chemical action to dwell for **20 to 30 minutes** to saponify cooking oils and organic sludge.
   - **Step 5:** Flush thoroughly with 5 to 10 Litres of hot running water.
3. **Routine Prevention:** Treat kitchen grease lines once weekly after closing hours.""",
                "suggested_products": [
                    {
                        "name": "Industrial Caustic Soda Flakes (99% Purity)",
                        "slug": "industrial-caustic-soda-flakes",
                        "category": "Floor Cleaners & Surface Care",
                        "product_image": "/images/products/industrial-caustic-soda-flakes.jpeg",
                        "reason": "99% High-purity concentrated alkali that rapidly saponifies stubborn fats and grease."
                    },
                    {
                        "name": "LIOC Ultra Concentrated Dishwash Liquid (5L)",
                        "slug": "lioc-ultra-concentrated-dishwash-liquid-5l",
                        "category": "Kitchen & Degreaser Solutions",
                        "product_image": "/images/products/lioc-ultra-dishwash-liquid-5l.jpeg",
                        "reason": "High-active degreaser for daily cookware and sink maintenance."
                    }
                ],
                "dilution_guide": {
                    "Severe Choked Drain": "200g flakes dissolved in 1L cold water",
                    "Weekly Preventive Treatment": "100g flakes per 2L water",
                    "Heavy Cookware Degreasing": "Undiluted dip for 2-3 minutes"
                },
                "safety_warnings": [
                    "CORROSIVE: Always wear heavy-duty rubber gloves, eye goggles, and protective footwear.",
                    "Never mix Caustic Soda with acidic cleaners (exothermic hazardous reaction)."
                ],
                "suggested_questions": [
                    "What safety PPE is mandatory when handling Caustic Soda?",
                    "Do you supply 25kg bags and 50kg drums of Caustic Soda?",
                    "What is the best dishwashing concentrate for restaurant grease?"
                ],
                "whatsapp_message": f"Hi LIOC Support Team, I need commercial declogging advice regarding: '{message}'. Please share quotes and technical details."
            }

        # Scenario 3: Air Freshener, Fragrance, Ambiance
        elif has_any(["air freshener", "fragrance", "smell", "odor", "ac room", "conference", "lobby", "sandal", "jasmine", "lavender"]):
            return {
                "reply": """### Commercial Air Ambiance & Odor Neutralization SOP:
LIOC supplies botanical, long-lasting room fresheners and deodorizers engineered specifically for high-traffic hospitality, conference halls, and corporate washrooms:

1. **Recommended Air Freshener Lineup:**
   - **LIOC Jasmine Bloom Commercial Air Freshener (200ml / Pack of 5):** Natural floral atomization for corporate suites and reception areas.
   - **LIOC Sandal Exotic Room & Air Freshener (200ml):** Calming, regal Chandan aroma ideal for executive lounges and luxury spaces.
   - **Odonil Deodorizer Blocks (4-Pack Assorted):** Continuous 24/7 moisture and odor control for institutional washrooms (up to 45 days).
2. **Application Protocol:**
   - Spray 2-3 trigger mists towards the upper center of the room or air intake return grilles.
   - For washrooms, mount Odonil blocks away from direct water splash.""",
                "suggested_products": [
                    {
                        "name": "LIOC Jasmine Bloom Commercial Air Freshener (200ml / Pack of 5)",
                        "slug": "lioc-jasmine-bloom-air-freshener-200ml",
                        "category": "Air Fresheners & Deodorizers",
                        "product_image": "/images/products/lioc-jasmine-bloom-air-freshener-200ml.jpeg",
                        "reason": "Fine-mist floral spray engineered for high-turnover rooms and reception foyers."
                    },
                    {
                        "name": "LIOC Sandal Exotic Room & Air Freshener (200ml)",
                        "slug": "lioc-sandal-exotic-air-freshener-200ml",
                        "category": "Air Fresheners & Deodorizers",
                        "product_image": "/images/products/lioc-sandal-air-freshener-200ml.jpeg",
                        "reason": "Warm, long-lasting premium fragrance for executive suites and conference rooms."
                    }
                ],
                "dilution_guide": {
                    "Daily Room Freshening": "Ready-to-use aerosol / fine mist spray, 2-3 pumps per 150 sq.ft.",
                    "Restroom Solid Block": "1 Block per washroom stall (lasts 30-45 days)"
                },
                "safety_warnings": [
                    "Do not spray directly onto open flames, hot lighting fixtures, or polished wooden surfaces.",
                    "Keep out of reach of children."
                ],
                "suggested_questions": [
                    "Which air freshener fragrance lasts longest in AC conference rooms?",
                    "Do you supply automated battery-operated aerosol dispensers?",
                    "What bulk carton discounts are available for Odonil blocks?"
                ],
                "whatsapp_message": f"Hi LIOC Support Team, I need commercial fragrance and air freshener solutions for: '{message}'. Please provide quotes."
            }

        # Scenario 4: Hospitality Guest Amenities & Linen
        elif has_any(["hotel", "hotel amenities", "dental kit", "shower cap", "soap", "guest soap", "linen", "guest house", "amenity", "towel", "bed sheet", "shampoo", "vanity"]):
            return {
                "reply": """### Hospitality Guest Amenities & Linen Sourcing:
LIOC supplies complete turnkey guest amenities and 300+ TC luxury linen for hotels, resorts, and corporate guest houses:

1. **Guest Washroom Vanity Supplies:**
   - **Luvlink 10g Mini Guest Soaps:** Grade-1 vegetable oil soaps in Pink, Green, and White.
   - **Dental Kits:** Standard White Box Pack or Eco-Friendly 100% Bamboo with Anchor/Colgate.
   - **Disposable Shower Caps:** High-elasticity waterproof PE caps in individual vanity pouches.
2. **Turnkey 7-in-1 Grooming Kits:**
   - Toothbrush, Toothpaste, Comb, Razor, Embassy Shave Gel, Trino Shampoo (15ml), and 12g Soap.
3. **Institutional Hotel Linen (300+ TC Combed Cotton):**
   - Satin Stripe Bed Sheets with Pillow Covers, Duvet Quilts, Heavyweight 550 GSM Bath Towels, Bathrobes, and Bath Mats.""",
                "suggested_products": [
                    {
                        "name": "Hotel Guest Dental Kit (Standard Box Pack)",
                        "slug": "hotel-guest-dental-kit-standard",
                        "category": "Hotel Guest Amenities & Personal Care",
                        "product_image": "/images/products/hotel-guest-dental-kit-box.jpeg",
                        "reason": "Complete oral care kit with full-sized toothbrush and Anchor toothpaste."
                    },
                    {
                        "name": "Hotel Guest Grooming & Amenities Travel Kit (7-in-1)",
                        "slug": "hotel-guest-grooming-amenities-kit",
                        "category": "Hotel Guest Amenities & Personal Care",
                        "product_image": "/images/products/hotel-guest-amenities-grooming-kit-7in1.jpeg",
                        "reason": "All-in-one vanity grooming set ready for instant room turnovers."
                    }
                ],
                "dilution_guide": {
                    "Linen Laundering SOP": "Wash at 60°C with non-chlorine institutional detergent; tumble dry medium",
                    "Vanity Tray Replenishment": "1 Set per guest stay turnover"
                },
                "safety_warnings": [
                    "Store bulk linen and soap cartons in dry, well-ventilated storerooms."
                ],
                "suggested_questions": [
                    "Can we customize amenities packaging with our hotel logo?",
                    "What is the wholesale box quantity for 10g guest soaps?",
                    "How do I request a physical sample evaluation kit?"
                ],
                "whatsapp_message": f"Hi LIOC Support Team, I need hotel guest amenities details regarding: '{message}'. Please share sample kit availability."
            }

        # Scenario 5: Hospital, Disinfection, Sanitization
        elif has_any(["hospital", "disinfect", "disinfection", "bleaching", "chlorine", "infection", "pathogen", "clinic", "ot room", "sterilize"]):
            return {
                "reply": """### Institutional Disinfection & Pathogen Control Protocol:
LIOC supplies hospital-grade sanitizers and chlorine disinfectants compliant with strict clinical and municipal hygiene standards:

1. **Recommended Disinfection Solutions:**
   - **Commercial Grade Bleaching Powder Disinfectant (High Chlorine):** For bulk surface sanitization, drains, clinical spill control, and water tank treatment.
   - **LIOC White Herbal Disinfectant Floor Cleaner (5L):** Broad-spectrum daily antibacterial mopping with natural insect deterrence.
2. **Clinical Safety Protocol:**
   - Always prepare fresh dilution batches daily in well-ventilated areas.
   - ⚠️ **Critical Safety Warning:** Never mix chlorine bleach or bleaching powder with acidic toilet cleaners or descalers (produces hazardous chlorine gas).""",
                "suggested_products": [
                    {
                        "name": "Commercial Grade Bleaching Powder Disinfectant (1kg / 25kg)",
                        "slug": "commercial-bleaching-powder-disinfectant",
                        "category": "Floor Cleaners & Surface Care",
                        "product_image": "/images/products/commercial-bleaching-powder-disinfectant.jpeg",
                        "reason": "High-chlorine stable bleaching powder for hospital deep sanitization and water chlorination."
                    },
                    {
                        "name": "LIOC White Herbal Disinfectant Floor Cleaner (5L)",
                        "slug": "lioc-white-herbal-floor-cleaner-5l",
                        "category": "Floor Cleaners & Surface Care",
                        "product_image": "/images/products/lioc-white-floor-cleaner-5l-lifestyle.jpeg",
                        "reason": "Flagship commercial formulation for daily mopping and hospital corridor disinfection."
                    }
                ],
                "dilution_guide": {
                    "General Surface Disinfection": "50g bleaching powder per 10L clean water",
                    "Pathogen Spill / Drain Treatment": "100g bleaching powder per 5L water",
                    "Daily Disinfectant Mopping": "50ml LIOC White Herbal in 5L water"
                },
                "safety_warnings": [
                    "Wear chemical-resistant rubber gloves, mask, and protective goggles.",
                    "Never mix chlorine bleaching solutions with acidic descalers or toilet cleaners."
                ],
                "suggested_questions": [
                    "What is the available chlorine percentage in your bleaching powder?",
                    "Do you supply 25kg bulk bags for municipal and hospital contracts?",
                    "What is the recommended SOP for clinical blood spills?"
                ],
                "whatsapp_message": f"Hi LIOC Support Team, I need commercial disinfection guidance regarding: '{message}'. Please share specifications and bulk pricing."
            }

        # Dynamic fallback matching from products in catalog
        suggested = []
        if top_products:
            for p in top_products:
                suggested.append({
                    "name": p["name"],
                    "slug": p["slug"],
                    "category": p["category"],
                    "product_image": p.get("image"),
                    "reason": p["short_description"][:120] + ("..." if len(p["short_description"]) > 120 else "")
                })
        else:
            suggested = [
                {
                    "name": "LIOC White Herbal Disinfectant Floor Cleaner (5L)",
                    "slug": "lioc-white-herbal-floor-cleaner-5l",
                    "category": "Floor Cleaners & Surface Care",
                    "product_image": "/images/products/lioc-white-floor-cleaner-5l-lifestyle.jpeg",
                    "reason": "Flagship commercial formulation for daily mopping and insect deterrence."
                },
                {
                    "name": "LIOC Heavy-Duty Liquid Floor Soap (Pink - 5L)",
                    "slug": "lioc-heavy-duty-pink-floor-soap-5l",
                    "category": "Floor Cleaners & Surface Care",
                    "product_image": "/images/products/lioc-liquid-floor-soap-pink-5l.jpeg",
                    "reason": "Lifts tough foot-traffic stains and monsoon marks."
                }
            ]

        return {
            "reply": f"""### LIOC Support Advisory:
Thank you for reaching out regarding: **"{message}"**.

LIOC manufactures institutional-grade cleaning chemicals, descalers, disinfectants, and hospitality guest amenities with factory-direct pricing across Kolkata and Eastern India.

**General Guidelines:**
- **Floor & Surface Cleaning:** For marble, granite, or vitrified tiles, always use **LIOC White Herbal Disinfectant Floor Cleaner** (1:100 dilution).
- **Washroom & Scale Removal:** Use **LIOC Ultra Power Toilet Cleaner** for uric/limescale descaling or **Harpic Floral Disinfectant** for tile scuff.
- **Hospitality & Guest Care:** We supply complete 10g mini guest soaps, dental kits, shower caps, and 300+ TC luxury linen.
- **Heavy Grease & Drains:** Use **Caustic Soda Flakes (99%)** for fat traps and **LIOC Ultra Dishwash** for commercial kitchenware.

You can click any recommended product below or connect with our support team on WhatsApp for custom dilution charts or 50L+ bulk pricing!""",
            "suggested_products": suggested,
            "dilution_guide": {
                "Routine Surface Mopping": "30-50ml in 5L water (1:100)",
                "Heavy Grease / Tough Stains": "1:5 to 1:20 direct application",
                "Machine Floor Scrubbers": "1:100 to 1:150 with clean water"
            },
            "safety_warnings": [
                "Always review the Technical Data Sheet (TDS) and Material Safety Data Sheet (MSDS) before first institutional application.",
                "Do not mix chlorine bleaching solutions with acidic descalers."
            ],
            "suggested_questions": [
                "How much do I dilute White Floor Cleaner for Italian marble?",
                "What should I use to unclog a commercial kitchen fat trap?",
                "Which air freshener lasts longest in AC conference rooms?",
                "Can I download MSDS / Safety Data Sheets for audit compliance?"
            ],
            "whatsapp_message": f"Hi LIOC Support Team, I need technical guidance regarding: '{message}'. Please share product specs and institutional pricing."
        }
