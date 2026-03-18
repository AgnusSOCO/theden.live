import React from "react";
import { Signal, Video, Users, BookOpen, Target, MessageCircle } from "lucide-react";
import SectionHeading from "../SectionHeading";
import useReveal from "../../hooks/useReveal";

const FEATURES = [
  {
    icon: Signal,
    title: "signals & trade ideas",
    desc: "receive actionable trading setups with clear entries, stops, and targets. not just alerts — full context and reasoning behind every idea.",
  },
  {
    icon: Video,
    title: "live sessions & breakdowns",
    desc: "join live trading events and real-time market analysis. watch how experienced traders read the market and make decisions under pressure.",
  },
  {
    icon: BookOpen,
    title: "structured education",
    desc: "follow a curated learning path from beginner to evaluation-ready. no information overload — just the concepts that actually matter.",
  },
  {
    icon: Target,
    title: "prop firm support",
    desc: "get specific guidance for prop firm evaluations. learn the rules, manage risk, and build the consistency needed to pass your challenge.",
  },
  {
    icon: Users,
    title: "mentorship & community",
    desc: "access one-on-one training, ask questions in real time, and trade alongside focused peers who hold each other accountable.",
  },
  {
    icon: MessageCircle,
    title: "accountability & mindset",
    desc: "trading isn't just strategy — it's discipline. build habits, track progress, and develop the mental framework for long-term consistency.",
  },
];

function FeatureCard({ icon: Icon, title, desc, delay }) {
  const ref = useReveal();
  return (
    <div ref={ref} className="glass-strong p-6 sm:p-7 group hover:bg-white/[0.08] transition-all duration-300">
      <div className="h-10 w-10 rounded-xl bg-den-emerald/10 flex items-center justify-center mb-4 group-hover:bg-den-emerald/20 transition-colors">
        <Icon className="h-5 w-5 text-den-emerald" />
      </div>
      <h3 className="text-[16px] sm:text-[17px] font-bold text-zinc-100 lowercase mb-2">{title}</h3>
      <p className="text-[13px] sm:text-[14px] text-zinc-400 leading-relaxed">{desc}</p>
    </div>
  );
}

/**
 * WhyDifferent — value proposition grid showing what makes this different from "just another signals group."
 */
export default function WhyDifferent() {
  return (
    <section id="features" className="relative py-16 sm:py-24 px-5 sm:px-8 md:px-12">
      <div className="mx-auto max-w-[1100px]">
        <SectionHeading
          eyebrow="why the den"
          sub="this isn't just a signals channel. it's a full trading ecosystem — education, mentorship, community, and structure designed to help you build real skill."
        >
          more than signals.{" "}
          <span className="text-gradient-emerald">a complete system.</span>
        </SectionHeading>

        <div className="mt-12 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {FEATURES.map((f, i) => (
            <FeatureCard key={i} {...f} delay={i * 100} />
          ))}
        </div>
      </div>
      <div className="section-divider mt-16 sm:mt-24" />
    </section>
  );
}
