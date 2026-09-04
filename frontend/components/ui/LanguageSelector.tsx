"use client";

import React, { useState, useRef, useEffect } from "react";
import { Globe, ChevronDown, Check } from "lucide-react";
import { useLanguage } from "@/lib/i18n/LanguageContext";
import { Language } from "@/lib/i18n/translations";

interface LanguageSelectorProps {
  variant?: "topbar" | "mobile" | "footer" | "pills";
  className?: string;
}

export default function LanguageSelector({
  variant = "topbar",
  className = "",
}: LanguageSelectorProps) {
  const { language, setLanguage, languages } = useLanguage();
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const currentOption = languages.find((l) => l.code === language) || languages[0];

  if (variant === "pills") {
    return (
      <div className={`inline-flex items-center p-1 bg-slate-100 rounded-xl border border-slate-200 ${className}`}>
        {languages.map((l) => {
          const isActive = language === l.code;
          return (
            <button
              key={l.code}
              onClick={() => setLanguage(l.code)}
              className={`px-2.5 py-1 text-xs font-bold rounded-lg transition-all ${
                isActive
                  ? "bg-lioc-teal text-white shadow-sm"
                  : "text-slate-600 hover:text-lioc-navy hover:bg-white"
              }`}
            >
              <span>{l.nativeLabel}</span>
            </button>
          );
        })}
      </div>
    );
  }

  if (variant === "mobile") {
    return (
      <div className={`space-y-2 ${className}`}>
        <div className="flex items-center space-x-1.5 text-xs font-bold text-slate-500 uppercase tracking-wider">
          <Globe className="w-3.5 h-3.5 text-lioc-teal" />
          <span>Select Language / ভাষা / भाषा</span>
        </div>
        <div className="grid grid-cols-3 gap-2">
          {languages.map((l) => {
            const isActive = language === l.code;
            return (
              <button
                key={l.code}
                onClick={() => setLanguage(l.code)}
                className={`py-2 px-3 rounded-xl text-xs font-bold flex items-center justify-center space-x-1.5 border transition-all ${
                  isActive
                    ? "bg-teal-50 border-teal-500 text-lioc-teal shadow-sm"
                    : "bg-slate-50 border-slate-200 text-slate-700 hover:bg-slate-100"
                }`}
              >
                <span>{l.flag}</span>
                <span>{l.nativeLabel}</span>
              </button>
            );
          })}
        </div>
      </div>
    );
  }

  if (variant === "footer") {
    return (
      <div className={`inline-flex items-center space-x-2 ${className}`}>
        <Globe className="w-4 h-4 text-teal-400" />
        <div className="inline-flex items-center bg-slate-900 rounded-lg p-0.5 border border-slate-700">
          {languages.map((l) => {
            const isActive = language === l.code;
            return (
              <button
                key={l.code}
                onClick={() => setLanguage(l.code)}
                className={`px-2 py-1 text-xs font-medium rounded transition-all ${
                  isActive
                    ? "bg-lioc-teal text-white font-bold shadow-sm"
                    : "text-slate-400 hover:text-white"
                }`}
              >
                {l.nativeLabel}
              </button>
            );
          })}
        </div>
      </div>
    );
  }

  // Default Top Bar Dropdown
  return (
    <div className={`relative inline-block text-left ${className}`} ref={dropdownRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center space-x-1.5 px-2.5 py-1 rounded-full bg-slate-800/80 hover:bg-slate-700 text-slate-200 hover:text-white border border-slate-700 transition-all text-xs font-medium"
        aria-expanded={isOpen}
        aria-label="Select Language"
      >
        <Globe className="w-3.5 h-3.5 text-teal-400" />
        <span>{currentOption.nativeLabel}</span>
        <ChevronDown className={`w-3 h-3 text-slate-400 transition-transform ${isOpen ? "rotate-180" : ""}`} />
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-1.5 w-40 rounded-2xl bg-white shadow-2xl border border-slate-200 py-1.5 z-50 text-xs animate-in fade-in-50 slide-in-from-top-2">
          <div className="px-3 py-1 text-[10px] font-bold text-slate-400 uppercase tracking-wider border-b border-slate-100 mb-1">
            Language
          </div>
          {languages.map((l) => {
            const isActive = language === l.code;
            return (
              <button
                key={l.code}
                onClick={() => {
                  setLanguage(l.code);
                  setIsOpen(false);
                }}
                className={`w-full px-3 py-2 text-left flex items-center justify-between transition-colors ${
                  isActive
                    ? "bg-teal-50 text-lioc-teal font-bold"
                    : "text-slate-700 hover:bg-slate-50 font-medium"
                }`}
              >
                <div className="flex items-center space-x-2">
                  <span>{l.flag}</span>
                  <span>{l.nativeLabel}</span>
                  <span className="text-[11px] text-slate-400">({l.label})</span>
                </div>
                {isActive && <Check className="w-3.5 h-3.5 text-lioc-teal" />}
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}
