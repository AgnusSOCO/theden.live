import React, { useState, useCallback, useEffect } from "react";
import HeroSection from "../components/sections/HeroSection";
import TrustBar from "../components/sections/TrustBar";
import WhyDifferent from "../components/sections/WhyDifferent";
import HowItWorks from "../components/sections/HowItWorks";
import OfferStack from "../components/sections/OfferStack";
import ForWho from "../components/sections/ForWho";
import SocialProof from "../components/sections/SocialProof";
import FAQSection from "../components/sections/FAQSection";
import FinalCTA from "../components/sections/FinalCTA";
import Footer from "../components/sections/Footer";
import StickyCTA from "../components/StickyCTA";
import LeadCaptureModal from "../components/LeadCaptureModal";
import useExitIntent from "../hooks/useExitIntent";
import { trackScrollDepth } from "../hooks/useAnalytics";

/**
 * LandingPage — main sales funnel page composing all sections.
 */
export default function LandingPage() {
  const [modalOpen, setModalOpen] = useState(false);
  const [modalVariant, setModalVariant] = useState("default");

  const openApply = useCallback(() => {
    setModalVariant("default");
    setModalOpen(true);
  }, []);

  // Exit intent modal
  const handleExitIntent = useCallback(() => {
    if (!modalOpen) {
      setModalVariant("exit");
      setModalOpen(true);
    }
  }, [modalOpen]);

  useExitIntent(handleExitIntent);

  // Scroll depth tracking
  useEffect(() => {
    let tracked = new Set();
    const depths = [25, 50, 75, 100];

    const handleScroll = () => {
      const scrollPercent = Math.round(
        (window.scrollY / (document.documentElement.scrollHeight - window.innerHeight)) * 100
      );
      depths.forEach((d) => {
        if (scrollPercent >= d && !tracked.has(d)) {
          tracked.add(d);
          trackScrollDepth(d);
        }
      });
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <div className="relative bg-black text-zinc-100 overflow-x-hidden sticky-cta-spacer">
      <HeroSection onApplyClick={openApply} />
      <TrustBar />
      <WhyDifferent />
      <HowItWorks />
      <OfferStack onApplyClick={openApply} />
      <ForWho />
      <SocialProof />
      <FAQSection />
      <FinalCTA onApplyClick={openApply} />
      <Footer />

      {/* Sticky CTA */}
      <StickyCTA onCtaClick={openApply} />

      {/* Lead Capture Modal */}
      <LeadCaptureModal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        variant={modalVariant}
      />
    </div>
  );
}
