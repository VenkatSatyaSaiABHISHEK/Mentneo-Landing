"use client";

import React, { useRef, useState } from "react";
import { COURSES, CourseItem } from "@/data/courses";

export default function MentlearnSection() {
  const railRef = useRef<HTMLDivElement>(null);
  const [activeCourse, setActiveCourse] = useState<string | null>(null);

  const scrollRail = (direction: "left" | "right") => {
    if (!railRef.current) return;
    const amount = direction === "left" ? -380 : 380;
    railRef.current.scrollBy({ left: amount, behavior: "smooth" });
  };

  return (
    <section
      id="chapter-6"
      data-theme="light"
      className="relative min-h-screen bg-[#F5F4F0] text-[#0B0C0E] px-6 py-28 flex flex-col justify-between overflow-hidden select-none border-t border-[#E9E7E1]"
    >
      {/* Background Micro Grid and Paper Texture */}
      <div className="absolute inset-0 bg-tech-grid-light opacity-50 pointer-events-none" />
      <div className="absolute bottom-1/4 left-1/4 w-[500px] h-[500px] rounded-full bg-[#2F5BFF]/[0.03] blur-[150px] pointer-events-none" />

      {/* Chapter Tag & Headline */}
      <div className="relative z-10 max-w-6xl mx-auto w-full flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-[#2F5BFF]/30 bg-[#2F5BFF]/[0.08] mb-4">
            <span className="w-1.5 h-1.5 rounded-full bg-[#2F5BFF]" />
            <span className="font-mono text-xs uppercase tracking-wideMono text-[#2F5BFF] font-semibold">
              CHAPTER 06 · ENGINEERING ACADEMY
            </span>
          </div>
          <h2 className="text-4xl sm:text-6xl font-light tracking-[-0.04em] text-[#0B0C0E]">
            Mentlearn. <br />
            <span className="text-[#4A4E57]">Bare-metal AI engineering.</span>
          </h2>
          <p className="mt-4 text-base sm:text-lg text-[#4A4E57] max-w-xl leading-relaxed">
            Rigorous, systems-level courses designed by Mentneo research scientists.
            Master GPU memory hierarchies, Triton kernels, alignment theory, and neuromorphic silicon.
          </p>
        </div>

        {/* Rail Navigation Controls */}
        <div className="flex items-center gap-3">
          <button
            onClick={() => scrollRail("left")}
            aria-label="Scroll left"
            className="w-11 h-11 rounded-full border border-[#DDD9D0] bg-white hover:bg-[#ECEAE4] flex items-center justify-center text-[#0B0C0E] shadow-sm transition-colors"
            data-cursor
            data-cursor-label="PREV"
          >
            ←
          </button>
          <button
            onClick={() => scrollRail("right")}
            aria-label="Scroll right"
            className="w-11 h-11 rounded-full border border-[#DDD9D0] bg-white hover:bg-[#ECEAE4] flex items-center justify-center text-[#0B0C0E] shadow-sm transition-colors"
            data-cursor
            data-cursor-label="NEXT"
          >
            →
          </button>
        </div>
      </div>

      {/* Draggable / Scrollable Course Rail in Crisp Paper Cards */}
      <div className="relative z-10 max-w-7xl mx-auto w-full">
        <div
          ref={railRef}
          className="flex gap-6 overflow-x-auto pb-8 pt-2 scrollbar-none snap-x snap-mandatory"
          style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
        >
          {COURSES.map((course: CourseItem) => {
            const isHovered = activeCourse === course.id;

            return (
              <div
                key={course.id}
                onMouseEnter={() => setActiveCourse(course.id)}
                onMouseLeave={() => setActiveCourse(null)}
                className={`flex-none w-[330px] sm:w-[400px] rounded-2xl border transition-all duration-300 p-7 flex flex-col justify-between snap-start cursor-pointer ${
                  isHovered
                    ? "bg-white border-[#2F5BFF]/50 shadow-[0_25px_50px_rgba(11,12,14,0.1)] scale-[1.01]"
                    : "bg-white border-[#E9E7E1] shadow-[0_8px_25px_rgba(11,12,14,0.04)] hover:border-[#DDD9D0]"
                }`}
                data-cursor
                data-cursor-label="SYLLABUS"
              >
                {/* Course Header */}
                <div>
                  <div className="flex items-center justify-between pb-4 border-b border-[#E9E7E1]">
                    <span className="font-mono text-xs text-[#2F5BFF] font-bold">
                      {course.code}
                    </span>
                    <span className="font-mono text-[10px] px-2.5 py-0.5 rounded-full border border-[#E9E7E1] bg-[#F5F4F0] text-[#4A4E57] font-semibold">
                      {course.level}
                    </span>
                  </div>

                  <h3 className="text-xl font-medium tracking-tight text-[#0B0C0E] mt-4 leading-snug">
                    {course.title}
                  </h3>

                  <p className="text-sm text-[#4A4E57] mt-3 leading-relaxed">
                    {course.description}
                  </p>
                </div>

                {/* Hover Reveal: Curriculum Breakdown */}
                <div className="my-6 pt-4 border-t border-[#E9E7E1]">
                  <span className="font-mono text-[10px] text-[#737883] uppercase tracking-wideMono block mb-2.5">
                    CURRICULUM BREAKDOWN ({course.modules} MODULES)
                  </span>
                  <ul className="space-y-2 font-mono text-xs text-[#0B0C0E]">
                    {course.syllabus.map((syl, i) => (
                      <li key={i} className="flex items-start gap-2">
                        <span className="text-[#2F5BFF] mt-0.5 font-bold">·</span>
                        <span className="line-clamp-1">{syl}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Footer Course Specs */}
                <div className="pt-4 border-t border-[#E9E7E1] flex items-center justify-between font-mono text-xs text-[#737883]">
                  <span>DURATION: {course.duration}</span>
                  <span className="text-[#2F5BFF] font-semibold flex items-center gap-1 group-hover:translate-x-1 transition-transform">
                    <span>View Syllabus</span>
                    <span>→</span>
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Bottom Academic Accreditation Note */}
      <div className="relative z-10 max-w-6xl mx-auto w-full pt-8 border-t border-[#E9E7E1] flex flex-wrap items-center justify-between font-mono text-xs text-[#737883] gap-4">
        <span>DELIVERED BY MENTNEO RESEARCH FELLOWS</span>
        <span>LAB ENVIRONMENT: DEDICATED H100 SXM5 RUNTIMES</span>
        <span>ACADEMIC PREREQUISITE VERIFICATION REQUIRED</span>
      </div>
    </section>
  );
}
