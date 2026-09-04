"use client";

import React, { useState } from "react";
import Image from "next/image";
import { ProductImage } from "@/types";
import { Sparkles, Maximize2 } from "lucide-react";

interface ProductImageGalleryProps {
  primaryImage?: string | null;
  images?: ProductImage[];
  productName: string;
  isBestseller?: boolean;
  isLiocManufactured?: boolean;
}

export default function ProductImageGallery({
  primaryImage,
  images = [],
  productName,
  isBestseller = false,
  isLiocManufactured = false,
}: ProductImageGalleryProps) {
  // Combine primaryImage and images list into a unique array of image URLs
  const allImages = React.useMemo(() => {
    const list: { url: string; alt: string }[] = [];
    if (primaryImage) {
      list.push({ url: primaryImage, alt: `${productName} Primary Photo` });
    }
    if (images && images.length > 0) {
      images.forEach((img) => {
        if (!list.some((item) => item.url === img.image_url)) {
          list.push({
            url: img.image_url,
            alt: img.alt_text || `${productName} Image`,
          });
        }
      });
    }
    return list;
  }, [primaryImage, images, productName]);

  const [selectedIndex, setSelectedIndex] = useState<number>(0);
  const currentImage = allImages[selectedIndex] || allImages[0];

  return (
    <div className="space-y-4">
      {/* Main Image Stage */}
      <div className="relative w-full h-80 sm:h-96 bg-gradient-to-br from-slate-50 via-teal-50/20 to-slate-100 rounded-3xl p-6 border border-slate-200 shadow-sm flex items-center justify-center overflow-hidden group">
        {/* Decorative Background Blur */}
        <div className="absolute -top-12 -right-12 w-48 h-48 bg-teal-500/10 rounded-full blur-2xl pointer-events-none"></div>

        {/* Badges */}
        <div className="absolute top-4 left-4 flex flex-col gap-2 z-10">
          {isLiocManufactured && (
            <span className="px-3 py-1 bg-gradient-to-r from-teal-700 to-emerald-700 text-white text-xs font-extrabold uppercase rounded-full shadow-sm">
              LIOC Direct Mfd
            </span>
          )}
          {isBestseller && (
            <span className="px-3 py-1 bg-amber-500 text-white text-xs font-extrabold uppercase rounded-full shadow-sm">
              Bestseller
            </span>
          )}
        </div>

        {/* Selected Image */}
        {currentImage ? (
          <div className="relative w-full h-full max-h-80 flex items-center justify-center transition-all duration-300">
            <Image
              src={currentImage.url}
              alt={currentImage.alt}
              fill
              priority
              sizes="(max-width: 768px) 100vw, 50vw"
              className="object-contain drop-shadow-lg transition-transform duration-300 group-hover:scale-105"
            />
          </div>
        ) : (
          <div className="w-32 h-32 rounded-3xl bg-white shadow-xl flex items-center justify-center text-lioc-teal">
            <Sparkles className="w-16 h-16" />
          </div>
        )}
      </div>

      {/* Thumbnails Gallery (if multiple images available) */}
      {allImages.length > 1 && (
        <div className="flex items-center gap-3 overflow-x-auto pb-2 pt-1 px-1">
          {allImages.map((img, idx) => {
            const isSelected = idx === selectedIndex;
            return (
              <button
                key={idx}
                type="button"
                onClick={() => setSelectedIndex(idx)}
                className={`relative w-20 h-20 rounded-2xl overflow-hidden p-2 transition-all shrink-0 bg-white border-2 cursor-pointer ${
                  isSelected
                    ? "border-lioc-teal shadow-md ring-2 ring-teal-500/30 scale-102"
                    : "border-slate-200 hover:border-slate-300 opacity-70 hover:opacity-100"
                }`}
              >
                <div className="relative w-full h-full">
                  <Image
                    src={img.url}
                    alt={img.alt}
                    fill
                    sizes="80px"
                    className="object-contain"
                  />
                </div>
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}
