"use client";

import React, { useState, useRef, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import {
  Sparkles,
  MessageSquare,
  X,
  Send,
  Bot,
  User,
  ExternalLink,
  ShieldAlert,
  Droplets,
  HelpCircle,
  PhoneCall,
  CheckCircle2,
  ChevronDown,
  Minimize2,
  Maximize2,
  RefreshCw,
  Headphones
} from "lucide-react";
import { SITE_CONFIG } from "@/lib/config";
import { getWhatsAppUrl } from "@/lib/whatsapp";

interface ProductSuggestion {
  name: string;
  slug: string;
  category: string;
  product_image?: string | null;
  reason: string;
}

interface ChatMessage {
  id: string;
  sender: "user" | "bot";
  text: string;
  suggestedProducts?: ProductSuggestion[];
  dilutionGuide?: Record<string, string>;
  safetyWarnings?: string[];
  suggestedQuestions?: string[];
  whatsappMessage?: string;
  timestamp: string;
}

const QUICK_PROMPTS = [
  "Dilution for Italian marble floors",
  "How to unclog commercial kitchen grease trap?",
  "Longest lasting air freshener for AC rooms",
  "Hospital ward disinfection protocol",
  "Safe descaler for yellow toilet stains"
];

export default function AskChemistWidget() {
  const [isOpen, setIsOpen] = useState(false);
  const [isMinimized, setIsMinimized] = useState(false);
  const [inputQuery, setInputQuery] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: "initial-welcome",
      sender: "bot",
      text: `👋 **Hello! Welcome to LIOC Chat Support.**

I am your AI Product & Hygiene Specialist. I can instantly assist you with:
- 🧪 **Dilution Ratios & Water SOPs**
- 🏛️ **Surface Safety (Italian Marble, Granite, Tiles)**
- 🏨 **Hotel Guest Amenities & Luxury Bedding**
- 🍽️ **Commercial Kitchen Degreasing & Grease Traps**
- 🏥 **Healthcare & Institutional Disinfection Protocols**

How can we assist your business or housekeeping team today?`,
      suggestedQuestions: QUICK_PROMPTS,
      timestamp: "Just now"
    }
  ]);

  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    if (isOpen && !isMinimized) {
      scrollToBottom();
    }
  }, [messages, isOpen, isMinimized]);

  const handleSendMessage = async (textToSend?: string) => {
    const query = (textToSend || inputQuery).trim();
    if (!query || isLoading) return;

    const userMsgId = `user-${Date.now()}`;
    const userMsg: ChatMessage = {
      id: userMsgId,
      sender: "user",
      text: query,
      timestamp: "Just now"
    };

    setMessages((prev) => [...prev, userMsg]);
    setInputQuery("");
    setIsLoading(true);

    try {
      const res = await fetch(`${SITE_CONFIG.apiUrl}/assistant/chat`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: query })
      });

      if (!res.ok) {
        throw new Error("Assistant service temporarily unavailable");
      }

      const data = await res.json();
      const botMsg: ChatMessage = {
        id: `bot-${Date.now()}`,
        sender: "bot",
        text: data.reply,
        suggestedProducts: data.suggested_products,
        dilutionGuide: data.dilution_guide,
        safetyWarnings: data.safety_warnings,
        suggestedQuestions: data.suggested_questions,
        whatsappMessage: data.whatsapp_message,
        timestamp: "Just now"
      };

      setMessages((prev) => [...prev, botMsg]);
    } catch (e) {
      // Graceful intelligent client-side fallback
      const fallbackMsg: ChatMessage = {
        id: `bot-fb-${Date.now()}`,
        sender: "bot",
        text: `### LIOC Product & Hygiene Support:
Regarding **"${query}"**:

- For **Marble & Tiles**, use **LIOC White Herbal Disinfectant Floor Cleaner** (1:100 daily dilution) to protect stone shine and keep insects away.
- For **Heavy Kitchen Grease & Choked Drains**, utilize **Industrial Caustic Soda Flakes (99%)** or **LIOC Ultra Dishwash Concentrated Liquid**.
- For **Ambient Room Freshness**, select **LIOC Jasmine Bloom / Sandal Exotic 200ml** botanical sprays.

You can also connect directly with our support team on WhatsApp for custom facility dosage and wholesale orders!`,
        whatsappMessage: `Hi LIOC Support Team, I asked the Chat Support: "${query}". Please provide factory bulk quotation and technical advice.`,
        suggestedQuestions: QUICK_PROMPTS.slice(0, 3),
        timestamp: "Just now"
      };
      setMessages((prev) => [...prev, fallbackMsg]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      {/* Floating Widget Trigger Button */}
      {!isOpen && (
        <div className="fixed bottom-6 right-6 z-40 flex items-center space-x-3">
          {/* Pulsing pill on desktop */}
          <button
            onClick={() => setIsOpen(true)}
            className="hidden sm:flex items-center space-x-2 bg-slate-900/90 hover:bg-slate-800 text-white text-xs font-semibold py-2 px-3.5 rounded-full border border-teal-500/40 shadow-xl backdrop-blur transition-all duration-200 hover:scale-105 cursor-pointer"
          >
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-teal-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-teal-500"></span>
            </span>
            <span>Chat Support</span>
          </button>

          <button
            onClick={() => setIsOpen(true)}
            className="group relative flex items-center justify-center w-14 h-14 rounded-full bg-gradient-to-tr from-teal-600 via-teal-500 to-cyan-500 text-white shadow-2xl shadow-teal-500/40 hover:scale-105 active:scale-95 transition-all duration-200 border border-white/20"
            aria-label="Open Chat Support"
          >
            <MessageSquare className="w-6 h-6 text-white group-hover:scale-110 transition" />
            <span className="absolute -top-1 -right-1 flex h-4 w-4">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-teal-300 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-4 w-4 bg-teal-400 border-2 border-slate-950"></span>
            </span>
          </button>
        </div>
      )}

      {/* Expanded Chat Window */}
      {isOpen && (
        <div
          className={`fixed z-50 transition-all duration-300 ${
            isMinimized
              ? "bottom-6 right-6 w-80 h-14 bg-slate-900 rounded-2xl border border-slate-800 shadow-2xl overflow-hidden"
              : "bottom-4 right-4 sm:bottom-6 sm:right-6 w-[calc(100vw-2rem)] sm:w-[460px] h-[600px] max-h-[88vh] bg-slate-950 rounded-3xl border border-slate-800 shadow-2xl shadow-slate-950/80 flex flex-col overflow-hidden backdrop-blur"
          }`}
        >
          {/* Header Bar */}
          <div className="flex items-center justify-between px-5 py-3.5 bg-gradient-to-r from-slate-900 via-slate-900 to-teal-950 border-b border-slate-800 text-white flex-shrink-0">
            <div className="flex items-center space-x-3">
              <div className="relative w-9 h-9 rounded-xl bg-teal-500/20 border border-teal-500/40 flex items-center justify-center text-teal-300">
                <Headphones className="w-5 h-5" />
                <span className="absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5 rounded-full bg-teal-400 border-2 border-slate-900" />
              </div>
              <div>
                <div className="flex items-center space-x-2">
                  <h3 className="text-sm font-bold text-white">LIOC Chat Support</h3>
                  <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-teal-500/20 text-teal-300 border border-teal-500/30">
                    AI Specialist
                  </span>
                </div>
                <p className="text-[11px] text-slate-400">Product Guidance & Technical Advisory</p>
              </div>
            </div>

            <div className="flex items-center space-x-1">
              <button
                onClick={() => setIsMinimized(!isMinimized)}
                className="p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 transition"
                title={isMinimized ? "Expand" : "Minimize"}
              >
                {isMinimized ? <Maximize2 className="w-4 h-4" /> : <Minimize2 className="w-4 h-4" />}
              </button>
              <button
                onClick={() => setIsOpen(false)}
                className="p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 transition"
                title="Close"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>

          {!isMinimized && (
            <>
              {/* Chat Message Scroll Area */}
              <div className="flex-1 p-4 overflow-y-auto space-y-4 text-xs sm:text-sm bg-slate-950/60">
                {messages.map((msg) => (
                  <div
                    key={msg.id}
                    className={`flex items-start gap-2.5 ${
                      msg.sender === "user" ? "justify-end" : "justify-start"
                    }`}
                  >
                    {msg.sender === "bot" && (
                      <div className="w-7 h-7 rounded-lg bg-teal-500/20 border border-teal-500/30 flex items-center justify-center text-teal-300 flex-shrink-0 mt-0.5">
                        <Bot className="w-4 h-4" />
                      </div>
                    )}

                    <div
                      className={`max-w-[85%] rounded-2xl p-4 shadow-sm ${
                        msg.sender === "user"
                          ? "bg-teal-600 text-white rounded-tr-none"
                          : "bg-slate-900 border border-slate-800 text-slate-200 rounded-tl-none"
                      }`}
                    >
                      {/* Message Text with simple formatting */}
                      <div className="whitespace-pre-wrap leading-relaxed space-y-2">
                        {msg.text.split("\n\n").map((para, i) => (
                          <div key={i}>
                            {para.startsWith("### ") ? (
                              <h4 className="font-bold text-teal-300 text-xs sm:text-sm uppercase tracking-wide mb-1">
                                {para.replace("### ", "")}
                              </h4>
                            ) : para.startsWith("- ") ? (
                              <ul className="list-disc list-inside space-y-1 text-slate-300">
                                {para.split("\n").map((line, li) => (
                                  <li key={li}>{line.replace("- ", "")}</li>
                                ))}
                              </ul>
                            ) : (
                              <p className="text-slate-200">{para}</p>
                            )}
                          </div>
                        ))}
                      </div>

                      {/* Dilution Guide Box if present */}
                      {msg.dilutionGuide && (
                        <div className="mt-3 p-2.5 rounded-xl bg-slate-950/80 border border-teal-500/30 text-xs space-y-1">
                          <div className="font-bold text-teal-300 flex items-center space-x-1 mb-1">
                            <Droplets className="w-3.5 h-3.5 text-teal-400" />
                            <span>Recommended Dilution Recipes:</span>
                          </div>
                          {Object.entries(msg.dilutionGuide).map(([k, v]) => (
                            <div key={k} className="flex justify-between border-b border-slate-800/80 pb-1">
                              <span className="text-slate-400">{k}:</span>
                              <span className="font-semibold text-white">{v}</span>
                            </div>
                          ))}
                        </div>
                      )}

                      {/* Safety Warnings if present */}
                      {msg.safetyWarnings && msg.safetyWarnings.length > 0 && (
                        <div className="mt-2.5 p-2.5 rounded-xl bg-amber-950/30 border border-amber-500/30 text-[11px] text-amber-200 space-y-0.5">
                          <div className="font-bold text-amber-300 flex items-center space-x-1 mb-0.5">
                            <ShieldAlert className="w-3.5 h-3.5 text-amber-400" />
                            <span>Safety Caution:</span>
                          </div>
                          {msg.safetyWarnings.map((w, wi) => (
                            <div key={wi}>• {w}</div>
                          ))}
                        </div>
                      )}

                      {/* Suggested Product Cards */}
                      {msg.suggestedProducts && msg.suggestedProducts.length > 0 && (
                        <div className="mt-3 pt-3 border-t border-slate-800 space-y-2">
                          <div className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
                            Recommended Products:
                          </div>
                          <div className="grid grid-cols-1 gap-2">
                            {msg.suggestedProducts.map((p, pi) => (
                              <Link
                                key={pi}
                                href={`/products/${p.slug}`}
                                onClick={() => setIsOpen(false)}
                                className="flex items-center justify-between p-2 rounded-xl bg-slate-950 hover:bg-teal-950/30 border border-slate-800 hover:border-teal-500/40 transition group"
                              >
                                <div className="flex items-center space-x-2.5 min-w-0">
                                  {p.product_image ? (
                                    <div className="relative w-8 h-8 rounded-lg overflow-hidden bg-slate-900 flex-shrink-0">
                                      <Image src={p.product_image} alt={p.name} fill className="object-cover" />
                                    </div>
                                  ) : (
                                    <div className="w-8 h-8 rounded-lg bg-teal-500/10 flex items-center justify-center text-teal-400 flex-shrink-0">
                                      <Sparkles className="w-4 h-4" />
                                    </div>
                                  )}
                                  <div className="truncate">
                                    <div className="font-semibold text-xs text-white group-hover:text-teal-300 truncate">
                                      {p.name}
                                    </div>
                                    <div className="text-[10px] text-slate-400 truncate">{p.reason}</div>
                                  </div>
                                </div>
                                <ExternalLink className="w-3.5 h-3.5 text-slate-500 group-hover:text-teal-400 flex-shrink-0 ml-2" />
                              </Link>
                            ))}
                          </div>
                        </div>
                      )}

                      {/* WhatsApp Handover Button */}
                      {msg.whatsappMessage && (
                        <div className="mt-3 pt-2.5 border-t border-slate-800">
                          <a
                            href={getWhatsAppUrl({ customMessage: msg.whatsappMessage })}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center space-x-1.5 px-3 py-1.5 bg-emerald-600 hover:bg-emerald-500 text-white rounded-lg text-xs font-semibold shadow-sm transition"
                          >
                            <PhoneCall className="w-3.5 h-3.5" />
                            <span>Connect with Support on WhatsApp</span>
                          </a>
                        </div>
                      )}
                    </div>

                    {msg.sender === "user" && (
                      <div className="w-7 h-7 rounded-lg bg-teal-600 flex items-center justify-center text-white flex-shrink-0 mt-0.5">
                        <User className="w-4 h-4" />
                      </div>
                    )}
                  </div>
                ))}

                {/* Loading Indicator */}
                {isLoading && (
                  <div className="flex items-start gap-2.5">
                    <div className="w-7 h-7 rounded-lg bg-teal-500/20 border border-teal-500/30 flex items-center justify-center text-teal-300 flex-shrink-0">
                      <Bot className="w-4 h-4" />
                    </div>
                    <div className="bg-slate-900 border border-slate-800 rounded-2xl rounded-tl-none p-3.5 flex items-center space-x-2">
                      <RefreshCw className="w-4 h-4 text-teal-400 animate-spin" />
                      <span className="text-xs text-slate-400">LIOC Support is generating response...</span>
                    </div>
                  </div>
                )}

                <div ref={messagesEndRef} />
              </div>

              {/* Quick Prompt Suggestion Pills */}
              <div className="px-4 py-2 bg-slate-900/90 border-t border-slate-800/80 overflow-x-auto no-scrollbar flex space-x-2 flex-shrink-0">
                {QUICK_PROMPTS.map((prompt, idx) => (
                  <button
                    key={idx}
                    onClick={() => handleSendMessage(prompt)}
                    disabled={isLoading}
                    className="flex-shrink-0 text-[11px] px-2.5 py-1 rounded-full bg-slate-950 border border-slate-800 text-slate-300 hover:text-white hover:border-teal-500/50 transition whitespace-nowrap cursor-pointer"
                  >
                    💡 {prompt}
                  </button>
                ))}
              </div>

              {/* Input Bar */}
              <div className="p-3 bg-slate-900 border-t border-slate-800 flex items-center space-x-2 flex-shrink-0">
                <input
                  type="text"
                  placeholder="Ask about products, dilution, surface safety, pricing..."
                  value={inputQuery}
                  onChange={(e) => setInputQuery(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter" && !e.shiftKey) {
                      e.preventDefault();
                      handleSendMessage();
                    }
                  }}
                  disabled={isLoading}
                  className="flex-1 px-3.5 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-xs sm:text-sm text-white placeholder-slate-500 focus:outline-none focus:border-teal-500 transition"
                />
                <button
                  onClick={() => handleSendMessage()}
                  disabled={!inputQuery.trim() || isLoading}
                  className="p-2.5 rounded-xl bg-teal-600 hover:bg-teal-500 disabled:opacity-50 text-white transition shadow-sm cursor-pointer"
                  title="Send Query"
                >
                  <Send className="w-4 h-4" />
                </button>
              </div>
            </>
          )}
        </div>
      )}
    </>
  );
}
