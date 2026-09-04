import React from "react";
import { SITE_CONFIG } from "@/lib/config";

export default function JsonLdSchema() {
  const schema = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": ["LocalBusiness", "Manufacturer", "WholesaleStore"],
        "@id": "https://lioc.in/#localbusiness",
        "name": SITE_CONFIG.companyName,
        "legalName": "Lioc Cleaning & Hygiene Solutions",
        "alternateName": "LIOC Calcutta",
        "url": "https://lioc.in",
        "logo": "https://lioc.in/logo.jpeg",
        "image": "https://lioc.in/logo.jpeg",
        "description": SITE_CONFIG.description,
        "telephone": "+919007381804",
        "email": SITE_CONFIG.email,
        "priceRange": "$$",
        "currenciesAccepted": "INR",
        "paymentAccepted": "Cash, Credit Card, Bank Transfer, NEFT, RTGS, UPI, Cheque",
        "address": {
          "@type": "PostalAddress",
          "streetAddress": "156, PGH Shah Road, Jadavpur",
          "addressLocality": "Kolkata",
          "addressRegion": "West Bengal",
          "postalCode": "700032",
          "addressCountry": "IN"
        },
        "geo": {
          "@type": "GeoCoordinates",
          "latitude": SITE_CONFIG.geo.latitude,
          "longitude": SITE_CONFIG.geo.longitude
        },
        "hasMap": SITE_CONFIG.googleMapsUrl,
        "openingHoursSpecification": [
          {
            "@type": "OpeningHoursSpecification",
            "dayOfWeek": [
              "Monday",
              "Tuesday",
              "Wednesday",
              "Thursday",
              "Friday",
              "Saturday"
            ],
            "opens": "09:00",
            "closes": "19:00"
          }
        ],
        "sameAs": [
          SITE_CONFIG.instagramUrl,
          "https://wa.me/919007381804"
        ],
        "areaServed": [
          {
            "@type": "City",
            "name": "Kolkata"
          },
          {
            "@type": "AdministrativeArea",
            "name": "West Bengal"
          },
          {
            "@type": "Country",
            "name": "India"
          }
        ],
        "knowsAbout": [
          "Commercial Cleaning Chemicals",
          "Floor Cleaners",
          "Toilet & Washroom Hygiene",
          "Kitchen Degreasers",
          "Hospital Grade Disinfectants",
          "Hotel Guest Amenities",
          "Institutional Cleaning Solutions"
        ]
      },
      {
        "@type": "WebSite",
        "@id": "https://lioc.in/#website",
        "url": "https://lioc.in",
        "name": SITE_CONFIG.companyName,
        "description": SITE_CONFIG.tagline,
        "publisher": {
          "@id": "https://lioc.in/#localbusiness"
        },
        "inLanguage": "en-IN"
      }
    ]
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  );
}
