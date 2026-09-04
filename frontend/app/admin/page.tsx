import React from "react";
import type { Metadata } from "next";
import AdminDashboardView from "@/components/admin/AdminDashboardView";

export const metadata: Metadata = {
  title: "CEO Executive Command Center | Lioc Hygiene",
  description: "Executive management portal for Lioc B2B commercial leads, quotation requests, sample orders, and distributor applications.",
  robots: {
    index: false,
    follow: false,
  },
};

export default function AdminDashboardPage() {
  return <AdminDashboardView />;
}
