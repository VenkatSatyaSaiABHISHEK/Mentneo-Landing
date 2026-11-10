"use client";

import React, { useState, useRef } from "react";
import { ProductItem } from "@/data/products";
import ProductVisualizer from "./ProductVisualizer";

interface ProductCardProps {
  product: ProductItem;
  className?: string;
}

export default function ProductCard({ product, className = "" }: ProductCardProps) {
  const cardRef = useRef<HTMLDivElement>(null);
  const [rotateX, setRotateX] = useState(0);
  const [rotateY, setRotateY] = useState(0);
  const [isHovered, setIsHovered] = useState(false);
  const [lightPos, setLightPos] = useState({ x: 50, y: 50 });

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width;
    const y = (e.clientY - rect.top) / rect.height;

    // Gentle 3D tilt: max 5 degrees
    const rX = (0.5 - y) * 9; // ~ -4.5deg to +4.5deg
    const rY = (x - 0.5) * 9;

    setRotateX(rX);
    setRotateY(rY);
    setLightPos({ x: x * 100, y: y * 100 });
  };

  const handleMouseEnter = () => {
    setIsHovered(true);
  };

  const handleMouseLeave = () => {
    setIsHovered(false);
    setRotateX(0);
    setRotateY(0);
  };

  return (
    <div className={`relative flex items-center justify-center ${className}`}>
      {/* Soft Ambient Glow behind the card */}
      <div
        className="absolute -inset-4 sm:-inset-8 rounded-[36px] blur-3xl pointer-events-none transition-all duration-700 ease-out"
        style={{
          background: `radial-gradient(ellipse at 50% 50%, ${product.accent}24, transparent 70%)`,
          opacity: isHovered ? 0.35 : 0.18,
          transform: isHovered ? "scale(1.04)" : "scale(1)",
        }}
      />

      {/* 3D Tilt Card Shell */}
      <div
        ref={cardRef}
        onMouseMove={handleMouseMove}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
        style={{
          transform: `perspective(1100px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) ${
            isHovered ? "translateZ(10px) scale(1.015)" : "translateZ(0px) scale(1)"
          }`,
          transition: isHovered
            ? "transform 0.12s ease-out, box-shadow 0.3s ease-out"
            : "transform 0.6s cubic-bezier(0.2, 0.8, 0.2, 1), box-shadow 0.6s ease-out",
        }}
        className="relative w-full max-w-[520px] lg:max-w-[540px] h-[58vh] sm:h-[62vh] min-h-[460px] max-h-[580px] rounded-[30px] p-[1px] select-none transition-colors duration-500 overflow-hidden"
      >
        {/* 1px Gradient Hairline Border (Brighter at top-left, fading down-right) */}
        <div
          className="absolute inset-0 rounded-[30px] pointer-events-none"
          style={{
            background: `linear-gradient(135deg, rgba(255,255,255,0.35) 0%, rgba(255,255,255,0.08) 40%, rgba(255,255,255,0.02) 100%)`,
            mask: "linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)",
            maskComposite: "exclude",
            WebkitMaskComposite: "xor",
            padding: "1px",
          }}
        />

        {/* Card Main Surface: Layered glass-on-black */}
        <div className="relative w-full h-full rounded-[29px] bg-gradient-to-b from-[#111318]/95 via-[#0C0D11]/95 to-[#08090C]/98 backdrop-blur-2xl p-6 sm:p-7 flex flex-col justify-between overflow-hidden shadow-[inset_0_1px_1px_rgba(255,255,255,0.18),inset_1px_0_0_rgba(255,255,255,0.06),0_24px_50px_rgba(0,0,0,0.65)]">
          {/* Subtle Dynamic Specular Light Following Cursor */}
          <div
            className="absolute inset-0 pointer-events-none transition-opacity duration-300"
            style={{
              background: `radial-gradient(circle 380px at ${lightPos.x}% ${lightPos.y}%, rgba(255,255,255,0.07), transparent 70%)`,
              opacity: isHovered ? 1 : 0,
            }}
          />

          {/* Film Grain Subtle Overlay */}
          <div
            className="absolute inset-0 pointer-events-none opacity-[0.035] mix-blend-overlay"
            style={{
              backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.8' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")`,
            }}
          />

          {/* Card Header */}
          <div className="relative z-10 flex items-center justify-between pb-3 border-b border-white/[0.07]">
            <div className="flex items-center gap-2.5">
              <span
                className="w-2 h-2 rounded-full transition-colors duration-500"
                style={{
                  backgroundColor: product.accent,
                  boxShadow: `0 0 10px ${product.accent}66`,
                }}
              />
              <span className="font-mono text-[11px] text-white/55 tracking-wider uppercase">
                {product.index} · {product.group}
              </span>
            </div>

            <div className="flex items-center gap-2">
              <span className="text-[12px] text-white/45 font-normal">
                {product.tagline}
              </span>
            </div>
          </div>

          {/* Center Visual Canvas (Product specific, calm and elegant) */}
          <div className="relative z-10 flex-1 my-3 flex items-center justify-center overflow-hidden rounded-2xl bg-white/[0.015] border border-white/[0.04]">
            <ProductVisualizer product={product} />
          </div>

          {/* Bottom Clean Metrics Bar (At most 3 small metrics in sentence case) */}
          <div className="relative z-10 pt-3 border-t border-white/[0.07] grid grid-cols-3 gap-2">
            {product.metrics.slice(0, 3).map((metric, idx) => (
              <div key={idx} className="flex flex-col">
                <span className="font-mono text-[10px] text-white/45 tracking-wide leading-tight truncate">
                  {metric.label}
                </span>
                <span
                  className="text-[15px] sm:text-[17px] font-medium tracking-tight mt-0.5"
                  style={{ color: idx === 0 ? product.accent : "#F2F2F0" }}
                >
                  {metric.value}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

