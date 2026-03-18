import React from "react";
import { UserPlus, BookOpen, Target, DollarSign } from "lucide-react";
import SectionHeading from "../SectionHeading";
import useReveal from "../../hooks/useReveal";

const STEPS = [
  {
    num: "01",
    icon: UserPlus,
    title: "join the community",
    desc: "apply for access to our private Telegram/Discord group. get set up with your welcome kit, beginner resources, and learning roadmap.",
  },
  {
    num: "02",
    icon: BookOpen,
    title: "learn the system",
    desc: "follow our structured education path. attend live sessions, study the materials, and practice the setups with guidance from mentors.",
  },
  {
    num: "03",
    icon: Target,
    title: "prepare & evaluate",
    desc: "when you're ready, start your prop firm evaluation. use our signals, live breakdowns, and risk management framework to pass your challenge.",
  },
  {
    num: "04",
    icon: DollarSign,
    title: "work toward your first payout",
    desc: "once funded, trade with structure and discipline. continue learning, stay accountable, and work toward consistent results and payouts.",
  },
];

function StepCard({ num, icon: Icon, title, desc, isLast }) {
  const ref = useReveal();
  return (
    <div ref={ref} className="relative flex gap-5 sm:gap-6">
      {/* Timeline line */}
      <div className="flex flex-col items-center">
        <div className="h-12 w-12 sm:h-14 sm:w-14 rounded-2xl bg-den-emerald/10 border border-den-emerald/20 flex items-center justify-center flex-shrink-0">
          <Icon className="h-5 w-5 sm:h-6 sm:w-6 text-den-emerald" />
        </div>
        {!isLast && (
          <div className="w-px flex-1 bg-gradient-to-b from-den-emerald/30 to-transparent mt-3 min-h-[40px]" />
        )}
      </div>

      {/* Content */}
      <div className="pb-10 sm:pb-12">
        <span className="text-[11px] font-bold uppercase tracking-[0.2em] text-den-emerald/60">
          step {num}
        </span>
        <h3 className="mt-1 text-lg sm:text-xl font-bold text-zinc-100 lowercase">{title}</h3>
        <p className="mt-2 text-[13px] sm:text-[15px] text-zinc-400 leading-relaxed max-w-lg">{desc}</p>
      </div>
    </div>
  );
}

/**
 * HowItWorks — 4-step visual timeline.
 */
export default function HowItWorks() {
  return (
    <section id="how-it-works" className="relative py-16 sm:py-24 px-5 sm:px-8 md:px-12">
      <div className="mx-auto max-w-[800px]">
        <SectionHeading
          eyebrow="how it works"
          sub="from complete beginner to funded trader — here's the path. no guesswork, no information overload. just clear steps."
        >
          the roadmap to{" "}
          <span className="text-gradient-emerald">your first payout</span>
        </SectionHeading>

        <div className="mt-12 sm:mt-16">
          {STEPS.map((step, i) => (
            <StepCard key={i} {...step} isLast={i === STEPS.length - 1} />
          ))}
        </div>
      </div>
      <div className="section-divider mt-16 sm:mt-24" />
    </section>
  );
}
