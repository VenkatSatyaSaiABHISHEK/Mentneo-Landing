"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useSmoothScroll } from "@/components/ui/SmoothScrollProvider";
import Logo from "@/components/ui/Logo";

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [isLightSection, setIsLightSection] = useState(false);
  const { scrollTo } = useSmoothScroll();

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 40);

      // Detect if user is currently inside a light section (Chapter 5 Sovereign or Chapter 6 Mentlearn)
      const ch5 = document.getElementById("chapter-5");
      const ch6 = document.getElementById("chapter-6");
      const scrollY = window.scrollY + 80;

      let inLight = false;
      if (ch5 && ch6) {
        const top5 = ch5.offsetTop;
        const bottom6 = ch6.offsetTop + ch6.offsetHeight;
        if (scrollY >= top5 && scrollY <= bottom6) {
          inLight = true;
        }
      }
      setIsLightSection(inLight);
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    handleScroll();
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-40 transition-all duration-500 ${
        scrolled
          ? isLightSection
            ? "py-3 bg-[#F5F4F0]/85 backdrop-blur-xl border-b border-[#E9E7E1] shadow-sm"
            : "py-3 bg-black/75 backdrop-blur-xl border-b border-white/[0.08]"
          : "py-6 bg-transparent"
      }`}
    >
      <div className="max-w-7xl mx-auto px-6 flex items-center justify-between">
        {/* Brand Monogram & Wordmark */}
        <Link
          href="/"
          onClick={(e) => {
            e.preventDefault();
            scrollTo("#chapter-1");
          }}
          className="group flex items-center"
          data-cursor
          data-cursor-label="HOME"
        >
          <Logo
            variant={isLightSection ? "light" : "dark"}
            size="md"
            showWordmark={true}
            showTagline={true}
          />
        </Link>

        {/* Center Nav Links */}
        <nav
          className={`hidden lg:flex items-center gap-8 text-[13px] font-medium tracking-tight transition-colors duration-300 ${
            isLightSection ? "text-ink/70" : "text-white/60"
          }`}
        >
          <button
            onClick={() => scrollTo("#chapter-2")}
            className={`transition-colors ${
              isLightSection ? "hover:text-ink" : "hover:text-white"
            }`}
          >
            The Shift
          </button>
          <button
            onClick={() => scrollTo("#chapter-3")}
            className={`transition-colors ${
              isLightSection ? "hover:text-ink" : "hover:text-white"
            }`}
          >
            Products
          </button>
          <button
            onClick={() => scrollTo("#chapter-4")}
            className={`transition-colors flex items-center gap-1.5 ${
              isLightSection ? "hover:text-ink" : "hover:text-white"
            }`}
          >
            <span>Neuro HGI</span>
            <span className="text-[9px] font-mono uppercase px-1.5 py-0.5 rounded bg-[#E8A23B]/10 text-[#E8A23B] border border-[#E8A23B]/30 font-bold">
              2.2 mm
            </span>
          </button>
          <button
            onClick={() => scrollTo("#chapter-5")}
            className={`transition-colors ${
              isLightSection ? "hover:text-ink" : "hover:text-white"
            }`}
          >
            Sovereign Enclaves
          </button>
          <button
            onClick={() => scrollTo("#chapter-6")}
            className={`transition-colors ${
              isLightSection ? "hover:text-ink" : "hover:text-white"
            }`}
          >
            Mentlearn
          </button>
        </nav>

        {/* Right Action */}
        <div className="flex items-center gap-4">
          <button
            onClick={() => scrollTo("#chapter-8")}
            className={`relative inline-flex items-center justify-center px-5 py-2.5 rounded-full border text-xs font-medium tracking-tight transition-all duration-300 ${
              isLightSection
                ? "border-ink/20 bg-ink text-white hover:bg-black"
                : "border-white/20 bg-white/10 text-white hover:bg-white hover:text-black"
            }`}
            data-cursor
            data-cursor-label="CONTACT"
          >
            <span>Talk to us</span>
          </button>
        </div>
      </div>
    </header>
  );
}
