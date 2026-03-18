import React from "react";
import { Check, X } from "lucide-react";
import SectionHeading from "../SectionHeading";
import useReveal from "../../hooks/useReveal";

const FOR_YOU = [
  "you're a beginner who wants structure and a clear path",
  "you want to pass a prop firm evaluation and get funded",
  "you want live signals with context, not just alerts",
  "you're tired of trading alone with no accountability",
  "you want mentorship and access to experienced traders",
  "you're willing to study, practice, and respect risk management",
  "you want a serious community, not a hype-driven Telegram group",
];

const NOT_FOR_YOU = [
  "you're looking for guaranteed profits or get-rich-quick schemes",
  "you want to blindly copy trades without learning anything",
  "you're not willing to put in the work to study and practice",
  "you expect overnight results with zero effort",
  "you treat trading like gambling with no risk plan",
  "you're looking for a free channel — we offer premium structure",
];

/**
 * ForWho — qualifying section to build trust and filter leads.
 */
export default function ForWho() {
  const leftRef = useReveal();
  const rightRef = useReveal();

  return (
    <section id="for-who" className="relative py-16 sm:py-24 px-5 sm:px-8 md:px-12">
      <div className="mx-auto max-w-[1100px]">
        <SectionHeading
          eyebrow="is this for you?"
          align="center"
          sub="we're selective about who we work with. the den is built for traders who are serious about growth."
        >
          built for the{" "}
          <span className="text-gradient-emerald">committed</span>
        </SectionHeading>

        <div className="mt-12 grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
          {/* FOR */}
          <div ref={leftRef} className="glass-strong p-6 sm:p-8">
            <div className="flex items-center gap-2 mb-6">
              <div className="h-8 w-8 rounded-lg bg-den-emerald/15 flex items-center justify-center">
                <Check className="h-4 w-4 text-den-emerald" />
              </div>
              <h3 className="text-lg font-bold text-zinc-100 lowercase">this is for you if…</h3>
            </div>
            <ul className="space-y-3">
              {FOR_YOU.map((item, i) => (
                <li key={i} className="flex items-start gap-3">
                  <Check className="h-4 w-4 text-den-emerald flex-shrink-0 mt-0.5" />
                  <span className="text-[13px] sm:text-[14px] text-zinc-300 leading-snug">{item}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* NOT FOR */}
          <div ref={rightRef} className="glass-strong p-6 sm:p-8">
            <div className="flex items-center gap-2 mb-6">
              <div className="h-8 w-8 rounded-lg bg-den-red/15 flex items-center justify-center">
                <X className="h-4 w-4 text-den-red" />
              </div>
              <h3 className="text-lg font-bold text-zinc-100 lowercase">this is NOT for you if…</h3>
            </div>
            <ul className="space-y-3">
              {NOT_FOR_YOU.map((item, i) => (
                <li key={i} className="flex items-start gap-3">
                  <X className="h-4 w-4 text-den-red flex-shrink-0 mt-0.5" />
                  <span className="text-[13px] sm:text-[14px] text-zinc-300 leading-snug">{item}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
      <div className="section-divider mt-16 sm:mt-24" />
    </section>
  );
}
