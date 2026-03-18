import React, { useState, useEffect } from "react";
import { ArrowRight } from "lucide-react";
import { trackCTA } from "../hooks/useAnalytics";

/**
 * StickyCTA — appears after scrolling past the hero.
 * Mobile: full-width bottom bar. Desktop: floating bottom bar.
 */
export default function StickyCTA({ onCtaClick, label = "Apply for Access" }) {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      // Show after scrolling 600px (past hero)
      setVisible(window.scrollY > 600);
    };
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const handleClick = () => {
    trackCTA("sticky_cta", "sticky_bar");
    onCtaClick?.();
  };

  return (
    <div
      className={`
        fixed bottom-0 left-0 right-0 z-40
        transition-all duration-500
        ${visible ? "translate-y-0 opacity-100" : "translate-y-full opacity-0"}
      `}
      style={{ paddingBottom: "env(safe-area-inset-bottom, 0px)" }}
    >
      <div className="mx-auto max-w-[1280px] px-4 pb-3 pt-2">
        <div className="glass-strong flex items-center justify-between p-3 sm:p-4">
          <div className="hidden sm:block">
            <div className="text-sm font-semibold text-zinc-200">ready to start trading with structure?</div>
            <div className="text-xs text-zinc-500">join 500+ traders in the den</div>
          </div>
          <button
            onClick={handleClick}
            className="glow-btn px-6 py-3 text-[14px] sm:text-[15px] font-bold w-full sm:w-auto flex items-center justify-center gap-2"
          >
            {label}
            <ArrowRight className="h-4 w-4" />
          </button>
        </div>
      </div>
    </div>
  );
}
