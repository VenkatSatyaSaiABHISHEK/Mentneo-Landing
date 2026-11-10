"use client";

import React, { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

export default function TheShift() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const textContainerRef = useRef<HTMLDivElement>(null);
  const pillarsRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (typeof window === "undefined") return;
    gsap.registerPlugin(ScrollTrigger);

    const section = sectionRef.current;
    const textContainer = textContainerRef.current;
    const pillars = pillarsRef.current;
    if (!section || !textContainer) return;

    const words = textContainer.querySelectorAll(".scrub-word");

    // Word by word scroll scrubbed timeline
    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: section,
        start: "top top",
        end: "+=120%",
        pin: true,
        scrub: 0.8,
        anticipatePin: 1,
      },
    });

    // Background color transition from pure black #000000 to graphite #0E1013
    tl.to(
      section,
      {
        backgroundColor: "#0E1013",
        ease: "none",
        duration: 1,
      },
      0
    );

    // Stagger word reveals with opacity and blur clearing
    tl.to(
      words,
      {
        opacity: 1,
        filter: "blur(0px)",
        stagger: 0.04,
        ease: "power2.out",
      },
      0
    );

    // Fade in supporting pillars towards the end of scrub
    if (pillars) {
      tl.fromTo(
        pillars,
        { opacity: 0, y: 30 },
        { opacity: 1, y: 0, ease: "power3.out", duration: 0.4 },
        0.65
      );
    }

    return () => {
      ScrollTrigger.getAll().forEach((st) => {
        if (st.trigger === section) st.kill();
      });
    };
  }, []);

  const statementParagraphs = [
    {
      prefix: "THE CONTRARIAN THESIS",
      text: "For two years, the industry raced to scale brute-force probabilistic approximations. They treated hallucinations as an inevitable price of intelligence.",
    },
    {
      prefix: "THE MENTNEO POSTULATE",
      text: "We reject probabilistic complacency. Real intelligence is not speculative guesswork—it is deterministic, auditable, and mathematically verifiable.",
    },
  ];

  return (
    <section
      id="chapter-2"
      ref={sectionRef}
      className="relative min-h-screen bg-black text-[#F2F2F0] px-6 py-20 flex flex-col justify-center items-center overflow-hidden transition-colors duration-700"
    >
      {/* Background Micro-grid texture */}
      <div className="absolute inset-0 bg-tech-grid opacity-30 pointer-events-none" />

      <div className="relative z-10 max-w-5xl mx-auto w-full">
        {/* Chapter Header */}
        <div className="flex items-center gap-3 mb-10">
          <span className="font-mono text-xs uppercase tracking-wideMono text-[#7DD3FC]">
            FOUNDATION
          </span>
          <div className="h-[1px] w-12 bg-white/20" />
          <span className="font-mono text-xs uppercase tracking-wideMono text-white/40">
            THE PARADIGM SHIFT
          </span>
        </div>

        {/* Word-by-word Scrub Text Container */}
        <div ref={textContainerRef} className="space-y-8">
          {statementParagraphs.map((block, pIdx) => (
            <div key={pIdx}>
              <p className="font-mono text-[10px] uppercase tracking-wideMono text-white/40 mb-3">
                {block.prefix}
              </p>
              <h2 className="text-3xl sm:text-5xl lg:text-6xl font-light tracking-[-0.03em] leading-[1.15] text-white">
                {block.text.split(" ").map((word, wIdx) => (
                  <span
                    key={wIdx}
                    className="scrub-word inline-block mr-[0.25em] opacity-15 filter blur-[4px] transition-all will-change-[opacity,filter]"
                  >
                    {word}
                  </span>
                ))}
              </h2>
            </div>
          ))}
        </div>

        {/* Supporting Tri-fold Architectural Pillars */}
        <div
          ref={pillarsRef}
          className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-16 pt-10 border-t border-white/10"
        >
          <div className="p-5 rounded-xl border border-white/[0.08] bg-white/[0.015]">
            <span className="font-mono text-[10px] text-[#7DD3FC] uppercase tracking-wideMono block mb-1">
              01 · VERIFICATION
            </span>
            <h4 className="text-sm font-semibold text-white tracking-tight mb-2">
              Formal Proof Checking
            </h4>
            <p className="text-xs text-[#8A8F98] leading-relaxed">
              Every inference trace is validated through formal logic solvers before output commitment.
              Mathematical certainty replaces probabilistic guesswork.
            </p>
          </div>

          <div className="p-5 rounded-xl border border-white/[0.08] bg-white/[0.015]">
            <span className="font-mono text-[10px] text-[#38BDF8] uppercase tracking-wideMono block mb-1">
              02 · ACOUSTIC PHYSICS
            </span>
            <h4 className="text-sm font-semibold text-white tracking-tight mb-2">
              Sub-120ms True Duplex
            </h4>
            <p className="text-xs text-[#8A8F98] leading-relaxed">
              End-to-end neural audio synthesis without intermediate text transcoding. Full conversational
              presence with acoustic physics and zero latency drift.
            </p>
          </div>

          <div className="p-5 rounded-xl border border-white/[0.08] bg-white/[0.015]">
            <span className="font-mono text-[10px] text-[#F59E0B] uppercase tracking-wideMono block mb-1">
              03 · SILICON AUTONOMY
            </span>
            <h4 className="text-sm font-semibold text-white tracking-tight mb-2">
              2.2 mm Neuromorphic Die
            </h4>
            <p className="text-xs text-[#8A8F98] leading-relaxed">
              Native edge intelligence consuming sub-milliwatt power budgets. Eliminating multi-megawatt
              datacenter dependency for sovereign deployments.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
