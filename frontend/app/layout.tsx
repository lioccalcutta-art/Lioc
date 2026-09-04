import type { Metadata } from "next";
import "./globals.css";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import WhatsAppButton from "@/components/layout/WhatsAppButton";
import JsonLdSchema from "@/components/seo/JsonLdSchema";
import AppProviders from "@/components/providers/AppProviders";
import AskChemistWidget from "@/components/assistant/AskChemistWidget";
import { SITE_CONFIG } from "@/lib/config";


export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000"),
  title: {
    default: `${SITE_CONFIG.companyName} | Commercial Cleaning & Hygiene Solutions`,
    template: `%s | ${SITE_CONFIG.companyName}`,
  },
  description: SITE_CONFIG.description,
  keywords: [
    "Commercial cleaning products Kolkata",
    "Hotel cleaning chemicals supplier",
    "Floor cleaner manufacturer West Bengal",
    "Restaurant kitchen degreaser bulk",
    "Hospital grade disinfectant supplier",
    "Toilet cleaner manufacturer Kolkata",
    "B2B hygiene products wholesale",
    "Industrial cleaning chemical dealer",
  ],
  authors: [{ name: SITE_CONFIG.companyName }],
  creator: SITE_CONFIG.companyName,
  icons: {
    icon: "/logo.jpeg",
    shortcut: "/logo.jpeg",
    apple: "/logo.jpeg",
  },
  openGraph: {
    type: "website",
    locale: "en_IN",
    url: "https://lioc.in",
    title: `${SITE_CONFIG.companyName} - Commercial Cleaning & Hygiene Products`,
    description: SITE_CONFIG.description,
    siteName: SITE_CONFIG.companyName,
    images: [
      {
        url: "/logo.jpeg",
        width: 800,
        height: 800,
        alt: `${SITE_CONFIG.companyName} Logo`,
      },
    ],
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="min-h-screen flex flex-col bg-slate-50 text-slate-900 antialiased font-sans">
        <AppProviders>
          <JsonLdSchema />
          <Header />
          <main className="flex-grow">{children}</main>
          <Footer />
          <WhatsAppButton />
          <AskChemistWidget />
        </AppProviders>
      </body>
    </html>
  );
}



