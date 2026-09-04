export interface ProductComplianceDoc {
  slug: string;
  name: string;
  category: string;
  categorySlug: string;
  sku: string;
  formulationType: string;
  ghsSignalWord: "DANGER" | "WARNING" | "CAUTION" | "NON-HAZARDOUS";
  ghsPictograms: ("Corrosive" | "Exclamation" | "Flammable" | "HealthHazard" | "EcoHazard" | "Safe")[];
  productImage: string;
  
  // TDS Specifications
  tds: {
    documentId: string;
    revisionDate: string;
    version: string;
    description: string;
    keyFeatures: string[];
    technicalProperties: {
      appearance: string;
      color: string;
      odor: string;
      ph: string;
      specificGravity: string;
      solubility: string;
      shelfLife: string;
      flashPoint?: string;
    };
    dilutionMatrix: {
      application: string;
      ratio: string;
      method: string;
    }[];
    surfaceCompatibility: {
      safe: string[];
      caution: string[];
      avoid: string[];
    };
    packagingSpecs: string[];
  };

  // 16-Section GHS MSDS / SDS Specifications
  msds: {
    sdsNumber: string;
    effectiveDate: string;
    sections: {
      section1_identification: {
        productName: string;
        recommendedUse: string;
        restrictions: string;
        manufacturer: string;
        emergencyPhone: string;
      };
      section2_hazardIdentification: {
        classification: string;
        hazardStatements: string[];
        precautionaryStatements: string[];
      };
      section3_composition: {
        chemicalName: string;
        casNumber: string;
        concentration: string;
      }[];
      section4_firstAid: {
        inhalation: string;
        skinContact: string;
        eyeContact: string;
        ingestion: string;
      };
      section5_fireFighting: {
        extinguishingMedia: string;
        specificHazards: string;
        protectiveEquipment: string;
      };
      section6_accidentalRelease: {
        personalPrecautions: string;
        environmentalPrecautions: string;
        cleanUpMethods: string;
      };
      section7_handlingStorage: {
        handling: string;
        storageConditions: string;
      };
      section8_exposureControlsPPE: {
        eyeProtection: string;
        handProtection: string;
        skinProtection: string;
        respiratoryProtection: string;
      };
      section9_physicalChemical: {
        physicalState: string;
        color: string;
        odor: string;
        ph: string;
        boilingPoint: string;
        flashPoint: string;
        relativeDensity: string;
      };
      section10_stabilityReactivity: {
        reactivity: string;
        chemicalStability: string;
        incompatibleMaterials: string;
        hazardousDecomposition: string;
      };
      section11_toxicological: {
        acuteToxicity: string;
        skinCorrosion: string;
        seriousEyeDamage: string;
      };
      section12_ecological: {
        ecotoxicity: string;
        biodegradability: string;
      };
      section13_disposal: {
        wasteTreatment: string;
      };
      section14_transport: {
        unNumber: string;
        properShippingName: string;
        transportHazardClass: string;
        packingGroup: string;
      };
      section15_regulatory: {
        safetyRegulations: string;
      };
      section16_otherInfo: {
        preparedBy: string;
        nfpaRating: { health: number; flammability: number; reactivity: number };
      };
    };
  };
}

export const COMPLIANCE_DOCS: ProductComplianceDoc[] = [
  {
    slug: "lioc-white-herbal-floor-cleaner-5l",
    name: "LIOC White Herbal Disinfectant Floor Cleaner (5L)",
    category: "Floor Cleaners & Surface Care",
    categorySlug: "floor-cleaners",
    sku: "LIOC-WFC-5L",
    formulationType: "Emulsified Herbal Pine Disinfectant",
    ghsSignalWord: "CAUTION",
    ghsPictograms: ["Safe", "EcoHazard"],
    productImage: "/images/products/lioc-white-floor-cleaner-5l-lifestyle.jpeg",
    tds: {
      documentId: "TDS-LIOC-WFC-01",
      revisionDate: "August 2026",
      version: "v3.2",
      description: "High-potency herbal white floor cleaner with pure botanical pine oil extracts, non-corrosive surfactants, and natural insect deterrent agents.",
      keyFeatures: [
        "Neutral pH formulation safe for Italian marble, granite, epoxy, and vitrified tiles",
        "Natural pine oil active deterring flies, mosquitoes, and floor pests",
        "Leaves high-gloss streak-free shine without slippery residue",
        "High-yield concentration with 1:100 daily dilution economy"
      ],
      technicalProperties: {
        appearance: "Milky White Homogeneous Emulsion",
        color: "Snow White",
        odor: "Refreshing Natural Herbal Pine",
        ph: "7.0 - 7.5 (1% Solution at 25°C)",
        specificGravity: "1.01 ± 0.02 g/cm³",
        solubility: "100% Soluble in Water",
        shelfLife: "24 Months in Sealed Container",
        flashPoint: "Non-Flammable (>100°C)"
      },
      dilutionMatrix: [
        { application: "Routine Daily Mopping", ratio: "1:100 (50ml in 5L water)", method: "Apply with spin mop or Kentucky string mop. No rinsing required." },
        { application: "High Foot-Traffic Corridors", ratio: "1:50 (100ml in 5L water)", method: "Mop and allow 2 minutes contact time for disinfection." },
        { application: "Automatic Floor Scrubbers", ratio: "1:150 with clean water", method: "Add directly to scrubber solution tank." }
      ],
      surfaceCompatibility: {
        safe: ["Italian Marble", "Granite", "Vitrified Tiles", "Ceramic", "Kota Stone", "Terrazzo", "Epoxy Flooring"],
        caution: ["Unsealed Porous Sandstone (pre-test in discreet area)"],
        avoid: ["Untreated raw wood flooring"]
      },
      packagingSpecs: ["5 Litres HDPE Can with Tamper-Evident Cap", "20 Litres Jerry Can", "50 Litres Heavy-Duty Drum", "200 Litres Barrel"]
    },
    msds: {
      sdsNumber: "SDS-LIOC-WFC-2026",
      effectiveDate: "2026-08-15",
      sections: {
        section1_identification: {
          productName: "LIOC White Herbal Disinfectant Floor Cleaner",
          recommendedUse: "Commercial & Institutional Floor Cleaning and Disinfection",
          restrictions: "For external floor cleaning only. Not for human consumption.",
          manufacturer: "LIOC Chemical Manufacturing Industries, Kolkata, India",
          emergencyPhone: "+91 90074 97424 / info@lioc.in"
        },
        section2_hazardIdentification: {
          classification: "Skin Irritation Cat 3; Eye Irritation Cat 2B; Non-Hazardous to Aquatic Environment under recommended dilution.",
          hazardStatements: ["H316: Causes mild skin irritation on prolonged undiluted contact.", "H320: Causes eye irritation."],
          precautionaryStatements: ["P102: Keep out of reach of children.", "P262: Avoid contact with eyes.", "P305+P351: If in eyes, rinse cautiously with water for several minutes."]
        },
        section3_composition: [
          {
            chemicalName: "Natural Terpene Pine Oil Extract",
            casNumber: "8002-09-3",
            concentration: "10.0% - 15.0%"
          }
        ],
        section4_firstAid: {
          inhalation: "Move to fresh air. No adverse effects anticipated under normal mopping.",
          skinContact: "Wash affected area with water. Apply moisturizer if dryness occurs.",
          eyeContact: "Rinse cautiously with running water for 10-15 minutes. Remove contact lenses if easy to do.",
          ingestion: "Do NOT induce vomiting. Rinse mouth with water. Drink 1-2 glasses of milk or water. Consult physician if unwell."
        },
        section5_fireFighting: {
          extinguishingMedia: "Water spray, carbon dioxide, dry chemical powder, foam.",
          specificHazards: "Non-combustible aqueous emulsion.",
          protectiveEquipment: "Standard protective gear for surrounding fire."
        },
        section6_accidentalRelease: {
          personalPrecautions: "Slip hazard. Wear rubber boots and gloves.",
          environmentalPrecautions: "Do not flush concentrated bulk spills directly into natural watercourses.",
          cleanUpMethods: "Mop up small spills. Contain large spills with sand/earth absorbent."
        },
        section7_handlingStorage: {
          handling: "Avoid eye contact. Shake well before diluting.",
          storageConditions: "Store upright in original container in a cool, dry area away from direct sunlight (10°C - 35°C)."
        },
        section8_exposureControlsPPE: {
          eyeProtection: "Safety glasses recommended during bulk dilution transfers.",
          handProtection: "Rubber/Nitrile gloves for prolonged daily mopping.",
          skinProtection: "Standard housekeeping uniform/apron.",
          respiratoryProtection: "Not required under well-ventilated conditions."
        },
        section9_physicalChemical: {
          physicalState: "Viscous Emulsion Liquid",
          color: "Milky White",
          odor: "Natural Pine Blossom",
          ph: "7.0 - 7.5",
          boilingPoint: "> 100°C",
          flashPoint: "Non-combustible",
          relativeDensity: "1.01 g/cm³"
        },
        section10_stabilityReactivity: {
          reactivity: "Non-reactive under normal institutional storage.",
          chemicalStability: "Stable for minimum 24 months.",
          incompatibleMaterials: "Strong concentrated oxidizing acids.",
          hazardousDecomposition: "Carbon oxides under extreme fire conditions."
        },
        section11_toxicological: {
          acuteToxicity: "Oral LD50 (Rat) > 5000 mg/kg (practically non-toxic)",
          skinCorrosion: "Non-corrosive. Mild transient irritation if undiluted.",
          seriousEyeDamage: "Mild reversible eye conjunctival irritation."
        },
        section12_ecological: {
          ecotoxicity: "Biodegradable surfactants (>90% OECD 301E).",
          biodegradability: "Naturally degrades into inert water and carbon dioxide."
        },
        section13_disposal: {
          wasteTreatment: "Diluted washings can be safely discharged to institutional drainage."
        },
        section14_transport: {
          unNumber: "Not Regulated for Transport",
          properShippingName: "Liquid Cleaning Compound, Non-Hazardous",
          transportHazardClass: "N/A",
          packingGroup: "N/A"
        },
        section15_regulatory: {
          safetyRegulations: "Compliant with BIS IS 1061 / GHS Hazard Communication Standard."
        },
        section16_otherInfo: {
          preparedBy: "LIOC Quality Assurance & Chemical R&D Division",
          nfpaRating: { health: 1, flammability: 0, reactivity: 0 }
        }
      }
    }
  },
  {
    slug: "lioc-heavy-duty-pink-floor-soap-5l",
    name: "LIOC Heavy-Duty Liquid Floor Soap (Pink - 5L)",
    category: "Floor Cleaners & Surface Care",
    categorySlug: "floor-cleaners",
    sku: "LIOC-LFS-5L",
    formulationType: "High-Solids Surfactant Floor Detergent",
    ghsSignalWord: "WARNING",
    ghsPictograms: ["Exclamation"],
    productImage: "/images/products/lioc-liquid-floor-soap-pink-5l.jpeg",
    tds: {
      documentId: "TDS-LIOC-LFS-02",
      revisionDate: "August 2026",
      version: "v2.8",
      description: "Heavy-duty concentrated pink floor soap engineered for high footfall commercial corridors, staircases, and monsoon mud stain removal.",
      keyFeatures: [
        "High active surfactant matrix penetrates deep into porous tile grooves",
        "Lifts stubborn rubber shoe scuffs, oil film, and monsoon rain tracking marks",
        "Rich foaming detergent action without damaging grout lines",
        "Long-lasting fresh floral perfume"
      ],
      technicalProperties: {
        appearance: "Translucent Bright Pink Liquid",
        color: "Bright Pink",
        odor: "Fresh Floral Bouquet",
        ph: "7.5 - 8.5 (1% Solution)",
        specificGravity: "1.02 ± 0.01 g/cm³",
        solubility: "Completely Soluble",
        shelfLife: "24 Months",
        flashPoint: "None"
      },
      dilutionMatrix: [
        { application: "Routine Floor Mopping", ratio: "1:100 (50ml in 5L water)", method: "Mop evenly and air dry." },
        { application: "Staircases & Rain Mud Marks", ratio: "1:20 (250ml in 5L water)", method: "Apply, scrub with nylon brush, and mop dry." },
        { application: "Single Disc Scrubber Machine", ratio: "1:50 in machine tank", method: "Scrub with red/green floor pad." }
      ],
      surfaceCompatibility: {
        safe: ["Vitrified Tiles", "Kota Stone", "Granite", "Ceramic Tiles", "Terrazzo", "Polished Concrete"],
        caution: ["Waxed vinyl floors (high dilution only)"],
        avoid: ["Raw unsealed hardwood"]
      },
      packagingSpecs: ["5 Litres HDPE Bottle", "20 Litres Jerry Can", "50 Litres Drum"]
    },
    msds: {
      sdsNumber: "SDS-LIOC-LFS-2026",
      effectiveDate: "2026-08-15",
      sections: {
        section1_identification: {
          productName: "LIOC Heavy-Duty Liquid Floor Soap (Pink)",
          recommendedUse: "Commercial Floor Washing and Deep Cleaning",
          restrictions: "Not for food contact surfaces.",
          manufacturer: "LIOC Chemical Manufacturing Industries",
          emergencyPhone: "+91 90074 97424"
        },
        section2_hazardIdentification: {
          classification: "Eye Irritant Cat 2; Mild Skin Irritant Cat 3.",
          hazardStatements: ["H319: Causes serious eye irritation.", "H316: Causes mild skin irritation."],
          precautionaryStatements: ["P264: Wash hands thoroughly after handling.", "P280: Wear protective eye protection and gloves for undiluted solution."]
        },
        section3_composition: [
          {
            chemicalName: "Linear Alkylbenzene Sulfonate / Fatty Alcohol Ethoxylates",
            casNumber: "68411-30-3",
            concentration: "12.0% - 18.0%"
          }
        ],
        section4_firstAid: {
          inhalation: "Provide fresh air.",
          skinContact: "Rinse with soap and water.",
          eyeContact: "Rinse cautiously with water for 15 minutes. Seek medical advice if irritation persists.",
          ingestion: "Drink plenty of water. Do not induce vomiting."
        },
        section5_fireFighting: {
          extinguishingMedia: "Water spray, Dry powder, Foam.",
          specificHazards: "Non-flammable.",
          protectiveEquipment: "Standard turnout gear."
        },
        section6_accidentalRelease: {
          personalPrecautions: "Caution: Slippery floor surface.",
          environmentalPrecautions: "Prevent bulk concentrated ingress into drains.",
          cleanUpMethods: "Absorb with inert material or rinse small quantities with excess water."
        },
        section7_handlingStorage: {
          handling: "Avoid contact with eyes.",
          storageConditions: "Store in cool, ventilated area above freezing point."
        },
        section8_exposureControlsPPE: {
          eyeProtection: "Safety goggles for dispensing concentrates.",
          handProtection: "Nitrile / PVC gloves.",
          skinProtection: "Housekeeping workwear.",
          respiratoryProtection: "Not required."
        },
        section9_physicalChemical: {
          physicalState: "Liquid",
          color: "Pink",
          odor: "Floral",
          ph: "7.5 - 8.5",
          boilingPoint: "100°C",
          flashPoint: "None",
          relativeDensity: "1.02"
        },
        section10_stabilityReactivity: {
          reactivity: "Stable.",
          chemicalStability: "Stable under recommended conditions.",
          incompatibleMaterials: "Strong acids and oxidizing agents.",
          hazardousDecomposition: "None known."
        },
        section11_toxicological: {
          acuteToxicity: "Oral LD50 > 3000 mg/kg",
          skinCorrosion: "Non-corrosive",
          seriousEyeDamage: "Moderate eye irritation"
        },
        section12_ecological: {
          ecotoxicity: "Surfactants readily biodegradable.",
          biodegradability: ">90% in 28 days."
        },
        section13_disposal: {
          wasteTreatment: "Dispose of contents according to local environmental regulations."
        },
        section14_transport: {
          unNumber: "Non-regulated",
          properShippingName: "Cleaning Compound",
          transportHazardClass: "None",
          packingGroup: "None"
        },
        section15_regulatory: {
          safetyRegulations: "GHS / OSHA Hazard Communication Standard compliant."
        },
        section16_otherInfo: {
          preparedBy: "LIOC R&D Division",
          nfpaRating: { health: 1, flammability: 0, reactivity: 0 }
        }
      }
    }
  },
  {
    slug: "lioc-ultra-power-toilet-cleaner-5l",
    name: "LIOC Ultra Power Thickened Toilet Cleaner (5L)",
    category: "Toilet & Washroom Hygiene",
    categorySlug: "toilet-washroom",
    sku: "LIOC-UTC-5L",
    formulationType: "Acid-Activated Viscous Ceramic Descaler",
    ghsSignalWord: "DANGER",
    ghsPictograms: ["Corrosive", "HealthHazard"],
    productImage: "/images/products/lioc-ultra-toilet-cleaner-5l.jpeg",
    tds: {
      documentId: "TDS-LIOC-UTC-03",
      revisionDate: "August 2026",
      version: "v4.1",
      description: "Thickened acid-activated disinfectant descaler engineered to cling to vertical porcelain surfaces to dissolve Kolkata hard-water mineral encrustations and yellow uric rings.",
      keyFeatures: [
        "High-viscosity clinging formulation extends active contact dwell time",
        "Rapidly dissolves calcium, magnesium limescale, and iron rust stains",
        "99.9% Pathogen and bactericidal kill for commercial restroom sanitization",
        "Septic-tank safe when used as directed"
      ],
      technicalProperties: {
        appearance: "Thick Royal Blue Viscous Liquid",
        color: "Deep Ocean Blue",
        odor: "Characteristic Acidic Mint",
        ph: "1.0 - 2.0 (Direct Concentrate)",
        specificGravity: "1.06 ± 0.02 g/cm³",
        solubility: "100% Soluble in Water",
        shelfLife: "24 Months",
        flashPoint: "Non-Flammable"
      },
      dilutionMatrix: [
        { application: "Toilet Bowl Descaling", ratio: "Undiluted (50-80ml)", method: "Apply under rim and inner bowl walls. Dwell 15-20 min, scrub and flush." },
        { application: "Urinal Basin De-rusting", ratio: "Undiluted", method: "Apply directly on uric acid rings, scrub with toilet brush." },
        { application: "Restroom Ceramic Floor Heavy Scale", ratio: "1:10 with water", method: "Apply, scrub with nylon brush, and flush thoroughly with clean water." }
      ],
      surfaceCompatibility: {
        safe: ["Ceramic Sanitaryware", "Porcelain Toilet Bowls", "Glazed Ceramic Tiles"],
        caution: ["Chrome plated fittings (rinse immediately within 1 minute)"],
        avoid: ["Italian Marble", "Granite", "Kota Stone", "Terrazzo", "Aluminum", "Enamel"]
      },
      packagingSpecs: ["1 Litre Squeeze Duckbill Bottle", "5 Litres Heavy-Duty Acid HDPE Can", "20 Litres Drum"]
    },
    msds: {
      sdsNumber: "SDS-LIOC-UTC-2026",
      effectiveDate: "2026-08-15",
      sections: {
        section1_identification: {
          productName: "LIOC Ultra Power Thickened Toilet Cleaner",
          recommendedUse: "Institutional Restroom Ceramic Descaling & Sanitization",
          restrictions: "DO NOT use on marble, granite, or metal surfaces. NEVER mix with bleach.",
          manufacturer: "LIOC Chemical Manufacturing Industries",
          emergencyPhone: "+91 90074 97424"
        },
        section2_hazardIdentification: {
          classification: "Skin Corrosion Cat 1B; Serious Eye Damage Cat 1; Corrosive to Metals Cat 1.",
          hazardStatements: ["H314: Causes severe skin burns and eye damage.", "H290: May be corrosive to metals.", "EUH206: Warning! Do not use together with other products (may release dangerous chlorine gas)."],
          precautionaryStatements: ["P260: Do not breathe vapor.", "P280: Wear protective gloves, protective clothing, and eye/face protection.", "P301+P330+P331: IF SWALLOWED: Rinse mouth. Do NOT induce vomiting.", "P303+P361+P353: IF ON SKIN: Take off immediately all contaminated clothing. Rinse skin with water.", "P305+P351+P338: IF IN EYES: Rinse cautiously with water for several minutes."]
        },
        section3_composition: [
          {
            chemicalName: "Hydrochloric Acid (Technical Grade) & Thickening Surfactants",
            casNumber: "7647-01-0",
            concentration: "10.0% - 12.0%"
          }
        ],
        section4_firstAid: {
          inhalation: "Move to fresh air immediately. If breathing is difficult, administer oxygen and seek medical attention.",
          skinContact: "Immediately wash with copious amounts of water for at least 15 minutes. Seek medical aid for chemical burns.",
          eyeContact: "Immediately flush eyes with running water for 20 minutes holding eyelids open. Transport to ophthalmologist immediately.",
          ingestion: "Never induce vomiting. Rinse mouth with water. Drink copious amounts of water or milk. Get immediate medical attention."
        },
        section5_fireFighting: {
          extinguishingMedia: "Water spray, Carbon Dioxide, Dry Chemical.",
          specificHazards: "Contact with metals may produce flammable hydrogen gas.",
          protectiveEquipment: "Full chemical protective suit with self-contained breathing apparatus (SCBA)."
        },
        section6_accidentalRelease: {
          personalPrecautions: "Evacuate area. Wear acid-resistant PPE.",
          environmentalPrecautions: "Prevent entering waterways and drains unneutralized.",
          cleanUpMethods: "Neutralize carefully with sodium bicarbonate or lime. Mop with water."
        },
        section7_handlingStorage: {
          handling: "Handle with care. Open cap slowly. Ensure good washroom ventilation.",
          storageConditions: "Store upright in cool, dry acid-resistant storage away from direct heat and alkalis."
        },
        section8_exposureControlsPPE: {
          eyeProtection: "Chemical splash goggles / face shield mandatory.",
          handProtection: "Acid-resistant heavy-duty rubber / neoprene gloves.",
          skinProtection: "Acid-resistant PVC apron.",
          respiratoryProtection: "Ensure adequate natural or mechanical ventilation."
        },
        section9_physicalChemical: {
          physicalState: "Viscous Liquid",
          color: "Deep Blue",
          odor: "Pungent Acidic Mint",
          ph: "< 1.5",
          boilingPoint: "105°C",
          flashPoint: "Non-flammable",
          relativeDensity: "1.06"
        },
        section10_stabilityReactivity: {
          reactivity: "Highly reactive with chlorine bleach, caustics, and reactive metals.",
          chemicalStability: "Stable under recommended conditions.",
          incompatibleMaterials: "Bleach (Sodium Hypochlorite), Caustic Soda, Aluminum, Zinc.",
          hazardousDecomposition: "Toxic chlorine gas released if mixed with bleach."
        },
        section11_toxicological: {
          acuteToxicity: "Corrosive to living tissue upon contact.",
          skinCorrosion: "Causes deep tissue acid burns.",
          seriousEyeDamage: "Permanent corneal opacity / blindness risk."
        },
        section12_ecological: {
          ecotoxicity: "Harmful to aquatic organisms due to low pH shift if discharged concentrated.",
          biodegradability: "Surfactants biodegradable. Acid neutralizes in soil."
        },
        section13_disposal: {
          wasteTreatment: "Neutralize prior to sewer disposal in compliance with municipal regulations."
        },
        section14_transport: {
          unNumber: "UN 1789",
          properShippingName: "HYDROCHLORIC ACID SOLUTION",
          transportHazardClass: "8 (Corrosive)",
          packingGroup: "III"
        },
        section15_regulatory: {
          safetyRegulations: "Regulated hazardous chemical under Indian Chemical Safety Rules."
        },
        section16_otherInfo: {
          preparedBy: "LIOC Chemical Safety Directorate",
          nfpaRating: { health: 3, flammability: 0, reactivity: 1 }
        }
      }
    }
  },
  {
    slug: "industrial-caustic-soda-flakes",
    name: "Industrial Caustic Soda Flakes (Sodium Hydroxide 99%)",
    category: "Floor Cleaners & Surface Care",
    categorySlug: "floor-cleaners",
    sku: "CHEM-CSF-PKG",
    formulationType: "High-Purity Solid Alkaline Chemical",
    ghsSignalWord: "DANGER",
    ghsPictograms: ["Corrosive", "HealthHazard"],
    productImage: "/images/products/industrial-caustic-soda-flakes.jpeg",
    tds: {
      documentId: "TDS-LIOC-CSF-04",
      revisionDate: "August 2026",
      version: "v3.0",
      description: "99% High-purity concentrated sodium hydroxide flakes engineered for commercial kitchen drain declogging, fat trap saponification, and heavy floor degreasing.",
      keyFeatures: [
        "99.0% Min purity for rapid chemical saponification of animal fats and oils",
        "Eradicates stubborn organic blockages in kitchen wastewater lines",
        "Essential chemical intermediate for industrial cleaning and soap manufacturing"
      ],
      technicalProperties: {
        appearance: "Solid White Translucent Flakes",
        color: "Pure White",
        odor: "Odorless",
        ph: "> 13.0 (1% Aqueous Solution)",
        specificGravity: "2.13 g/cm³",
        solubility: "Highly Exothermic Soluble in Water (109 g/100ml at 20°C)",
        shelfLife: "36 Months in Air-Tight Sealed Bag",
        flashPoint: "Non-combustible"
      },
      dilutionMatrix: [
        { application: "Choked Kitchen Drains", ratio: "150-250g dissolved in 1L cold water", method: "Pour down drain, dwell 20-30 min, flush with hot water." },
        { application: "Weekly Drain Maintenance", ratio: "100g per 2L cold water", method: "Pour after closing shift to prevent grease buildup." },
        { application: "Industrial Floor Degreasing", ratio: "50g per 10L warm water", method: "Scrub with heavy-duty machine, rinse with plenty of water." }
      ],
      surfaceCompatibility: {
        safe: ["Cast Iron Drainage Pipes", "PVC / HDPE Drain Pipes", "Concrete", "Stainless Steel"],
        caution: ["Porous cement grout (rinse thoroughly)"],
        avoid: ["Aluminum", "Brass", "Zinc", "Galvanized Steel", "Italian Marble"]
      },
      packagingSpecs: ["1 kg Laminated Moisture-Proof Pouch", "25 kg Heavy-Duty HDPE Bag with Inner Liner", "50 kg Steel Drum"]
    },
    msds: {
      sdsNumber: "SDS-LIOC-CSF-2026",
      effectiveDate: "2026-08-15",
      sections: {
        section1_identification: {
          productName: "Industrial Caustic Soda Flakes (Sodium Hydroxide)",
          recommendedUse: "Commercial Drain Unclogging, Industrial Degreasing, Chemical Processing",
          restrictions: "Corrosive alkali. Never handle with bare hands.",
          manufacturer: "LIOC Chemical Manufacturing Industries",
          emergencyPhone: "+91 90074 97424"
        },
        section2_hazardIdentification: {
          classification: "Skin Corrosion Cat 1A; Eye Damage Cat 1; Corrosive to Metals Cat 1.",
          hazardStatements: ["H314: Causes severe skin burns and serious eye damage.", "H290: May be corrosive to metals."],
          precautionaryStatements: ["P260: Do not breathe dust/fumes.", "P280: Wear protective gloves, protective clothing, eye protection, face shield.", "P301+P330+P331: IF SWALLOWED: Rinse mouth. Do NOT induce vomiting.", "P305+P351+P338: IF IN EYES: Rinse cautiously with water for several minutes."]
        },
        section3_composition: [
          {
            chemicalName: "Sodium Hydroxide (Caustic Soda)",
            casNumber: "1310-73-2",
            concentration: "99.0% Min"
          }
        ],
        section4_firstAid: {
          inhalation: "Remove victim to fresh air. Seek immediate medical attention.",
          skinContact: "Immediately brush off excess dry flakes, then flush skin with water for at least 30 minutes. Seek emergency medical aid.",
          eyeContact: "Immediately rinse cautiously with copious water for 30 minutes holding eyelids wide open. Transport immediately to eye hospital.",
          ingestion: "Do NOT induce vomiting. Give 1-2 cups of water or milk to drink. Seek immediate emergency medical care."
        },
        section5_fireFighting: {
          extinguishingMedia: "Use extinguishing media appropriate for surrounding fire.",
          specificHazards: "Reacts violently with water generating extreme heat. Contact with aluminum releases hydrogen gas.",
          protectiveEquipment: "Full protective chemical suit with SCBA."
        },
        section6_accidentalRelease: {
          personalPrecautions: "Keep unprotected personnel away. Avoid raising dust.",
          environmentalPrecautions: "Prevent entering public sewers or waterways.",
          cleanUpMethods: "Sweep up dry flakes with non-sparking shovel into sealed container. Neutralize residue with dilute citric acid."
        },
        section7_handlingStorage: {
          handling: "Always add flakes slowly to cold water with stirring. NEVER add water to flakes directly.",
          storageConditions: "Store in tightly closed moisture-proof bags in a dry, cool storeroom away from acids."
        },
        section8_exposureControlsPPE: {
          eyeProtection: "Chemical goggles and full-face shield mandatory.",
          handProtection: "Heavy-duty nitrile/neoprene chemical gloves.",
          skinProtection: "Chemical-resistant apron and rubber boots.",
          respiratoryProtection: "Dust mask / P2 particulate filter if dust is generated."
        },
        section9_physicalChemical: {
          physicalState: "Solid Flakes",
          color: "White",
          odor: "Odorless",
          ph: "13.5 (1% Solution)",
          boilingPoint: "1388°C",
          flashPoint: "Non-flammable",
          relativeDensity: "2.13"
        },
        section10_stabilityReactivity: {
          reactivity: "Exothermic reaction with water and acids.",
          chemicalStability: "Hygroscopic (absorbs atmospheric moisture and CO2).",
          incompatibleMaterials: "Acids, moisture, aluminum, tin, zinc.",
          hazardousDecomposition: "Sodium oxides under extreme conditions."
        },
        section11_toxicological: {
          acuteToxicity: "Highly destructive to mucosal and cutaneous tissue.",
          skinCorrosion: "Severe caustic chemical burns and deep ulceration.",
          seriousEyeDamage: "Irreversible blindness risk."
        },
        section12_ecological: {
          ecotoxicity: "High pH shift is toxic to aquatic life if unneutralized.",
          biodegradability: "Inorganic substance; neutralizes in environment."
        },
        section13_disposal: {
          wasteTreatment: "Neutralize carefully to pH 7.0 before disposal."
        },
        section14_transport: {
          unNumber: "UN 1823",
          properShippingName: "SODIUM HYDROXIDE, SOLID",
          transportHazardClass: "8 (Corrosive)",
          packingGroup: "II"
        },
        section15_regulatory: {
          safetyRegulations: "Schedule 2 hazardous industrial chemical."
        },
        section16_otherInfo: {
          preparedBy: "LIOC Chemical Safety Directorate",
          nfpaRating: { health: 3, flammability: 0, reactivity: 2 }
        }
      }
    }
  },
  {
    slug: "commercial-bleaching-powder-disinfectant",
    name: "Commercial Grade Bleaching Powder Disinfectant (1kg / 25kg)",
    category: "Floor Cleaners & Surface Care",
    categorySlug: "floor-cleaners",
    sku: "CHEM-BLP-PKG",
    formulationType: "High-Chlorine Stable Inorganic Disinfectant",
    ghsSignalWord: "DANGER",
    ghsPictograms: ["Corrosive", "EcoHazard", "Exclamation"],
    productImage: "/images/products/commercial-bleaching-powder-disinfectant.jpeg",
    tds: {
      documentId: "TDS-LIOC-BLP-05",
      revisionDate: "August 2026",
      version: "v3.1",
      description: "Stable chlorinated lime bleaching powder with 33-35% available chlorine for institutional surface disinfection, water tank chlorination, and drain sanitation.",
      keyFeatures: [
        "33% - 35% Active available chlorine delivers broad-spectrum bactericidal kill",
        "Eradicates black mold, algae, and moss from outdoor stone and concrete walkways",
        "Dependable municipal and hospital water reservoir disinfection standard"
      ],
      technicalProperties: {
        appearance: "Fine Free-Flowing White Powder",
        color: "Snow White to Light Cream",
        odor: "Strong Pungent Chlorine",
        ph: "11.0 - 12.0 (1% Slurry)",
        specificGravity: "0.80 - 0.90 g/cm³ (Bulk Density)",
        solubility: "Partially Soluble (releases active hypochlorite)",
        shelfLife: "12 Months in Moisture-Proof Packaging",
        flashPoint: "Non-combustible"
      },
      dilutionMatrix: [
        { application: "Surface Disinfection & Deep Mopping", ratio: "50g dissolved in 10L clean water", method: "Mop surface, leave 10 minutes, and rinse with water." },
        { application: "Water Storage Tank Chlorination", ratio: "2-5g per 1,000 Litres of water", method: "Dissolve in bucket, pour into tank, circulate for 30 min." },
        { application: "Drain Sanitation & Vector Control", ratio: "Direct dry powder or 10% slurry", method: "Sprinkle around drains and waste areas." }
      ],
      surfaceCompatibility: {
        safe: ["Concrete", "Cement Walkways", "Glazed Tiles", "Drain Channels", "PVC Tanks"],
        caution: ["Colored fabrics (causes permanent bleaching)"],
        avoid: ["Untreated wood", "Polished marble", "Direct contact with reactive metals"]
      },
      packagingSpecs: ["1 kg Sealed Polythene Pouch", "5 kg Bag", "25 kg Heavy-Duty Master Sack with Liner"]
    },
    msds: {
      sdsNumber: "SDS-LIOC-BLP-2026",
      effectiveDate: "2026-08-15",
      sections: {
        section1_identification: {
          productName: "Commercial Grade Bleaching Powder",
          recommendedUse: "Water Treatment, Surface Disinfection, Hospital Sanitation",
          restrictions: "Do NOT mix with acids (releases toxic chlorine gas).",
          manufacturer: "LIOC Chemical Manufacturing Industries",
          emergencyPhone: "+91 90074 97424"
        },
        section2_hazardIdentification: {
          classification: "Oxidizing Solid Cat 2; Acute Toxicity Cat 4; Skin Corrosion Cat 1B; Aquatic Acute Cat 1.",
          hazardStatements: ["H272: May intensify fire; oxidizer.", "H302: Harmful if swallowed.", "H314: Causes severe skin burns and eye damage.", "H400: Very toxic to aquatic life."],
          precautionaryStatements: ["P210: Keep away from heat, sparks, open flames.", "P220: Keep away from clothing and other combustible materials.", "P280: Wear protective gloves and eye protection.", "P304+P340: IF INHALED: Remove person to fresh air."]
        },
        section3_composition: [
          {
            chemicalName: "Calcium Hypochlorite / Chlorinated Lime",
            casNumber: "7778-54-3",
            concentration: "33.0% - 35.0% Available Chlorine"
          }
        ],
        section4_firstAid: {
          inhalation: "Remove to fresh air immediately. If coughing persists, consult doctor.",
          skinContact: "Wash skin with plenty of water. Remove contaminated clothing.",
          eyeContact: "Rinse cautiously with water for at least 15 minutes. Consult ophthalmologist.",
          ingestion: "Rinse mouth. Drink plenty of water. Do NOT induce vomiting."
        },
        section5_fireFighting: {
          extinguishingMedia: "Copious water spray. Do NOT use dry chemical extinguishers containing ammonium compounds.",
          specificHazards: "Decomposes above 175°C releasing toxic chlorine gas.",
          protectiveEquipment: "SCBA and full protective equipment."
        },
        section6_accidentalRelease: {
          personalPrecautions: "Wear dust respirator, gloves, and eye protection.",
          environmentalPrecautions: "Do not discharge directly into natural ponds or fish hatcheries.",
          cleanUpMethods: "Collect dry powder into clean, dry container. Neutralize residue with sodium thiosulfate."
        },
        section7_handlingStorage: {
          handling: "Avoid creating dust. Keep container tightly closed after use.",
          storageConditions: "Store in a cool, dark, dry and well-ventilated storeroom away from heat and acids."
        },
        section8_exposureControlsPPE: {
          eyeProtection: "Chemical safety goggles.",
          handProtection: "Rubber or PVC gloves.",
          skinProtection: "Long-sleeved workwear.",
          respiratoryProtection: "Dust mask (N95 / P2 rating) during powder scooping."
        },
        section9_physicalChemical: {
          physicalState: "Powder",
          color: "White / Off-White",
          odor: "Pungent Chlorine",
          ph: "11.5",
          boilingPoint: "Decomposes",
          flashPoint: "None",
          relativeDensity: "0.85"
        },
        section10_stabilityReactivity: {
          reactivity: "Strong oxidizing agent.",
          chemicalStability: "Slowly loses available chlorine over time if exposed to moisture/heat.",
          incompatibleMaterials: "Acids, ammonia, organic combustibles, reducing agents.",
          hazardousDecomposition: "Chlorine gas (Cl2) released in contact with acids."
        },
        section11_toxicological: {
          acuteToxicity: "Oral LD50 > 850 mg/kg",
          skinCorrosion: "Causes skin irritation and corrosion upon wet contact.",
          seriousEyeDamage: "Severe chemical conjunctivitis."
        },
        section12_ecological: {
          ecotoxicity: "High toxicity to aquatic flora and fish in concentrated form.",
          biodegradability: "Chlorine reacts into inert chlorides."
        },
        section13_disposal: {
          wasteTreatment: "Neutralize with reducing agent before controlled disposal."
        },
        section14_transport: {
          unNumber: "UN 2208",
          properShippingName: "BLEACHING POWDER (CALCIUM HYPOCHLORITE MIXTURE, DRY)",
          transportHazardClass: "5.1 (Oxidizer)",
          packingGroup: "III"
        },
        section15_regulatory: {
          safetyRegulations: "Compliant with BIS IS 1065 / Central Insecticides Board Standards."
        },
        section16_otherInfo: {
          preparedBy: "LIOC Quality Assurance Division",
          nfpaRating: { health: 2, flammability: 0, reactivity: 2 }
        }
      }
    }
  },
  {
    slug: "finch-antibacterial-rose-hand-wash-5l",
    name: "Finch Antibacterial Rose Foam Hand Wash (5L Refill)",
    category: "Hand Hygiene & Sanitization",
    categorySlug: "hand-hygiene",
    sku: "FINCH-HW-5L",
    formulationType: "Dermatologically Balanced Antibacterial Soap",
    ghsSignalWord: "NON-HAZARDOUS",
    ghsPictograms: ["Safe"],
    productImage: "/images/products/finch-hand-wash-rose-5l.jpeg",
    tds: {
      documentId: "TDS-FINCH-HW-06",
      revisionDate: "August 2026",
      version: "v2.5",
      description: "Rich foaming antibacterial hand wash lotion infused with rose petal extracts, gentle skin emollients, and anti-microbial agents for high-frequency institutional dispensers.",
      keyFeatures: [
        "99.9% Antibacterial protection tested against E. coli and S. aureus",
        "Enriched with skin conditioners to prevent moisture loss during frequent handwashing",
        "Smooth pump consistency prevents dispenser nozzle drips and clogging",
        "Rose Feels Alive signature fragrance enhances corporate and guest washroom ambiance"
      ],
      technicalProperties: {
        appearance: "Pearlized Soft Pink Viscous Liquid",
        color: "Soft Pearl Pink",
        odor: "Natural Rose Petal Floral",
        ph: "5.5 - 6.5 (Skin-Balanced at 25°C)",
        specificGravity: "1.02 ± 0.01 g/cm³",
        solubility: "100% Soluble in Water",
        shelfLife: "24 Months",
        flashPoint: "Non-Flammable"
      },
      dilutionMatrix: [
        { application: "Wall-Mounted Dispensers", ratio: "Ready to Use (Undiluted)", method: "Pour directly into manual or sensor dispensers." },
        { application: "Foam Dispensers", ratio: "1:1 with distilled water (optional)", method: "Dispense as aerated foam lather." }
      ],
      surfaceCompatibility: {
        safe: ["Human Skin", "All Dispensers (Manual & Touchless Sensor)"],
        caution: [],
        avoid: []
      },
      packagingSpecs: ["5 Litres HDPE Refill Can with Handle", "20 Litres Institutional Can"]
    },
    msds: {
      sdsNumber: "SDS-FINCH-HW-2026",
      effectiveDate: "2026-08-15",
      sections: {
        section1_identification: {
          productName: "Finch Antibacterial Rose Foam Hand Wash",
          recommendedUse: "Commercial & Institutional Hand Cleansing and Hygiene",
          restrictions: "For external skin use only.",
          manufacturer: "LIOC Personal Care Division",
          emergencyPhone: "+91 90074 97424"
        },
        section2_hazardIdentification: {
          classification: "Non-Hazardous Cosmetic Product. Eye Irritant Cat 2B.",
          hazardStatements: ["H320: Causes mild eye irritation upon direct contact."],
          precautionaryStatements: ["P305+P351: IF IN EYES: Rinse cautiously with water for several minutes."]
        },
        section3_composition: [
          {
            chemicalName: "Sodium Laureth Sulfate, Cocamidopropyl Betaine, Glycerin, Chloroxylenol (PCMX)",
            casNumber: "68891-38-3 / 88-04-0",
            concentration: "Cosmetic Grade Active Formulation"
          }
        ],
        section4_firstAid: {
          inhalation: "Not applicable.",
          skinContact: "Rinse with clean water.",
          eyeContact: "Flush eyes thoroughly with water for 10 minutes.",
          ingestion: "Drink a glass of water. Consult physician if large quantities ingested."
        },
        section5_fireFighting: {
          extinguishingMedia: "Water, Foam, Dry Powder.",
          specificHazards: "Non-combustible.",
          protectiveEquipment: "Standard gear."
        },
        section6_accidentalRelease: {
          personalPrecautions: "Caution: Slippery surface.",
          environmentalPrecautions: "Eco-safe formulation.",
          cleanUpMethods: "Mop up and flush residue with water."
        },
        section7_handlingStorage: {
          handling: "No special handling required.",
          storageConditions: "Store in cool area away from freezing."
        },
        section8_exposureControlsPPE: {
          eyeProtection: "Not required under normal use.",
          handProtection: "Not applicable.",
          skinProtection: "Not applicable.",
          respiratoryProtection: "Not applicable."
        },
        section9_physicalChemical: {
          physicalState: "Pearlized Liquid",
          color: "Soft Pink",
          odor: "Rose Floral",
          ph: "5.5 - 6.5",
          boilingPoint: "100°C",
          flashPoint: "None",
          relativeDensity: "1.02"
        },
        section10_stabilityReactivity: {
          reactivity: "None.",
          chemicalStability: "Stable.",
          incompatibleMaterials: "None known.",
          hazardousDecomposition: "None."
        },
        section11_toxicological: {
          acuteToxicity: "Non-toxic (Dermatologically tested)",
          skinCorrosion: "Non-corrosive / Moisturizing",
          seriousEyeDamage: "Mild transient eye sting"
        },
        section12_ecological: {
          ecotoxicity: "100% Readily Biodegradable.",
          biodegradability: ">95% in 14 days."
        },
        section13_disposal: {
          wasteTreatment: "Flush with sewer water."
        },
        section14_transport: {
          unNumber: "Non-regulated",
          properShippingName: "Liquid Hand Soap",
          transportHazardClass: "None",
          packingGroup: "None"
        },
        section15_regulatory: {
          safetyRegulations: "Compliant with BIS IS 4199 (Liquid Toilet Soap)."
        },
        section16_otherInfo: {
          preparedBy: "LIOC Personal Care Directorate",
          nfpaRating: { health: 0, flammability: 0, reactivity: 0 }
        }
      }
    }
  }
];

export function getComplianceDocBySlug(slug: string): ProductComplianceDoc | undefined {
  return COMPLIANCE_DOCS.find((d) => d.slug === slug);
}
