"use client";

import React, { useState, useMemo } from "react";
import { Category, Industry, ProductListItem } from "@/types";
import ProductCard from "./ProductCard";
import { Search, Package, Factory, ShieldCheck, Sparkles } from "lucide-react";

interface ProductCatalogViewProps {
  initialProducts: ProductListItem[];
  categories: Category[];
  industries: Industry[];
  initialCategory?: string;
  initialIndustry?: string;
}

export default function ProductCatalogView({
  initialProducts,
  categories,
  industries,
  initialCategory = "",
  initialIndustry = "",
}: ProductCatalogViewProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState(initialCategory);
  const [filterType, setFilterType] = useState<"all" | "lioc-mfd" | "institutional">("all");

  const filteredProducts = useMemo(() => {
    return initialProducts.filter((product) => {
      // Manufacturer / Source filter
      const isLioc =
        product.name.toLowerCase().includes("lioc") ||
        (product.sku && product.sku.toUpperCase().startsWith("LIOC"));

      if (filterType === "lioc-mfd" && !isLioc) {
        return false;
      }
      if (filterType === "institutional" && isLioc) {
        return false;
      }

      // Category filter
      if (selectedCategory && product.category_slug !== selectedCategory) {
        return false;
      }

      // Search filter
      if (searchQuery.trim()) {
        const query = searchQuery.toLowerCase();
        const matchesName = product.name.toLowerCase().includes(query);
        const matchesDesc = product.short_description.toLowerCase().includes(query);
        const matchesSku = product.sku?.toLowerCase().includes(query);
        const matchesCat = product.category_name?.toLowerCase().includes(query);
        if (!matchesName && !matchesDesc && !matchesSku && !matchesCat) {
          return false;
        }
      }

      return true;
    });
  }, [initialProducts, selectedCategory, searchQuery, filterType]);

  return (
    <div className="space-y-8">
      {/* Filter and Search Bar Container */}
      <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm space-y-6">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          {/* Search Bar */}
          <div className="relative flex-1 max-w-md">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search by product name, active ingredient, or SKU..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-lioc-teal/30 focus:border-lioc-teal text-sm bg-slate-50/60"
            />
          </div>

          {/* Quick Source Type Selector */}
          <div className="flex items-center gap-1.5 p-1 bg-slate-100 rounded-2xl">
            <button
              onClick={() => setFilterType("all")}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
                filterType === "all"
                  ? "bg-white text-lioc-navy shadow-xs"
                  : "text-slate-600 hover:text-slate-900"
              }`}
            >
              All Supplies ({initialProducts.length})
            </button>
            <button
              onClick={() => setFilterType("lioc-mfd")}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center space-x-1.5 ${
                filterType === "lioc-mfd"
                  ? "bg-teal-700 text-white shadow-xs"
                  : "text-slate-600 hover:text-teal-700"
              }`}
            >
              <Factory className="w-3.5 h-3.5" />
              <span>LIOC Direct Mfd</span>
            </button>
            <button
              onClick={() => setFilterType("institutional")}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center space-x-1.5 ${
                filterType === "institutional"
                  ? "bg-slate-800 text-white shadow-xs"
                  : "text-slate-600 hover:text-slate-900"
              }`}
            >
              <ShieldCheck className="w-3.5 h-3.5" />
              <span>B2B Supplies</span>
            </button>
          </div>
        </div>

        {/* Category Pills */}
        <div>
          <div className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-3 flex items-center justify-between">
            <span>Filter by Cleaning Category</span>
            <span className="text-[11px] font-semibold text-slate-500">
              Showing <span className="text-lioc-navy font-bold">{filteredProducts.length}</span> items
            </span>
          </div>
          <div className="flex flex-wrap gap-2">
            <button
              onClick={() => setSelectedCategory("")}
              className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all ${
                selectedCategory === ""
                  ? "bg-lioc-navy text-white shadow-md shadow-lioc-navy/20"
                  : "bg-slate-100 text-slate-700 hover:bg-slate-200"
              }`}
            >
              All Categories
            </button>
            {categories.map((cat) => (
              <button
                key={cat.id}
                onClick={() => setSelectedCategory(cat.slug === selectedCategory ? "" : cat.slug)}
                className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all flex items-center space-x-1.5 ${
                  selectedCategory === cat.slug
                    ? "bg-lioc-teal text-white shadow-md shadow-teal-600/30"
                    : "bg-slate-100 text-slate-700 hover:bg-slate-200"
                }`}
              >
                <span>{cat.name}</span>
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Products Grid */}
      {filteredProducts.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredProducts.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      ) : (
        <div className="text-center py-16 bg-white rounded-3xl border border-dashed border-slate-300 p-8 space-y-3">
          <Package className="w-12 h-12 text-slate-300 mx-auto" />
          <h3 className="text-base font-bold text-slate-700">No matching formulations found</h3>
          <p className="text-xs text-slate-500 max-w-sm mx-auto">
            Try adjusting your search query, clearing filters, or contacting our chemical sales team for custom batch formulation.
          </p>
          <button
            onClick={() => {
              setSearchQuery("");
              setSelectedCategory("");
              setFilterType("all");
            }}
            className="px-4 py-2 bg-lioc-teal text-white rounded-xl text-xs font-bold shadow-sm"
          >
            Reset All Filters
          </button>
        </div>
      )}
    </div>
  );
}
