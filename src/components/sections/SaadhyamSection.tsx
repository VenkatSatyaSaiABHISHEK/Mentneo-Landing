"use client";

import React, { useRef, useState } from "react";
import Link from "next/link";
import { ArrowUpRight, PhoneCall } from "lucide-react";

interface AiHumanCard {
  id: string;
  name: string;
  role: string;
  tagline: string;
  voice: boolean;
  capabilities: string[];
  deploymentTag: string;
  accent: string;
}

const AI_HUMANS: AiHumanCard[] = [
  {
    id: "sara",
    name: "Sara",
    role: "Voice Calling & Client Onboarding",
    tagline: "An AI voice agent that talks and reasons like a person in real time.",
    voice: true,
    capabilities: [
      "Natural conversational cadence & zero robotic latency",
      "Bilingual fluency across English & regional Indian languages",
      "Autonomous booking, qualification & CRM updating",
    ],
    deploymentTag: "Voice AI Employee",
    accent: "#2F5BFF",
  },
  {
    id: "diya",
    name: "Diya",
    role: "Autonomous Digital Marketing",
    tagline: "An always-on marketing workforce for scaling brand visibility.",
    voice: false,
    capabilities: [
      "Automated multi-channel content creation & copywriting",
      "Real-time SEO keyword tracking & trend monitoring",
      "Social growth loops and performance analytics synthesis",
    ],
    deploymentTag: "Growth & Creative",
    accent: "#E11D48",
  },
  {
    id: "valmiki",
    name: "Valmiki",
    role: "Deep Research & Enterprise Intelligence",
    tagline: "Synthesizes complex documents, competitor landscapes, and industry data.",
    voice: false,
    capabilities: [
      "Multi-source intelligence gathering & citation synthesis",
      "Long-context whitepaper & financial statement breakdown",
      "Executive briefs generated on daily automated schedules",
    ],
    deploymentTag: "Research & Strategy",
    accent: "#059669",
  },
  {
    id: "rudra",
    name: "Rudra",
    role: "Operations & Back-Office Automation",
    tagline: "Orchestrates multi-step operational tasks across enterprise tools.",
    voice: false,
    capabilities: [
      "Autonomous ERP, database & billing reconciliation",
      "High-throughput document verification & invoice matching",
      "Automated incident escalation & status reporting",
    ],
    deploymentTag: "Operations Engine",
    accent: "#D97706",
  },
  {
    id: "law-ai",
    name: "Law AI",
    role: "Legal Assistant & Contract Drafting",
    tagline: "Precision legal research, contract review, and compliance intelligence.",
    voice: false,
    capabilities: [
      "Clause-by-clause contract analysis & risk flag detection",
      "Statutory compliance cross-referencing for Indian laws",
      "Standard agreement generation customized to company policies",
    ],
    deploymentTag: "Legal & Compliance",
    accent: "#7C3AED",
  },
  {
    id: "custom",
    name: "Custom AI Human",
    role: "Bespoke Enterprise Digital Employees",
    tagline: "Trained on your private datasets, SOPs, and proprietary enterprise software.",
    voice: true,
    capabilities: [
      "Air-gapped on-premise or cloud tenant deployment",
      "Custom tool execution via authenticated API sandboxes",
      "Granular role-based access control & full audit trails",
    ],
    deploymentTag: "Custom Solution",
    accent: "#0B0C0E",
  },
];

export default function SaadhyamSection() {
  const railRef = useRef<HTMLDivElement>(null);
  const [activeHuman, setActiveHuman] = useState<string | null>(null);

  const scrollRail = (direction: "left" | "right") => {
    if (!railRef.current) return;
    const amount = direction === "left" ? -400 : 400;
    railRef.current.scrollBy({ left: amount, behavior: "smooth" });
  };

  return (
    <section
      id="chapter-6"
      data-theme="light"
      className="relative min-h-screen bg-[#F5F4F0] text-[#0B0C0E] px-6 py-28 flex flex-col justify-between overflow-hidden select-none border-t border-[#E9E7E1]"
    >
      {/* Background Micro Grid and Paper Texture */}
      <div className="absolute inset-0 bg-tech-grid-light opacity-50 pointer-events-none" />
      <div className="absolute bottom-1/4 left-1/4 w-[500px] h-[500px] rounded-full bg-[#2F5BFF]/[0.03] blur-[150px] pointer-events-none" />

      {/* Chapter Tag & Headline */}
      <div className="relative z-10 max-w-6xl mx-auto w-full flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-[#2F5BFF]/30 bg-[#2F5BFF]/[0.08] mb-4">
            <span className="w-1.5 h-1.5 rounded-full bg-[#2F5BFF]" />
            <span className="font-mono text-xs uppercase tracking-wideMono text-[#2F5BFF] font-semibold">
              AI WORKFORCE PLATFORM · WWW.SAADHYAM.COM
            </span>
          </div>
          <h2 className="text-4xl sm:text-6xl font-light tracking-[-0.04em] text-[#0B0C0E]">
            Saadhyam. <br />
            <span className="text-[#4A4E57]">AI humans that work like employees.</span>
          </h2>
          <p className="mt-4 text-base sm:text-lg text-[#4A4E57] max-w-xl leading-relaxed">
            Don&apos;t just use AI chatbots. Build your autonomous digital workforce.
            Create, deploy, and manage AI Humans with assigned business roles, deep workflows, voice capabilities, and continuous 24/7 execution.
          </p>
        </div>

        {/* Top Direct Action Link to www.saadhyam.com & Rail Controls */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3">
          <Link
            href="https://www.saadhyam.com"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-[#0B0C0E] text-white text-xs font-semibold hover:bg-black transition-all shadow-md group"
          >
            <span>Visit www.saadhyam.com</span>
            <ArrowUpRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
          </Link>

          <div className="flex items-center gap-2">
            <button
              onClick={() => scrollRail("left")}
              aria-label="Scroll left"
              className="w-10 h-10 rounded-full border border-[#DDD9D0] bg-white hover:bg-[#ECEAE4] flex items-center justify-center text-[#0B0C0E] shadow-sm transition-colors"
            >
              ←
            </button>
            <button
              onClick={() => scrollRail("right")}
              aria-label="Scroll right"
              className="w-10 h-10 rounded-full border border-[#DDD9D0] bg-white hover:bg-[#ECEAE4] flex items-center justify-center text-[#0B0C0E] shadow-sm transition-colors"
            >
              →
            </button>
          </div>
        </div>
      </div>

      {/* Draggable / Scrollable AI Humans Rail */}
      <div className="relative z-10 max-w-7xl mx-auto w-full">
        <div
          ref={railRef}
          className="flex gap-6 overflow-x-auto pb-8 pt-2 scrollbar-none snap-x snap-mandatory"
          style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
        >
          {AI_HUMANS.map((human) => {
            const isHovered = activeHuman === human.id;

            return (
              <div
                key={human.id}
                onMouseEnter={() => setActiveHuman(human.id)}
                onMouseLeave={() => setActiveHuman(null)}
                className={`flex-none w-[320px] sm:w-[380px] rounded-2xl border transition-all duration-300 p-7 flex flex-col justify-between snap-start cursor-pointer ${
                  isHovered
                    ? "bg-white border-[#2F5BFF]/50 shadow-[0_25px_50px_rgba(11,12,14,0.1)] scale-[1.01]"
                    : "bg-white border-[#E9E7E1] shadow-[0_8px_25px_rgba(11,12,14,0.04)] hover:border-[#DDD9D0]"
                }`}
              >
                {/* Card Header */}
                <div>
                  <div className="flex items-center justify-between pb-4 border-b border-[#E9E7E1]">
                    <span className="font-mono text-xs text-[#2F5BFF] font-bold">
                      {human.deploymentTag}
                    </span>
                    <span className="inline-flex items-center gap-1.5 font-mono text-[10px] px-2.5 py-0.5 rounded-full border border-emerald-200 bg-emerald-50 text-emerald-700 font-semibold">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                      Active Workforce
                    </span>
                  </div>

                  <div className="mt-4 flex items-baseline gap-2">
                    <h3 className="text-2xl font-semibold tracking-tight text-[#0B0C0E]">
                      {human.name}
                    </h3>
                    {human.voice && (
                      <span className="inline-flex items-center gap-1 text-[10px] font-mono text-[#2F5BFF] bg-[#2F5BFF]/10 px-2 py-0.5 rounded-md">
                        <PhoneCall className="w-2.5 h-2.5" />
                        Voice Enabled
                      </span>
                    )}
                  </div>

                  <p className="text-xs font-mono text-[#737883] mt-1">
                    {human.role}
                  </p>

                  <p className="text-sm text-[#4A4E57] mt-3 leading-relaxed">
                    {human.tagline}
                  </p>
                </div>

                {/* Capabilities Breakdown */}
                <div className="my-6 pt-4 border-t border-[#E9E7E1]">
                  <span className="font-mono text-[10px] text-[#737883] uppercase tracking-wideMono block mb-2.5">
                    CORE OPERATIONAL CAPABILITIES
                  </span>
                  <ul className="space-y-2 font-mono text-xs text-[#0B0C0E]">
                    {human.capabilities.map((cap, i) => (
                      <li key={i} className="flex items-start gap-2">
                        <span className="text-[#2F5BFF] mt-0.5 font-bold">·</span>
                        <span className="line-clamp-2 leading-relaxed">{cap}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Footer Action */}
                <div className="pt-4 border-t border-[#E9E7E1] flex items-center justify-between font-mono text-xs text-[#737883]">
                  <span>POWERED BY SAADHYAM</span>
                  <Link
                    href="https://www.saadhyam.com"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-[#2F5BFF] font-semibold flex items-center gap-1 hover:underline"
                  >
                    <span>Deploy Employee</span>
                    <ArrowUpRight className="w-3.5 h-3.5" />
                  </Link>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Bottom Accreditation Banner */}
      <div className="relative z-10 max-w-6xl mx-auto w-full pt-8 border-t border-[#E9E7E1] flex flex-wrap items-center justify-between font-mono text-xs text-[#737883] gap-4">
        <span>PLATFORM: WWW.SAADHYAM.COM</span>
        <span>MODELS: MENTNEO SOVEREIGN FOUNDATION MODELS</span>
        <span>DEPLOYMENT: CLOUD HOSTED &amp; ON-PREMISE PRIVATE CLUSTER</span>
      </div>
    </section>
  );
}
