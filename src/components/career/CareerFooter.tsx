"use client";

import React from "react";
import Link from "next/link";
import Logo from "@/components/ui/Logo";

export default function CareerFooter() {
  return (
    <footer className="w-full bg-[#FAFAFA] border-t border-[#EAEAEA] py-12 px-6 select-none">
      <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
        {/* Brand Monogram & Location */}
        <div className="space-y-2">
          <Logo variant="light" size="sm" showWordmark={true} showTagline={false} />
          <p className="text-xs text-[#666666] tracking-normal font-sans">
            Mentneo Frontier AI Research Labs · Hyderabad, India
          </p>
        </div>

        {/* Links */}
        <div className="flex flex-wrap items-center gap-6 text-xs text-[#555555]">
          <Link href="/career/apply/btech" className="hover:text-black transition-colors">
            Apply: B.Tech (Machine Learning)
          </Link>
          <Link href="/career/apply/mba" className="hover:text-black transition-colors">
            Apply: MBA Role
          </Link>
          <a
            href="mailto:careers@mentneo.ai"
            className="hover:text-black transition-colors"
          >
            careers@mentneo.ai
          </a>
          <Link href="/" className="hover:text-black transition-colors">
            mentneo.ai ↗
          </Link>
        </div>

        {/* Copyright */}
        <div className="text-xs text-[#888888] font-sans">
          <span>© 2026 Mentneo Inc. All rights reserved.</span>
        </div>
      </div>
    </footer>
  );
}
