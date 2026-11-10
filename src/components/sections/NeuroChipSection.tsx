"use client";

import React, { useEffect, useRef, useState } from "react";
import dynamic from "next/dynamic";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import ChipStaticFallback from "@/components/3d/ChipStaticFallback";

// Lazy-load the 3D canvas for maximum performance and 60fps
const ChipExploded3D = dynamic(() => import("@/components/3d/ChipExploded3D"), {
  ssr: false,
  loading: () => <ChipStaticFallback progress={0.4} />,
});

export default function NeuroChipSection() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const [progress, setProgress] = useState(0.2);

  useEffect(() => {
    if (typeof window === "undefined") return;
    gsap.registerPlugin(ScrollTrigger);

    const section = sectionRef.current;
    if (!section) return;

    const st = ScrollTrigger.create({
      trigger: section,
      start: "top top",
      end: "+=140%",
      pin: true,
      scrub: 0.8,
      anticipatePin: 1,
      onUpdate: (self) => {
        setProgress(self.progress);
      },
    });

    return () => {
      st.kill();
    };
  }, []);

  return (
    <section
      id="chapter-4"
      ref={sectionRef}
      className="relative min-h-screen bg-[#12151A] text-[#F2F2F0] px-6 py-20 flex flex-col justify-between items-center overflow-hidden select-none"
    >
      {/* Background Micro Grid and Amber Specular Light */}
      <div className="absolute inset-0 bg-tech-grid opacity-20 pointer-events-none" />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full bg-[#F59E0B]/[0.05] blur-[150px] pointer-events-none" />

      {/* Chapter Header */}
      <div className="relative z-10 max-w-4xl mx-auto text-center">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-[#F59E0B]/30 bg-[#F59E0B]/[0.05] mb-4">
          <span className="w-1.5 h-1.5 rounded-full bg-[#F59E0B] animate-pulse" />
          <span className="font-mono text-[11px] uppercase tracking-wideMono text-[#F59E0B]">
            CHIP · HARDWARE FOUNDRY
          </span>
        </div>

        <h2 className="text-4xl sm:text-6xl font-light tracking-[-0.04em] text-white">
          Neuro HGI Chip. <br />
          <span className="text-[#8A8F98]">2.2 mm of neuromorphic certainty.</span>
        </h2>
        <p className="mt-3 text-sm sm:text-base text-[#8A8F98] max-w-xl mx-auto">
          Scroll to explode the 2.2&nbsp;mm die into its discrete architectural strata.
          Zero reliance on gigawatt cloud datacenters for edge cognitive autonomy.
        </p>
      </div>

      {/* Main 3D Exploded Stage with Hairline Spec Annotations */}
      <div className="relative z-10 w-full max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-8 items-center my-6">
        {/* Left Spec Callouts (3 Cols) */}
        <div className="hidden lg:flex flex-col justify-around h-[400px] lg:col-span-3 space-y-6">
          {/* Spec 1 */}
          <div className="p-4 rounded-xl border border-white/10 bg-black/40 backdrop-blur-md relative group">
            <span className="font-mono text-[10px] text-[#F59E0B] uppercase tracking-wideMono block mb-1">
              STRATA 05 · THERMAL DISSIPATION
            </span>
            <h4 className="text-sm font-semibold text-white">
              Synthetic Diamond Heat Spreader
            </h4>
            <p className="text-xs text-[#8A8F98] mt-1">
              0.8W Peak envelope. Operates passively in air-gapped field deployments.
            </p>
            {/* Horizontal Hairline connecting line */}
            <div className="hidden lg:block absolute top-1/2 -right-8 w-8 h-[1px] bg-gradient-to-r from-white/30 to-[#F59E0B]" />
          </div>

          {/* Spec 2 */}
          <div className="p-4 rounded-xl border border-white/10 bg-black/40 backdrop-blur-md relative group">
            <span className="font-mono text-[10px] text-[#F59E0B] uppercase tracking-wideMono block mb-1">
              STRATA 04 · INTERCONNECT
            </span>
            <h4 className="text-sm font-semibold text-white">
              Photonic Optical Waveguide
            </h4>
            <p className="text-xs text-[#8A8F98] mt-1">
              Sub-picosecond optical clock bus eliminating wire delay across neural clusters.
            </p>
            <div className="hidden lg:block absolute top-1/2 -right-8 w-8 h-[1px] bg-gradient-to-r from-white/30 to-[#F59E0B]" />
          </div>

          {/* Spec 3 */}
          <div className="p-4 rounded-xl border border-white/10 bg-black/40 backdrop-blur-md relative group">
            <span className="font-mono text-[10px] text-white/50 uppercase tracking-wideMono block mb-1">
              FOUNDRY VALIDATION
            </span>
            <h4 className="text-sm font-semibold text-white">
              Hyderabad Cleanroom Labs
            </h4>
            <p className="text-xs text-[#8A8F98] mt-1">
              Sovereign physical die layout verified for commercial tape-out.
            </p>
            <div className="hidden lg:block absolute top-1/2 -right-8 w-8 h-[1px] bg-gradient-to-r from-white/30 to-white/60" />
          </div>
        </div>

        {/* Center: 3D Exploded Die Canvas (6 Cols) */}
        <div className="lg:col-span-6 h-[380px] sm:h-[480px] w-full relative flex items-center justify-center">
          <ChipExploded3D progress={progress} />

          {/* Scale Indicator Overlay */}
          <div className="absolute bottom-2 left-1/2 -translate-x-1/2 flex items-center gap-2 px-3 py-1 rounded-full border border-white/10 bg-black/70 backdrop-blur-md font-mono text-[10px] text-white/70">
            <span className="text-[#F59E0B]">DIE FOOTPRINT:</span>
            <span>2.2 mm × 2.2 mm</span>
            <span className="text-white/30">|</span>
            <span className="text-white/50">EXPLODE: {Math.round(progress * 100)}%</span>
          </div>
        </div>

        {/* Right Spec Callouts (3 Cols) */}
        <div className="hidden lg:flex flex-col justify-around h-[400px] lg:col-span-3 space-y-6">
          {/* Spec 4 */}
          <div className="p-4 rounded-xl border border-white/10 bg-black/40 backdrop-blur-md relative group">
            <div className="hidden lg:block absolute top-1/2 -left-8 w-8 h-[1px] bg-gradient-to-l from-white/30 to-[#7DD3FC]" />
            <span className="font-mono text-[10px] text-[#7DD3FC] uppercase tracking-wideMono block mb-1">
              STRATA 03 · REGISTERS
            </span>
            <h4 className="text-sm font-semibold text-white">
              Ultra-Low Leakage SRAM Mesh
            </h4>
            <p className="text-xs text-[#8A8F98] mt-1">
              18 MB on-die distributed register cache with zero off-die memory bottlenecks.
            </p>
          </div>

          {/* Spec 5 */}
          <div className="p-4 rounded-xl border border-white/10 bg-black/40 backdrop-blur-md relative group">
            <div className="hidden lg:block absolute top-1/2 -left-8 w-8 h-[1px] bg-gradient-to-l from-white/30 to-[#F59E0B]" />
            <span className="font-mono text-[10px] text-[#F59E0B] uppercase tracking-wideMono block mb-1">
              STRATA 02 · NEURAL CORE
            </span>
            <h4 className="text-sm font-semibold text-white">
              Neuromorphic Spiking Matrix
            </h4>
            <p className="text-xs text-[#8A8F98] mt-1">
              48 TOPS/W efficiency with mixed analog-digital event-driven synapses.
            </p>
          </div>

          {/* Spec 6 */}
          <div className="p-4 rounded-xl border border-white/10 bg-black/40 backdrop-blur-md relative group">
            <div className="hidden lg:block absolute top-1/2 -left-8 w-8 h-[1px] bg-gradient-to-l from-white/30 to-white/60" />
            <span className="font-mono text-[10px] text-white/50 uppercase tracking-wideMono block mb-1">
              PACKAGING SPEC
            </span>
            <h4 className="text-sm font-semibold text-white">
              120-Pin Micro-BGA Interposer
            </h4>
            <p className="text-xs text-[#8A8F98] mt-1">
              Ultra-compact integration for sovereign edge drones, IoT, and air-gapped enclaves.
            </p>
          </div>
        </div>
      </div>

      {/* Bottom Telemetry Ticker */}
      <div className="relative z-10 w-full max-w-4xl mx-auto pt-6 border-t border-white/10 flex flex-wrap items-center justify-between font-mono text-[11px] text-white/50 gap-4">
        <div>
          <span className="text-white/30">FABRICATION NODE:</span>{" "}
          <span className="text-white">SOVEREIGN ADVANCED PACKAGING</span>
        </div>
        <div>
          <span className="text-white/30">MAX POWER:</span>{" "}
          <span className="text-[#F59E0B]">0.8W PEAK</span>
        </div>
        <div>
          <span className="text-white/30">STATUS:</span>{" "}
          <span className="text-[#10B981]">FOUNDRY PROTOTYPING</span>
        </div>
      </div>
    </section>
  );
}
