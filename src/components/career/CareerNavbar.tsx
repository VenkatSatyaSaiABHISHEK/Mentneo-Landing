"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import Logo from "@/components/ui/Logo";
import { Menu, X } from "lucide-react";

interface CareerNavbarProps {
  isOpen?: boolean;
}

export default function CareerNavbar({ isOpen }: CareerNavbarProps) {
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [dynamicOpen, setDynamicOpen] = useState<boolean>(isOpen !== undefined ? isOpen : true);

  useEffect(() => {
    if (isOpen !== undefined) {
      setDynamicOpen(isOpen);
      return;
    }

    async function checkStatus() {
      try {
        const res = await fetch(`/api/career/form-config?t=${Date.now()}`, { cache: "no-store" });
        if (res.ok) {
          const json = await res.json();
          if (json.success && json.data) {
            const open = json.data.globalOpen && (json.data.btech.isOpen || json.data.mba.isOpen);
            setDynamicOpen(open);
          }
        }
      } catch {}
    }
    checkStatus();
  }, [isOpen]);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-40 transition-all duration-300 ${
        scrolled
          ? "py-3.5 bg-white/95 backdrop-blur-md border-b border-[#EAEAEA] shadow-[0_2px_12px_rgba(0,0,0,0.03)]"
          : "py-5 bg-white border-b border-[#EAEAEA]/70"
      }`}
    >
      <div className="max-w-6xl mx-auto px-6 flex items-center justify-between">
        {/* Brand Logo in light mode */}
        <Link href="/career" className="flex items-center gap-3 group">
          <Logo variant="light" size="md" showWordmark={true} showTagline={false} />
          <span className="hidden sm:inline-block ml-1 pl-3 border-l border-[#E5E5E5] text-[12px] font-sans font-medium tracking-wide text-[#666666]">
            Careers
          </span>
        </Link>

        {/* Center / Right Clean Menu with Solid Dark Text (No Blinking Dots, No Admin Buttons) */}
        <nav className="hidden md:flex items-center gap-8 text-[14px] font-medium text-[#111111]">
          <Link
            href="/career#btech"
            className="text-[#111111] hover:text-black transition-colors"
          >
            B.Tech (Machine Learning)
          </Link>
          <Link
            href="/career#mba"
            className="text-[#111111] hover:text-black transition-colors"
          >
            MBA Role
          </Link>
          <Link
            href="/"
            className="text-[#666666] hover:text-black transition-colors flex items-center gap-1"
          >
            <span>Mentneo.ai</span>
            <span className="text-xs">↗</span>
          </Link>
        </nav>

        {/* Live Dynamic Applications Status Indicator */}
        <div className="hidden sm:flex items-center">
          {dynamicOpen ? (
            <span className="px-3.5 py-1.5 rounded-full border border-emerald-500/30 bg-emerald-50 text-emerald-800 text-xs font-medium flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
              Applications Open
            </span>
          ) : (
            <span className="px-3.5 py-1.5 rounded-full border border-amber-500/30 bg-amber-50 text-amber-800 text-xs font-medium">
              Applications Closed
            </span>
          )}
        </div>

        {/* Mobile menu toggle */}
        <button
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          className="md:hidden p-2 rounded-lg text-[#111111] hover:bg-[#F5F5F5]"
          aria-label="Toggle navigation menu"
        >
          {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
        </button>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="md:hidden border-t border-[#EAEAEA] bg-white px-6 py-4 space-y-3 shadow-lg">
          <Link
            href="/career#btech"
            onClick={() => setMobileMenuOpen(false)}
            className="block text-sm font-medium text-[#111111] py-1.5"
          >
            B.Tech: Machine Learning Role
          </Link>
          <Link
            href="/career#mba"
            onClick={() => setMobileMenuOpen(false)}
            className="block text-sm font-medium text-[#111111] py-1.5"
          >
            MBA: Management &amp; Growth Role
          </Link>
          <Link
            href="/"
            onClick={() => setMobileMenuOpen(false)}
            className="block text-sm text-[#666666] py-1.5"
          >
            Mentneo Main Website ↗
          </Link>
          <div className="pt-2 border-t border-[#EAEAEA]">
            {dynamicOpen ? (
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full border border-emerald-500/30 bg-emerald-50 text-emerald-800 text-xs font-medium">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                Applications Open
              </span>
            ) : (
              <span className="inline-flex items-center px-3 py-1 rounded-full border border-amber-500/30 bg-amber-50 text-amber-800 text-xs font-medium">
                Applications Closed
              </span>
            )}
          </div>
        </div>
      )}
    </header>
  );
}
