import type { Metadata } from "next";
import localFont from "next/font/local";
import "./globals.css";

const geistSans = localFont({
  src: "./fonts/GeistVF.woff",
  variable: "--font-sans",
  weight: "100 900",
});

const geistMono = localFont({
  src: "./fonts/GeistMonoVF.woff",
  variable: "--font-mono",
  weight: "100 900",
});

export const metadata: Metadata = {
  title: "Mentneo — Intelligence, Engineered",
  description:
    "Mentneo is an AI research & development laboratory building frontier foundation models, real-time voice intelligence, autonomous agent swarms, and the 2.2 mm Neuro HGI silicon architecture.",
  icons: {
    icon: "/favicon.svg",
    shortcut: "/favicon.svg",
    apple: "/favicon.svg",
  },
  keywords: [
    "Mentneo",
    "Mentneo LLM",
    "Real-time Voice AI",
    "Saadhyam Voice Agent",
    "Neuro HGI Chip",
    "Autonomous Agents",
    "Enterprise AI Air-gapped",
    "Mentlearn",
    "AI Research Hyderabad",
  ],
  authors: [{ name: "Mentneo Research & Development" }],
  openGraph: {
    title: "Mentneo — Intelligence, Engineered",
    description:
      "Serious AI research & development: frontier models, real-time voice, sovereign air-gapped enclaves, and 2.2 mm neuromorphic silicon.",
    type: "website",
    locale: "en_US",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark">
      <body
        className={`${geistSans.variable} ${geistMono.variable} font-sans bg-black text-[#F2F2F0] antialiased selection:bg-white/20 selection:text-white`}
      >
        {children}
      </body>
    </html>
  );
}
