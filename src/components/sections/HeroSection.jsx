import React, { useRef } from "react";
import { ArrowRight, Send } from "lucide-react";
import ChartBG from "../chart/ChartBG/ChartBG";
import GlowButton from "../GlowButton";
import { trackFormSubmit } from "../../hooks/useAnalytics";

/**
 * HeroSection — full-viewport hero with ChartBG backdrop, hook headline, inline email capture.
 */
export default function HeroSection({ onApplyClick }) {
  const emailRef = useRef(null);

  const handleInlineSubmit = (e) => {
    e.preventDefault();
    const email = emailRef.current?.value?.trim();
    if (email) {
      trackFormSubmit("hero_email", { email });
      onApplyClick?.();
    }
  };

  return (
    <section
      id="hero"
      className="relative min-h-[100dvh] flex flex-col justify-end pb-12 sm:pb-16 md:pb-20"
    >
      {/* Chart background */}
      <ChartBG />

      {/* Gradient overlay for readability */}
      <div className="absolute inset-0 bg-gradient-to-t from-black via-black/60 to-transparent pointer-events-none z-10" />

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
          onClick={onApplyClick}
          size="sm"
          id="nav_cta"
          section="hero_nav"
        >
          Apply for Access
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

        {/* Inline email capture */}
        <form
          onSubmit={handleInlineSubmit}
          className="animate-fade-up-delay-2 opacity-0 mt-8 flex flex-col sm:flex-row gap-3 max-w-xl"
        >
          <div className="flex-1 glass flex items-center px-4">
            <input
              ref={emailRef}
              type="email"
              required
              placeholder="enter your email"
              className="w-full bg-transparent py-4 text-[16px] text-zinc-100 placeholder:text-zinc-500 outline-none"
            />
          </div>
          <button
            type="submit"
            className="glow-btn px-6 py-4 text-[15px] font-bold flex items-center justify-center gap-2 min-w-[180px]"
          >
            Get Access <ArrowRight className="h-4 w-4" />
          </button>
        </form>

        <p className="animate-fade-up-delay-2 opacity-0 mt-3 text-[11px] sm:text-xs text-zinc-600">
          free to apply · no credit card required · 500+ active members
        </p>
      </div>
    </section>
  );
}
