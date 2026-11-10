"use client";

import React from "react";
import { HeroVisualType } from "@/data/products";

interface HeroCardVisualProps {
  type: HeroVisualType;
  accent: string;
}

export default function HeroCardVisual({ type, accent }: HeroCardVisualProps) {
  switch (type) {
    case "saadhyam_orb":
      return <SaadhyamOrbVisual accent={accent} />;
    case "language_streaming":
      return <LanguageStreamingVisual accent={accent} />;
    case "voice_waveform":
      return <VoiceWaveformVisual accent={accent} />;
    case "growth_chart":
      return <GrowthChartVisual accent={accent} />;
    case "education_path":
      return <EducationPathVisual accent={accent} />;
    case "iot_nodes":
      return <IotNodesVisual accent={accent} />;
    case "neuro_chip_render":
      return <NeuroChipRenderVisual accent={accent} />;
    case "ai_human_silhouette":
      return <SaadhyamOrbVisual accent={accent} />;
    default:
      return <SaadhyamOrbVisual accent={accent} />;
  }
}

// ─────────────────────────────────────────────────────────────────────────────
// 1. Saadhyam: Soft glowing orb of flowing light lines
// ─────────────────────────────────────────────────────────────────────────────
function SaadhyamOrbVisual({ accent }: { accent: string }) {
  return (
    <div className="relative w-full h-full flex items-center justify-center overflow-hidden">
      {/* Soft background ambient glow */}
      <div
        className="absolute w-28 h-28 rounded-full blur-2xl opacity-35 pointer-events-none"
        style={{ backgroundColor: accent }}
      />

      <svg viewBox="0 0 200 160" className="w-full h-full max-h-[145px] overflow-visible">
        <defs>
          <radialGradient id="saadhyamCore" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="#FFFFFF" stopOpacity="0.9" />
            <stop offset="35%" stopColor={accent} stopOpacity="0.6" />
            <stop offset="70%" stopColor={accent} stopOpacity="0.15" />
            <stop offset="100%" stopColor="transparent" stopOpacity="0" />
          </radialGradient>

          <filter id="orbGlow" x="-30%" y="-30%" width="160%" height="160%">
            <feGaussianBlur stdDeviation="3.5" result="blur" />
            <feComposite in="SourceGraphic" in2="blur" operator="over" />
          </filter>
        </defs>

        {/* Central Luminous Core */}
        <circle cx="100" cy="80" r="28" fill="url(#saadhyamCore)" filter="url(#orbGlow)" />

        {/* Flowing Orbital Light Paths */}
        {/* Orbit 1: horizontal oval */}
        <ellipse
          cx="100"
          cy="80"
          rx="58"
          ry="22"
          fill="none"
          stroke={accent}
          strokeWidth="1.2"
          strokeOpacity="0.65"
          transform="rotate(-15 100 80)"
        />

        {/* Orbit 2: tilted oval */}
        <ellipse
          cx="100"
          cy="80"
          rx="52"
          ry="32"
          fill="none"
          stroke="#FFFFFF"
          strokeWidth="1"
          strokeOpacity="0.4"
          transform="rotate(35 100 80)"
        />

        {/* Orbit 3: counter-tilted */}
        <ellipse
          cx="100"
          cy="80"
          rx="64"
          ry="18"
          fill="none"
          stroke={accent}
          strokeWidth="1"
          strokeDasharray="4 6"
          strokeOpacity="0.5"
          transform="rotate(-45 100 80)"
        />

        {/* Gliding photon beacon */}
        <circle cx="145" cy="72" r="2.5" fill="#FFFFFF" filter="url(#orbGlow)" />
        <circle cx="65" cy="88" r="1.8" fill={accent} filter="url(#orbGlow)" />
      </svg>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// 2. LLM & Conversational AI: Clean streaming text lines with a gentle cursor
// ─────────────────────────────────────────────────────────────────────────────
function LanguageStreamingVisual({ accent }: { accent: string }) {
  return (
    <div className="relative w-full h-full flex flex-col justify-center px-5 py-3 select-none">
      {/* Visual Text Lines Box */}
      <div className="space-y-2.5 p-3.5 rounded-xl bg-white/[0.02] border border-white/[0.06] backdrop-blur-sm">
        {/* Line 1 */}
        <div className="flex items-center gap-2">
          <div className="h-2 rounded-full bg-white/70 w-3/4" />
          <div className="h-2 rounded-full bg-white/20 w-1/5" />
        </div>

        {/* Line 2 (Accent colored highlight) */}
        <div className="flex items-center gap-2">
          <div
            className="h-2 rounded-full w-2/5 transition-colors"
            style={{ backgroundColor: accent, opacity: 0.85 }}
          />
          <div className="h-2 rounded-full bg-white/40 w-1/2" />
        </div>

        {/* Line 3 with gentle cursor */}
        <div className="flex items-center gap-2">
          <div className="h-2 rounded-full bg-white/30 w-3/5" />
          {/* Gentle Pulsing Cursor */}
          <span
            className="w-1.5 h-3.5 rounded-sm animate-pulse"
            style={{ backgroundColor: accent }}
          />
        </div>
      </div>

      <div className="flex items-center justify-between text-[11px] text-white/45 mt-2.5 px-1 font-mono">
        <span>Multilingual corpus</span>
        <span style={{ color: accent }}>22 Indian languages</span>
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// 3. Sara: Refined waveform ribbon
// ─────────────────────────────────────────────────────────────────────────────
function VoiceWaveformVisual({ accent }: { accent: string }) {
  return (
    <div className="relative w-full h-full flex items-center justify-center overflow-hidden">
      <div
        className="absolute w-24 h-24 rounded-full blur-2xl opacity-25 pointer-events-none"
        style={{ backgroundColor: accent }}
      />

      <svg viewBox="0 0 200 120" className="w-full h-full max-h-[140px] overflow-visible">
        <defs>
          <linearGradient id="saraWaveGrad" x1="0" y1="0" x2="1" y2="0">
            <stop offset="0%" stopColor={accent} stopOpacity="0.2" />
            <stop offset="50%" stopColor="#FFFFFF" stopOpacity="0.95" />
            <stop offset="100%" stopColor={accent} stopOpacity="0.3" />
          </linearGradient>

          <filter id="voiceGlow" x="-20%" y="-20%" width="140%" height="140%">
            <feGaussianBlur stdDeviation="3" result="blur" />
            <feComposite in="SourceGraphic" in2="blur" operator="over" />
          </filter>
        </defs>

        {/* Center line */}
        <line
          x1="20"
          y1="60"
          x2="180"
          y2="60"
          stroke="rgba(255,255,255,0.08)"
          strokeDasharray="2 4"
        />

        {/* Soft Background Wave */}
        <path
          d="M 20 60 Q 50 35, 75 60 T 130 60 T 180 60"
          fill="none"
          stroke={accent}
          strokeWidth="1.2"
          strokeOpacity="0.35"
        />

        {/* Foreground Primary Acoustic Ribbon */}
        <path
          d="M 20 60 Q 60 20, 100 60 T 180 60"
          fill="none"
          stroke="url(#saraWaveGrad)"
          strokeWidth="2.4"
          strokeLinecap="round"
          filter="url(#voiceGlow)"
        />

        {/* Secondary Harmonizer */}
        <path
          d="M 20 60 Q 40 75, 80 60 T 140 60 T 180 60"
          fill="none"
          stroke={accent}
          strokeWidth="1.6"
          strokeOpacity="0.6"
          strokeLinecap="round"
        />

        {/* Subtle Nodes */}
        <circle cx="60" cy="40" r="2.5" fill="#FFFFFF" />
        <circle cx="100" cy="60" r="3" fill={accent} filter="url(#voiceGlow)" />
        <circle cx="140" cy="80" r="2" fill="#FFFFFF" />
      </svg>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// 4. Diya: Minimal rising line chart with soft gradient area
// ─────────────────────────────────────────────────────────────────────────────
function GrowthChartVisual({ accent }: { accent: string }) {
  return (
    <div className="relative w-full h-full flex flex-col justify-center px-4 py-2 select-none">
      <svg viewBox="0 0 200 130" className="w-full h-full max-h-[140px] overflow-visible">
        <defs>
          <linearGradient id="diyaAreaGrad" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor={accent} stopOpacity="0.3" />
            <stop offset="60%" stopColor={accent} stopOpacity="0.06" />
            <stop offset="100%" stopColor="transparent" stopOpacity="0" />
          </linearGradient>

          <filter id="diyaGlow" x="-20%" y="-20%" width="140%" height="140%">
            <feGaussianBlur stdDeviation="2.5" result="blur" />
            <feComposite in="SourceGraphic" in2="blur" operator="over" />
          </filter>
        </defs>

        {/* Soft grid lines */}
        <line x1="15" y1="35" x2="185" y2="35" stroke="rgba(255,255,255,0.05)" strokeDasharray="2 4" />
        <line x1="15" y1="75" x2="185" y2="75" stroke="rgba(255,255,255,0.05)" strokeDasharray="2 4" />
        <line x1="15" y1="115" x2="185" y2="115" stroke="rgba(255,255,255,0.05)" strokeDasharray="2 4" />

        {/* Gradient Area under curve */}
        <path
          d="M 20 105 C 60 100, 90 85, 120 65 C 145 48, 165 35, 180 25 L 180 115 L 20 115 Z"
          fill="url(#diyaAreaGrad)"
        />

        {/* Primary Curve */}
        <path
          d="M 20 105 C 60 100, 90 85, 120 65 C 145 48, 165 35, 180 25"
          fill="none"
          stroke={accent}
          strokeWidth="2.2"
          strokeLinecap="round"
          filter="url(#diyaGlow)"
        />

        {/* Anchor Dots */}
        {[
          { cx: 20, cy: 105 },
          { cx: 80, cy: 90 },
          { cx: 135, cy: 55 },
          { cx: 180, cy: 25 },
        ].map((pt, i) => (
          <g key={i}>
            <circle cx={pt.cx} cy={pt.cy} r="3" fill="#0C0D11" stroke={accent} strokeWidth="1.5" />
            <circle cx={pt.cx} cy={pt.cy} r="1.2" fill="#FFFFFF" />
          </g>
        ))}

        {/* Top Growth Pill */}
        <g transform="translate(142, 10)">
          <rect width="42" height="15" rx="7.5" fill="rgba(255,255,255,0.06)" stroke={accent} strokeWidth="0.8" />
          <text x="21" y="11" textAnchor="middle" fill="#FFFFFF" fontSize="9" fontFamily="monospace">
            +46%
          </text>
        </g>
      </svg>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// 5. Education Platforms: Clean layered notebook / course-path illustration
// ─────────────────────────────────────────────────────────────────────────────
function EducationPathVisual({ accent }: { accent: string }) {
  return (
    <div className="relative w-full h-full flex items-center justify-center overflow-hidden">
      <svg viewBox="0 0 200 130" className="w-full h-full max-h-[140px] overflow-visible">
        {/* Layered Notebook/Card Line Art */}
        {/* Back page */}
        <rect
          x="38"
          y="28"
          width="124"
          height="76"
          rx="6"
          fill="none"
          stroke="rgba(255,255,255,0.12)"
          strokeWidth="1"
          transform="rotate(-4 100 66)"
        />

        {/* Front main page */}
        <rect
          x="44"
          y="24"
          width="122"
          height="80"
          rx="6"
          fill="#0B0D12"
          stroke={accent}
          strokeWidth="1.2"
          strokeOpacity="0.75"
        />

        {/* Internal notebook lines & course milestones */}
        <line x1="56" y1="40" x2="110" y2="40" stroke="#FFFFFF" strokeOpacity="0.7" strokeWidth="1.5" strokeLinecap="round" />
        <line x1="56" y1="52" x2="140" y2="52" stroke="rgba(255,255,255,0.2)" strokeWidth="1" strokeLinecap="round" />
        <line x1="56" y1="62" x2="130" y2="62" stroke="rgba(255,255,255,0.2)" strokeWidth="1" strokeLinecap="round" />

        {/* Learning Path Milestone Track */}
        <path
          d="M 58 84 L 90 84 L 115 84 L 145 84"
          fill="none"
          stroke={accent}
          strokeWidth="1.2"
          strokeDasharray="2 3"
        />

        {/* Milestone Steps */}
        <circle cx="58" cy="84" r="3.5" fill={accent} />
        <circle cx="95" cy="84" r="3" fill="#FFFFFF" />
        <circle cx="135" cy="84" r="3" fill="#0B0D12" stroke={accent} strokeWidth="1.2" />
      </svg>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// 6. IoT & Embedded: Minimal chip / device outline with connecting lines
// ─────────────────────────────────────────────────────────────────────────────
function IotNodesVisual({ accent }: { accent: string }) {
  return (
    <div className="relative w-full h-full flex items-center justify-center overflow-hidden">
      <svg viewBox="0 0 200 130" className="w-full h-full max-h-[140px] overflow-visible">
        {/* Peripheral Telemetry Lines */}
        <line x1="25" y1="65" x2="70" y2="65" stroke={accent} strokeOpacity="0.4" strokeWidth="1" />
        <line x1="130" y1="65" x2="175" y2="65" stroke={accent} strokeOpacity="0.4" strokeWidth="1" />
        <line x1="100" y1="20" x2="100" y2="45" stroke={accent} strokeOpacity="0.4" strokeWidth="1" />
        <line x1="100" y1="85" x2="100" y2="110" stroke={accent} strokeOpacity="0.4" strokeWidth="1" />

        {/* Diagonal Sensor Lines */}
        <line x1="45" y1="35" x2="75" y2="52" stroke="rgba(255,255,255,0.15)" strokeWidth="1" />
        <line x1="155" y1="35" x2="125" y2="52" stroke="rgba(255,255,255,0.15)" strokeWidth="1" />
        <line x1="45" y1="95" x2="75" y2="78" stroke="rgba(255,255,255,0.15)" strokeWidth="1" />
        <line x1="155" y1="95" x2="125" y2="78" stroke="rgba(255,255,255,0.15)" strokeWidth="1" />

        {/* Central Embedded Device Outline */}
        <rect
          x="70"
          y="45"
          width="60"
          height="40"
          rx="5"
          fill="#0C0E12"
          stroke={accent}
          strokeWidth="1.4"
        />

        {/* Microcontroller core inside */}
        <rect
          x="82"
          y="54"
          width="36"
          height="22"
          rx="3"
          fill="none"
          stroke="#FFFFFF"
          strokeOpacity="0.4"
          strokeWidth="1"
        />

        {/* Radiating Peripheral Nodes */}
        <circle cx="25" cy="65" r="3" fill="#FFFFFF" />
        <circle cx="175" cy="65" r="3" fill="#FFFFFF" />
        <circle cx="100" cy="20" r="3" fill={accent} />
        <circle cx="100" cy="110" r="3" fill={accent} />

        <circle cx="45" cy="35" r="2" fill="rgba(255,255,255,0.5)" />
        <circle cx="155" cy="35" r="2" fill="rgba(255,255,255,0.5)" />
        <circle cx="45" cy="95" r="2" fill="rgba(255,255,255,0.5)" />
        <circle cx="155" cy="95" r="2" fill="rgba(255,255,255,0.5)" />
      </svg>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// 7. Neuro HGI Chip: Precise chip render with warm amber edge light
// ─────────────────────────────────────────────────────────────────────────────
function NeuroChipRenderVisual({ accent }: { accent: string }) {
  return (
    <div className="relative w-full h-full flex items-center justify-center overflow-hidden">
      {/* Warm amber edge radiance */}
      <div
        className="absolute w-28 h-28 rounded-full blur-2xl opacity-35 pointer-events-none"
        style={{ backgroundColor: accent }}
      />

      <svg viewBox="0 0 200 140" className="w-full h-full max-h-[145px] overflow-visible">
        <defs>
          <filter id="amberEdgeGlow" x="-20%" y="-20%" width="140%" height="140%">
            <feGaussianBlur stdDeviation="3" result="blur" />
            <feComposite in="SourceGraphic" in2="blur" operator="over" />
          </filter>
        </defs>

        {/* Outer Package Substrate */}
        <rect
          x="58"
          y="28"
          width="84"
          height="84"
          rx="8"
          fill="#100E0A"
          stroke={accent}
          strokeWidth="1.5"
          filter="url(#amberEdgeGlow)"
        />

        {/* Die Inner Area */}
        <rect
          x="68"
          y="38"
          width="64"
          height="64"
          rx="4"
          fill="#18150D"
          stroke="rgba(245,158,11,0.5)"
          strokeWidth="1"
          strokeDasharray="3 3"
        />

        {/* Golden Conductive Traces on edge */}
        <line x1="58" y1="48" x2="68" y2="48" stroke={accent} strokeWidth="1" />
        <line x1="58" y1="60" x2="68" y2="60" stroke={accent} strokeWidth="1" />
        <line x1="58" y1="72" x2="68" y2="72" stroke={accent} strokeWidth="1" />
        <line x1="58" y1="84" x2="68" y2="84" stroke={accent} strokeWidth="1" />

        <line x1="132" y1="48" x2="142" y2="48" stroke={accent} strokeWidth="1" />
        <line x1="132" y1="60" x2="142" y2="60" stroke={accent} strokeWidth="1" />
        <line x1="132" y1="72" x2="142" y2="72" stroke={accent} strokeWidth="1" />
        <line x1="132" y1="84" x2="142" y2="84" stroke={accent} strokeWidth="1" />

        {/* Center Silicon Die Core */}
        <rect
          x="82"
          y="52"
          width="36"
          height="36"
          rx="2"
          fill="#0C0A06"
          stroke="#FFFFFF"
          strokeOpacity="0.4"
          strokeWidth="1"
        />

        {/* Dimension Label in sentence case */}
        <text
          x="100"
          y="73"
          textAnchor="middle"
          fill={accent}
          fontSize="9"
          fontFamily="monospace"
          fontWeight="bold"
        >
          2.2 mm
        </text>
      </svg>
    </div>
  );
}

