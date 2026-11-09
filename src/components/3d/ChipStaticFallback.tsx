"use client";

import React from "react";

export default function ChipStaticFallback({ progress = 0.5 }: { progress?: number }) {
  const explode = progress * 40;

  return (
    <div className="w-full h-full flex items-center justify-center p-4 select-none">
      <div className="relative w-full max-w-[380px] h-[360px] flex items-center justify-center">
        {/* Abstract SVG Isometric Die Layers */}
        <svg
          viewBox="0 0 400 380"
          className="w-full h-full overflow-visible"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          {/* Layer 5: Top Diamond Heat Cap */}
          <g transform={`translate(0, ${-explode * 1.6})`} className="transition-transform duration-300">
            <polygon
              points="200,60 320,110 200,160 80,110"
              fill="#14171F"
              stroke="#F59E0B"
              strokeWidth="1.2"
              strokeOpacity="0.8"
            />
            <polygon points="80,110 200,160 200,168 80,118" fill="#0C0E14" />
            <polygon points="320,110 200,160 200,168 320,118" fill="#080A0E" />
            <text x="200" y="115" textAnchor="middle" fill="#F59E0B" fontSize="10" fontFamily="monospace">
              MENTNEO HGI · 2.2MM
            </text>
          </g>

          {/* Layer 4: Photonic Interconnect */}
          <g transform={`translate(0, ${-explode * 0.8})`} className="transition-transform duration-300">
            <polygon
              points="200,90 310,135 200,180 90,135"
              fill="#0E121A"
              stroke="#E2E8F0"
              strokeWidth="1"
              strokeOpacity="0.4"
            />
            <circle cx="200" cy="135" r="16" stroke="#F59E0B" strokeWidth="1.5" fill="none" opacity="0.9" />
          </g>

          {/* Layer 3: SRAM Memory Mesh */}
          <g className="transition-transform duration-300">
            <polygon
              points="200,120 300,162 200,204 100,162"
              fill="#0A0C10"
              stroke="#7DD3FC"
              strokeWidth="1"
              strokeOpacity="0.5"
            />
          </g>

          {/* Layer 2: Neuromorphic Core */}
          <g transform={`translate(0, ${explode * 0.8})`} className="transition-transform duration-300">
            <polygon
              points="200,150 310,195 200,240 90,195"
              fill="#10141D"
              stroke="#F59E0B"
              strokeWidth="1.2"
              strokeOpacity="0.7"
            />
            <circle cx="200" cy="195" r="12" fill="#F59E0B" opacity="0.8" />
          </g>

          {/* Layer 1: Silicon Interposer Substrate */}
          <g transform={`translate(0, ${explode * 1.6})`} className="transition-transform duration-300">
            <polygon
              points="200,180 330,235 200,290 70,235"
              fill="#08090C"
              stroke="#E2E8F0"
              strokeWidth="1"
              strokeOpacity="0.3"
            />
            <polygon points="70,235 200,290 200,302 70,247" fill="#040507" />
            <polygon points="330,235 200,290 200,302 330,247" fill="#020304" />
          </g>
        </svg>

        {/* Center Physical Dimension Badge */}
        <div className="absolute -bottom-2 px-3 py-1 rounded-full border border-[#F59E0B]/40 bg-black/80 font-mono text-[10px] text-[#F59E0B] tracking-wideMono">
          SCALE: 2.2 MM × 2.2 MM DIE
        </div>
      </div>
    </div>
  );
}
