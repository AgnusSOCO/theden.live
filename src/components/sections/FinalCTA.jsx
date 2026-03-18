import React from "react";
import { ArrowRight } from "lucide-react";
import GlowButton from "../GlowButton";
import useReveal from "../../hooks/useReveal";

/**
 * FinalCTA — closing conversion section with strong copy and CTA.
 */
export default function FinalCTA({ onApplyClick }) {
  const ref = useReveal();

  return (
    <section id="join" className="relative py-20 sm:py-32 px-5 sm:px-8 md:px-12">
      {/* Subtle emerald glow background */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full bg-den-emerald/[0.03] blur-[120px]" />
      </div>

      <div ref={ref} className="relative mx-auto max-w-[700px] text-center">
        <div className="text-den-emerald text-xs sm:text-sm font-semibold uppercase tracking-[0.2em] mb-4">
          ready to start?
        </div>

        <h2 className="text-[clamp(30px,7vw,52px)] font-extrabold leading-[1.05] tracking-tight text-zinc-100 lowercase">
          stop trading alone.{" "}
          <span className="text-gradient-emerald">join the den.</span>
        </h2>

        <p className="mt-5 text-base sm:text-lg text-zinc-400 leading-relaxed max-w-lg mx-auto">
          get the structure, signals, education, and community you need to trade with confidence.
          whether you're starting from zero or preparing for a prop firm evaluation — we've got you.
        </p>

        <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-3">
          <GlowButton
            size="xl"
            onClick={onApplyClick}
            id="final_cta"
            section="final_close"
          >
            Apply for Access <ArrowRight className="h-5 w-5" />
          </GlowButton>
          <span className="text-xs text-zinc-600">free to apply · instant access</span>
        </div>

        {/* Risk disclaimer */}
        <div className="mt-12 glass p-4 sm:p-5 text-left">
          <p className="text-[11px] sm:text-xs text-zinc-500 leading-relaxed">
            <span className="font-semibold text-zinc-400">risk disclaimer:</span> trading financial
            instruments involves significant risk and may not be suitable for all investors. past
            performance is not indicative of future results. the den provides educational content,
            signals, and community support as tools — not financial advice. always trade responsibly
            and never risk more than you can afford to lose. no guarantees of profit are made or
            implied.
          </p>
        </div>
      </div>
    </section>
  );
}
