import React from "react";
import Link from "next/link";
import Image from "next/image";
import { ProductListItem } from "@/types";
import { Sparkles, ArrowRight, Layers, Factory, ShieldCheck } from "lucide-react";
import { getWhatsAppUrl } from "@/lib/whatsapp";

interface ProductCardProps {
  product: ProductListItem;
}

export default function ProductCard({ product }: ProductCardProps) {
  const isLiocManufactured =
    product.name.toLowerCase().includes("lioc") ||
    (product.sku && product.sku.toUpperCase().startsWith("LIOC"));

  return (
    <div className="group bg-white rounded-2xl border border-slate-200/90 shadow-sm hover:shadow-card transition-all duration-300 flex flex-col justify-between overflow-hidden hover:-translate-y-1">
      {/* Top Banner & Badges */}
      <div>
        <div className="relative h-52 bg-gradient-to-br from-slate-50 via-teal-50/20 to-slate-100 p-4 flex items-center justify-center overflow-hidden">
          {/* Subtle decorative background glow */}
          <div className="absolute -right-8 -bottom-8 w-36 h-36 bg-teal-500/10 rounded-full blur-xl pointer-events-none"></div>

          {/* Status / Manufacturer Badges */}
          <div className="absolute top-3 left-3 flex flex-wrap gap-1.5 z-10">
            {isLiocManufactured ? (
              <span className="px-2.5 py-1 text-[10px] font-extrabold uppercase tracking-wider bg-gradient-to-r from-teal-700 to-emerald-700 text-white rounded-full shadow-xs flex items-center space-x-1">
                <Factory className="w-2.5 h-2.5" />
                <span>LIOC Direct Mfd</span>
              </span>
            ) : (
              <span className="px-2.5 py-1 text-[10px] font-extrabold uppercase tracking-wider bg-slate-800 text-white rounded-full shadow-xs flex items-center space-x-1">
                <ShieldCheck className="w-2.5 h-2.5 text-teal-300" />
                <span>B2B Supply</span>
              </span>
            )}
            {product.is_bestseller && (
              <span className="px-2.5 py-1 text-[10px] font-extrabold uppercase tracking-wider bg-amber-500 text-white rounded-full shadow-xs">
                Bestseller
              </span>
            )}
          </div>

          {/* Product Category Tag */}
          {product.category_name && (
            <div className="absolute bottom-3 left-3 z-10">
              <span className="px-2.5 py-0.5 text-[11px] font-semibold bg-white/95 backdrop-blur-md text-slate-700 rounded-md border border-slate-200/80 shadow-2xs">
                {product.category_name}
              </span>
            </div>
          )}

          {/* Actual Product Photo Container */}
          <div className="relative w-full h-full flex items-center justify-center">
            {product.product_image ? (
              <div className="relative w-36 h-40 group-hover:scale-108 transition-transform duration-300 ease-out">
                <Image
                  src={product.product_image}
                  alt={product.name}
                  fill
                  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                  className="object-contain drop-shadow-md"
                />
              </div>
            ) : (
              <div className="w-20 h-20 rounded-2xl bg-white shadow-md flex items-center justify-center text-lioc-teal group-hover:scale-110 transition-transform duration-300">
                <Sparkles className="w-10 h-10" />
              </div>
            )}
          </div>
        </div>

        {/* Product Details Section */}
        <div className="p-5">
          <div className="flex items-center justify-between">
            {product.sku && (
              <span className="text-[10px] font-mono font-bold text-slate-400 uppercase tracking-wider">
                SKU: {product.sku}
              </span>
            )}
            {isLiocManufactured && (
              <span className="text-[10px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                Factory Direct
              </span>
            )}
          </div>

          <h3 className="text-base font-bold text-lioc-navy group-hover:text-lioc-teal transition-colors line-clamp-2 mt-1.5">
            <Link href={`/products/${product.slug}`}>{product.name}</Link>
          </h3>
          <p className="text-xs text-slate-500 mt-2 line-clamp-2 leading-relaxed">
            {product.short_description}
          </p>

          {/* Sizes Available */}
          {product.available_sizes && (
            <div className="mt-3.5 pt-3 border-t border-slate-100 flex items-center space-x-1.5 text-slate-600">
              <Layers className="w-3.5 h-3.5 text-lioc-teal flex-shrink-0" />
              <span className="text-[11px] font-medium text-slate-500">Packaging:</span>
              <span className="text-[11px] font-bold text-slate-700 truncate">
                {product.available_sizes}
              </span>
            </div>
          )}
        </div>
      </div>

      {/* Card Action Footers */}
      <div className="p-5 pt-0 grid grid-cols-2 gap-2">
        <Link
          href={`/products/${product.slug}`}
          className="w-full py-2.5 px-3 rounded-xl bg-slate-100 hover:bg-slate-200 text-lioc-navy text-xs font-bold text-center transition-colors flex items-center justify-center space-x-1"
        >
          <span>Specs & Usage</span>
          <ArrowRight className="w-3 h-3" />
        </Link>
        <Link
          href={`/request-quote?product=${encodeURIComponent(product.name)}`}
          className="w-full py-2.5 px-3 rounded-xl bg-lioc-teal hover:bg-lioc-tealDark text-white text-xs font-bold text-center shadow-sm shadow-teal-700/20 transition-all"
        >
          Bulk Pricing
        </Link>
      </div>
    </div>
  );
}
