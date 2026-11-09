"use client";

import React, { useState, useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { LOCATIONS, LocationItem } from "@/data/locations";

export default function GlobalSection() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const mapSvgRef = useRef<SVGSVGElement>(null);
  const [activeLocation, setActiveLocation] = useState<LocationItem>(LOCATIONS[0]);

  useEffect(() => {
    if (typeof window === "undefined") return;
    gsap.registerPlugin(ScrollTrigger);

    const section = sectionRef.current;
    const map = mapSvgRef.current;
    if (!section || !map) return;

    // Draw geodesic interconnect paths on scroll
    const paths = map.querySelectorAll(".geodesic-path");
    const st = ScrollTrigger.create({
      trigger: section,
      start: "top 70%",
      onEnter: () => {
        gsap.fromTo(
          paths,
          { strokeDashoffset: 600 },
          { strokeDashoffset: 0, duration: 2.4, ease: "power2.out", stagger: 0.2 }
        );
      },
    });

    return () => st.kill();
  }, []);

  // Map coordinates projection to SVG 1000x500 box:
  // x = (lng + 180) * (1000 / 360)
  // y = (90 - lat) * (500 / 180)
  const project = (lat: number, lng: number) => {
    const x = (lng + 180) * (1000 / 360);
    const y = (90 - lat) * (500 / 180);
    return { x, y };
  };

  const hyderabad = project(17.385, 78.4867);
  const kakinada = project(16.9891, 82.2475);
  const sf = project(37.7749, -122.4194);
  const london = project(51.5074, -0.1278);

  return (
    <section
      id="chapter-7"
      ref={sectionRef}
      className="relative min-h-screen bg-[#0D0B0A] text-[#F2F2F0] px-6 py-28 flex flex-col justify-between items-center overflow-hidden select-none"
    >
      {/* Background Micro Grid and Warm Ambient Flare */}
      <div className="absolute inset-0 bg-tech-grid opacity-20 pointer-events-none" />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full bg-[#38BDF8]/[0.03] blur-[160px] pointer-events-none" />

      {/* Chapter Tag & Headline */}
      <div className="relative z-10 max-w-4xl mx-auto text-center">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-[#38BDF8]/30 bg-[#38BDF8]/[0.05] mb-4">
          <span className="w-1.5 h-1.5 rounded-full bg-[#38BDF8]" />
          <span className="font-mono text-[11px] uppercase tracking-wideMono text-[#38BDF8]">
            CHAPTER 07 · SOVEREIGN TOPOGRAPHY
          </span>
        </div>

        <h2 className="text-4xl sm:text-6xl font-light tracking-[-0.04em] text-white">
          Global Coordinates. <br />
          <span className="text-white/60">Distributed across four research poles.</span>
        </h2>
        <p className="mt-4 text-sm sm:text-base text-[#8A8F98] max-w-2xl mx-auto leading-relaxed">
          From the silicon cleanrooms of Hyderabad to the sovereign data enclaves of Kakinada,
          San Francisco algorithmic theory, and London regulatory alignment.
        </p>
      </div>

      {/* Minimal Dotted World Map & Pulsing Radar Points */}
      <div className="relative z-10 w-full max-w-6xl mx-auto my-10 p-6 rounded-2xl border border-white/10 bg-black/60 backdrop-blur-md">
        <div className="flex items-center justify-between pb-4 border-b border-white/10 font-mono text-[11px]">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-[#38BDF8] animate-ping" />
            <span className="text-white uppercase tracking-wideMono">
              SYNCHRONIZED FIBER MESH · ACTIVE TELEMETRY
            </span>
          </div>
          <span className="text-[#38BDF8]">GLOBAL PING: &lt; 18.4 MS MAXIMUM</span>
        </div>

        {/* SVG Projection Canvas */}
        <div className="relative w-full h-[320px] sm:h-[420px] my-4 flex items-center justify-center overflow-hidden">
          <svg
            ref={mapSvgRef}
            viewBox="0 0 1000 500"
            className="w-full h-full overflow-visible"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            {/* Background Minimal Lat/Long Matrix Grid */}
            {Array.from({ length: 9 }).map((_, i) => (
              <line
                key={`h-${i}`}
                x1="0"
                y1={i * 55 + 30}
                x2="1000"
                y2={i * 55 + 30}
                stroke="rgba(255,255,255,0.03)"
                strokeDasharray="2 4"
              />
            ))}
            {Array.from({ length: 17 }).map((_, i) => (
              <line
                key={`v-${i}`}
                x1={i * 60 + 20}
                y1="0"
                x2={i * 60 + 20}
                y2="500"
                stroke="rgba(255,255,255,0.03)"
                strokeDasharray="2 4"
              />
            ))}

            {/* Dotted Continents Abstract Representation */}
            {/* North America Dots */}
            {[-120, -110, -100, -90, -80, -70].map((lng, li) =>
              [30, 38, 45, 52].map((lat, la) => {
                const p = project(lat, lng);
                return (
                  <circle
                    key={`na-${li}-${la}`}
                    cx={p.x}
                    cy={p.y}
                    r="1.2"
                    fill="rgba(255,255,255,0.12)"
                  />
                );
              })
            )}

            {/* Europe Dots */}
            {[-10, 0, 10, 20, 30].map((lng, li) =>
              [42, 48, 54, 60].map((lat, la) => {
                const p = project(lat, lng);
                return (
                  <circle
                    key={`eu-${li}-${la}`}
                    cx={p.x}
                    cy={p.y}
                    r="1.2"
                    fill="rgba(255,255,255,0.12)"
                  />
                );
              })
            )}

            {/* India & Asia Dots */}
            {[70, 78, 82, 88, 96, 105].map((lng, li) =>
              [12, 18, 24, 30, 36].map((lat, la) => {
                const p = project(lat, lng);
                return (
                  <circle
                    key={`as-${li}-${la}`}
                    cx={p.x}
                    cy={p.y}
                    r="1.2"
                    fill="rgba(255,255,255,0.14)"
                  />
                );
              })
            )}

            {/* Geodesic Interconnect Paths between Hubs */}
            {/* Hyderabad to Kakinada */}
            <path
              className="geodesic-path"
              d={`M ${hyderabad.x} ${hyderabad.y} Q ${(hyderabad.x + kakinada.x) / 2} ${
                (hyderabad.y + kakinada.y) / 2 - 15
              } ${kakinada.x} ${kakinada.y}`}
              stroke="#38BDF8"
              strokeWidth="1.5"
              strokeDasharray="600"
              strokeDashoffset="0"
              opacity="0.8"
            />

            {/* Hyderabad to London */}
            <path
              className="geodesic-path"
              d={`M ${hyderabad.x} ${hyderabad.y} Q ${(hyderabad.x + london.x) / 2} ${
                (hyderabad.y + london.y) / 2 - 80
              } ${london.x} ${london.y}`}
              stroke="#38BDF8"
              strokeWidth="1.2"
              strokeDasharray="600"
              strokeDashoffset="0"
              opacity="0.6"
            />

            {/* London to San Francisco */}
            <path
              className="geodesic-path"
              d={`M ${london.x} ${london.y} Q ${(london.x + sf.x) / 2 + 30} ${
                (london.y + sf.y) / 2 - 90
              } ${sf.x} ${sf.y}`}
              stroke="#38BDF8"
              strokeWidth="1.2"
              strokeDasharray="600"
              strokeDashoffset="0"
              opacity="0.6"
            />

            {/* Pulsing Radar Hubs */}
            {[
              { loc: LOCATIONS[0], pt: hyderabad },
              { loc: LOCATIONS[1], pt: kakinada },
              { loc: LOCATIONS[2], pt: sf },
              { loc: LOCATIONS[3], pt: london },
            ].map(({ loc, pt }) => {
              const isSelected = activeLocation.id === loc.id;
              return (
                <g
                  key={loc.id}
                  onClick={() => setActiveLocation(loc)}
                  className="cursor-pointer group"
                >
                  {/* Outer Pulsing Ring */}
                  <circle
                    cx={pt.x}
                    cy={pt.y}
                    r="12"
                    fill="none"
                    stroke="#38BDF8"
                    strokeWidth="1"
                    opacity={isSelected ? 0.9 : 0.3}
                    className={isSelected ? "animate-ping" : ""}
                  />
                  {/* Core Pin */}
                  <circle
                    cx={pt.x}
                    cy={pt.y}
                    r={isSelected ? 5 : 3.5}
                    fill={isSelected ? "#FFFFFF" : "#38BDF8"}
                    stroke="#000000"
                    strokeWidth="1.5"
                  />
                  {/* City Label */}
                  <text
                    x={pt.x + 8}
                    y={pt.y - 8}
                    fill={isSelected ? "#FFFFFF" : "rgba(255,255,255,0.6)"}
                    fontSize="11"
                    fontFamily="monospace"
                    fontWeight={isSelected ? "bold" : "normal"}
                  >
                    {loc.city.toUpperCase()}
                  </text>
                </g>
              );
            })}
          </svg>
        </div>

        {/* Active Hub Telemetry Card */}
        <div className="pt-4 border-t border-white/10 grid grid-cols-1 md:grid-cols-3 gap-6 items-center">
          <div>
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-[#38BDF8]" />
              <h4 className="text-base font-semibold text-white">
                {activeLocation.city}, {activeLocation.country}
              </h4>
            </div>
            <p className="font-mono text-[10px] text-[#38BDF8] mt-0.5">
              {activeLocation.role}
            </p>
            <p className="font-mono text-[10px] text-white/40 mt-1">
              COORDINATES: {activeLocation.coordinates}
            </p>
          </div>

          <div className="space-y-1">
            <span className="font-mono text-[9px] uppercase tracking-wideMono text-white/40 block">
              PRIMARY LABORATORY MANDATE
            </span>
            <ul className="text-xs text-white/80 space-y-1">
              {activeLocation.focus.map((f, i) => (
                <li key={i} className="flex items-center gap-2">
                  <span className="w-1 h-1 rounded-full bg-white/40" />
                  <span>{f}</span>
                </li>
              ))}
            </ul>
          </div>

          <div className="p-3 rounded-xl border border-white/10 bg-white/[0.02] flex flex-col justify-between">
            <span className="font-mono text-[10px] uppercase text-white/40">
              OPERATIONAL STATUS
            </span>
            <span className="font-mono text-sm font-bold text-white mt-1">
              {activeLocation.status}
            </span>
            <span className="font-mono text-[10px] text-[#10B981] mt-1">
              {activeLocation.latency}
            </span>
          </div>
        </div>
      </div>

      {/* Global Ticker */}
      <div className="relative z-10 w-full max-w-4xl mx-auto flex flex-wrap items-center justify-between font-mono text-[11px] text-white/40 gap-4 pt-6">
        <span>SOVEREIGN JURISDICTION: MULTI-REGIONAL AIR-GAP</span>
        <span>LATENCY MATRIX: AUTONOMOUS MESH PEERING</span>
        <span>FOUNDED 2025</span>
      </div>
    </section>
  );
}
