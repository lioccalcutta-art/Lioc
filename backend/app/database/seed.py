import sys
from sqlalchemy.orm import Session
from backend.app.database.session import engine, SessionLocal
from backend.app.database.base import Base
from backend.app.models.category import ProductCategory
from backend.app.models.industry import Industry, product_industries
from backend.app.models.product import Product, ProductImage
from backend.app.core.config import settings


def seed_database(force_reseed: bool = False):
    if settings.ENVIRONMENT.lower() == "production" and force_reseed:
        print("[NOTICE] force_reseed disabled in PRODUCTION environment to protect catalog data.")
        force_reseed = False

    print("Creating/verifying database tables...")
    Base.metadata.create_all(bind=engine)

    db: Session = SessionLocal()
    try:
        if force_reseed:
            print("Force reseed enabled. Clearing existing catalog data...")
            db.execute(product_industries.delete())
            db.query(ProductImage).delete()
            db.query(Product).delete()
            db.query(ProductCategory).delete()
            db.query(Industry).delete()
            db.commit()
        elif db.query(ProductCategory).first():
            print("Database already contains seed data. Skipping seed.")
            return

        print("Seeding Categories...")
        categories = [
            ProductCategory(
                name="Floor Cleaners & Surface Care",
                slug="floor-cleaners",
                description="Commercial-grade formulations for marble, vitrified tiles, granite, epoxy, and heavy foot-traffic floors.",
                icon="Sparkles",
                image_url="/images/categories/floor-care.jpg",
                display_order=1,
            ),
            ProductCategory(
                name="Toilet & Washroom Hygiene",
                slug="toilet-washroom",
                description="Heavy-duty descalers, disinfectant bowl cleaners, urinal cakes, and odor control blocks.",
                icon="Droplets",
                image_url="/images/categories/washroom.jpg",
                display_order=2,
            ),
            ProductCategory(
                name="Air Fresheners & Deodorizers",
                slug="air-fresheners",
                description="Long-lasting ambient air perfumes, botanical trigger sprays, and room deodorizing solutions.",
                icon="Wind",
                image_url="/images/categories/air-care.jpg",
                display_order=3,
            ),
            ProductCategory(
                name="Kitchen & Degreaser Solutions",
                slug="kitchen-degreasers",
                description="Food-service safe heavy grease cutters, concentrated dishwashing liquids, and kitchen surface sanitizers.",
                icon="Flame",
                image_url="/images/categories/kitchen.jpg",
                display_order=4,
            ),
            ProductCategory(
                name="Hand Hygiene & Sanitization",
                slug="hand-hygiene",
                description="Antibacterial foaming and lotion hand washes, conditioning bulk soaps, and dispenser refills.",
                icon="ShieldCheck",
                image_url="/images/categories/hand-hygiene.jpg",
                display_order=5,
            ),
            ProductCategory(
                name="Hotel Guest Amenities & Personal Care",
                slug="guest-amenities",
                description="Individually packaged guest soaps, dental kits, shower caps, linen, and complete hospitality supplies.",
                icon="Building2",
                image_url="/images/categories/guest-amenities.jpg",
                display_order=6,
            ),
            ProductCategory(
                name="Housekeeping Tools & Cleaning Equipment",
                slug="cleaning-tools",
                description="Commercial 360Â° spin mops, Kentucky loop mops, brooms, buckets, and janitorial hardware.",
                icon="Wrench",
                image_url="/images/categories/tools.jpg",
                display_order=7,
            ),
            ProductCategory(
                name="Facility Maintenance & Pest Defense",
                slug="pest-control",
                description="Institutional pest defense sprays, mosquito vaporisers, industrial chemicals, and power supplies.",
                icon="Shield",
                image_url="/images/categories/pest.jpg",
                display_order=8,
            ),
        ]
        db.add_all(categories)
        db.commit()

        print("Seeding Industries...")
        industries = [
            Industry(
                name="Hotels, Motels & Guest Houses",
                slug="hotels-guest-houses",
                tagline="Flawless room presentation, spotless washrooms, and luxury guest aromas.",
                description="Hospitality hygiene requires consistent five-star guest comfort, crystal clean bathroom ceramics, lingering natural fragrance, and reliable single-use guest amenities.",
                key_challenges="High guest turnover, water hardness stains on sanitaryware, lingering food & dampness odors, extensive floor maintenance.",
                recommended_solutions="Lioc White Herbal Floor Cleaner, Lioc Jasmine & Sandal Air Fresheners, Luvlink Hotel Guest Soaps, Hotel Dental & Amenities Kits.",
                icon="Building2",
                image_url="/images/industries/hotel.jpg",
                display_order=1,
            ),
            Industry(
                name="Restaurants, Cafes & Cloud Kitchens",
                slug="restaurants-cafes",
                tagline="Commercial food-safety compliance and heavy grease elimination.",
                description="Food service operations face intense oil vapor, greasy fryers, slippery kitchen tiles, and stringent FSSAI hygiene standards.",
                key_challenges="Burnt grease on cookware, slippery kitchen floors, odor control during rush hours, fast dish turnaround.",
                recommended_solutions="Lioc Ultra Dishwash Liquid, Lioc Heavy-Duty Pink Floor Soap, Caustic Soda Flakes, Commercial Pest Shield Spray.",
                icon="UtensilsCrossed",
                image_url="/images/industries/restaurant.jpg",
                display_order=2,
            ),
            Industry(
                name="Corporate Offices & IT Parks",
                slug="corporate-offices",
                tagline="Impeccable workplace cleanliness and elevated employee wellness.",
                description="Modern corporate spaces need streak-free glass partitions, fresh air in conference halls, and well-stocked hygienic restrooms with high-capacity dispensers.",
                key_challenges="Fingerprints on glass, high-traffic washroom odor, carpet/staircase dirt, continuous soap replenishment.",
                recommended_solutions="Lioc White Floor Cleaner, Finch Rose Hand Wash 5L, Lioc Air Fresheners, SaniFresh Urinal Cubes, 10 on 10 Toilet Rolls.",
                icon="Briefcase",
                image_url="/images/industries/office.jpg",
                display_order=3,
            ),
            Industry(
                name="Schools, Colleges & Universities",
                slug="schools-colleges",
                tagline="Safe, non-hazardous germ protection for high-density student facilities.",
                description="Educational campuses require dependable daily disinfection with gentle, surface-safe formulations for classrooms, corridors, and student washrooms.",
                key_challenges="High contagion risk, heavy corridor dust/mud, high student washroom usage.",
                recommended_solutions="Lioc White Disinfectant Floor Cleaner, Finch Antibacterial Hand Wash, Lioc Ultra Toilet Descaler, Bleaching Powder Disinfectant.",
                icon="GraduationCap",
                image_url="/images/industries/school.jpg",
                display_order=4,
            ),
            Industry(
                name="Hospitals, Clinics & Healthcare",
                slug="hospitals-healthcare",
                tagline="Hospital-grade disinfection, infection control, and sterile clean standards.",
                description="Healthcare institutions demand rigorous pathogen control, surface-safe disinfection, patient room deodorization, and hypoallergenic hygiene supplies.",
                key_challenges="Cross-contamination risks, bio-burden reduction, high sanitization frequency, sensitive patient zones.",
                recommended_solutions="Lioc White Herbal Disinfectant Floor Cleaner, Finch Antibacterial Hand Wash, Commercial 360Â° Spin Mop, Bleaching Powder.",
                icon="ShieldCheck",
                image_url="/images/industries/hospital.jpg",
                display_order=5,
            ),
            Industry(
                name="Commercial & Facility Management",
                slug="facility-management",
                tagline="High-yield bulk concentrates engineered for professional cleaning crews.",
                description="Contract cleaners and facility managers require reliable bulk supply, high dilution ratios for cost efficiency, and heavy-duty formulations for large areas.",
                key_challenges="Controlling per-sq-ft cleaning cost, inventory stock-outs, staircase and basement mud marks.",
                recommended_solutions="Lioc Heavy-Duty Pink Floor Soap, Commercial 360 Spin Mops, Kentucky Loop Mops, Caustic Soda Flakes, Kingson Naphthalene Balls.",
                icon="Factory",
                image_url="/images/industries/facility.jpg",
                display_order=6,
            ),
            Industry(
                name="Residential & Modern Homes",
                slug="residential-homes",
                tagline="Safe, fragrant, and deep cleansing protection for homes and residences.",
                description="Premium residential estates, villas, and apartments benefit from professional-strength formulations that are safe for pets, children, and marble floors.",
                key_challenges="Stubborn floor stains, bathroom scaling, foul drain odor, insect/bug deterrence.",
                recommended_solutions="Lioc White Herbal Floor Cleaner, LIOC Exotic Air Fresheners, Good Knight Flash Vaporiser, Kingson Naphthalene Balls.",
                icon="Sparkles",
                image_url="/images/industries/residential.jpg",
                display_order=7,
            ),
        ]
        db.add_all(industries)
        db.commit()

        cats = {c.slug: c for c in db.query(ProductCategory).all()}
        inds = {i.slug: i for i in db.query(Industry).all()}

        print("Seeding Complete Product Catalog (28 Products) with Photos...")
        products = [
            # ==========================================
            # 1. FLOOR CLEANERS & SURFACE CARE
            # ==========================================
            Product(
                name="LIOC White Herbal Disinfectant Floor Cleaner (5L)",
                slug="lioc-white-herbal-floor-cleaner-5l",
                sku="LIOC-WFC-5L",
                category=cats["floor-cleaners"],
                short_description="High-potency herbal white floor cleaner with natural pine extracts that removes stubborn stains, cleans and shines, and naturally keeps insects away.",
                full_description="""LIOC White Herbal Disinfectant Floor Cleaner is a flagship manufactured formulation engineered for both commercial institutions and modern households. Infused with pure herbal pine oils and high-grade cleansing surfactants, it effortlessly cuts through grease, dust, mud, and bathroom stains while leaving an ultra-fresh pine aroma.

Its multi-action formula cleans, shines, disinfects, and acts as a natural deterrent against flies, mosquitoes, and insects. Perfectly safe for Italian marble, granite, ceramic tiles, vitrified floors, and linoleum.""",
                product_image="/images/products/lioc-white-floor-cleaner-5l-lifestyle.jpeg",
                available_sizes="5 Litres Can, 20 Litres Jerry Can, 50 Litres Drum, 200 Litres Barrel",
                usage_instructions="Daily Mopping: Dilute 1 cup (30-50ml) in 4-5 Litres of water. Mop the floor evenly. No post-rinse required.\nHeavy Soil / Stains: Apply with mild dilution (1:5) directly onto stained area, dwell for 3 minutes, scrub lightly and mop clean.",
                benefits="Natural Herbal Pine formulation with powerful insect & bug deterrent action\nLeaves brilliant streak-free gloss and extra shine on marble & tiles\nNeutral pH, surface-safe and non-corrosive for daily institutional use",
                safety_information="For external floor use only. Shake well before use. Keep out of reach of children and pets.",
                technical_information="Appearance: Milky White Emulsion Liquid\nFragrance: Herbal Pine Fresh\nActive Ingredient: High-Purity Pine Oil & Surfactants\npH: 7.0 - 7.5\nDilution: 1:100 to 1:150",
                status="ACTIVE",
                is_featured=True,
                is_bestseller=True,
                display_order=1,
                industries=[inds["hospitals-healthcare"], inds["hotels-guest-houses"], inds["corporate-offices"], inds["schools-colleges"], inds["facility-management"], inds["residential-homes"]],
                images=[
                    ProductImage(image_url="/images/products/lioc-white-floor-cleaner-5l-lifestyle.jpeg", alt_text="LIOC White Herbal Floor Cleaner 5L Lifestyle Presentation", display_order=1, is_primary=True),
                    ProductImage(image_url="/images/products/lioc-white-floor-cleaner-5l-infographic.jpeg", alt_text="LIOC White Floor Cleaner Multi-Place Infographic", display_order=2, is_primary=False),
                ],
            ),
            Product(
                name="LIOC Heavy-Duty Liquid Floor Soap (Pink - 5L)",
                slug="lioc-heavy-duty-pink-floor-soap-5l",
                sku="LIOC-LFS-5L",
                category=cats["floor-cleaners"],
                short_description="Heavy-duty concentrated pink liquid floor soap that eradicates tough dirt, black foot-traffic stains, and monsoon rain marks with a lasting floral fragrance.",
                full_description="""LIOC Heavy-Duty Pink Liquid Floor Soap is a high-solids floor detergent specially manufactured for demanding commercial spaces with high footfalls. Its advanced surfactant matrix penetrates deeply into porous tile grooves, staircases, and textured surfaces to dissolve tough dirt, grime, black scuffs, and water marks.""",
                product_image="/images/products/lioc-liquid-floor-soap-pink-5l.jpeg",
                available_sizes="5 Litres Can, 20 Litres Jerry Can, 50 Litres Drum",
                usage_instructions="For Tough Stains & Rain Marks: Apply directly onto stained area. Leave for 5-10 minutes. Scrub gently with a nylon brush, then rinse with water.\nRoutine Mopping: Mix 50ml per 5 Litres of water.",
                benefits="Tough on stubborn dirt, grease, and rain tracking marks\nFormulated safe for expensive floorings, granite, and polished tiles\nRich foaming action lifts ground-in dirt without damaging grout",
                safety_information="For external use only. Keep away from children. Store in a cool, dry area.",
                technical_information="Appearance: Translucent Bright Pink Viscous Liquid\npH: 7.5 - 8.5\nActive Matter: Cleaning Agents, Surfactants, Essence, Preservatives",
                status="ACTIVE",
                is_featured=True,
                is_bestseller=True,
                display_order=2,
                industries=[inds["facility-management"], inds["corporate-offices"], inds["schools-colleges"], inds["restaurants-cafes"], inds["hotels-guest-houses"]],
                images=[
                    ProductImage(image_url="/images/products/lioc-liquid-floor-soap-pink-5l.jpeg", alt_text="LIOC Heavy-Duty Liquid Floor Soap Pink 5L", display_order=1, is_primary=True),
                    ProductImage(image_url="/images/products/lioc-liquid-floor-soap-pink-5l-lifestyle.jpeg", alt_text="LIOC Pink Floor Soap Staircase Cleaning Lifestyle", display_order=2, is_primary=False),
                ],
            ),
            Product(
                name="Industrial Caustic Soda Flakes (Sodium Hydroxide 99% - 1kg / 25kg / 50kg)",
                slug="industrial-caustic-soda-flakes",
                sku="CHEM-CSF-PKG",
                category=cats["floor-cleaners"],
                short_description="High-purity solid white caustic soda flakes for commercial drain unclogging, grease saponification, industrial floor degreasing, and soap manufacturing.",
                full_description="""Commercial Grade Caustic Soda Flakes (Sodium Hydroxide NaOH > 99%) is an industrial chemical agent used for clearing choked drainage pipes, dissolving stubborn fats, grease traps, kitchen oil lines, and heavy-duty grease stripping on factory floors and commercial kitchen drains.""",
                product_image="/images/products/industrial-caustic-soda-flakes.jpeg",
                available_sizes="1 kg Bag, 25 kg Bag, 50 kg Drum",
                usage_instructions="Drain Clearing: Dissolve 100-200g slowly in 1 Litre of cold water. Pour down drain, let react for 20 minutes, flush with hot water. Wear protective gear.",
                benefits="99% concentrated high-alkalinity grease dissolver\nInstant action on organic drain blockages and fat encrustations\nVersatile utility for industrial floor degreasing and laundry formulation",
                safety_information="CORROSIVE. Wear rubber gloves, safety goggles, and face shield. Never add water to flakes directly; always add flakes slowly to cold water.",
                technical_information="Chemical Formula: NaOH (Sodium Hydroxide)\nPurity: 99.0% Min\nAppearance: Solid White Translucent Flakes",
                status="ACTIVE",
                is_featured=False,
                is_bestseller=False,
                display_order=3,
                industries=[inds["restaurants-cafes"], inds["facility-management"], inds["hotels-guest-houses"]],
                images=[
                    ProductImage(image_url="/images/products/industrial-caustic-soda-flakes.jpeg", alt_text="Industrial Caustic Soda Flakes Bag Pack", display_order=1, is_primary=True),
                ],
            ),
            Product(
                name="Commercial Grade Bleaching Powder Disinfectant (1kg / 25kg)",
                slug="commercial-bleaching-powder-disinfectant",
                sku="CHEM-BLP-PKG",
                category=cats["floor-cleaners"],
                short_description="High-chlorine stable bleaching powder for surface sanitization, water chlorination, moss removal, hospital disinfection, and public area hygiene.",
                full_description="""Commercial Bleaching Powder (Calcium Hypochlorite / Chlorinated Lime) delivers powerful bactericidal disinfection and bleaching action. Essential for institutional water tank disinfection, outdoor floor moss removal, drain sanitization, public health vector control, and hospital deep sanitization.""",
                product_image="/images/products/commercial-bleaching-powder-disinfectant.jpeg",
                available_sizes="1 kg Pouch, 5 kg Bag, 25 kg Master Sack",
                usage_instructions="Surface Disinfection: Dissolve 50g per 10 Litres of water. Mop or spray surface, leave for 10 minutes, and rinse.\nWater Tank Disinfection: 2-5g per 1,000 Litres of water.",
                benefits="Broad spectrum pathogen and bactericidal kill\nRemoves black mold, moss, and algae from exterior concrete & drains\nCost-effective institutional public health sanitization agent",
                safety_information="Strong oxidizer. Store in a dry, well-ventilated storeroom away from acids, heat, and moisture. Wear gloves and mask.",
                technical_information="Active Ingredient: Calcium Hypochlorite / Available Chlorine 33-35%\nAppearance: Fine White Powder",
                status="ACTIVE",
                is_featured=False,
                is_bestseller=False,
                display_order=4,
                industries=[inds["hospitals-healthcare"], inds["schools-colleges"], inds["facility-management"], inds["residential-homes"]],
                images=[
                    ProductImage(image_url="/images/products/commercial-bleaching-powder-disinfectant.jpeg", alt_text="Commercial Bleaching Powder Disinfectant Pouch", display_order=1, is_primary=True),
                ],
            ),

            # ==========================================
            # 2. TOILET & WASHROOM HYGIENE
            # ==========================================
            Product(
                name="LIOC Ultra Power Thickened Toilet Cleaner (5L)",
                slug="lioc-ultra-power-toilet-cleaner-5l",
                sku="LIOC-UTC-5L",
                category=cats["toilet-washroom"],
                short_description="Thick acid-activated disinfectant toilet bowl cleaner that clings to vertical ceramic surfaces to dissolve hard water limescale, uric stains, and germs.",
                full_description="""LIOC Ultra Toilet Cleaner is an institutional descaling formulation manufactured for heavy-footfall commercial restrooms, corporate IT campuses, hospitals, and educational facilities. Its high-viscosity blue gel clings firmly to vertical bowl walls and rims, ensuring prolonged chemical dwell time to dissolve tough Kolkata hard-water mineral crusts, yellowish uric acid rings, and rust deposits.""",
                product_image="/images/products/lioc-ultra-toilet-cleaner-5l.jpeg",
                available_sizes="1 Litre Bottle, 5 Litres Can, 20 Litres Can",
                usage_instructions="1. Apply generously around the rim and inner bowl walls.\n2. Leave for 15-20 minutes.\n3. Scrub thoroughly with a toilet brush.\n4. Flush thoroughly with water.",
                benefits="High-viscosity clinging gel maximizes contact time\nEffortlessly removes tough limescale, yellow uric stains, and mineral deposits\n99.9% bactericidal germ kill for reliable sanitary compliance",
                safety_information="Contains acidic agents (Hydrochloric Acid 10-12%). Wear rubber gloves. Do not mix with bleach or chlorine products.",
                technical_information="Appearance: Deep Blue Thick Liquid\npH: 1.0 - 2.0\nActive Ingredients: Hydrochloric Acid (HCL) 10-12%, Surfactants, Fragrance",
                status="ACTIVE",
                is_featured=True,
                is_bestseller=True,
                display_order=5,
                industries=[inds["corporate-offices"], inds["hotels-guest-houses"], inds["schools-colleges"], inds["hospitals-healthcare"], inds["facility-management"]],
                images=[
                    ProductImage(image_url="/images/products/lioc-ultra-toilet-cleaner-5l.jpeg", alt_text="LIOC Ultra Thickened Toilet Cleaner 5L Deep Blue Concentrate", display_order=1, is_primary=True),
                ],
            ),
            Product(
                name="Harpic Disinfectant Floral Bathroom Cleaner (1L / 5L)",
                slug="harpic-disinfectant-bathroom-cleaner-floral",
                sku="HARP-BC-FL",
                category=cats["toilet-washroom"],
                short_description="10X better cleaning floral bathroom disinfectant liquid that eliminates 99.9% of germs, removes tough soap scum, hard water stains, and deodorizes tiles.",
                full_description="""Harpic Disinfectant Bathroom Cleaner Floral delivers 10X superior stain removal on bathroom tiles, basins, sinks, shower cubicles, and bathroom floors. Kills 99.9% of germs while infusing washrooms with a lasting, fresh floral fragrance.""",
                product_image="/images/products/harpic-disinfectant-bathroom-cleaner-floral.jpeg",
                available_sizes="500ml Bottle, 1 Litre Bottle, 5 Litres Refill Can",
                usage_instructions="Bathroom Floor & Tiles: Mix 1.5 capfuls in half a bucket of water (4L). Mop gently.\nBasins, Taps & Hard Stains: Apply undiluted on dirty surface, scrub with sponge/brush, rinse with water.",
                benefits="10X Better cleaning power on tough soap scum and water marks\nKills 99.9% of bathroom germs and bacteria\nInvigorating floral perfume keeps washroom smelling pristine",
                safety_information="For external bathroom use only. Avoid contact with eyes and skin. Do not mix with acid toilet cleaners.",
                technical_information="Form: Red Liquid Disinfectant Cleaner\nFragrance: Floral Fresh\nPackaging: Commercial 1L Bottle / 5L Bulk Can",
                status="ACTIVE",
                is_featured=False,
                is_bestseller=True,
                display_order=6,
                industries=[inds["hotels-guest-houses"], inds["corporate-offices"], inds["residential-homes"]],
                images=[
                    ProductImage(image_url="/images/products/harpic-disinfectant-bathroom-cleaner-floral.jpeg", alt_text="Harpic Disinfectant Bathroom Cleaner Floral", display_order=1, is_primary=True),
                ],
            ),
            Product(
                name="Kingson Bengal High-Purity Naphthalene Balls (500g)",
                slug="kingson-bengal-naphthalene-balls-500g",
                sku="KB-NB-500G",
                category=cats["toilet-washroom"],
                short_description="99.9% pure solid white naphthalene balls in 500g packs for urinal odor control, drain deodorization, and linen fabric moth protection.",
                full_description="""Kingson Bengal Pure Naphthalene Balls provide long-lasting, slow-sublimating odor suppression and pest protection across commercial restrooms, hotel linen closets, and storage warehouses.""",
                product_image="/images/products/naphthalene-balls-500g.jpeg",
                available_sizes="500 Grams Pack, Master Carton (50 x 500g)",
                usage_instructions="Urinals: Place 2-4 balls directly in urinal channels.\nLinen Closets: Place in breathable cloth sachets between folded blankets.",
                benefits="High-purity grade ensures slow, even sublimation for extended life\nPotent dual action: Powerful deodorizer and proven moth/insect repellent\nPrevents moisture damage and insect damage in stored linen",
                safety_information="Do not ingest. Keep out of reach of children. Store away from food items.",
                technical_information="Composition: High-Purity Refined Naphthalene (>99.5%)\nWeight: 500 Grams per pouch\nBrand: Kingson Bengal Chemical",
                status="ACTIVE",
                is_featured=False,
                is_bestseller=True,
                display_order=7,
                industries=[inds["hotels-guest-houses"], inds["facility-management"], inds["corporate-offices"], inds["residential-homes"]],
                images=[
                    ProductImage(image_url="/images/products/naphthalene-balls-500g.jpeg", alt_text="Kingson Bengal Naphthalene Balls 500g Pack", display_order=1, is_primary=True),
                ],
            ),
            Product(
                name="SaniFresh Urinal Deodorizer & Sanitizing Cubes",
                slug="sanifresh-urinal-deodorizer-cubes",
                sku="SANI-UC-PK",
                category=cats["toilet-washroom"],
                short_description="Slow-dissolving concentrated urinal deodorizing cakes that neutralize foul uric odors and prevent scale buildup in commercial restrooms.",
                full_description="""SaniFresh Toilet & Urinal Cubes are engineered for high-traffic public, commercial, and educational washrooms. Formulated with concentrated deodorizing surfactants, they dissolve gradually with every flush, breaking down uric acid encrustations while dispersing a fresh aroma.""",
                product_image="/images/products/sanifresh-urinal-toilet-cubes.jpeg",
                available_sizes="Retail Box Pack, Bulk Wholesale Master Carton (24 Boxes)",
                usage_instructions="Place 1-2 cubes directly into each urinal basin channel or drain dome. Replace when dissolved.",
                benefits="Continuous 24/7 odor combatting in high-traffic washrooms\nSlow-dissolving formulation maximizes chemical longevity\nPrevents pipe scale crystallization and blockage",
                safety_information="Wear gloves when handling. Avoid contact with skin and eyes.",
                technical_information="Form: Pressed Solid Fragrant Deodorant Blocks\nBrand: SaniFresh Toilet Cubes",
                status="ACTIVE",
                is_featured=False,
                is_bestseller=True,
                display_order=8,
                industries=[inds["corporate-offices"], inds["hotels-guest-houses"], inds["schools-colleges"], inds["facility-management"]],
                images=[
                    ProductImage(image_url="/images/products/sanifresh-urinal-toilet-cubes.jpeg", alt_text="SaniFresh Urinal Toilet Deodorizing Cubes Pack", display_order=1, is_primary=True),
                ],
            ),
            Product(
                name="10 on 10 Commercial Soft Toilet Paper Rolls (10-Roll Multi-Pack)",
                slug="10-on-10-commercial-toilet-paper-rolls",
                sku="TIS-TPR-10PK",
                category=cats["toilet-washroom"],
                short_description="Ultra-soft, highly absorbent 2-ply commercial toilet paper rolls in bulk 10-roll packs for hospitality and office restrooms.",
                full_description="""10 on 10 Commercial Toilet Paper Rolls are manufactured from 100% virgin soft-touch pulp. Each roll offers superior wet-strength, rapid dispersibility to prevent plumbing clogs, and gentle skin-friendly softness. Packaged in convenient, dust-proof 10-roll bundles for hotel housekeeping and corporate restroom supply.""",
                product_image="/images/products/commercial-toilet-paper-rolls-10pack.jpeg",
                available_sizes="1 Pack = 10 Rolls, Master Carton (10 Packs = 100 Rolls)",
                usage_instructions="Install in standard wall-mounted tissue dispensers. Tear along perforated line.",
                benefits="100% Virgin pulp formulation, gentle and lint-free\nRapid flush dispersibility protects sewage plumbing\nEconomical commercial multi-pack bundle",
                safety_information="Store bulk packs in dry linen storerooms.",
                technical_information="Ply: 2-Ply Soft Embossed\nPack Count: 10 Rolls per Pack\nBrand: 10 on 10 Tissues",
                status="ACTIVE",
                is_featured=False,
                is_bestseller=True,
                display_order=9,
                industries=[inds["corporate-offices"], inds["hotels-guest-houses"], inds["restaurants-cafes"], inds["schools-colleges"]],
                images=[
                    ProductImage(image_url="/images/products/commercial-toilet-paper-rolls-10pack.jpeg", alt_text="10 on 10 Tissues 10-Roll Toilet Paper Multi-Pack", display_order=1, is_primary=True),
                ],
            ),

            # ==========================================
            # 3. AIR FRESHENERS & DEODORIZERS
            # ==========================================
            Product(
                name="LIOC Jasmine Bloom Commercial Air Freshener (200ml / Pack of 5)",
                slug="lioc-jasmine-bloom-air-freshener-200ml",
                sku="LIOC-AFJ-200",
                category=cats["air-fresheners"],
                short_description="Fine-mist botanical Jasmine air freshener spray pack engineered to eliminate foul odors and impart a rich, long-lasting natural floral fragrance.",
                full_description="""LIOC Jasmine Bloom Air Freshener is manufactured to elevate indoor air ambiance across hotels, corporate executive suites, reception areas, and luxury washrooms. Featuring fine-mist trigger spray atomization, it releases microscopic aromatic droplets that suspend in the air to neutralize dampness, smoke, and stuffy odors instantly.""",
                product_image="/images/products/lioc-jasmine-bloom-air-freshener-200ml.jpeg",
                available_sizes="200ml Trigger Spray, 5-Pack Box (5 x 200ml), 5 Litres Bulk Refill Can",
                usage_instructions="Hold spray bottle upright 30cm away from surfaces. Press trigger 2-3 times directed towards center and upper corners of room.",
                benefits="Instant odor neutralizer and fresh jasmine aroma enhancer\nFine trigger mist delivers even dispersion and extended air suspension\nNon-aerosol, eco-friendly water-based formula without propellant gases",
                safety_information="For ambient air use only. Do not spray directly into eyes or face.",
                technical_information="Appearance: Clear Liquid\nFragrance Note: Natural Jasmine Bloom\nNet Content: 200ml per bottle\nMfd By: LIOC",
                status="ACTIVE",
                is_featured=True,
                is_bestseller=True,
                display_order=10,
                industries=[inds["hotels-guest-houses"], inds["corporate-offices"], inds["facility-management"], inds["residential-homes"]],
                images=[
                    ProductImage(image_url="/images/products/lioc-jasmine-bloom-air-freshener-200ml.jpeg", alt_text="LIOC Jasmine Bloom Air Freshener 200ml Studio Bottle", display_order=1, is_primary=True),
                    ProductImage(image_url="/images/products/lioc-jasmine-bloom-air-freshener-pack5.jpeg", alt_text="LIOC Jasmine Bloom Air Freshener Pack of 5", display_order=2, is_primary=False),
                ],
            ),
            Product(
                name="LIOC Litchi Exotic Room & Air Freshener (200ml)",
                slug="lioc-litchi-exotic-air-freshener-200ml",
                sku="LIOC-AFL-200",
                category=cats["air-fresheners"],
                short_description="Sweet and refreshing exotic Litchi room spray that revitalizes stale indoor air with an elegant fruity aroma for lounges and hospitality suites.",
                full_description="""LIOC Litchi Air Freshener brings an invigorating, sweet, and uplifting exotic fruity aroma to guest rooms, restaurant waiting lounges, corporate reception foyers, and washrooms. Designed with high-performance odor-locking molecules, it encapsulates unpleasant odors from food, moisture, and air conditioning vents.""",
                product_image="/images/products/lioc-litchi-air-freshener-200ml-studio.jpeg",
                available_sizes="200ml Spray Bottle, 5 Litres Bulk Refill Can",
                usage_instructions="Spray 2-3 pumps in air toward the center of the room. Reapply every 4-6 hours.",
                benefits="Exotic sweet Litchi fruit fragrance elevates guest mood and freshness\nRapid odor encapsulation technology eliminates damp and food odors\nZero sticky residue on ambient surfaces",
                safety_information="Avoid spraying directly towards open flames or food items.",
                technical_information="Appearance: Clear Liquid\nFragrance Profile: Sweet Exotic Litchi\nQuantity: 200ml\nMfd By: LIOC",
                status="ACTIVE",
                is_featured=True,
                is_bestseller=True,
                display_order=11,
                industries=[inds["hotels-guest-houses"], inds["restaurants-cafes"], inds["corporate-offices"], inds["residential-homes"]],
                images=[
                    ProductImage(image_url="/images/products/lioc-litchi-air-freshener-200ml-studio.jpeg", alt_text="LIOC Litchi Exotic Air Freshener 200ml Studio Presentation", display_order=1, is_primary=True),
                    ProductImage(image_url="/images/products/lioc-litchi-air-freshener-200ml.jpeg", alt_text="LIOC Litchi Air Freshener Bottle", display_order=2, is_primary=False),
                ],
            ),
            Product(
                name="LIOC Sandal Exotic Room & Air Freshener (200ml)",
                slug="lioc-sandal-exotic-air-freshener-200ml",
                sku="LIOC-AFS-200",
                category=cats["air-fresheners"],
                short_description="Warm and majestic Sandalwood room spray crafted with pure sandalwood extracts for luxurious hotel reception lobbies, spas, and boardrooms.",
                full_description="""LIOC Sandal Air Freshener infuses interiors with the warm, regal, and grounding essence of sacred Indian Chandan (Sandalwood). Specially engineered for luxury hospitality environments, executive conference halls, spa retreats, and premium residential spaces where a distinguished, calming aroma is essential.""",
                product_image="/images/products/lioc-sandal-air-freshener-200ml.jpeg",
                available_sizes="200ml Spray Bottle, 5 Litres Bulk Refill Can",
                usage_instructions="Dispense 2-3 fine mist sprays in upper air corners. Suitable for air-conditioned rooms.",
                benefits="Authentic Royal Sandalwood aromatic profile\nCreates serene, premium ambiance for high-end guests\nLong-lasting water-based fine mist dispersion",
                safety_information="Do not spray into open flames or eyes.",
                technical_information="Fragrance Note: Pure Sandalwood / Chandan\nVolume: 200ml Trigger Spray\nMfd By: LIOC",
                status="ACTIVE",
                is_featured=True,
                is_bestseller=True,
                display_order=12,
                industries=[inds["hotels-guest-houses"], inds["corporate-offices"], inds["residential-homes"]],
                images=[
                    ProductImage(image_url="/images/products/lioc-sandal-air-freshener-200ml.jpeg", alt_text="LIOC Sandal Exotic Air Freshener 200ml Studio Bottle", display_order=1, is_primary=True),
                ],
            ),
            Product(
                name="LIOC Lavender Bloom Room & Air Freshener (200ml)",
                slug="lioc-lavender-bloom-air-freshener-200ml",
                sku="LIOC-AFLAV-200",
                category=cats["air-fresheners"],
                short_description="Calming French Lavender botanical air freshener spray designed to eliminate stress, deodorize guest rooms, and promote restful sleep.",
                full_description="""LIOC Lavender Bloom Air Freshener features a therapeutic floral blend derived from soothing French lavender blossoms. Formulated to neutralize stagnant indoor air, eliminate bathroom dampness, and create a tranquil, spa-like atmosphere in hotel bedrooms, lounge areas, and healthcare suites.""",
                product_image="/images/products/lioc-lavender-bloom-air-freshener-200ml.jpeg",
                available_sizes="200ml Spray Bottle, 5 Litres Bulk Refill Can",
                usage_instructions="Spray 2-3 pumps upward in room center during evening turndown or after housekeeping.",
                benefits="Calming French Lavender aroma relieves stress and fatigue\nEffective neutralizer of musty, smoky, and damp odors\nWater-based botanical mist leaves no stains",
                safety_information="Keep away from open flames. Store in a cool place.",
                technical_information="Fragrance: French Lavender Bloom\nVolume: 200ml Fine Mist Bottle\nMfd By: LIOC",
                status="ACTIVE",
                is_featured=True,
                is_bestseller=False,
                display_order=13,
                industries=[inds["hotels-guest-houses"], inds["hospitals-healthcare"], inds["residential-homes"], inds["corporate-offices"]],
                images=[
                    ProductImage(image_url="/images/products/lioc-lavender-bloom-air-freshener-200ml.jpeg", alt_text="LIOC Lavender Bloom Air Freshener 200ml Studio Bottle", display_order=1, is_primary=True),
                ],
            ),
            Product(
                name="Odonil Jasmine Fresh Aerosol Room Spray (240ml)",
                slug="odonil-jasmine-fresh-room-spray",
                sku="ODO-RS-JAS",
                category=cats["air-fresheners"],
                short_description="Instant atmospheric fragrance aerosol spray capturing natural blooming jasmine for hotel reception lobbies, conference rooms, and washrooms.",
                full_description="""Odonil Jasmine Fresh Room Spray instantly neutralizes musty and stale indoor air, filling commercial guest rooms, conference halls, and restrooms with the uplifting fragrance of blooming jasmine petals. Its fine dry-mist aerosol dispenses evenly across large square footage without wetting floors or furnishings.""",
                product_image="/images/products/room-spray-jasmine-fresh.jpeg",
                available_sizes="240ml Aerosol Can, Master Pack of 12",
                usage_instructions="Shake well before use. Hold can upright, point nozzle upward, and press spray button for 2-3 seconds.",
                benefits="Instant room refreshment transforms indoor ambiance in seconds\nNatural Jasmine floral notes provide a calming and luxurious atmosphere\nFine dry mist will not cause staining on upholstery",
                safety_information="Pressurized container. Protect from sunlight and heat.",
                technical_information="Net Content: 240ml\nFragrance: Natural Jasmine Fresh\nForm: Fine Aerosol Spray",
                status="ACTIVE",
                is_featured=False,
                is_bestseller=False,
                display_order=14,
                industries=[inds["hotels-guest-houses"], inds["corporate-offices"], inds["residential-homes"]],
                images=[
                    ProductImage(image_url="/images/products/room-spray-jasmine-fresh.jpeg", alt_text="Odonil Jasmine Fresh Aerosol Room Spray", display_order=1, is_primary=True),
                    ProductImage(image_url="/images/products/odonil-jasmine-fresh-room-spray-single.jpeg", alt_text="Odonil Jasmine Fresh Room Spray Can Packshot", display_order=2, is_primary=False),
                ],
            ),
            Product(
                name="Odonil Aerosol Room Spray Assorted Range (4-Pack: Lavender, Rose, Jasmine, Citrus)",
                slug="odonil-room-spray-assorted-4pack",
                sku="ODO-RS-4PK",
                category=cats["air-fresheners"],
                short_description="Multi-fragrance commercial aerosol room spray collection featuring Lavender Mist, Rose Garden, Jasmine Fresh, and Citrus Fresh.",
                full_description="""Odonil 4-Fragrance Commercial Aerosol Pack offers complete aromatic versatility for multi-floor hotels, corporate campuses, and banquet halls. Includes Lavender Mist for bedrooms, Jasmine Fresh for lobbies, Rose Garden for suites, and Citrus Fresh for dining and washrooms.""",
                product_image="/images/products/odonil-room-spray-assorted-4pack.jpeg",
                available_sizes="4 x 240ml Cans Box Set, Wholesale Master Carton",
                usage_instructions="Use different fragrance cans for specific facility zones for tailored guest sensory experiences.",
                benefits="4 distinct signature fragrances in a single inventory pack\nFine dry aerosol mist ensures instant airborne dispersion\nHigh-yield commercial economy pack",
                safety_information="Do not puncture or incinerate cans. Keep away from heat.",
                technical_information="Pack Contents: 4 Cans (Lavender, Rose, Jasmine, Citrus)\nVolume: 4 x 240ml = 960ml Total",
                status="ACTIVE",
                is_featured=False,
                is_bestseller=True,
                display_order=15,
                industries=[inds["hotels-guest-houses"], inds["corporate-offices"], inds["restaurants-cafes"]],
                images=[
                    ProductImage(image_url="/images/products/odonil-room-spray-assorted-4pack.jpeg", alt_text="Odonil 4-Pack Aerosol Room Spray Assorted Fragrances", display_order=1, is_primary=True),
                ],
            ),
            Product(
                name="Odonil Air Freshener Deodorizer Blocks (4-Pack Assorted: Orchid, Jasmine, Lavender, Rose)",
                slug="odonil-air-freshener-blocks-4pack",
                sku="ODO-BLK-4PK",
                category=cats["air-fresheners"],
                short_description="Continuous 45-day slow-release fragrant deodorizer blocks for guest bathrooms, wardrobes, linen rooms, and executive washrooms.",
                full_description="""Odonil Air Freshener Solid Blocks provide constant 24/7 ambient deodorization for up to 45 days. Packed with special fragrance diffuser cavities, they continuously emit enchanting floral aromas while actively neutralizing stagnant bathroom moisture odors. Includes Orchid Dew, Jasmine Mist, Lavender Meadows, and Mystic Rose.""",
                product_image="/images/products/odonil-air-freshener-blocks-4pack.jpeg",
                available_sizes="Pack of 4 Blocks (50g/75g each), Master Carton (48 Packs)",
                usage_instructions="Unwrap outer foil, place block inside hanger case, and hang on bathroom wall or wardrobe rail.",
                benefits="Guaranteed 45 days of continuous fresh fragrance release\nRequires no power, batteries, or manual spraying\nAssorted floral fragrances prevent sensory fatigue",
                safety_information="Keep out of reach of children and pets. Do not ingest.",
                technical_information="Fragrance Duration: 45 Days per block\nFragrances: Orchid Dew, Jasmine Mist, Lavender Meadows, Mystic Rose\nBrand: Odonil",
                status="ACTIVE",
                is_featured=False,
                is_bestseller=True,
                display_order=16,
                industries=[inds["hotels-guest-houses"], inds["corporate-offices"], inds["residential-homes"]],
                images=[
                    ProductImage(image_url="/images/products/odonil-air-freshener-blocks-4pack.jpeg", alt_text="Odonil 4-Pack Air Freshener Deodorizer Blocks", display_order=1, is_primary=True),
                ],
            ),

            # ==========================================
            # 4. KITCHEN & DEGREASER SOLUTIONS
            # ==========================================
            Product(
                name="LIOC Ultra Concentrated Dishwash Liquid (5L)",
                slug="lioc-ultra-concentrated-dishwash-liquid-5l",
                sku="LIOC-UDW-5L",
                category=cats["kitchen-degreasers"],
                short_description="Commercial-strength lemon fresh dishwashing liquid concentrate that cuts heavy oil and baked food grease while remaining gentle on hands.",
                full_description="""LIOC Ultra Dishwash Liquid is an institutional-grade degreasing formula manufactured for busy commercial kitchens, hotel culinary suites, restaurant dish pits, and catering establishments. Packed with grease-cutting active agents, a single capful effortlessly dissolves stubborn cooking fats, burnt-on food residue, curry stains, and oil films from stainless steel cookware, glassware, and crockery.""",
                product_image="/images/products/lioc-ultra-dishwash-liquid-5l.jpeg",
                available_sizes="5 Litres Can, 20 Litres Can, 50 Litres Drum",
                usage_instructions="Routine Dishwashing: Dilute 1 teaspoon (5ml) in a small bowl of water. Dip sponge, squeeze to generate rich foam, and scrub.\nHeavy Grease: Apply directly onto wet utensil, soak 2 minutes, and rinse.",
                benefits="Tough on heavy cooking oil, ghee, and grease; soft on dishwasher hands\nStreak-free rinsing leaves crystal glassware shining\nLemon fresh formula neutralizes pungent odors",
                safety_information="Keep out of reach of children. Do not ingest.",
                technical_information="Appearance: Bright Yellow Viscous Gel\npH: 6.5 - 7.5 (Skin Balanced)\nMfd By: LIOC",
                status="ACTIVE",
                is_featured=True,
                is_bestseller=True,
                display_order=17,
                industries=[inds["restaurants-cafes"], inds["hotels-guest-houses"], inds["corporate-offices"], inds["hospitals-healthcare"]],
                images=[
                    ProductImage(image_url="/images/products/lioc-ultra-dishwash-liquid-5l.jpeg", alt_text="LIOC Ultra Dishwash Liquid 5L Studio Can", display_order=1, is_primary=True),
                    ProductImage(image_url="/images/products/lioc-ultra-dishwash-liquid-5l-lifestyle.jpeg", alt_text="LIOC Ultra Dishwash Commercial Kitchen Action", display_order=2, is_primary=False),
                ],
            ),

            # ==========================================
            # 5. HAND HYGIENE & SANITIZATION
            # ==========================================
            Product(
                name="Finch Antibacterial Rose Foam Hand Wash (5L Refill)",
                slug="finch-antibacterial-rose-hand-wash-5l",
                sku="FINCH-HW-5L",
                category=cats["hand-hygiene"],
                short_description="High-reach foam antibacterial hand wash lotion infused with rose essence and skin moisturizers for institutional dispensers.",
                full_description="""Finch Rose Antibacterial Hand Wash is a premium commercial hand soap formulation distributed in high-capacity 5-Litre refill cans for corporate, hospitality, and educational facility dispensers. Engineered with rich foaming surfactants and skin-conditioning emollients, it cleanses away 99.9% of bacteria without stripping moisture.""",
                product_image="/images/products/finch-hand-wash-rose-5l.jpeg",
                available_sizes="5 Litres Can, 20 Litres Can",
                usage_instructions="Pour directly into automatic or manual wall-mounted dispensers. Dispense 1 pump onto wet hands, lather 20 seconds, rinse thoroughly.",
                benefits="Feathery soft feel with high-reach rich foaming action\nRose Feels Alive soothing fragrance\nEnriched with skin emollients to prevent dryness",
                safety_information="For external skin use only. Avoid contact with eyes.",
                technical_information="Appearance: Pearlized Soft Pink Liquid\nFragrance: Rose Floral\npH: 5.5 - 6.5\nPackaging: 5 Litres Bulk Can",
                status="ACTIVE",
                is_featured=True,
                is_bestseller=True,
                display_order=18,
                industries=[inds["corporate-offices"], inds["hotels-guest-houses"], inds["schools-colleges"], inds["hospitals-healthcare"], inds["restaurants-cafes"]],
                images=[
                    ProductImage(image_url="/images/products/finch-hand-wash-rose-5l.jpeg", alt_text="Finch Antibacterial Rose Hand Wash 5L Refill Can", display_order=1, is_primary=True),
                ],
            ),

            # ==========================================
            # 6. HOTEL GUEST AMENITIES & PERSONAL CARE
            # ==========================================
            Product(
                name="Luvlink Hotel Guest Amenities Mini Soaps (10g / Bulk Boxes)",
                slug="luvlink-hotel-guest-amenities-mini-soaps-10g",
                sku="LUV-GS-10G",
                category=cats["guest-amenities"],
                short_description="Individually flow-wrapped 10g guest cleansing mini soap bars in bulk wholesale packs (600 / 432 pcs) for hotels, guest houses, and hospitals.",
                full_description="""Luvlink Mini Guest Soaps provide the ideal hygienic, single-use cleansing solution for hotel bathrooms, guest houses, nursing homes, and transit accommodations. Available in fresh Green, Pink, and White varieties, each 10-gram bar is individually sealed in moisture-proof packaging for maximum hygiene.""",
                product_image="/images/products/hotel-guest-soap-pink-10g.jpeg",
                available_sizes="1 Box = 600 Pieces (Pink / Green), 1 Bag = 432 Pieces (White)",
                usage_instructions="Place on bathroom vanity tray for single guest stay.",
                benefits="Superior foaming with captivating fresh fragrance\nConveniently sized 10g bars minimize wastage\nIndividually flow-wrapped moisture-resistant packaging",
                safety_information="For external body and hand cleansing. Store bulk cartons in a dry linen storeroom.",
                technical_information="Bar Weight: 10 Grams each\nFormulation: Pure Grade 1 Toilet Soap Noodles\nCarton Quantities: 600 pcs/box (Pink/Green) or 432 pcs/bag (White)",
                status="ACTIVE",
                is_featured=True,
                is_bestseller=True,
                display_order=19,
                industries=[inds["hotels-guest-houses"], inds["hospitals-healthcare"], inds["residential-homes"]],
                images=[
                    ProductImage(image_url="/images/products/hotel-guest-soap-pink-10g.jpeg", alt_text="Luvlink Hotel Guest Soap Pink 10g (Box of 600)", display_order=1, is_primary=True),
                    ProductImage(image_url="/images/products/hotel-guest-soap-green-10g.jpeg", alt_text="Luvlink Mini Guest Soap Green 10g", display_order=2, is_primary=False),
                    ProductImage(image_url="/images/products/hotel-guest-soap-white-10g.jpeg", alt_text="Luvlink Mini Guest Soap White 10g (Bag of 432)", display_order=3, is_primary=False),
                ],
            ),
            Product(
                name="Hotel Guest Dental Kit (Standard Box Pack & Individual Flow Wrap)",
                slug="hotel-guest-dental-kit-standard",
                sku="AMEN-DK-STD",
                category=cats["guest-amenities"],
                short_description="Complete single-use guest oral hygiene kit featuring a full-sized toothbrush and branded Anchor/Colgate toothpaste in a sleek presentation box.",
                full_description="""Hotel Guest Dental Kits provide visiting guests with premium single-use oral care hygiene. Each kit includes a full-grip ergonomic toothbrush with soft end-rounded bristles and a sealed tube of branded Anchor/Colgate toothpaste (8g/11g). Available in clean white duplex boxes or hygienic transparent flow-wrap pouches for guest room vanity placement.""",
                product_image="/images/products/hotel-guest-dental-kit-box.jpeg",
                available_sizes="1 Carton = 500 Kits (Boxed / Flow-Wrap)",
                usage_instructions="Place beside washbasin on guest amenities tray.",
                benefits="Individually boxed for pristine 5-star room aesthetics\nIncludes branded fluoride toothpaste with protective seal\nHigh-density soft nylon bristles ensure gentle gum cleaning",
                safety_information="For oral hygiene use. Single guest stay use.",
                technical_information="Kit Includes: 1 Toothbrush (18cm) + 1 Toothpaste Tube (Anchor/Colgate 8g)\nPackaging: White Printed Duplex Box / Poly Sealed Wrap",
                status="ACTIVE",
                is_featured=True,
                is_bestseller=True,
                display_order=20,
                industries=[inds["hotels-guest-houses"], inds["hospitals-healthcare"]],
                images=[
                    ProductImage(image_url="/images/products/hotel-guest-dental-kit-box.jpeg", alt_text="Hotel Guest Dental Kit with Box and Anchor Toothpaste", display_order=1, is_primary=True),
                    ProductImage(image_url="/images/products/hotel-guest-dental-kit-vertical.jpeg", alt_text="Hotel Dental Kit Vertical Presentation", display_order=2, is_primary=False),
                    ProductImage(image_url="/images/products/hotel-guest-dental-kit-flowwrap.jpeg", alt_text="Hotel Dental Kit Flow-Wrap Packaging", display_order=3, is_primary=False),
                ],
            ),
            Product(
                name="Hotel Eco-Friendly Bamboo Dental Kit (Kraft Box)",
                slug="hotel-bamboo-dental-kit-eco",
                sku="AMEN-DK-ECO",
                category=cats["guest-amenities"],
                short_description="Sustainable 100% biodegradable natural bamboo toothbrush paired with Colgate toothpaste in an eco-kraft presentation box for green resorts.",
                full_description="""Eco-Friendly Bamboo Dental Kit is designed for sustainable boutique hotels, heritage resorts, and environmentally conscious guest houses. Featuring a 100% biodegradable polished bamboo handle with charcoal-infused soft bristles and a Colgate toothpaste tube in a recyclable kraft paper box.""",
                product_image="/images/products/hotel-bamboo-dental-kit-eco.jpeg",
                available_sizes="1 Carton = 250 Kits (Kraft Box)",
                usage_instructions="Place in eco-friendly vanity tray for luxury resort guests.",
                benefits="100% Natural biodegradable bamboo handle\nPlastic-free kraft paper packaging elevates eco-resort branding\nSoft charcoal-infused antibacterial bristles",
                safety_information="Store in dry storeroom away from excessive humidity.",
                technical_information="Handle Material: 100% Natural Bamboo Wood\nBristles: Charcoal Infused Ultra-Soft Nylon\nPackaging: Kraft Paper Box",
                status="ACTIVE",
                is_featured=False,
                is_bestseller=True,
                display_order=21,
                industries=[inds["hotels-guest-houses"], inds["residential-homes"]],
                images=[
                    ProductImage(image_url="/images/products/hotel-bamboo-dental-kit-eco.jpeg", alt_text="Hotel Eco-Friendly Bamboo Dental Kit with Colgate", display_order=1, is_primary=True),
                ],
            ),
            Product(
                name="Hotel Disposable Elastic Shower Caps (Waterproof & Eco-Pouch)",
                slug="hotel-disposable-shower-caps",
                sku="AMEN-SC-PK",
                category=cats["guest-amenities"],
                short_description="High-elasticity waterproof polyethylene guest shower caps in hygienic single-use pouches for luxury bathroom amenities.",
                full_description="""Hotel Disposable Shower Caps provide superior water-resistant protection to keep hair completely dry during bathing. Made from tear-resistant, optimized tensile PE film with a flexible elastic band that fits comfortably over all hair lengths and volumes. Available in standard clear pouches and recyclable eco-paper packaging.""",
                product_image="/images/products/hotel-disposable-shower-caps-waterproof.jpeg",
                available_sizes="Master Carton = 1,000 Pieces (Individually Sealed)",
                usage_instructions="Expand pleated cap and slip over hair before showering.",
                benefits="100% Waterproof optimized PE material with durable tensile stretch\nHygienically packed in compact individual vanity pouches\nUniversal elastic fit for all hair lengths",
                safety_information="For external hair protection. Keep away from small children.",
                technical_information="Material: High-Grade Polyethylene (PE)\nBand: High-Elasticity Double Stitched Band\nPackaging: Clear Seal Pouch / Eco Paper Pouch",
                status="ACTIVE",
                is_featured=False,
                is_bestseller=True,
                display_order=22,
                industries=[inds["hotels-guest-houses"], inds["hospitals-healthcare"]],
                images=[
                    ProductImage(image_url="/images/products/hotel-disposable-shower-caps-waterproof.jpeg", alt_text="Hotel Disposable Shower Caps 4-Panel Infographic", display_order=1, is_primary=True),
                    ProductImage(image_url="/images/products/hotel-disposable-shower-caps-eco.jpeg", alt_text="Hotel Shower Cap Eco-Friendly Recyclable Pouch", display_order=2, is_primary=False),
                ],
            ),
            Product(
                name="Hotel Guest Grooming & Amenities Travel Kit (7-in-1 / 9-in-1 Luxury Set)",
                slug="hotel-guest-grooming-amenities-kit",
                sku="AMEN-KIT-LUX",
                category=cats["guest-amenities"],
                short_description="Comprehensive luxury hospitality vanity kit containing toothbrush, toothpaste, comb, razor, shave gel, shampoo, and soap.",
                full_description="""Hotel Guest Grooming & Amenities Kit is a complete, turnkey guest hospitality kit engineered for boutique hotels, executive suites, VIP guest houses, and hospital private rooms. Includes essential single-use grooming accessories in an attractive, organized travel pack.""",
                product_image="/images/products/hotel-guest-amenities-grooming-kit-7in1.jpeg",
                available_sizes="Master Carton = 100 Kits / 250 Kits",
                usage_instructions="Place on bathroom vanity tray or VIP welcome hamper.",
                benefits="Complete 7-in-1 / 9-in-1 guest care solution\nElevates hotel guest satisfaction and online review ratings\nTurnkey hospitality supply ready for instant room turnover",
                safety_information="Keep out of reach of infants.",
                technical_information="Kit Components: Toothbrush (18cm), Toothpaste (8g), Comb (19cm), Razor, Embassy Shave Gel, Trino Shampoo (15ml), Soap (12g)\nPackaging: Waterproof Zip Pouch / Presentation Box",
                status="ACTIVE",
                is_featured=True,
                is_bestseller=True,
                display_order=23,
                industries=[inds["hotels-guest-houses"], inds["hospitals-healthcare"]],
                images=[
                    ProductImage(image_url="/images/products/hotel-guest-amenities-grooming-kit-7in1.jpeg", alt_text="Hotel Guest Grooming Kit 7-in-1 Components", display_order=1, is_primary=True),
                    ProductImage(image_url="/images/products/hotel-guest-amenities-kit-lifestyle.jpeg", alt_text="Hotel Amenities Kit Lifestyle Presentation with Towel", display_order=2, is_primary=False),
                    ProductImage(image_url="/images/products/hotel-guest-amenities-kit-real.jpeg", alt_text="Hotel Guest Amenities Real Packaging Overview", display_order=3, is_primary=False),
                ],
            ),
            Product(
                name="Hotel Luxury Linen & Bedding Master Collection",
                slug="hotel-luxury-linen-bedding-collection",
                sku="LIN-MST-COL",
                category=cats["guest-amenities"],
                short_description="Institutional 300+ TC luxury hospitality linen collection: satin stripe bed sheets, duvet quilts, plush bath towels, bathrobes, and bed runners.",
                full_description="""Hotel Luxury Linen Master Collection supplies hotels, resorts, and premium guest houses with five-star institutional bedding and bath textiles. Engineered with high-tensile 100% combed cotton, our linen withstands commercial laundering cycles while maintaining silky softness and crisp white appearance.

Full Range Includes:
- Bed Sheets with 2 Pillow Covers (King, Queen, Single)
- Decorative Bed Runners (Style 1, 2, 3)
- Microfiber Duvet / Quilts & Duvet Covers
- Thermal Blankets & Plush Pillow Inserts
- Fitted Sheets & Flat Sheets
- Heavyweight Bath Towels, Hand Towels, Face Towels
- Luxury Bath Mats, Bathrobes, Room Slippers & Table Linen.""",
                product_image="/images/products/hotel-luxury-linen-collection-infographic.jpeg",
                available_sizes="Custom Institutional Bulk Sizing (Single, Double, Queen, King)",
                usage_instructions="Launder at 60Â°C with non-chlorine institutional detergent. Tumble dry on medium heat.",
                benefits="300+ Thread Count 100% combed cotton for 5-star guest comfort\nReinforced selvages and hemmed borders for high-temperature laundry durability\nComplete coordinated collection for entire bedroom and bath setup",
                safety_information="Wash before first guest use.",
                technical_information="Fabric: 100% Combed Cotton / Satin Stripe Percale (300-400 TC)\nTowel GSM: 500-650 GSM High-Absorbency Ring-Spun Cotton\nFinish: Optical White / Mercerized",
                status="ACTIVE",
                is_featured=True,
                is_bestseller=True,
                display_order=24,
                industries=[inds["hotels-guest-houses"], inds["hospitals-healthcare"], inds["residential-homes"]],
                images=[
                    ProductImage(image_url="/images/products/hotel-luxury-linen-collection-infographic.jpeg", alt_text="Hotel Luxury Linen Collection Complete Master Infographic", display_order=1, is_primary=True),
                ],
            ),
            Product(
                name="Hotel Amenities All-In-One Master Collection (21-Item Hospitality Supply)",
                slug="hotel-amenities-all-in-one-master-collection",
                sku="AMEN-MST-21",
                category=cats["guest-amenities"],
                short_description="Complete 21-item institutional hotel guest amenity inventory: mini toiletries, vanity kits, grooming items, room accessories, and linen.",
                full_description="""Hotel Amenities All-In-One Master Collection provides hotel procurement managers and housekeeping supervisors with a single unified catalog for all guest-facing supplies.

Includes 21 Essential Items:
1. Shampoo & Conditioner (30ml/50ml)
2. Body Wash & Body Lotion
3. Dispenser Hand Wash & Bath Soaps
4. Shaving Cream & Shaving Gel
5. Toothbrush & Toothpaste Dental Kits
6. Ergonomic Razors & Combs
7. Disposable Shower Caps & Cotton Buds
8. Vanity Kits & Sanitary Bags
9. Sewing Kits & Shoe Shine Sponges
10. Laundry Bags & Tissue Boxes
11. Room Air Freshener Sprays & Deodorants
12. Luxury Slippers, Lip Balms & Nail Files
13. Facial Tissues, Bath Salts & Bath Sponges.""",
                product_image="/images/products/hotel-amenities-all-in-one-master-collection.jpeg",
                available_sizes="Institutional Master Cartons & Customized Hotel Branding Packs",
                usage_instructions="Coordinate room replenishments using housekeeping room service carts.",
                benefits="Single-vendor consolidation saves procurement time and shipping cost\nConsistent five-star branding across all guest touchpoints\nDirect wholesale bulk rates for hotel chains and resorts",
                safety_information="Store in clean, dry facility linen rooms.",
                technical_information="Total Items: 21 Certified Hospitality Standard Products\nCustomization: Private Label Hotel Logo Printing Available (MOQ Applies)",
                status="ACTIVE",
                is_featured=True,
                is_bestseller=True,
                display_order=25,
                industries=[inds["hotels-guest-houses"], inds["hospitals-healthcare"]],
                images=[
                    ProductImage(image_url="/images/products/hotel-amenities-all-in-one-master-collection.jpeg", alt_text="Hotel Amenities All-In-One Master Collection 21-Item Catalog", display_order=1, is_primary=True),
                ],
            ),

            # ==========================================
            # 7. HOUSEKEEPING TOOLS & CLEANING EQUIPMENT
            # ==========================================
            Product(
                name="Commercial 360-Degree Rotating Microfiber Spin Mop System",
                slug="commercial-360-spin-mop-system",
                sku="LIOC-MOP-360",
                category=cats["cleaning-tools"],
                short_description="Heavy-duty commercial spin mop with stainless steel telescopic handle and 360-degree rotating super-absorbent microfiber head.",
                full_description="""The Commercial 360Â° Rotating Spin Mop System is built for professional housekeeping staff in corporate towers, hospitals, hotel corridors, and restaurants. Featuring a reinforced stainless steel telescopic rod with an ergonomic grip lock and a 360-degree swivel joint, it glides under low furniture, deep into tight corners, and along baseboards with zero wrist strain.""",
                product_image="/images/products/commercial-360-spin-mop.jpeg",
                available_sizes="Complete Mop Set (Handle + Head), Replacement Microfiber Heads (Pack of 5)",
                usage_instructions="Attach microfiber head securely. Adjust pole height and lock. Dip in bucket, spin to wring excess moisture, and mop in smooth figure-8 motion.",
                benefits="360Â° rotational maneuverability reaches deep under desks and counters\nStainless steel telescopic shaft resists bending and corrosion\nMachine-washable and reusable mop heads reduce long-term consumable costs",
                safety_information="Rinse and dry microfiber head after daily mopping shifts.",
                technical_information="Shaft Material: Heavy-Duty Stainless Steel\nMop Head: 100% Ultra-Fine Microfiber (Machine Washable)\nRotation: Full 360Â° Articulating Swivel Disc",
                status="ACTIVE",
                is_featured=False,
                is_bestseller=True,
                display_order=26,
                industries=[inds["corporate-offices"], inds["hotels-guest-houses"], inds["hospitals-healthcare"], inds["restaurants-cafes"], inds["facility-management"]],
                images=[
                    ProductImage(image_url="/images/products/commercial-360-spin-mop.jpeg", alt_text="Commercial 360 Degree Microfiber Spin Mop with Stainless Steel Handle", display_order=1, is_primary=True),
                    ProductImage(image_url="/images/products/commercial-360-spin-mop-system.jpeg", alt_text="Commercial Spin Mop Handle and 2 Refill Heads", display_order=2, is_primary=False),
                ],
            ),
            Product(
                name="Commercial Kentucky Loop-End Wet String Mop & Refills System",
                slug="commercial-kentucky-loop-end-string-mop",
                sku="MOP-KY-STD",
                category=cats["cleaning-tools"],
                short_description="Heavy-duty long-handle Kentucky loop-end cotton string mop with sturdy plastic socket clamp for high-traffic hallway and lobby mopping.",
                full_description="""Commercial Kentucky Loop-End String Mop is the industry workhorse for hospital corridors, airport concourses, school hallways, and warehouse floor maintenance. Features high-absorbency looped-end cotton yarn that will not fray, snag, or leave lint strands behind. Paired with a heavy-duty polymer socket clamp and powder-coated steel handle.""",
                product_image="/images/products/commercial-kentucky-loop-end-string-mop.jpeg",
                available_sizes="Complete Mop (Handle + Yarn Head 350g/450g), Replacement Cotton Heads",
                usage_instructions="Secure mop yarn into socket clamp. Dip in wringer bucket, press wringer lever, and mop in wide S-patterns.",
                benefits="Looped-end design prevents fraying and covers 2x more floor area per stroke\nHeavy cotton yarn absorbs over 4x its weight in dirty water\nHeavy-duty screw socket makes head replacement fast and tool-free",
                safety_information="Hang mop upside down to dry after daily shift to prevent mildew.",
                technical_information="Yarn: 4-Ply Looped-End Cotton & Poly Blend (350g / 450g)\nSocket: High-Impact Polypropylene Clamp\nHandle: 140cm Reinforced Steel Rod",
                status="ACTIVE",
                is_featured=False,
                is_bestseller=True,
                display_order=27,
                industries=[inds["facility-management"], inds["hospitals-healthcare"], inds["schools-colleges"], inds["corporate-offices"]],
                images=[
                    ProductImage(image_url="/images/products/commercial-kentucky-loop-end-string-mop.jpeg", alt_text="Commercial Kentucky Loop-End Floor String Mops", display_order=1, is_primary=True),
                    ProductImage(image_url="/images/products/commercial-round-cotton-mop-refill.jpeg", alt_text="Commercial Round Cotton Mop Refill Head Socket", display_order=2, is_primary=False),
                ],
            ),
            Product(
                name="Gala No Dust Floor Broom & Coconut Grass Sweeping Brooms",
                slug="gala-no-dust-floor-broom",
                sku="BRM-GALA-ND",
                category=cats["cleaning-tools"],
                short_description="Flagship Gala No Dust synthetic fiber broom and traditional heavy-duty coconut grass brooms for dry sweeping indoor and outdoor surfaces.",
                full_description="""Gala No Dust Broom utilizes engineered micro-split synthetic fibers that capture microscopic dust particles without shedding grass dust (bhusa). Leaves floors spotless in a single stroke. Paired with our heavy-duty traditional coconut grass broom for rough outdoor verandas, staircases, and wet courtyard sweeping.""",
                product_image="/images/products/gala-no-dust-floor-broom.jpeg",
                available_sizes="Gala No Dust Broom (Single/Pack of 6), Traditional Coconut Grass Broom",
                usage_instructions="Sweep in smooth, even strokes towards dustpan. Rinse synthetic bristles under tap when soiled.",
                benefits="Zero grass dust shedding from day one\nStep-cut design sweeps deep along baseboards and corners\nLong ergonomic handle reduces back strain during sweeping",
                safety_information="Store hanging upright to preserve bristle shape.",
                technical_information="Fiber: Specially Formulated Synthetic Micro-Bristles (Gala) / Natural Coconut Stalks\nHandle: Ergonomic Ribbed Polymer Handle\nBrand: Gala / LIOC Commercial Tools",
                status="ACTIVE",
                is_featured=False,
                is_bestseller=True,
                display_order=28,
                industries=[inds["corporate-offices"], inds["hotels-guest-houses"], inds["residential-homes"], inds["facility-management"]],
                images=[
                    ProductImage(image_url="/images/products/gala-no-dust-floor-broom.jpeg", alt_text="Gala No Dust Floor Broom with Long Handle", display_order=1, is_primary=True),
                    ProductImage(image_url="/images/products/traditional-coconut-grass-broom.jpeg", alt_text="Heavy-Duty Traditional Coconut Grass Sweeping Broom", display_order=2, is_primary=False),
                ],
            ),
            Product(
                name="Milton Heavy-Duty Housekeeping Buckets & Utility Mugs Set",
                slug="milton-heavy-duty-plastic-bucket-mugs",
                sku="PLAS-BKT-18L",
                category=cats["cleaning-tools"],
                short_description="High-density virgin plastic 18L mopping bucket and ergonomic 1L bathroom utility mugs set for commercial housekeeping crews.",
                full_description="""Milton Commercial Heavy-Duty Mopping Buckets are moulded from 100% virgin impact-resistant polymer designed to endure rigorous daily cleaning operations. Features a reinforced steel/plastic handle with grip channel, broad pouring lip, and graduated volume marks. Accompanied by commercial curved-grip bathroom mugs.""",
                product_image="/images/products/milton-heavy-duty-plastic-bucket.jpeg",
                available_sizes="18 Litres Bucket, 25 Litres Bucket, 1 Litre Utility Mug (Pink / Blue)",
                usage_instructions="Use for floor cleaner dilution, mopping wringing, and bathroom maintenance.",
                benefits="Crack-resistant virgin polymer stands up to commercial chemical exposure\nSturdy ergonomic handle ensures secure transport when filled with water\nWide mouth accommodates all standard spin mops and loop mops",
                safety_information="Rinse bucket after chemical floor washing.",
                technical_information="Capacity: 18 Litres Bucket / 1000ml Mug\nMaterial: 100% Virgin Polypropylene (PP)\nBrand: Milton",
                status="ACTIVE",
                is_featured=False,
                is_bestseller=False,
                display_order=29,
                industries=[inds["facility-management"], inds["hotels-guest-houses"], inds["residential-homes"], inds["corporate-offices"]],
                images=[
                    ProductImage(image_url="/images/products/milton-heavy-duty-plastic-bucket.jpeg", alt_text="Milton Heavy-Duty Plastic Housekeeping Bucket", display_order=1, is_primary=True),
                    ProductImage(image_url="/images/products/commercial-utility-bathroom-mugs-set.jpeg", alt_text="Commercial Bathroom Utility Mugs Pink and Blue", display_order=2, is_primary=False),
                ],
            ),

            # ==========================================
            # 8. FACILITY MAINTENANCE & PEST DEFENSE
            # ==========================================
            Product(
                name="Commercial Pest Shield Anti-Roach Aerosol Spray",
                slug="commercial-pest-shield-anti-roach-spray",
                sku="HIT-AR-SP",
                category=cats["pest-control"],
                short_description="Fast-acting insecticidal aerosol spray with precision deep-reach nozzle to eliminate cockroaches and crawling pests in commercial kitchens.",
                full_description="""Commercial Pest Shield Anti-Roach Spray provides rapid knockdown and prolonged residual barrier protection against cockroaches, silverfish, and crawling insects in food preparation zones, hotel storage rooms, and facility maintenance basements.""",
                product_image="/images/products/pest-control-anti-roach-spray.jpeg",
                available_sizes="320ml Aerosol Can, 625ml Large Commercial Can",
                usage_instructions="Attach precision nozzle straw. Spray directly into cockroach hiding spotsâ€”under kitchen sinks, behind refrigerators, gas cylinder corners, drain pipes, and cabinet hinges.",
                benefits="Instant knockdown formulation destroys crawling insects on contact\nExtendable nozzle reaches narrow cracks and hidden nesting crevices\nResidual barrier formula prevents re-infestation for up to 4-6 weeks",
                safety_information="Pressurized container. Flammable. Keep away from flames. Do not inhale spray mist.",
                technical_information="Active Ingredients: Synthetic Pyrethroid Micro-Mist\nForm: Pressurized Aerosol Spray with Target Nozzle Straw",
                status="ACTIVE",
                is_featured=False,
                is_bestseller=False,
                display_order=30,
                industries=[inds["restaurants-cafes"], inds["hotels-guest-houses"], inds["facility-management"], inds["corporate-offices"]],
                images=[
                    ProductImage(image_url="/images/products/pest-control-anti-roach-spray.jpeg", alt_text="Commercial Pest Shield Anti-Roach Aerosol Spray Can", display_order=1, is_primary=True),
                ],
            ),
            Product(
                name="Godrej Good Knight Flash Liquid Mosquito Vaporiser & Twin Refill Pack",
                slug="godrej-goodknight-flash-mosquito-vaporiser",
                sku="GK-FL-VP",
                category=cats["pest-control"],
                short_description="High-potency electronic mosquito vaporiser with Flash Mode and 2-pack long-lasting liquid refills for hotel rooms and offices.",
                full_description="""Godrej Good Knight Flash Liquid Vaporiser provides complete dual-mode mosquito defense across hotel guest rooms, corporate workspaces, hospital wards, and residences. Featuring a smart electronic heating device with Flash Mode for rapid 30-minute vapor bursts during peak mosquito hours, paired with long-lasting twin liquid refill bottles.""",
                product_image="/images/products/godrej-goodknight-flash-liquid-vaporiser-machine.jpeg",
                available_sizes="Machine + 1 Refill Pack, Twin Refill Pack (2 x 45ml)",
                usage_instructions="Insert refill bottle into machine, screw tight, and plug into 230V AC socket. Switch to Flash mode during evening hours for rapid knockdown.",
                benefits="Dual mode operation: Normal Mode for all-night protection, Flash Mode for instant knockdown\nRefills fit all standard electronic vaporiser machines\nSafe, non-irritating floral vapor approved for indoor room use",
                safety_information="Keep out of reach of children. Do not cover machine while plugged in.",
                technical_information="Active Ingredient: Transfluthrin 0.88% w/w\nRefill Duration: 60 Nights per 45ml bottle (8 hours/night)\nBrand: Godrej Good Knight",
                status="ACTIVE",
                is_featured=False,
                is_bestseller=True,
                display_order=31,
                industries=[inds["hotels-guest-houses"], inds["corporate-offices"], inds["residential-homes"], inds["hospitals-healthcare"]],
                images=[
                    ProductImage(image_url="/images/products/godrej-goodknight-flash-liquid-vaporiser-machine.jpeg", alt_text="Godrej Good Knight Flash Liquid Vaporiser Machine Pack", display_order=1, is_primary=True),
                    ProductImage(image_url="/images/products/godrej-goodknight-flash-refills-twin-pack.jpeg", alt_text="Godrej Good Knight Flash 2 Refills Twin Pack", display_order=2, is_primary=False),
                ],
            ),
            Product(
                name="Duracell Ultra AA Alkaline Batteries (12-Pack Card)",
                slug="duracell-ultra-aa-alkaline-batteries-12pack",
                sku="BAT-DUR-AA12",
                category=cats["pest-control"],
                short_description="1.5V long-lasting AA alkaline batteries for hotel electronic RFID door locks, automatic washroom fragrance dispensers, TV remotes, and clocks.",
                full_description="""Duracell Ultra AA Alkaline Batteries deliver dependable, long-lasting 1.5V power engineered for commercial hospitality and institutional electronic devices. Designed with 2X longer-lasting power and 10-year storage shelf-life, these batteries prevent unexpected lockouts in hotel electronic door keycard locks, wall soap dispensers, automated air fresheners, and TV remotes.""",
                product_image="/images/products/duracell-aa-alkaline-batteries-12pack.jpeg",
                available_sizes="12-Pack Card, Master Box (12 x 12 = 144 Batteries)",
                usage_instructions="Insert into battery compartment observing correct +/- polarity.",
                benefits="2X Longer-lasting power reduces hotel maintenance battery replacement cycles\nSuperior anti-leakage seal protects expensive electronic door locks and dispensers\n10-Year ambient power preservation in inventory storage",
                safety_information="Do not recharge or dispose of in fire. Insert with correct polarity.",
                technical_information="Chemistry: Alkaline Manganese Dioxide (Zn/MnO2)\nVoltage: 1.5 Volts\nSize: AA / LR6\nBrand: Duracell",
                status="ACTIVE",
                is_featured=False,
                is_bestseller=True,
                display_order=32,
                industries=[inds["hotels-guest-houses"], inds["corporate-offices"], inds["facility-management"], inds["residential-homes"]],
                images=[
                    ProductImage(image_url="/images/products/duracell-aa-alkaline-batteries-12pack.jpeg", alt_text="Duracell AA Alkaline Batteries 12-Pack Card", display_order=1, is_primary=True),
                ],
            ),
        ]

        db.add_all(products)
        db.commit()

        print(f"Database seeding completed successfully! Seeded {len(products)} products across {len(categories)} categories and {len(industries)} industries.")
    except Exception as e:
        db.rollback()
        print(f"Error seeding database: {e}")
        raise e
    finally:
        db.close()


if __name__ == "__main__":
    force = "--force" in sys.argv or True
    seed_database(force_reseed=force)

