import SmoothScrollProvider from "@/components/ui/SmoothScrollProvider";
import CustomCursor from "@/components/ui/CustomCursor";
import FlowController from "@/components/ui/FlowController";
import Preloader from "@/components/sections/Preloader";
import Navbar from "@/components/sections/Navbar";
import Hero from "@/components/sections/Hero";
import TheShift from "@/components/sections/TheShift";
import HorizontalJourney from "@/components/sections/HorizontalJourney";
import NeuroChipSection from "@/components/sections/NeuroChipSection";
import EnterpriseGov from "@/components/sections/EnterpriseGov";
import MentlearnSection from "@/components/sections/MentlearnSection";
import FinaleSection from "@/components/sections/FinaleSection";

export default function Home() {
  return (
    <SmoothScrollProvider>
      {/* Precision Custom Cursor */}
      <CustomCursor />

      {/* Floating Story Flow Controller Progress Rail */}
      <FlowController />

      {/* Chapter 0: Preloader Boot Sequence */}
      <Preloader />

      {/* Floating Navbar */}
      <Navbar />

      <main className="relative min-h-screen bg-black text-[#F2F2F0] selection:bg-white/20 selection:text-white">
        {/* Intro: Hero & Flower-style Product Fan */}
        <Hero />

        {/* The Cognitive Shift (Word-by-word scroll-scrubbed) */}
        <TheShift />

        {/* Products: Product Fleet (Horizontal Pinned Journey) */}
        <HorizontalJourney />

        {/* Chip: Depth Section - Neuro HGI 2.2 mm Chip (Exploded 3D & Specs) */}
        <NeuroChipSection />

        {/* Domains: Enterprise & Government (Self-Drawing Security Boundary) */}
        <EnterpriseGov />

        {/* Academy: Mentlearn Engineering Academy (Draggable Course Rail) */}
        <MentlearnSection />

        {/* Contact: Typographic Finale & Consultation */}
        <FinaleSection />
      </main>
    </SmoothScrollProvider>
  );
}
