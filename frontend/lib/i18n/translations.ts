export type Language = "en" | "bn" | "hi";

export interface LanguageOption {
  code: Language;
  label: string;
  nativeLabel: string;
  flag: string;
}

export const LANGUAGES: LanguageOption[] = [
  { code: "en", label: "English", nativeLabel: "English", flag: "🇬🇧" },
  { code: "bn", label: "Bengali", nativeLabel: "বাংলা", flag: "🇮🇳" },
  { code: "hi", label: "Hindi", nativeLabel: "हिन्दी", flag: "🇮🇳" },
];

export const TRANSLATIONS: Record<Language, Record<string, string>> = {
  en: {
    // Top Bar
    "topbar.mfg_supply": "Direct Manufacturing & Supply: Kolkata & West Bengal (Pan-India Available)",
    "topbar.commercial_grade": "Commercial & Institutional Grade Hygiene",
    "topbar.admin_login": "Admin Login",

    // Nav Links
    "nav.home": "Home",
    "nav.products": "Products",
    "nav.product_finder": "Product Finder",
    "nav.industries": "Industries",
    "nav.about": "About Us",
    "nav.leadership": "Leadership",
    "nav.dealerships": "Dealerships",
    "nav.contact": "Contact",

    // Header CTAs
    "cta.get_sample": "Get Free Sample",
    "cta.request_quote": "Request Quote",
    "cta.request_bulk_quote": "Request Bulk Quote",
    "cta.chat_whatsapp": "Chat on WhatsApp",
    "cta.direct_whatsapp_desk": "Direct WhatsApp Sales Desk",
    "cta.dealership_inquiries": "Dealership Inquiries",
    "cta.view_products": "Explore Product Catalog",
    "cta.find_regimen": "Find Industry Regimen",
    "cta.get_gps_directions": "Get GPS Driving Directions",
    "cta.open_in_google_maps": "Open in Google Maps",
    "cta.follow_instagram": "Follow on Instagram",

    // Brand & Value Prop
    "brand.tagline": "Chemical Manufacturer & B2B Supply",
    "brand.sub_tagline": "Direct Chemical Manufacturer & B2B Commercial Hygiene Supplier",
    "brand.description":
      "LIOC manufactures and supplies high-performance commercial cleaning chemicals, heavy-duty floor soaps, descalers, air fresheners, and facility hygiene products engineered for hotels, restaurants, hospitals, schools, and offices.",

    // Value Pillars
    "values.commercial_grade": "Commercial Grade Formulations",
    "values.commercial_grade_desc": "High-potency institutional formulations for daily hygiene.",
    "values.direct_supply": "Direct Factory Supply",
    "values.direct_supply_desc": "Fast reliable delivery in Kolkata & surrounding industrial hubs.",
    "values.bulk_cost": "Bulk Cost Efficiency",
    "values.bulk_cost_desc": "High-dilution concentrates reducing per-liter cleaning costs by up to 40%.",
    "values.free_samples": "Free Sample Trials",
    "values.free_samples_desc": "Evaluation kits available for commercial decision makers.",

    // Footer Sections
    "footer.formulations": "Formulations & Catalog",
    "footer.industries": "Industries We Serve",
    "footer.b2b_inquiries": "B2B Inquiries & Logistics",
    "footer.rights": "All rights reserved. Commercial Cleaning & Hygiene Solutions.",
    "footer.privacy": "Privacy Policy",
    "footer.terms": "Terms & Conditions",
    "footer.about_co": "About Company",
    "footer.contact_us": "Contact Us",

    // Form Common Labels
    "form.name": "Full Name",
    "form.business_name": "Company / Facility Name",
    "form.phone": "Phone Number / WhatsApp",
    "form.email": "Official Email Address",
    "form.city": "City / Location",
    "form.product": "Product of Interest",
    "form.volume": "Required Volume (Liters / Units)",
    "form.message": "Additional Inquiries or Regimen Details",
    "form.submit_quote": "Submit Quotation Request",
    "form.submit_sample": "Request Free Sample Kit",
    "form.submit_contact": "Send Direct Message",
    "form.instant_ref": "Instant Lead Reference ID",

    // Contact Details
    "contact.address_label": "Address / Supply Hub",
    "contact.phone_label": "Phone Support",
    "contact.email_label": "Email Inquiries",
    "contact.hours_label": "Business Hours",
    "contact.logistics_title": "Regional Supply Logistics",
    "contact.logistics_desc":
      "Bulk deliveries to North 24 Parganas, South 24 Parganas, Salt Lake Sector V, New Town Rajarhat, Howrah, and Hooghly operate on daily dispatch schedules.",

    // Language Toggle
    "lang.select": "Language",
  },

  bn: {
    // Top Bar
    "topbar.mfg_supply": "সরাসরি কারখানা থেকে উৎপাদন ও সরবরাহ: কলকাতা ও পশ্চিমবঙ্গ (সমগ্র ভারত উপলব্ধ)",
    "topbar.commercial_grade": "বাণিজ্যিক ও প্রাতিষ্ঠানিক গ্রেড পরিচ্ছন্নতা",
    "topbar.admin_login": "অ্যাডমিন লগইন",

    // Nav Links
    "nav.home": "হোম",
    "nav.products": "পণ্যসমূহ",
    "nav.product_finder": "প্রোডাক্ট ফাইন্ডার",
    "nav.industries": "শিল্পক্ষেত্র",
    "nav.about": "আমাদের সম্পর্কে",
    "nav.leadership": "নেতৃত্ব ও প্রতিষ্ঠাতা",
    "nav.dealerships": "ডিলারশিপ",
    "nav.contact": "যোগাযোগ",

    // Header CTAs
    "cta.get_sample": "বিনামূল্যে নমুনা নিন",
    "cta.request_quote": "কোটেশন চান",
    "cta.request_bulk_quote": "পাইকারি কোটেশন চান",
    "cta.chat_whatsapp": "হোয়াটসঅ্যাপে কথা বলুন",
    "cta.direct_whatsapp_desk": "সরাসরি হোয়াটসঅ্যাপ সেলস ডেস্ক",
    "cta.dealership_inquiries": "ডিলারশিপ ও এজেন্সি অনুসন্ধান",
    "cta.view_products": "সকল পণ্য দেখুন",
    "cta.find_regimen": "আপনার উপযুক্ত পণ্য খুঁজুন",
    "cta.get_gps_directions": "জিপিএস ড্রাইভিং দিকনির্দেশ পান",
    "cta.open_in_google_maps": "গুগল ম্যাপে দেখুন",
    "cta.follow_instagram": "ইনস্টাগ্রামে ফলো করুন",

    // Brand & Value Prop
    "brand.tagline": "রাসায়নিক প্রস্তুতকারক ও বি২বি সরবরাহ",
    "brand.sub_tagline": "সরাসরি রাসায়নিক কারখানা ও বাণিজ্যিক হাইজিন সরবরাহকারী",
    "brand.description":
      "LIOC উচ্চ-ক্ষমতাসম্পন্ন বাণিজ্যিক ক্লিনিং কেমিক্যাল, ফ্লোর ক্লিনার, ডিসইনফেক্ট্যান্ট, রুম ফ্রেশনার এবং হোটেল, হাসপাতাল, স্কুল ও অফিসের জন্য প্রাতিষ্ঠানিক হাইজিন পণ্য প্রস্তুত করে।",

    // Value Pillars
    "values.commercial_grade": "বাণিজ্যিক গ্রেড ফর্মুলা",
    "values.commercial_grade_desc": "দৈনন্দিন প্রাতিষ্ঠানিক পরিচ্ছন্নতার জন্য উচ্চ ঘনত্বের ফর্মুলেশন।",
    "values.direct_supply": "সরাসরি ফ্যাক্টরি সাপ্লাই",
    "values.direct_supply_desc": "কলকাতা ও পার্শ্ববর্তী শিল্পাঞ্চলে দ্রুত ও নির্ভরযোগ্য ডেলিভারি।",
    "values.bulk_cost": "পাইকারি খরচের সাশ্রয়",
    "values.bulk_cost_desc": "উচ্চ-ডাইলিউশন কনসেন্ট্রেট যা প্রতি লিটার ক্লিনিং খরচ ৪০% পর্যন্ত কমায়।",
    "values.free_samples": "বিনামূল্যে ট্রায়াল কিট",
    "values.free_samples_desc": "বাণিজ্যিক সিদ্ধান্ত গ্রহণকারীদের জন্য ফ্রি স্যাম্পল ট্রায়াল কিট উপলব্ধ।",

    // Footer Sections
    "footer.formulations": "ফর্মুলেশন ও পণ্য তালিকা",
    "footer.industries": "আমাদের সেবাপ্রাপ্ত শিল্পক্ষেত্র",
    "footer.b2b_inquiries": "বি২বি অনুসন্ধান ও রসদ",
    "footer.rights": "সর্বস্বত্ব সংরক্ষিত। বাণিজ্যিক ক্লিনিং ও হাইজিন সমাধান।",
    "footer.privacy": "গোপনীয়তা নীতি",
    "footer.terms": "শর্তাবলী",
    "footer.about_co": "কোম্পানি সম্পর্কে",
    "footer.contact_us": "যোগাযোগ করুন",

    // Form Common Labels
    "form.name": "পূর্ণ নাম",
    "form.business_name": "কোম্পানি / প্রতিষ্ঠানের নাম",
    "form.phone": "ফোন নম্বর / হোয়াটসঅ্যাপ",
    "form.email": "অফিসিয়াল ইমেল ঠিকানা",
    "form.city": "শহর / অবস্থান",
    "form.product": "পছন্দের পণ্য",
    "form.volume": "প্রয়োজনীয় পরিমাণ (লিটার / ইউনিট)",
    "form.message": "অতিরিক্ত বিবরণ বা অনুসন্ধান",
    "form.submit_quote": "কোটেশন রিকোয়েস্ট পাঠান",
    "form.submit_sample": "ফ্রি স্যাম্পল কিটের আবেদন করুন",
    "form.submit_contact": "সরাসরি মেসেজ পাঠান",
    "form.instant_ref": "তাত্ক্ষণিক ট্র্যাকিং রেফারেন্স আইডি",

    // Contact Details
    "contact.address_label": "ঠিকানা / সাপ্লাই হাব",
    "contact.phone_label": "ফোন সাপোর্ট",
    "contact.email_label": "ইমেল অনুসন্ধান",
    "contact.hours_label": "কাজের সময়সূচী",
    "contact.logistics_title": "আঞ্চলিক সরবরাহ ব্যবস্থা",
    "contact.logistics_desc":
      "উত্তর ২৪ পরগণা, দক্ষিণ ২৪ পরগণা, সল্টলেক সেক্টর ৫, নিউ টাউন, হাওড়া এবং হুগলিতে প্রতিদিন নিয়মিত সাপ্লাই গাড়ি চলাচল করে।",

    // Language Toggle
    "lang.select": "ভাষা নির্বাচন",
  },

  hi: {
    // Top Bar
    "topbar.mfg_supply": "सीधे फैक्ट्री से उत्पादन और आपूर्ति: कोलकाता एवं पश्चिम बंगाल (पूरे भारत में उपलब्ध)",
    "topbar.commercial_grade": "कमर्शियल और संस्थागत ग्रेड स्वच्छता",
    "topbar.admin_login": "एडमिन लॉगिन",

    // Nav Links
    "nav.home": "होम",
    "nav.products": "उत्पाद",
    "nav.product_finder": "प्रोडक्ट खोजें",
    "nav.industries": "उद्योग क्षेत्र",
    "nav.about": "हमारे बारे में",
    "nav.leadership": "नेतृत्व और संस्थापक",
    "nav.dealerships": "डीलरशिप",
    "nav.contact": "संपर्क करें",

    // Header CTAs
    "cta.get_sample": "मुफ्त सैंपल पाएं",
    "cta.request_quote": "कोटेशन मांगें",
    "cta.request_bulk_quote": "थोक कोटेशन मांगें",
    "cta.chat_whatsapp": "व्हाट्सएप पर बात करें",
    "cta.direct_whatsapp_desk": "डायरेक्ट व्हाट्सएप सेल्स डेस्क",
    "cta.dealership_inquiries": "डीलरशिप और वितरक पूछताछ",
    "cta.view_products": "सभी उत्पाद देखें",
    "cta.find_regimen": "सही उत्पाद चुनें",
    "cta.get_gps_directions": "जीपीएस ड्राइविंग दिशा-निर्देश प्राप्त करें",
    "cta.open_in_google_maps": "गूगल मैप पर देखें",
    "cta.follow_instagram": "इंस्टाग्राम पर फॉलो करें",

    // Brand & Value Prop
    "brand.tagline": "केमिकल निर्माता और बी2बी आपूर्ति",
    "brand.sub_tagline": "डायरेक्ट केमिकल निर्माता और बी2बी कमर्शियल हाइजीन सप्लायर",
    "brand.description":
      "LIOC होटलों, रेस्तरां, अस्पतालों, स्कूलों और कॉर्पोरेट परिसरों के लिए उच्च-क्षमता वाले फ्लोर क्लीनर, किचन डीग्रीजर, टॉयलेट क्लीनर और रूम फ्रेशनर बनाती है।",

    // Value Pillars
    "values.commercial_grade": "कमर्शियल ग्रेड फॉर्मूलेशन",
    "values.commercial_grade_desc": "दैनिक स्वच्छता के लिए उच्च-क्षमता वाले औद्योगिक केमिकल उत्पाद।",
    "values.direct_supply": "सीधी फैक्ट्री सप्लाई",
    "values.direct_supply_desc": "कोलकाता और आसपास के औद्योगिक क्षेत्रों में तेज और विश्वसनीय डिलीवरी।",
    "values.bulk_cost": "थोक लागत में भारी बचत",
    "values.bulk_cost_desc": "हाई-डाइल्यूशन कंसंट्रेट्स जो प्रति-लीटर सफाई लागत को 40% तक कम करते हैं।",
    "values.free_samples": "मुफ्त सैंपल ट्रायल",
    "values.free_samples_desc": "व्यावसायिक निर्णयकर्ताओं के लिए फ्री टेस्टिंग किट उपलब्ध।",

    // Footer Sections
    "footer.formulations": "उत्पाद और कैटलॉग",
    "footer.industries": "हमारे सेवा क्षेत्र",
    "footer.b2b_inquiries": "बी2बी पूछताछ और लॉजिस्टिक्स",
    "footer.rights": "सर्वाधिकार सुरक्षित। व्यावसायिक सफाई और स्वच्छता समाधान।",
    "footer.privacy": "गोपनीयता नीति",
    "footer.terms": "नियम एवं शर्तें",
    "footer.about_co": "कंपनी परिचय",
    "footer.contact_us": "संपर्क करें",

    // Form Common Labels
    "form.name": "पूरा नाम",
    "form.business_name": "कंपनी / प्रतिष्ठान का नाम",
    "form.phone": "फोन नंबर / व्हाट्सएप",
    "form.email": "आधिकारिक ईमेल",
    "form.city": "शहर / स्थान",
    "form.product": "आवश्यक उत्पाद",
    "form.volume": "आवश्यक मात्रा (लीटर / इकाइयाँ)",
    "form.message": "अतिरिक्त विवरण या आवश्यकता",
    "form.submit_quote": "कोटेशन अनुरोध भेजें",
    "form.submit_sample": "मुफ्त सैंपल किट का अनुरोध करें",
    "form.submit_contact": "संदेश भेजें",
    "form.instant_ref": "त्वरित ट्रैकिंग रेफरेंस आईडी",

    // Contact Details
    "contact.address_label": "पता / सप्लाई हब",
    "contact.phone_label": "फोन सहायता",
    "contact.email_label": "ईमेल पूछताछ",
    "contact.hours_label": "कार्य समय",
    "contact.logistics_title": "क्षेत्रीय आपूर्ति व्यवस्था",
    "contact.logistics_desc":
      "उत्तर 24 परगना, दक्षिण 24 परगना, साल्ट लेक सेक्टर 5, न्यू टाउन, हावड़ा और हुगली में प्रतिदिन डिलीवरी गाड़ियां चलती हैं।",

    // Language Toggle
    "lang.select": "भाषा चुनें",
  },
};
