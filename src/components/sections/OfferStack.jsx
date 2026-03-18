import React from "react";
import {
  Signal, Video, BookOpen, Users, Target,
  MessageCircle, Compass, Shield, Headphones, BookMarked
} from "lucide-react";
import SectionHeading from "../SectionHeading";
import GlowButton from "../GlowButton";
import useReveal from "../../hooks/useReveal";

const ITEMS = [
  { icon: Signal, text: "private Telegram & Discord access" },
  { icon: Target, text: "daily trading signals & trade ideas" },
  { icon: Video, text: "live trading sessions & market breakdowns" },
  { icon: BookOpen, text: "structured education library" },
  { icon: Compass, text: "beginner-to-funded roadmap" },
  { icon: Shield, text: "prop firm evaluation support & guidance" },
  { icon: Headphones, text: "one-on-one mentorship access" },
  { icon: Users, text: "private community of serious traders" },
  { icon: MessageCircle, text: "accountability & progress tracking" },
  { icon: BookMarked, text: "trading books & resource library" },
];

/**
 * OfferStack — premium "everything included" showcase.
 * CTA scrolls to pricing section for checkout.
 */
export default function OfferStack({ onCTAClick }) {
  const ref = useReveal();

  return (
    <section id="offer" className="relative py-16 sm:py-24 px-5 sm:px-8 md:px-12">
      <div className="mx-auto max-w-[900px]">
        <SectionHeading
          eyebrow="what's included"
          align="center"
          sub="everything you need to go from overwhelmed beginner to structured, confident trader — in one membership."
        >
          the complete{" "}
          <span className="text-gradient-emerald">trading toolkit</span>
        </SectionHeading>

        <div ref={ref} className="mt-12 glass-strong p-6 sm:p-8 md:p-10">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-5">
            {ITEMS.map(({ icon: Icon, text }, i) => (
              <div
                key={i}
                className="flex items-start gap-3 p-3 rounded-xl hover:bg-white/[0.04] transition-colors"
              >
                <div className="h-8 w-8 rounded-lg bg-den-emerald/10 flex items-center justify-center flex-shrink-0 mt-0.5">
                  <Icon className="h-4 w-4 text-den-emerald" />
                </div>
                <span className="text-[14px] sm:text-[15px] text-zinc-200 leading-snug">{text}</span>
              </div>
            ))}
          </div>

          {/* Divider + CTA */}
          <div className="mt-8 pt-8 border-t border-white/8 flex flex-col items-center text-center">
            <p className="text-sm text-zinc-400 mb-5">
              one membership. full access. everything above. <span className="text-zinc-200 font-semibold">no hidden fees.</span>
            </p>
            <GlowButton
              size="lg"
              onClick={onCTAClick}
              id="offer_cta"
              section="offer_stack"
            >
              Choose Your Plan
            </GlowButton>
          </div>
        </div>
      </div>
      <div className="section-divider mt-16 sm:mt-24" />
    </section>
  );
}
