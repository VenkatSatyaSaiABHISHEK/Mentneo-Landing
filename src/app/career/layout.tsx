import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Careers at MENTNEO — Build Your Future 2026",
  description:
    "Explore BTech engineering roles, MBA business leadership positions, and industry internship programs at Mentneo.",
};

export default function CareerLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-white text-[#0B0C0E] font-sans antialiased selection:bg-[#0B0C0E] selection:text-white">
      {children}
    </div>
  );
}
