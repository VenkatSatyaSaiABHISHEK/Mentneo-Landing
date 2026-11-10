"use client";

import React, { useEffect, useRef, useState } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { PRODUCTS } from "@/data/products";
import ProductCard from "@/components/products/ProductCard";

export default function HorizontalJourney() {
  const containerRef = useRef<HTMLDivElement>(null);
  const viewportRef = useRef<HTMLDivElement>(null);
  const sceneRefs = useRef<(HTMLDivElement | null)[]>([]);
  const contentRefs = useRef<(HTMLDivElement | null)[]>([]);

  const [currentIndex, setCurrentIndex] = useState(0);
  const [progressPercent, setProgressPercent] = useState(0);

  useEffect(() => {
    if (typeof window === "undefined") return;
    gsap.registerPlugin(ScrollTrigger);
    (window as unknown as Record<string, unknown>).ScrollTrigger = ScrollTrigger;
    (window as unknown as Record<string, unknown>).gsap = gsap;

    const container = containerRef.current;
    if (!container) return;

    const isDesktop = window.matchMedia("(min-width: 1024px)").matches;
    if (!isDesktop) return;

    // Reset clips and transforms for clean initialization
    sceneRefs.current.forEach((scene, i) => {
      if (scene) {
        if (i === 0) {
          gsap.set(scene, { clipPath: "inset(0% 0% 0% 0%)" });
        } else {
          gsap.set(scene, { clipPath: "inset(0% 0% 0% 100%)" });
        }
      }
    });

    contentRefs.current.forEach((content) => {
      if (content) {
        gsap.set(content, { x: 0, opacity: 1 });
      }
    });

    // Pinned scroll distance: 220vh per scene (total ~1980vh for 9 scenes)
    // GSAP scrub: 1.4 for calm, weighty cinematic feel
    const totalDistanceVh = PRODUCTS.length * 220;

    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: container,
        start: "top top",
        end: () => `+=${totalDistanceVh}vh`,
        pin: true,
        scrub: 1.4,
        anticipatePin: 1,
        invalidateOnRefresh: true,
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

    // Build timeline with dwell periods (soft magnet rest) and clip-path wipe + parallax
    for (let i = 0; i < PRODUCTS.length - 1; i++) {
      // 1. Soft Magnet Dwell / Rest at scene i
      tl.to({}, { duration: 1.1 });

      // 2. Cinematic transition: 1.3s ease power3.inOut clip-path wipe with multi-plane parallax
      const nextScene = sceneRefs.current[i + 1];
      const currContent = contentRefs.current[i];
      const nextContent = contentRefs.current[i + 1];

      const label = `trans-${i}`;

      if (nextScene) {
        tl.to(
          nextScene,
          {
            clipPath: "inset(0% 0% 0% 0%)",
            ease: "power3.inOut",
            duration: 1.3,
          },
          label
        );
      }

      if (currContent) {
        tl.to(
          currContent,
          {
            x: -80,
            opacity: 0.25,
            ease: "power3.inOut",
            duration: 1.3,
          },
          label
        );
      }

      if (nextContent) {
        tl.fromTo(
          nextContent,
          { x: 80, opacity: 0.3 },
          {
            x: 0,
            opacity: 1,
            ease: "power3.inOut",
            duration: 1.3,
          },
          label
        );
      }
    }

    // Final dwell period on the last scene (Neuro HGI) before unpinning
    tl.to({}, { duration: 1.1 });

    return () => {
      tl.kill();
      ScrollTrigger.getAll().forEach((st) => {
        if (st.trigger === container) st.kill();
      });
    };
  }, []);

  const currentProduct = PRODUCTS[currentIndex] || PRODUCTS[0];

  const handleJumpToScene = (idx: number) => {
    if (!containerRef.current) return;
    const isDesktop = window.matchMedia("(min-width: 1024px)").matches;
    if (isDesktop) {
      const stList = ScrollTrigger.getAll();
      const st = stList.find((s) => s.trigger === containerRef.current);
      if (st) {
        const totalDuration = (PRODUCTS.length - 1) * 2.4 + 1.1;
        const targetTime = idx * 2.4 + 0.55;
        const targetProgress = Math.min(1, Math.max(0, targetTime / totalDuration));
        const targetY = st.start + targetProgress * (st.end - st.start);
        window.scrollTo({ top: targetY, behavior: "smooth" });
        return;
      }
    }
    const mobileScene = document.getElementById(`mobile-scene-${idx}`);
    mobileScene?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    if (typeof window !== "undefined") {
      (window as unknown as Record<string, unknown>).__jumpToScene = handleJumpToScene;
    }
  }, []);

  return (
    <section
      id="chapter-3"
      ref={containerRef}
      className="relative bg-black text-[#F2F2F0] select-none"
    >
      {/* ─── Top Persistent Progress Bar & Scene Counter (01 / 09) ─── */}
      <div className="hidden lg:flex fixed top-24 left-8 right-8 z-40 items-center justify-between pointer-events-none transition-all duration-500">
        <div className="flex items-center gap-3 bg-black/80 backdrop-blur-xl px-4 py-2 rounded-full border border-white/10 shadow-[0_8px_32px_rgba(0,0,0,0.6)]">
          <span
            className="w-2 h-2 rounded-full transition-colors duration-500 shadow-[0_0_8px_currentColor]"
            style={{ backgroundColor: currentProduct.accent, color: currentProduct.accent }}
          />
          <span className="font-mono text-xs text-white/50 tracking-wider uppercase">
            {currentProduct.group}
          </span>
          <span className="text-white/20">·</span>
          <span className="font-mono text-xs font-semibold text-white tracking-tight">
            {currentProduct.index} / 09
          </span>
          <span className="text-white/40">·</span>
          <span className="text-xs font-medium text-white/90">
            {currentProduct.name}
          </span>
        </div>

        {/* 9-Scene Interactive Step Dots & Progress Hairline */}
        <div className="flex items-center gap-3 pointer-events-auto bg-black/80 backdrop-blur-xl px-4 py-2 rounded-full border border-white/10 shadow-[0_8px_32px_rgba(0,0,0,0.6)]">
          <div className="flex items-center gap-1.5">
            {PRODUCTS.map((prod, idx) => (
              <button
                key={prod.id}
                onClick={() => handleJumpToScene(idx)}
                aria-label={`Jump to scene ${prod.index}: ${prod.name}`}
                className="group relative p-1 focus:outline-none"
              >
                <span
                  className={`block rounded-full transition-all duration-300 ${
                    idx === currentIndex
                      ? "w-5 h-2"
                      : "w-2 h-2 group-hover:scale-125"
                  }`}
                  style={{
                    backgroundColor:
                      idx === currentIndex
                        ? prod.accent
                        : "rgba(255,255,255,0.2)",
                  }}
                />
              </button>
            ))}
          </div>

          <div className="w-28 h-[2px] bg-white/10 rounded-full overflow-hidden ml-1">
            <div
              className="h-full transition-all duration-300 ease-out"
              style={{
                width: `${Math.max(8, progressPercent)}%`,
                backgroundColor: currentProduct.accent,
              }}
            />
          </div>
        </div>
      </div>

      {/* ─── Desktop Pinned Viewport (Stacked Clip-Path Wipe Scenes) ─── */}
      <div
        ref={viewportRef}
        className="hidden lg:block relative w-full h-screen overflow-hidden"
      >
        {PRODUCTS.map((prod, idx) => (
          <div
            key={prod.id}
            ref={(el) => {
              sceneRefs.current[idx] = el;
            }}
            style={{
              backgroundColor: prod.bgShade,
              zIndex: 10 + idx,
            }}
            className="absolute inset-0 w-full h-full flex items-center justify-center px-8 lg:px-16 xl:px-24 will-change-[clip-path]"
          >
            {/* Ambient Background Specular Glow */}
            <div
              className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[550px] rounded-full blur-[160px] pointer-events-none opacity-20 transition-colors duration-700"
              style={{ backgroundColor: prod.accent }}
            />

            {/* Scene Content Container (With Parallax Offset) */}
            <div
              ref={(el) => {
                contentRefs.current[idx] = el;
              }}
              className="relative z-10 max-w-7xl w-full mx-auto grid grid-cols-12 gap-10 lg:gap-14 items-center"
            >
              {/* LEFT COLUMN: Editorial & Highlights (6 Cols) */}
              <div className="col-span-6 space-y-7 pr-4">
                {/* Small Group Label above scene name */}
                <div className="flex items-center gap-2.5">
                  <span
                    className="w-2 h-2 rounded-full transition-colors duration-500"
                    style={{ backgroundColor: prod.accent }}
                  />
                  <span className="font-mono text-xs uppercase tracking-wider text-white/50 font-medium">
                    {prod.group}
                  </span>
                  <span className="text-white/20">·</span>
                  <span className="font-mono text-xs text-white/40">
                    Scene {prod.index} / 09
                  </span>
                </div>

                {/* Product Name (Large, clean Grotesk) */}
                <div>
                  <h2 className="text-4xl sm:text-5xl lg:text-6xl font-light tracking-[-0.03em] text-white leading-[1.08]">
                    {prod.name}
                  </h2>
                  {/* One-Line Promise (Supporting text high contrast, comfortable line height) */}
                  <p className="text-lg sm:text-xl text-[#E4E4E7] font-normal leading-relaxed tracking-tight mt-3">
                    {prod.promise}
                  </p>
                </div>

                {/* 2-3 Short Highlights (Readable 15-16px, comfortable line height) */}
                <div className="pt-5 border-t border-white/[0.08] space-y-3.5">
                  {prod.highlights.map((h, hIdx) => (
                    <div
                      key={hIdx}
                      className="flex items-start gap-3.5 text-[15px] sm:text-[16px] text-[#A1A1AA] leading-relaxed"
                    >
                      <span
                        className="w-1.5 h-1.5 rounded-full mt-2.5 shrink-0"
                        style={{ backgroundColor: prod.accent }}
                      />
                      <span>{h}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* RIGHT COLUMN: ONE Refined Card (6 Cols) */}
              <div className="col-span-6 flex items-center justify-center">
                <ProductCard product={prod} />
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* ─── Mobile: Vertical Stacked Cards with Scroll-Snap ─── */}
      <div className="lg:hidden flex flex-col w-full divide-y divide-white/[0.06]">
        {PRODUCTS.map((prod, idx) => (
          <div
            id={`mobile-scene-${idx}`}
            key={prod.id}
            style={{ backgroundColor: prod.bgShade }}
            className="w-full min-h-screen flex flex-col justify-center px-6 py-24 relative overflow-hidden"
          >
            {/* Ambient specular light */}
            <div
              className="absolute top-1/4 left-1/2 -translate-x-1/2 w-80 h-80 rounded-full blur-[120px] pointer-events-none opacity-20"
              style={{ backgroundColor: prod.accent }}
            />

            <div className="relative z-10 w-full space-y-6">
              {/* Meta Pill */}
              <div className="flex items-center gap-2">
                <span
                  className="w-2 h-2 rounded-full"
                  style={{ backgroundColor: prod.accent }}
                />
                <span className="font-mono text-xs uppercase tracking-wider text-white/50">
                  {prod.group} · {prod.index} / 09
                </span>
              </div>

              {/* Product Name & Promise */}
              <div>
                <h2 className="text-3xl sm:text-4xl font-light tracking-tight text-white">
                  {prod.name}
                </h2>
                <p className="text-base sm:text-lg text-[#E4E4E7] font-normal mt-2 leading-snug">
                  {prod.promise}
                </p>
              </div>

              {/* Product Card */}
              <div className="py-2 flex justify-center">
                <ProductCard product={prod} />
              </div>

              {/* Highlights */}
              <div className="pt-4 border-t border-white/[0.08] space-y-2.5">
                {prod.highlights.map((h, hIdx) => (
                  <div
                    key={hIdx}
                    className="flex items-start gap-2.5 text-sm text-[#A1A1AA] leading-relaxed"
                  >
                    <span
                      className="w-1.5 h-1.5 rounded-full mt-2 shrink-0"
                      style={{ backgroundColor: prod.accent }}
                    />
                    <span>{h}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
