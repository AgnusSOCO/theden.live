import React, { useState, useCallback, useEffect } from "react";
import ChartBG from "../components/chart/ChartBG/ChartBG";
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
 * LandingPage — main sales funnel page.
 * ChartBG is rendered as a fixed full-page background visible behind all sections.
 */
export default function LandingPage() {
  const handleCheckout = useCallback((plan) => {
    goToCheckout(plan);
  }, []);

  const handleCTA = useCallback(() => {
    scrollToPricing();
  }, []);

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
      {/* ═══ FIXED CHART BACKGROUND ═══
          Stays in view behind all content as you scroll.
          Each section has its own semi-transparent bg to maintain readability. */}
      <div className="fixed inset-0 z-0 overflow-hidden" aria-hidden="true">
        <ChartBG />
      </div>

      {/* ═══ SCROLLABLE CONTENT ═══
          All sections sit above the fixed chart with their own backdrops. */}
      <div className="relative z-10">
        <HeroSection onCTAClick={handleCTA} />

        {/* Semi-transparent content backdrop from here down */}
        <div className="relative" style={{ background: "linear-gradient(to bottom, rgba(0,0,0,0.75) 0%, rgba(0,0,0,0.88) 10%, rgba(0,0,0,0.92) 50%, rgba(0,0,0,0.88) 90%, rgba(0,0,0,0.75) 100%)" }}>
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
        </div>
      </div>

      {/* Sticky CTA */}
      <StickyCTA onCtaClick={handleCTA} label="See Plans & Pricing" />
    </div>
  );
}
