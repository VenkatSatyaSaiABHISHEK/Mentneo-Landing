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
import GlobalSection from "@/components/sections/GlobalSection";
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
        {/* Chapter 1: Hero & Refined Product Fan */}
        <Hero />

        {/* Chapter 2: The Cognitive Shift (Word-by-word scroll-scrubbed) */}
        <TheShift />

        {/* Chapter 3: Horizontal Pinned Journey (7 Flagship Products) */}
        <HorizontalJourney />

        {/* Chapter 4: Depth Section - Neuro HGI 2.2 mm Chip (Exploded 3D & Specs) */}
        <NeuroChipSection />

        {/* Chapter 5: Enterprise & Government (Self-Drawing Security Boundary & Counters) */}
        <EnterpriseGov />

        {/* Chapter 6: Mentlearn Engineering Academy (Draggable Course Rail) */}
        <MentlearnSection />

        {/* Chapter 7: Global Coordinates (Dotted World Map & Pulsing Hubs) */}
        <GlobalSection />

        {/* Chapter 8: Typographic Finale & Briefing Engagement */}
        <FinaleSection />
      </main>
    </SmoothScrollProvider>
  );
}
