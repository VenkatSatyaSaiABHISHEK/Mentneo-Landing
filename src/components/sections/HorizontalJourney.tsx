"use client";

import React, { useEffect, useRef, useState } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { PRODUCTS } from "@/data/products";
import ProductVisualizer from "@/components/products/ProductVisualizer";

export default function HorizontalJourney() {
  const containerRef = useRef<HTMLDivElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [progressPercent, setProgressPercent] = useState(0);

  useEffect(() => {
    if (typeof window === "undefined") return;
    gsap.registerPlugin(ScrollTrigger);

    const container = containerRef.current;
    const track = trackRef.current;
    if (!container || !track) return;

    // Check if desktop screen width allows smooth horizontal pin
    const isDesktop = window.matchMedia("(min-width: 1024px)").matches;
    if (!isDesktop) return;

    const totalScrollWidth = track.scrollWidth - window.innerWidth;

    const tween = gsap.to(track, {
      x: () => -totalScrollWidth,
      ease: "none",
      scrollTrigger: {
        trigger: container,
        start: "top top",
        end: () => `+=${totalScrollWidth}`,
        pin: true,
        scrub: 0.8,
        invalidateOnRefresh: true,
        anticipatePin: 1,
        onUpdate: (self) => {
          const prog = self.progress;
          setProgressPercent(prog * 100);
          const active = Math.min(
            PRODUCTS.length - 1,
            Math.floor(prog * PRODUCTS.length)
          );
          setCurrentIndex(active);
        },
      },
    });

    return () => {
      tween.kill();
      ScrollTrigger.getAll().forEach((st) => {
        if (st.trigger === container) st.kill();
      });
    };
  }, []);

  const currentProduct = PRODUCTS[currentIndex] || PRODUCTS[0];

  return (
    <section
      id="chapter-3"
      ref={containerRef}
      className="relative bg-black text-[#F2F2F0] overflow-hidden select-none"
    >
      {/* Top Persistent Progress Bar & Scene Counter */}
      <div className="hidden lg:flex fixed top-24 left-8 right-8 z-30 items-center justify-between pointer-events-none">
        <div className="flex items-center gap-3 bg-black/75 backdrop-blur-md px-4 py-2 rounded-full border border-white/10 shadow-lg">
          <span
            className="w-2 h-2 rounded-full transition-colors duration-500"
            style={{ backgroundColor: currentProduct.accent }}
          />
          <span className="font-mono text-xs text-white/50 tracking-wideMono uppercase">
            FLEET HORIZON
          </span>
          <span className="font-mono text-xs font-bold text-white tracking-tight">
            {currentProduct.index} / 07
          </span>
          <span className="text-white/40">·</span>
          <span className="text-xs font-semibold text-white/90">
            {currentProduct.name}
          </span>
        </div>

        {/* Thin Hairline Progress Line */}
        <div className="w-52 h-[2px] bg-white/10 rounded-full overflow-hidden">
          <div
            className="h-full transition-all duration-300"
            style={{
              width: `${Math.max(5, progressPercent)}%`,
              backgroundColor: currentProduct.accent,
            }}
          />
        </div>
      </div>

      {/* HORIZONTAL TRACK (Desktop: Pinned Horizontal Scrub / Mobile: Vertical Stack) */}
      <div
        ref={trackRef}
        className="flex flex-col lg:flex-row w-full lg:w-max min-h-screen"
      >
        {PRODUCTS.map((prod) => (
          <div
            key={prod.id}
            style={{ backgroundColor: prod.bgShade }}
            className="w-full lg:w-screen min-h-screen flex items-center justify-center px-6 lg:px-16 py-28 relative border-b lg:border-b-0 lg:border-r border-white/[0.06] transition-colors duration-700"
          >
            {/* Ambient specular light spot */}
            <div
              className="absolute top-1/4 left-1/3 w-[500px] h-[500px] rounded-full blur-[140px] pointer-events-none opacity-10"
              style={{ backgroundColor: prod.accent }}
            />

            <div className="max-w-7xl w-full mx-auto grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center relative z-10">
              {/* Left Column: Editorial Information (5 Cols) */}
              <div className="lg:col-span-5 space-y-6">
                {/* Meta Badge */}
                <div className="flex items-center gap-3">
                  <span
                    className="font-mono text-xs px-2.5 py-0.5 rounded-full border border-white/15 bg-white/[0.04] font-semibold"
                    style={{ color: prod.accent }}
                  >
                    {prod.index} / 07
                  </span>
                  <span className="font-mono text-xs uppercase tracking-wideMono text-white/50">
                    {prod.category}
                  </span>
                  <span className="text-white/20">|</span>
                  <span className="font-mono text-xs text-white/60">
                    {prod.status}
                  </span>
                </div>

                {/* Product Name & Bold Headline */}
                <div>
                  <h2 className="text-3xl sm:text-4xl lg:text-5xl font-light tracking-[-0.03em] text-white leading-tight">
                    {prod.name}
                  </h2>
                  <p
                    className="text-lg sm:text-xl font-normal mt-2 tracking-tight"
                    style={{ color: prod.accent }}
                  >
                    {prod.headline}
                  </p>
                </div>

                {/* In-depth Clear Description (Readable 14-15px typography) */}
                <p className="text-sm sm:text-[15px] text-[#8A8F98] leading-relaxed font-normal">
                  {prod.description}
                </p>

                {/* 3 Key Metrics Cards with Gradient Hairlines */}
                <div className="grid grid-cols-3 gap-3 pt-2">
                  {prod.metrics.map((metric, mIdx) => (
                    <div
                      key={mIdx}
                      className="p-3.5 rounded-xl border border-white/10 border-t-white/20 bg-white/[0.025] shadow-[inset_0_1px_0_rgba(255,255,255,0.08)]"
                    >
                      <span className="font-mono text-[10px] uppercase tracking-wideMono text-white/50 block mb-1">
                        {metric.label}
                      </span>
                      <span
                        className="font-mono text-base sm:text-lg font-bold block"
                        style={{ color: prod.accent }}
                      >
                        {metric.value}
                      </span>
                      <span className="text-[11px] text-white/50 block mt-1 leading-snug">
                        {metric.detail}
                      </span>
                    </div>
                  ))}
                </div>

                {/* Spec Table Card with Chamfered Style */}
                <div className="p-4 rounded-xl border border-white/10 border-t-white/20 bg-black/60 shadow-[inset_0_1px_0_rgba(255,255,255,0.06)] space-y-2 font-mono text-xs">
                  {prod.specs.map((sp) => (
                    <div
                      key={sp.label}
                      className="flex items-center justify-between text-white/70"
                    >
                      <span className="text-white/40">{sp.label}</span>
                      <span className="text-white font-medium">{sp.value}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Right Column: Live Interactive Demo Visualizer (7 Cols) */}
              <div className="lg:col-span-7 h-[430px] sm:h-[490px] w-full">
                <ProductVisualizer product={prod} />
              </div>
            </div>

            {/* Mobile Scene Indicator */}
            <div className="lg:hidden absolute bottom-4 right-6 font-mono text-xs text-white/50">
              PRODUCT {prod.index} OF 07
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
