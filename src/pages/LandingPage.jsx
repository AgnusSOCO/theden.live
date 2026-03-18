import React, { useState, useCallback, useEffect } from "react";
import HeroSection from "../components/sections/HeroSection";
import TrustBar from "../components/sections/TrustBar";
import WhyDifferent from "../components/sections/WhyDifferent";
import HowItWorks from "../components/sections/HowItWorks";
import Pricing from "../components/sections/Pricing";
import OfferStack from "../components/sections/OfferStack";
import ForWho from "../components/sections/ForWho";
import SocialProof from "../components/sections/SocialProof";
import FAQSection from "../components/sections/FAQSection";
import FinalCTA from "../components/sections/FinalCTA";
import Footer from "../components/sections/Footer";
import StickyCTA from "../components/StickyCTA";
import useExitIntent from "../hooks/useExitIntent";
import { trackScrollDepth } from "../hooks/useAnalytics";
import { goToCheckout, scrollToPricing } from "../hooks/useCheckout";

/**
 * LandingPage — main sales funnel page composing all sections.
 * All CTAs now drive to pricing/checkout instead of lead capture.
 */
export default function LandingPage() {
  // Handle plan checkout — redirect to Stripe
  const handleCheckout = useCallback((plan) => {
    goToCheckout(plan);
  }, []);

  // Scroll to pricing section — used by all "Get Started" CTAs
  const handleCTA = useCallback(() => {
    scrollToPricing();
  }, []);

  // Exit intent — scroll to pricing instead of showing a modal
  const handleExitIntent = useCallback(() => {
    scrollToPricing();
  }, []);

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
      <HeroSection onCTAClick={handleCTA} />
      <TrustBar />
      <WhyDifferent />
      <HowItWorks />
      <Pricing onCheckout={handleCheckout} />
      <OfferStack onCTAClick={handleCTA} />
      <ForWho />
      <SocialProof />
      <FAQSection />
      <FinalCTA onCTAClick={handleCTA} />
      <Footer />

      {/* Sticky CTA */}
      <StickyCTA onCtaClick={handleCTA} label="See Plans & Pricing" />
    </div>
  );
}
