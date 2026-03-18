import React from "react";
import { ArrowRight } from "lucide-react";
import GlowButton from "../GlowButton";

/**
 * HeroSection — full-viewport hero (ChartBG is now rendered at page level as fixed background).
 * CTA scrolls to pricing section for immediate checkout.
 */
export default function HeroSection({ onCTAClick }) {
  return (
    <section
      id="hero"
      className="relative min-h-[100dvh] flex flex-col justify-end pb-12 sm:pb-16 md:pb-20"
    >
      {/* Gradient overlay for readability — sits above the fixed ChartBG */}
      <div className="absolute inset-0 bg-gradient-to-t from-black via-black/50 to-black/20 pointer-events-none z-10" />

      {/* Top bar */}
      <div
        className="
          absolute top-0 left-0 right-0 z-30
          flex items-center justify-between
          px-5 sm:px-8 md:px-12
          pt-[max(0.75rem,env(safe-area-inset-top))]
          sm:pt-6 md:pt-8
        "
      >
        <h1 className="text-[clamp(24px,7vw,56px)] leading-none font-extrabold tracking-tight lowercase text-zinc-200">
          the den
        </h1>
        <GlowButton
          onClick={onCTAClick}
          size="sm"
          id="nav_cta"
          section="hero_nav"
        >
          Get Started
        </GlowButton>
      </div>

      {/* Hero content */}
      <div className="relative z-20 px-5 sm:px-8 md:px-12 max-w-[860px]">
        {/* Eyebrow */}
        <div className="animate-fade-up opacity-0 flex items-center gap-2 mb-5">
          <div className="h-1.5 w-1.5 rounded-full bg-den-emerald animate-pulse" />
          <span className="text-xs sm:text-sm font-medium uppercase tracking-[0.2em] text-den-emerald">
            premium trading community
          </span>
        </div>

        {/* Headline */}
        <h2 className="animate-fade-up opacity-0 text-[clamp(32px,8vw,64px)] font-extrabold leading-[1.05] tracking-tight text-zinc-100 lowercase">
          structure. signals.{" "}
          <span className="text-gradient-emerald">community.</span>
          <br />
          your edge starts here.
        </h2>

        {/* Subhead */}
        <p className="animate-fade-up-delay opacity-0 mt-5 text-base sm:text-lg md:text-xl text-zinc-400 leading-relaxed max-w-xl">
          join a private network of focused traders. get live signals, prop firm support,
          trading education, and mentorship — all in one place.
        </p>

        {/* CTA buttons */}
        <div className="animate-fade-up-delay-2 opacity-0 mt-8 flex flex-col sm:flex-row gap-3 max-w-xl">
          <button
            onClick={onCTAClick}
            className="glow-btn px-8 py-4 text-[16px] sm:text-[18px] font-bold flex items-center justify-center gap-2"
          >
            Join Now — See Plans <ArrowRight className="h-5 w-5" />
          </button>
          <a
            href="#features"
            className="rounded-2xl border border-white/16 bg-white/6 backdrop-blur-xl px-6 py-4 text-[15px] sm:text-[16px] font-semibold text-zinc-300 text-center hover:bg-white/10 transition-all duration-300"
          >
            Learn More
          </a>
        </div>

        <p className="animate-fade-up-delay-2 opacity-0 mt-4 text-[11px] sm:text-xs text-zinc-600">
          instant access after payment · cancel anytime · 500+ active members
        </p>
      </div>
    </section>
  );
}
