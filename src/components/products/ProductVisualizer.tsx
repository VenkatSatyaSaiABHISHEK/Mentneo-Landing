"use client";

import React, { useEffect, useState } from "react";
import { ProductItem } from "@/data/products";

interface ProductVisualizerProps {
  product: ProductItem;
}

export default function ProductVisualizer({ product }: ProductVisualizerProps) {
  switch (product.visualType) {
    case "aiml":
      return <AimlVisual accent={product.accent} />;
    case "deeplearning":
      return <DeepLearningVisual accent={product.accent} />;
    case "saadhyam":
      return <SaadhyamVisual accent={product.accent} />;
    case "ai_human_sara":
    case "ai_human_diya":
    case "ai_human_valmiki":
    case "ai_human_rudra":
    case "ai_human_law":
      return <AiHumanPortraitVisual product={product} />;
    case "neuro_chip":
      return <NeuroChipVisual accent={product.accent} />;
    default:
      return <SaadhyamVisual accent={product.accent} />;
  }
}

// ─────────────────────────────────────────────────────────────────────────────
// 01: AI / ML Solutions - Clean Animated Line Chart with Soft Gradient Area
// ─────────────────────────────────────────────────────────────────────────────
function AimlVisual({ accent }: { accent: string }) {
  const [beaconProgress, setBeaconProgress] = useState(0);

  useEffect(() => {
    let frameId: number;
    let t = 0;
    const animate = () => {
      t += 0.008;
      setBeaconProgress((Math.sin(t) + 1) / 2);
      frameId = requestAnimationFrame(animate);
    };
    frameId = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(frameId);
  }, []);

  // Compute point along cubic bezier path: (30, 160) -> (110, 140) -> (190, 80) -> (270, 100) -> (370, 35)
  // Approximate parametric coordinates for the smooth gliding beacon
  const bx = 30 + beaconProgress * 340;
  const by =
    160 -
    Math.sin(beaconProgress * Math.PI) * 70 -
    beaconProgress * 60 +
    Math.sin(beaconProgress * Math.PI * 3) * 8;

  return (
    <div className="relative w-full h-full flex flex-col justify-between p-5 select-none">
      {/* Top Header of Visual */}
      <div className="flex items-center justify-between text-xs font-mono">
        <span className="text-white/45 text-[11px] tracking-wide">
          Causal inference trajectory
        </span>
        <div className="flex items-center gap-1.5">
          <span
            className="w-1.5 h-1.5 rounded-full animate-pulse"
            style={{ backgroundColor: accent }}
          />
          <span className="text-[11px] text-white/70">Continuous sync</span>
        </div>
      </div>

      {/* Main SVG Line Chart */}
      <div className="relative flex-1 w-full flex items-center justify-center my-2">
        <svg
          viewBox="0 0 400 200"
          className="w-full h-full max-h-[190px] overflow-visible"
        >
          <defs>
            {/* Soft Gradient Area Fill */}
            <linearGradient id="aimlAreaGrad" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor={accent} stopOpacity="0.28" />
              <stop offset="50%" stopColor={accent} stopOpacity="0.08" />
              <stop offset="100%" stopColor={accent} stopOpacity="0" />
            </linearGradient>

            {/* Glowing Stroke Gradient */}
            <linearGradient id="aimlStrokeGrad" x1="0" y1="0" x2="1" y2="0">
              <stop offset="0%" stopColor={accent} stopOpacity="0.4" />
              <stop offset="50%" stopColor={accent} stopOpacity="0.9" />
              <stop offset="100%" stopColor="#FFFFFF" stopOpacity="0.95" />
            </linearGradient>

            {/* Filter for glow */}
            <filter id="softGlow" x="-20%" y="-20%" width="140%" height="140%">
              <feGaussianBlur stdDeviation="3" result="blur" />
              <feComposite in="SourceGraphic" in2="blur" operator="over" />
            </filter>
          </defs>

          {/* Subtle Horizontal Grid Hairlines */}
          <line
            x1="20"
            y1="50"
            x2="380"
            y2="50"
            stroke="rgba(255,255,255,0.05)"
            strokeDasharray="3 4"
          />
          <line
            x1="20"
            y1="100"
            x2="380"
            y2="100"
            stroke="rgba(255,255,255,0.05)"
            strokeDasharray="3 4"
          />
          <line
            x1="20"
            y1="150"
            x2="380"
            y2="150"
            stroke="rgba(255,255,255,0.05)"
            strokeDasharray="3 4"
          />

          {/* Area Gradient under curve */}
          <path
            d="M 30 160 C 100 150, 150 115, 210 110 C 270 105, 310 60, 370 35 L 370 180 L 30 180 Z"
            fill="url(#aimlAreaGrad)"
          />

          {/* Primary Curve */}
          <path
            d="M 30 160 C 100 150, 150 115, 210 110 C 270 105, 310 60, 370 35"
            fill="none"
            stroke="url(#aimlStrokeGrad)"
            strokeWidth="2.2"
            strokeLinecap="round"
            filter="url(#softGlow)"
          />

          {/* Subtle Baseline Reference Curve */}
          <path
            d="M 30 165 C 110 162, 190 148, 270 138 C 320 132, 350 120, 370 112"
            fill="none"
            stroke="rgba(255,255,255,0.18)"
            strokeWidth="1.2"
            strokeDasharray="4 4"
          />

          {/* Stationary Key Anchor Points */}
          {[
            { cx: 30, cy: 160 },
            { cx: 155, cy: 122 },
            { cx: 270, cy: 92 },
            { cx: 370, cy: 35 },
          ].map((pt, i) => (
            <g key={i}>
              <circle
                cx={pt.cx}
                cy={pt.cy}
                r="3.5"
                fill="#0C0D11"
                stroke={accent}
                strokeWidth="1.5"
              />
              <circle cx={pt.cx} cy={pt.cy} r="1.5" fill="#FFFFFF" />
            </g>
          ))}

          {/* Gliding Scanning Beacon */}
          <g transform={`translate(${bx}, ${by})`}>
            {/* Outer Breathing Halo */}
            <circle
              r="12"
              fill={accent}
              fillOpacity="0.18"
              className="animate-ping"
              style={{ animationDuration: "2.4s" }}
            />
            {/* Inner Glowing Core */}
            <circle
              r="4.5"
              fill={accent}
              stroke="#FFFFFF"
              strokeWidth="1.5"
              filter="url(#softGlow)"
            />
          </g>
        </svg>
      </div>

      {/* Bottom Sub-annotation */}
      <div className="flex items-center justify-between text-[11px] text-white/50 border-t border-white/[0.04] pt-2">
        <span>Baseline vs adaptive model</span>
        <span className="font-mono text-white/80">+38% precision gain</span>
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// 02: Deep Learning - Minimal Neural-Layer Diagram with Slowly Flowing Light
// ─────────────────────────────────────────────────────────────────────────────
function DeepLearningVisual({ accent }: { accent: string }) {
  // 4 columns: Input (3), Hidden 1 (4), Hidden 2 (4), Output (2)
  const layers = [
    { name: "In", count: 3, x: 50 },
    { name: "H1", count: 4, x: 150 },
    { name: "H2", count: 4, x: 250 },
    { name: "Out", count: 2, x: 350 },
  ];

  // Helper to calculate Y position of a node in a layer
  const getNodeY = (count: number, index: number, height = 180) => {
    const spacing = height / (count + 1);
    return spacing * (index + 1) + 10;
  };

  return (
    <div className="relative w-full h-full flex flex-col justify-between p-5 select-none">
      {/* Visual Header */}
      <div className="flex items-center justify-between text-xs font-mono">
        <span className="text-white/45 text-[11px] tracking-wide">
          Bespoke neural synthesis
        </span>
        <span className="text-[11px] text-white/70">FP8 forward pass</span>
      </div>

      {/* Neural Network SVG Architecture */}
      <div className="relative flex-1 w-full flex items-center justify-center my-1">
        <svg
          viewBox="0 0 400 200"
          className="w-full h-full max-h-[190px] overflow-visible"
        >
          <defs>
            {/* Flowing Pulse Gradient */}
            <linearGradient id="flowPulse" x1="0" y1="0" x2="1" y2="0">
              <stop offset="0%" stopColor={accent} stopOpacity="0" />
              <stop offset="50%" stopColor={accent} stopOpacity="0.8" />
              <stop offset="100%" stopColor="#FFFFFF" stopOpacity="1" />
            </linearGradient>

            <filter id="neuralGlow" x="-30%" y="-30%" width="160%" height="160%">
              <feGaussianBlur stdDeviation="2.5" result="blur" />
              <feComposite in="SourceGraphic" in2="blur" operator="over" />
            </filter>
          </defs>

          {/* Connection Lines between consecutive layers */}
          {layers.slice(0, -1).map((layer, lIdx) => {
            const nextLayer = layers[lIdx + 1];
            return Array.from({ length: layer.count }).map((_, i) =>
              Array.from({ length: nextLayer.count }).map((_, j) => {
                const x1 = layer.x;
                const y1 = getNodeY(layer.count, i);
                const x2 = nextLayer.x;
                const y2 = getNodeY(nextLayer.count, j);
                const isKeyPath = (i + j + lIdx) % 3 === 0;

                return (
                  <line
                    key={`${lIdx}-${i}-${j}`}
                    x1={x1}
                    y1={y1}
                    x2={x2}
                    y2={y2}
                    stroke={
                      isKeyPath
                        ? accent
                        : "rgba(255,255,255,0.08)"
                    }
                    strokeOpacity={isKeyPath ? 0.35 : 0.08}
                    strokeWidth={isKeyPath ? 1.2 : 0.75}
                  />
                );
              })
            );
          })}

          {/* Animated Flowing Light Pulses along 3 representative paths */}
          {[
            {
              d: `M 50 ${getNodeY(3, 1)} C 100 ${getNodeY(3, 1)}, 100 ${getNodeY(4, 1)}, 150 ${getNodeY(4, 1)} C 200 ${getNodeY(4, 1)}, 200 ${getNodeY(4, 2)}, 250 ${getNodeY(4, 2)} C 300 ${getNodeY(4, 2)}, 300 ${getNodeY(2, 0)}, 350 ${getNodeY(2, 0)}`,
              dur: "3.6s",
              delay: "0s",
            },
            {
              d: `M 50 ${getNodeY(3, 0)} C 100 ${getNodeY(3, 0)}, 100 ${getNodeY(4, 0)}, 150 ${getNodeY(4, 0)} C 200 ${getNodeY(4, 0)}, 200 ${getNodeY(4, 1)}, 250 ${getNodeY(4, 1)} C 300 ${getNodeY(4, 1)}, 300 ${getNodeY(2, 1)}, 350 ${getNodeY(2, 1)}`,
              dur: "4.2s",
              delay: "1.2s",
            },
            {
              d: `M 50 ${getNodeY(3, 2)} C 100 ${getNodeY(3, 2)}, 100 ${getNodeY(4, 3)}, 150 ${getNodeY(4, 3)} C 200 ${getNodeY(4, 3)}, 200 ${getNodeY(4, 2)}, 250 ${getNodeY(4, 2)} C 300 ${getNodeY(4, 2)}, 300 ${getNodeY(2, 1)}, 350 ${getNodeY(2, 1)}`,
              dur: "3.9s",
              delay: "2.1s",
            },
          ].map((path, pIdx) => (
            <g key={pIdx}>
              {/* Highlight path with subtle glow */}
              <path
                d={path.d}
                fill="none"
                stroke={accent}
                strokeOpacity="0.25"
                strokeWidth="1.5"
              />
              {/* Animated Light Orb */}
              <circle r="3.5" fill="#FFFFFF" filter="url(#neuralGlow)">
                <animateMotion
                  path={path.d}
                  dur={path.dur}
                  begin={path.delay}
                  repeatCount="indefinite"
                />
              </circle>
            </g>
          ))}

          {/* Node Circles */}
          {layers.map((layer) =>
            Array.from({ length: layer.count }).map((_, i) => {
              const cx = layer.x;
              const cy = getNodeY(layer.count, i);
              return (
                <g key={`${layer.name}-${i}`}>
                  {/* Subtle Node Aura */}
                  <circle
                    cx={cx}
                    cy={cy}
                    r="9"
                    fill={accent}
                    fillOpacity="0.08"
                  />
                  {/* Outer Ring */}
                  <circle
                    cx={cx}
                    cy={cy}
                    r="4.5"
                    fill="#0B0D12"
                    stroke={accent}
                    strokeWidth="1.5"
                  />
                  {/* Center Dot */}
                  <circle cx={cx} cy={cy} r="1.8" fill="#FFFFFF" />
                </g>
              );
            })
          )}
        </svg>
      </div>

      {/* Visual Footer Caption */}
      <div className="flex items-center justify-between text-[11px] text-white/50 border-t border-white/[0.04] pt-2">
        <span>Sparse-dense multi-layer</span>
        <span className="font-mono text-white/80">Zero gradient stall</span>
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// 03: Saadhyam / Voice - Smooth, Soft Waveform Ribbon that Gently Breathes
// ─────────────────────────────────────────────────────────────────────────────
function SaadhyamVisual({ accent }: { accent: string }) {
  const [phase, setPhase] = useState(0);

  useEffect(() => {
    let frameId: number;
    let t = 0;
    const animate = () => {
      t += 0.02;
      setPhase(t);
      frameId = requestAnimationFrame(animate);
    };
    frameId = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(frameId);
  }, []);

  // Generate smooth breathing ribbon paths
  const generateWave = (offset: number, amplitude: number, frequency: number) => {
    const points: [number, number][] = [];
    const width = 380;
    const midY = 100;
    const steps = 38;

    for (let i = 0; i <= steps; i++) {
      const x = 10 + (i / steps) * width;
      // Window function so ends taper gracefully to 0
      const envelope = Math.sin((i / steps) * Math.PI);
      const y =
        midY +
        Math.sin(i * frequency + phase + offset) * amplitude * envelope +
        Math.cos(i * 0.4 + phase * 0.7) * 4 * envelope;
      points.push([x, y]);
    }

    // Build SVG smooth path through points
    return points.reduce((acc, [px, py], i, arr) => {
      if (i === 0) return `M ${px} ${py}`;
      const [prevX, prevY] = arr[i - 1];
      const cx = (prevX + px) / 2;
      const cy = (prevY + py) / 2;
      return `${acc} Q ${prevX} ${prevY}, ${cx} ${cy}`;
    }, "");
  };

  const wave1 = generateWave(0, 36, 0.28);
  const wave2 = generateWave(1.8, 26, 0.32);
  const wave3 = generateWave(3.4, 18, 0.36);

  return (
    <div className="relative w-full h-full flex flex-col justify-between p-5 select-none">
      {/* Visual Header */}
      <div className="flex items-center justify-between text-xs font-mono">
        <span className="text-white/45 text-[11px] tracking-wide">
          Sovereign foundation acoustic ribbon
        </span>
        <div className="flex items-center gap-1.5">
          <span
            className="w-1.5 h-1.5 rounded-full animate-ping"
            style={{ backgroundColor: accent }}
          />
          <span className="text-[11px] text-white/70">Sub-120ms DSP</span>
        </div>
      </div>

      {/* SVG Waveform Ribbon */}
      <div className="relative flex-1 w-full flex items-center justify-center my-1">
        <svg
          viewBox="0 0 400 200"
          className="w-full h-full max-h-[190px] overflow-visible"
        >
          <defs>
            <linearGradient id="waveGrad1" x1="0" y1="0" x2="1" y2="0">
              <stop offset="0%" stopColor={accent} stopOpacity="0.2" />
              <stop offset="50%" stopColor={accent} stopOpacity="0.95" />
              <stop offset="100%" stopColor="#FFFFFF" stopOpacity="0.9" />
            </linearGradient>

            <linearGradient id="waveGrad2" x1="0" y1="0" x2="1" y2="0">
              <stop offset="0%" stopColor="#8EA0B8" stopOpacity="0.1" />
              <stop offset="50%" stopColor="#B4C6E7" stopOpacity="0.6" />
              <stop offset="100%" stopColor={accent} stopOpacity="0.3" />
            </linearGradient>

            <filter id="ribbonGlow" x="-20%" y="-20%" width="140%" height="140%">
              <feGaussianBlur stdDeviation="3.5" result="blur" />
              <feComposite in="SourceGraphic" in2="blur" operator="over" />
            </filter>
          </defs>

          {/* Central Soft Ambient Glow */}
          <ellipse
            cx="200"
            cy="100"
            rx="140"
            ry="40"
            fill={accent}
            fillOpacity="0.12"
            filter="url(#ribbonGlow)"
          />

          {/* Wave 3 (Background subtle) */}
          <path
            d={wave3}
            fill="none"
            stroke={accent}
            strokeOpacity="0.3"
            strokeWidth="1.2"
          />

          {/* Wave 2 (Middle layer) */}
          <path
            d={wave2}
            fill="none"
            stroke="url(#waveGrad2)"
            strokeWidth="1.8"
            strokeLinecap="round"
          />

          {/* Wave 1 (Foreground primary ribbon with glow) */}
          <path
            d={wave1}
            fill="none"
            stroke="url(#waveGrad1)"
            strokeWidth="2.4"
            strokeLinecap="round"
            filter="url(#ribbonGlow)"
          />

          {/* Subtle Dynamic Harmonic Dots along wave center */}
          {[100, 200, 300].map((xPos, idx) => (
            <circle
              key={idx}
              cx={xPos}
              cy={100 + Math.sin(phase + idx * 1.5) * 20}
              r="2.5"
              fill="#FFFFFF"
              fillOpacity="0.8"
            />
          ))}
        </svg>
      </div>

      {/* Visual Footer */}
      <div className="flex items-center justify-between text-[11px] text-white/50 border-t border-white/[0.04] pt-2">
        <span>Continuous harmonic breathing</span>
        <span className="font-mono text-white/80">Lossless 48kHz</span>
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// Group B: AI Humans - Refined Portrait Card with Abstract Luminous Silhouette
// ─────────────────────────────────────────────────────────────────────────────
function AiHumanPortraitVisual({ product }: { product: ProductItem }) {
  const profile = product.humanProfile || {
    role: "AI Human",
    speakingStatus: "Active",
    initials: "AI",
  };
  const accent = product.accent;

  return (
    <div className="relative w-full h-full flex flex-col justify-between p-5 select-none overflow-hidden">
      {/* Top Bar: Identity & Role */}
      <div className="flex items-center justify-between text-xs z-10">
        <div className="flex flex-col">
          <span className="text-white text-[15px] font-medium tracking-tight">
            {product.name}
          </span>
          <span className="text-white/45 text-[11px] font-normal leading-tight">
            {profile.role}
          </span>
        </div>

        {/* Small Live "Speaking" Indicator (Pulsing Voice Bars) */}
        <div className="flex items-center gap-2 px-2.5 py-1 rounded-full bg-white/[0.04] border border-white/[0.08]">
          <div className="flex items-end gap-[3px] h-3.5">
            {[0.4, 0.9, 0.6, 0.8, 0.3].map((scale, i) => (
              <span
                key={i}
                className="w-[2px] rounded-full transition-all duration-300"
                style={{
                  height: "100%",
                  backgroundColor: accent,
                  transform: `scaleY(${scale})`,
                  animation: `voicePulse 1.${2 + i * 2}s ease-in-out infinite alternate`,
                }}
              />
            ))}
          </div>
          <span className="text-[10px] text-white/70 font-mono tracking-tight capitalize">
            {profile.speakingStatus}
          </span>
        </div>
      </div>

      {/* Center: Abstract Luminous Silhouette (NO cartoon, NO 3D toy) */}
      <div className="relative flex-1 w-full flex items-center justify-center my-1 overflow-hidden">
        {/* Soft Ambient Radiance behind the silhouette */}
        <div
          className="absolute w-44 h-44 rounded-full blur-3xl pointer-events-none opacity-30"
          style={{ backgroundColor: accent }}
        />

        <svg
          viewBox="0 0 320 220"
          className="w-full h-full max-h-[190px] overflow-visible"
        >
          <defs>
            {/* Luminous Silhouette Gradient */}
            <linearGradient id={`silhouetteGrad-${product.id}`} x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#FFFFFF" stopOpacity="0.45" />
              <stop offset="35%" stopColor={accent} stopOpacity="0.35" />
              <stop offset="85%" stopColor={accent} stopOpacity="0.05" />
              <stop offset="100%" stopColor="transparent" stopOpacity="0" />
            </linearGradient>

            {/* Rim Light Gradient */}
            <linearGradient id={`rimGrad-${product.id}`} x1="0" y1="0" x2="1" y2="0">
              <stop offset="0%" stopColor="transparent" />
              <stop offset="30%" stopColor={accent} stopOpacity="0.8" />
              <stop offset="50%" stopColor="#FFFFFF" stopOpacity="0.95" />
              <stop offset="70%" stopColor={accent} stopOpacity="0.8" />
              <stop offset="100%" stopColor="transparent" />
            </linearGradient>

            {/* Translucent Caustic Rings */}
            <radialGradient id={`causticGrad-${product.id}`} cx="50%" cy="40%" r="50%">
              <stop offset="0%" stopColor={accent} stopOpacity="0.25" />
              <stop offset="60%" stopColor={accent} stopOpacity="0.05" />
              <stop offset="100%" stopColor="transparent" />
            </radialGradient>

            <filter id={`portraitGlow-${product.id}`} x="-20%" y="-20%" width="140%" height="140%">
              <feGaussianBlur stdDeviation="4" result="blur" />
              <feComposite in="SourceGraphic" in2="blur" operator="over" />
            </filter>
          </defs>

          {/* Background Concentric Harmonic Halo */}
          <circle
            cx="160"
            cy="90"
            r="70"
            fill={`url(#causticGrad-${product.id})`}
            filter={`url(#portraitGlow-${product.id})`}
          />
          <circle
            cx="160"
            cy="90"
            r="82"
            fill="none"
            stroke="rgba(255,255,255,0.06)"
            strokeDasharray="2 6"
          />

          {/* Abstract Head Contour (Refined, minimal, elegant human silhouette) */}
          <path
            d="M 160 38 C 142 38, 128 52, 128 74 C 128 94, 138 110, 146 118 C 126 128, 92 144, 82 195 L 238 195 C 228 144, 194 128, 174 118 C 182 110, 192 94, 192 74 C 192 52, 178 38, 160 38 Z"
            fill={`url(#silhouetteGrad-${product.id})`}
          />

          {/* Luminous Rim Light across silhouette contour */}
          <path
            d="M 128 78 C 128 54, 142 40, 160 40 C 178 40, 192 54, 192 78"
            fill="none"
            stroke={`url(#rimGrad-${product.id})`}
            strokeWidth="1.8"
            filter={`url(#portraitGlow-${product.id})`}
          />

          {/* Gentle Collarbone / Shoulder Arc */}
          <path
            d="M 104 175 C 130 160, 190 160, 216 175"
            fill="none"
            stroke="rgba(255,255,255,0.12)"
            strokeWidth="1"
          />

          {/* Subtle Internal Caustic Light Lines */}
          <path
            d="M 148 68 C 154 62, 166 62, 172 68"
            fill="none"
            stroke={accent}
            strokeOpacity="0.4"
            strokeWidth="1"
          />
          <path
            d="M 152 92 C 156 96, 164 96, 168 92"
            fill="none"
            stroke="rgba(255,255,255,0.25)"
            strokeWidth="1"
          />

          {/* Breathing Presence Beacon at Crown */}
          <circle
            cx="160"
            cy="38"
            r="2"
            fill="#FFFFFF"
            filter={`url(#portraitGlow-${product.id})`}
          />
        </svg>
      </div>

      {/* Bottom Subtle Caption */}
      <div className="flex items-center justify-between text-[11px] text-white/50 border-t border-white/[0.04] pt-2 z-10">
        <span>Family of Mentneo AI Humans</span>
        <span className="font-mono text-white/80">Zero robotic latency</span>
      </div>

      {/* CSS Voice Bar Pulse Animation */}
      <style jsx>{`
        @keyframes voicePulse {
          0% {
            transform: scaleY(0.25);
          }
          100% {
            transform: scaleY(1);
          }
        }
      `}</style>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// 09: Neuro HGI - Heterogeneous Silicon Substrate Die
// ─────────────────────────────────────────────────────────────────────────────
function NeuroChipVisual({ accent }: { accent: string }) {
  return (
    <div className="relative w-full h-full flex flex-col justify-between p-5 select-none">
      {/* Visual Header */}
      <div className="flex items-center justify-between text-xs font-mono">
        <span className="text-white/45 text-[11px] tracking-wide">
          Monolithic silicon die
        </span>
        <span className="text-[11px] text-[#F59E0B]">2.20 mm physical die</span>
      </div>

      {/* Die Vector Graphics */}
      <div className="relative flex-1 w-full flex items-center justify-center my-1">
        <svg
          viewBox="0 0 320 200"
          className="w-full h-full max-h-[180px] overflow-visible"
        >
          <defs>
            <radialGradient id="dieGlow" cx="50%" cy="50%" r="50%">
              <stop offset="0%" stopColor={accent} stopOpacity="0.35" />
              <stop offset="60%" stopColor={accent} stopOpacity="0.08" />
              <stop offset="100%" stopColor="transparent" />
            </radialGradient>

            <filter id="goldGlow" x="-20%" y="-20%" width="140%" height="140%">
              <feGaussianBlur stdDeviation="3" result="blur" />
              <feComposite in="SourceGraphic" in2="blur" operator="over" />
            </filter>
          </defs>

          {/* Ambient Amber Glow behind chip die */}
          <rect
            x="85"
            y="25"
            width="150"
            height="150"
            rx="20"
            fill="url(#dieGlow)"
            filter="url(#goldGlow)"
          />

          {/* Outer Package Substrate */}
          <rect
            x="95"
            y="35"
            width="130"
            height="130"
            rx="12"
            fill="#0E0D09"
            stroke="rgba(245,158,11,0.3)"
            strokeWidth="1.2"
          />

          {/* Inner Silicon Core */}
          <rect
            x="115"
            y="55"
            width="90"
            height="90"
            rx="6"
            fill="#14120D"
            stroke={accent}
            strokeWidth="1"
            strokeDasharray="4 2"
          />

          {/* Interconnect Golden Traces */}
          <line x1="95" y1="65" x2="115" y2="65" stroke={accent} strokeWidth="1" />
          <line x1="95" y1="85" x2="115" y2="85" stroke={accent} strokeWidth="1" />
          <line x1="95" y1="105" x2="115" y2="105" stroke={accent} strokeWidth="1" />
          <line x1="95" y1="125" x2="115" y2="125" stroke={accent} strokeWidth="1" />

          <line x1="205" y1="65" x2="225" y2="65" stroke={accent} strokeWidth="1" />
          <line x1="205" y1="85" x2="225" y2="85" stroke={accent} strokeWidth="1" />
          <line x1="205" y1="105" x2="225" y2="105" stroke={accent} strokeWidth="1" />
          <line x1="205" y1="125" x2="225" y2="125" stroke={accent} strokeWidth="1" />

          {/* Central Neural Substrate Unit */}
          <rect
            x="135"
            y="75"
            width="50"
            height="50"
            rx="4"
            fill="#0A0906"
            stroke="#FFFFFF"
            strokeOpacity="0.4"
            strokeWidth="1"
          />

          {/* Core Pulsing Point */}
          <circle
            cx="160"
            cy="100"
            r="4"
            fill={accent}
            filter="url(#goldGlow)"
            className="animate-pulse"
          />
        </svg>
      </div>

      {/* Visual Footer */}
      <div className="flex items-center justify-between text-[11px] text-white/50 border-t border-white/[0.04] pt-2">
        <span>Optical memory waveguide</span>
        <span className="font-mono text-[#F59E0B]">680 TFLOPS · 11.8W</span>
      </div>
    </div>
  );
}
