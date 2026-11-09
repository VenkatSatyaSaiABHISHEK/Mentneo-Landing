"use client";

import React, { useEffect, useRef, useState } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

export default function EnterpriseGov() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const diagramRef = useRef<SVGSVGElement>(null);
  const [counts, setCounts] = useState({
    uptime: 0,
    egress: 0,
    queries: 0,
    latency: 0,
  });

  useEffect(() => {
    if (typeof window === "undefined") return;
    gsap.registerPlugin(ScrollTrigger);

    const section = sectionRef.current;
    const diagram = diagramRef.current;
    if (!section) return;

    // Trigger path drawing and counter count-up when section enters view
    const st = ScrollTrigger.create({
      trigger: section,
      start: "top 65%",
      onEnter: () => {
        // Animate SVG perimeter path
        if (diagram) {
          const boundaryPath = diagram.querySelector(".enclave-path");
          if (boundaryPath) {
            gsap.fromTo(
              boundaryPath,
              { strokeDashoffset: 1400 },
              { strokeDashoffset: 0, duration: 2.2, ease: "power3.out" }
            );
          }
        }

        // Animate Telemetry Counters
        gsap.to(
          {},
          {
            duration: 2.0,
            ease: "power2.out",
            onUpdate: function () {
              const p = this.progress();
              setCounts({
                uptime: +(p * 99.999).toFixed(3),
                egress: 0,
                queries: Math.floor(p * 42),
                latency: Math.floor((1 - p) * 120 + 38),
              });
            },
          }
        );
      },
    });

    return () => st.kill();
  }, []);

  return (
    <section
      id="chapter-5"
      data-theme="light"
      ref={sectionRef}
      className="relative min-h-screen bg-[#F5F4F0] text-[#0B0C0E] px-6 py-28 flex flex-col justify-between items-center overflow-hidden transition-colors duration-1000 select-none"
    >
      {/* Background Micro Grid and Paper Texture */}
      <div className="absolute inset-0 bg-tech-grid-light opacity-50 pointer-events-none" />
      <div className="absolute top-1/3 right-1/4 w-[600px] h-[600px] rounded-full bg-[#2F5BFF]/[0.04] blur-[140px] pointer-events-none" />

      {/* Chapter Tag & Headline */}
      <div className="relative z-10 max-w-4xl mx-auto text-center">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-[#2F5BFF]/30 bg-[#2F5BFF]/[0.08] mb-4">
          <span className="w-1.5 h-1.5 rounded-full bg-[#2F5BFF]" />
          <span className="font-mono text-xs uppercase tracking-wideMono text-[#2F5BFF] font-semibold">
            CHAPTER 05 · SOVEREIGN ARCHITECTURE
          </span>
        </div>

        <h2 className="text-4xl sm:text-6xl font-light tracking-[-0.04em] text-[#0B0C0E]">
          Enterprise & Government. <br />
          <span className="text-[#4A4E57]">Air-gapped by design.</span>
        </h2>
        <p className="mt-4 text-base sm:text-lg text-[#4A4E57] max-w-2xl mx-auto leading-relaxed">
          Mission-critical infrastructure for defense, public sector administration, and sovereign
          intelligence. Complete on-premise execution with zero telemetry leaks to foreign clouds.
        </p>
      </div>

      {/* Main Self-Drawing SVG Boundary Security Diagram in Dark Ink Lines on Crisp Paper */}
      <div className="relative z-10 w-full max-w-5xl mx-auto my-12 p-6 rounded-2xl border border-[#E9E7E1] bg-white shadow-[0_20px_50px_rgba(11,12,14,0.06)]">
        <div className="flex items-center justify-between pb-4 border-b border-[#E9E7E1] font-mono text-xs">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-[#2F5BFF]" />
            <span className="text-[#0B0C0E] font-semibold uppercase tracking-wideMono">
              SOVEREIGN ENCLAVE TOPOLOGY · AIR-GAPPED PERIMETER
            </span>
          </div>
          <span className="text-[#2F5BFF] font-bold">ISO 27001 · FedRAMP High Ready</span>
        </div>

        {/* Self-Drawing Interactive SVG Diagram */}
        <div className="relative w-full h-[320px] sm:h-[360px] my-4 flex items-center justify-center">
          <svg
            ref={diagramRef}
            viewBox="0 0 900 360"
            className="w-full h-full overflow-visible"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            {/* Outer Ingress Zone */}
            <rect
              x="30"
              y="50"
              width="200"
              height="260"
              rx="12"
              fill="#F9F9F8"
              stroke="#DDD9D0"
              strokeDasharray="4 4"
            />
            <text x="130" y="80" textAnchor="middle" fill="#737883" fontSize="11" fontFamily="monospace">
              EXTERNAL INTAKE
            </text>
            <text x="130" y="140" textAnchor="middle" fill="#0B0C0E" fontSize="13" fontWeight="500" fontFamily="sans-serif">
              Citizen Queries
            </text>
            <text x="130" y="170" textAnchor="middle" fill="#0B0C0E" fontSize="13" fontWeight="500" fontFamily="sans-serif">
              Public Land Records
            </text>
            <text x="130" y="200" textAnchor="middle" fill="#0B0C0E" fontSize="13" fontWeight="500" fontFamily="sans-serif">
              Enterprise Invoices
            </text>

            {/* Connecting Ingress Channel with Filter */}
            <line x1="230" y1="180" x2="330" y2="180" stroke="#2F5BFF" strokeWidth="2" strokeDasharray="6 4" />
            <circle cx="280" cy="180" r="14" fill="#FFFFFF" stroke="#2F5BFF" strokeWidth="1.5" />
            <text x="280" y="184" textAnchor="middle" fill="#2F5BFF" fontSize="9" fontWeight="bold" fontFamily="monospace">
              GATE
            </text>

            {/* THE IMPENETRABLE AIR-GAPPED PERIMETER (Self-Drawing Path) */}
            <rect
              className="enclave-path"
              x="340"
              y="30"
              width="530"
              height="300"
              rx="16"
              fill="rgba(47, 91, 255, 0.02)"
              stroke="#2F5BFF"
              strokeWidth="2"
              strokeDasharray="1400"
              strokeDashoffset="0"
            />

            {/* Enclave Interior Security Nodes */}
            <g transform="translate(370, 70)">
              {/* Node 1: Sovereign Document Processing */}
              <rect x="0" y="0" width="220" height="90" rx="8" fill="#FFFFFF" stroke="#E9E7E1" strokeWidth="1.5" />
              <text x="15" y="25" fill="#2F5BFF" fontSize="11" fontWeight="bold" fontFamily="monospace">
                CORE 01 · EXTRACTION
              </text>
              <text x="15" y="48" fill="#0B0C0E" fontSize="13" fontWeight="600" fontFamily="sans-serif">
                Document Intelligence
              </text>
              <text x="15" y="70" fill="#4A4E57" fontSize="11" fontFamily="sans-serif">
                Automatic redaction of PII &amp; secrets
              </text>

              {/* Node 2: Local Sovereign Weights */}
              <rect x="250" y="0" width="220" height="90" rx="8" fill="#FFFFFF" stroke="#E9E7E1" strokeWidth="1.5" />
              <text x="265" y="25" fill="#0B0C0E" fontSize="11" fontWeight="bold" fontFamily="monospace">
                CORE 02 · ON-PREM MODEL
              </text>
              <text x="265" y="48" fill="#0B0C0E" fontSize="13" fontWeight="600" fontFamily="sans-serif">
                Air-Gapped Mentneo LLM
              </text>
              <text x="265" y="70" fill="#4A4E57" fontSize="11" fontFamily="sans-serif">
                Direct inference on bare-metal racks
              </text>

              {/* Node 3: Citizen Service Telemetry */}
              <rect x="0" y="120" width="220" height="90" rx="8" fill="#FFFFFF" stroke="#E9E7E1" strokeWidth="1.5" />
              <text x="15" y="145" fill="#4A4E57" fontSize="11" fontWeight="bold" fontFamily="monospace">
                CORE 03 · CIVIC BOT
              </text>
              <text x="15" y="168" fill="#0B0C0E" fontSize="13" fontWeight="600" fontFamily="sans-serif">
                Citizen Service Engine
              </text>
              <text x="15" y="190" fill="#4A4E57" fontSize="11" fontFamily="sans-serif">
                Multilingual vernacular telephony
              </text>

              {/* Node 4: Cryptographic Zero-Egress Attestation */}
              <rect x="250" y="120" width="220" height="90" rx="8" fill="#FFFFFF" stroke="#2F5BFF" strokeWidth="1.5" />
              <text x="265" y="145" fill="#2F5BFF" fontSize="11" fontWeight="bold" fontFamily="monospace">
                SECURITY BARRIER
              </text>
              <text x="265" y="168" fill="#2F5BFF" fontSize="13" fontWeight="700" fontFamily="sans-serif">
                Zero Cloud Egress: 0 Bytes
              </text>
              <text x="265" y="190" fill="#4A4E57" fontSize="11" fontFamily="sans-serif">
                Cryptographic hardware attestation
              </text>
            </g>
          </svg>
        </div>

        {/* Real-time Sovereign Audit Badge */}
        <div className="flex flex-wrap items-center justify-between pt-3 border-t border-[#E9E7E1] font-mono text-xs text-[#737883]">
          <span>PHYSICAL LAYER: AIR-GAPPED DARK FIBER ONLY</span>
          <span className="text-[#2F5BFF] font-semibold">EGRESS TRAFFIC AUDIT: BLOCKED (0.00KB/S)</span>
        </div>
      </div>

      {/* 4 Animated Live Telemetry Counters in Crisp Paper White Cards */}
      <div className="relative z-10 w-full max-w-5xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-4 mt-4">
        {/* Counter 1 */}
        <div className="p-5 rounded-xl border border-[#E9E7E1] bg-white shadow-sm text-center">
          <span className="font-mono text-xs text-[#737883] uppercase tracking-wideMono block mb-1">
            AIR-GAPPED UPTIME
          </span>
          <span className="font-mono text-2xl sm:text-3xl font-bold text-[#0B0C0E] block">
            {counts.uptime}%
          </span>
          <span className="text-xs text-[#4A4E57] mt-1 block">Tier-4 Sovereign Spec</span>
        </div>

        {/* Counter 2 */}
        <div className="p-5 rounded-xl border border-[#E9E7E1] bg-white shadow-sm text-center">
          <span className="font-mono text-xs text-[#737883] uppercase tracking-wideMono block mb-1">
            OFF-PREMISE EGRESS
          </span>
          <span className="font-mono text-2xl sm:text-3xl font-bold text-[#2F5BFF] block">
            {counts.egress} BYTES
          </span>
          <span className="text-xs text-[#4A4E57] mt-1 block">Zero External Transmit</span>
        </div>

        {/* Counter 3 */}
        <div className="p-5 rounded-xl border border-[#E9E7E1] bg-white shadow-sm text-center">
          <span className="font-mono text-xs text-[#737883] uppercase tracking-wideMono block mb-1">
            CITIZEN QUERIES SERVED
          </span>
          <span className="font-mono text-2xl sm:text-3xl font-bold text-[#0B0C0E] block">
            {counts.queries}M+
          </span>
          <span className="text-xs text-[#4A4E57] mt-1 block">State &amp; Municipal Depts</span>
        </div>

        {/* Counter 4 */}
        <div className="p-5 rounded-xl border border-[#E9E7E1] bg-white shadow-sm text-center">
          <span className="font-mono text-xs text-[#737883] uppercase tracking-wideMono block mb-1">
            ON-PREM DOC PARSE
          </span>
          <span className="font-mono text-2xl sm:text-3xl font-bold text-[#2F5BFF] block">
            &lt; {counts.latency} ms
          </span>
          <span className="text-xs text-[#4A4E57] mt-1 block">SIMD Native Ingestion</span>
        </div>
      </div>
    </section>
  );
}
