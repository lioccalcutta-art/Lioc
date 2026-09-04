"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import {
  Shield,
  Lock,
  Mail,
  ArrowRight,
  Sparkles,
  Eye,
  EyeOff,
  AlertCircle,
} from "lucide-react";
import { api } from "@/lib/api";
import { SITE_CONFIG } from "@/lib/config";

export default function AdminLoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // If already authenticated, redirect straight to dashboard
  useEffect(() => {
    const savedToken = localStorage.getItem("lioc_admin_token");
    if (savedToken) {
      router.push("/admin");
    }
  }, [router]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      const response = await api.adminLogin(email.trim(), password.trim());
      if (response && response.access_token) {
        localStorage.setItem("lioc_admin_token", response.access_token);
        localStorage.setItem("lioc_admin_user", JSON.stringify(response.admin_user));
        router.push("/admin");
      } else {
        setError("Invalid response from authorization server.");
      }
    } catch (err: any) {
      console.error("Login error:", err);
      setError(err?.message || "Invalid CEO credentials. Please check email and password.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 text-white flex flex-col justify-between relative overflow-hidden py-12 px-4 sm:px-6 lg:px-8">
      {/* Background glow aesthetics */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[600px] bg-teal-500/10 rounded-full blur-3xl pointer-events-none"></div>
      <div className="absolute bottom-0 right-0 w-[400px] h-[400px] bg-indigo-500/10 rounded-full blur-3xl pointer-events-none"></div>

      {/* Top Header */}
      <div className="max-w-md w-full mx-auto flex items-center justify-between">
        <Link href="/" className="flex items-center space-x-2 text-slate-300 hover:text-white transition-colors">
          <div className="w-8 h-8 rounded-lg bg-lioc-teal flex items-center justify-center text-white">
            <Sparkles className="w-4 h-4" />
          </div>
          <span className="font-bold text-sm tracking-wide">Lioc Hygiene</span>
        </Link>
        <Link href="/" className="text-xs text-slate-400 hover:text-teal-300 transition-colors">
          ← Back to Website
        </Link>
      </div>

      {/* Login Card */}
      <div className="max-w-md w-full mx-auto bg-slate-900/90 border border-slate-800 backdrop-blur-xl rounded-3xl p-8 sm:p-10 shadow-2xl space-y-8 relative z-10">
        <div className="text-center space-y-2">
          <div className="w-14 h-14 bg-gradient-to-tr from-lioc-teal to-teal-400 rounded-2xl flex items-center justify-center mx-auto text-slate-950 shadow-lg shadow-teal-500/20">
            <Shield className="w-7 h-7 font-black" />
          </div>
          <h2 className="text-2xl font-black tracking-tight text-white pt-2">
            CEO & Executive Portal
          </h2>
          <p className="text-xs text-slate-400">
            Access live B2B customer inquiries, RFQ quotes, sample dispatches, and dealership leads.
          </p>
        </div>

        {error && (
          <div className="bg-rose-500/10 border border-rose-500/30 text-rose-300 text-xs p-3.5 rounded-2xl flex items-start space-x-2.5">
            <AlertCircle className="w-4 h-4 flex-shrink-0 mt-0.5" />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-5">
          {/* Email field */}
          <div className="space-y-1.5">
            <label className="text-xs font-bold text-slate-300 flex items-center justify-between">
              <span>Admin Email</span>
              <span className="text-[10px] text-teal-400 font-normal">Executive Account</span>
            </label>
            <div className="relative">
              <Mail className="w-4 h-4 text-slate-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter your admin email"
                autoComplete="email"
                className="w-full bg-slate-950 border border-slate-800 rounded-xl pl-10 pr-4 py-3 text-xs text-white placeholder-slate-600 focus:outline-none focus:border-teal-400 transition-colors"
              />
            </div>
          </div>

          {/* Password field */}
          <div className="space-y-1.5">
            <label className="text-xs font-bold text-slate-300 flex items-center justify-between">
              <span>Executive Password</span>
            </label>
            <div className="relative">
              <Lock className="w-4 h-4 text-slate-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type={showPassword ? "text" : "password"}
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter your password"
                autoComplete="current-password"
                className="w-full bg-slate-950 border border-slate-800 rounded-xl pl-10 pr-10 py-3 text-xs text-white placeholder-slate-600 focus:outline-none focus:border-teal-400 transition-colors"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-300"
              >
                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={loading}
            className="w-full py-3.5 bg-gradient-to-r from-lioc-teal to-teal-500 hover:from-teal-600 hover:to-teal-400 text-slate-950 font-black text-xs uppercase tracking-wider rounded-xl shadow-lg shadow-teal-500/20 transition-all flex items-center justify-center space-x-2 disabled:opacity-50"
          >
            {loading ? (
              <div className="w-4 h-4 border-2 border-slate-950 border-t-transparent rounded-full animate-spin"></div>
            ) : (
              <>
                <span>Enter Command Center</span>
                <ArrowRight className="w-4 h-4" />
              </>
            )}
          </button>
        </form>

        <div className="pt-2 text-center text-[11px] text-slate-500">
          Protected with SHA-256 encrypted token authorization.
        </div>
      </div>

      {/* Bottom Footer */}
      <div className="max-w-md w-full mx-auto text-center text-xs text-slate-600">
        © {new Date().getFullYear()} {SITE_CONFIG.companyName}. Executive Administration.
      </div>
    </div>
  );
}
