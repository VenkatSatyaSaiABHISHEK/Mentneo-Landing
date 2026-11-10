"use client";

import React, { useEffect, useState } from "react";
import { CHAPTERS } from "@/data/chapters";
import { useSmoothScroll } from "./SmoothScrollProvider";

export default function FlowController() {
  const [activeChapter, setActiveChapter] = useState("chapter-1");
  const { scrollTo } = useSmoothScroll();

  useEffect(() => {
    const handleScroll = () => {
      const scrollPosition = window.scrollY + window.innerHeight * 0.35;
      for (let i = CHAPTERS.length - 1; i >= 0; i--) {
        const chapter = CHAPTERS[i];
        const el = document.getElementById(chapter.id);
        if (el) {
          const top = el.offsetTop;
          if (scrollPosition >= top) {
            setActiveChapter(chapter.id);
            break;
          }
        }
      }
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    handleScroll();

    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const navChapters = CHAPTERS.filter((c) => c.id !== "chapter-0");
  const currentMeta = CHAPTERS.find((c) => c.id === activeChapter) || CHAPTERS[1];
  const isLight = activeChapter === "chapter-5" || activeChapter === "chapter-6";

  return (
    <aside
      aria-label="Chapter Story Progress"
      className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50 transition-all duration-500 ease-out"
    >
      <div
        className={`rounded-full px-4 py-2 border shadow-xl backdrop-blur-xl flex items-center gap-3 transition-colors duration-500 ${
          isLight
            ? "bg-white/90 border-[#E9E7E1] text-[#0B0C0E] shadow-[0_10px_30px_rgba(11,12,14,0.12)]"
            : "bg-black/75 border-white/10 text-white shadow-[0_10px_30px_rgba(0,0,0,0.8)]"
        }`}
      >
        {/* Simple Name indicator (no CH XX tech jargon) */}
        <div
          className={`flex items-center gap-2 pr-3 border-r transition-colors ${
            isLight ? "border-[#E9E7E1]" : "border-white/10"
          }`}
        >
          <span
            className="w-1.5 h-1.5 rounded-full animate-pulse"
            style={{
              backgroundColor: isLight ? "#2F5BFF" : currentMeta.themeColor,
            }}
          />
          <span
            className={`text-xs font-medium tracking-tight transition-all duration-300 ${
              isLight ? "text-[#0B0C0E]" : "text-white/90"
            }`}
          >
            {currentMeta.title}
          </span>
        </div>

        {/* Minimal dot milestones (Intro, Products, Chip, Domains, Academy, Contact) */}
        <nav className="flex items-center gap-2">
          {navChapters.map((chap) => {
            const isActive = chap.id === activeChapter;
            return (
              <button
                key={chap.id}
                onClick={() => scrollTo(`#${chap.id}`)}
                aria-label={`Jump to ${chap.title}`}
                data-cursor
                data-cursor-label={chap.title}
                className={`relative transition-all duration-300 rounded-full flex items-center justify-center ${
                  isActive
                    ? isLight
                      ? "w-6 h-2 bg-[#2F5BFF]"
                      : "w-6 h-2 bg-white"
                    : isLight
                    ? "w-2 h-2 hover:bg-[#0B0C0E] bg-[#0B0C0E]/25"
                    : "w-2 h-2 hover:bg-white bg-white/25"
                }`}
              />
            );
          })}
        </nav>
      </div>
    </aside>
  );
}
