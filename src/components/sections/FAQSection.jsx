import React from "react";
import SectionHeading from "../SectionHeading";
import FAQAccordion from "../FAQAccordion";

const FAQ_ITEMS = [
  {
    q: "is this beginner friendly?",
    a: "absolutely. the den was built with beginners in mind. we have a structured learning path that takes you from zero trading knowledge to evaluation-ready. you don't need any prior experience — just the willingness to learn and put in the work.",
  },
  {
    q: "is this only a signals group?",
    a: "no. signals and trade ideas are part of the membership, but they're just one piece. you also get structured education, live trading sessions, market breakdowns, one-on-one mentorship, prop firm guidance, and a community of traders who hold you accountable.",
  },
  {
    q: "do I need prior trading experience?",
    a: "not at all. many of our members started with zero experience. the education library and mentorship are designed to bring you up to speed quickly. experienced traders benefit from the signals, live sessions, and accountability structure.",
  },
  {
    q: "what markets do you cover?",
    a: "we primarily focus on forex and indices, but our education covers universal trading concepts — price action, risk management, market structure, and psychology. these skills apply to any market you trade.",
  },
  {
    q: "can you guarantee profits?",
    a: "no — and any group that guarantees profits is lying to you. trading carries inherent risk and past results don't guarantee future performance. what we provide is education, structure, signals, and a support system that gives you the best possible foundation to succeed. the rest is up to you.",
  },
  {
    q: "how do prop firm evaluations work?",
    a: "prop firms give you a simulated trading account with specific rules (profit targets, max drawdown limits, etc). if you pass the evaluation, they fund you with real capital and you keep a percentage of the profits. we help you understand the rules, build the right habits, and prepare for the challenge.",
  },
  {
    q: "what do I get immediately after joining?",
    a: "you'll get instant access to: the private Telegram/Discord community, the education library, the beginner roadmap, all current and future signals, and the live session schedule. for mentorship, you'll be paired within 24–48 hours.",
  },
  {
    q: "is there live help?",
    a: "yes. we host regular live trading sessions where you can watch, ask questions, and learn in real time. we also have a community chat where questions are answered daily by mentors and experienced members.",
  },
  {
    q: "is mentorship included?",
    a: "yes — one-on-one mentorship access is included in the membership. you can ask questions, get trade reviews, and receive personalized guidance on your specific goals and challenges.",
  },
  {
    q: "what platform/community do I join?",
    a: "we operate primarily through a private Telegram group and Discord server. both are included in your membership. you choose the platform that works best for you — or use both.",
  },
];

/**
 * FAQSection — objection-handling FAQ accordion.
 */
export default function FAQSection() {
  return (
    <section id="faq" className="relative py-16 sm:py-24 px-5 sm:px-8 md:px-12">
      <div className="mx-auto max-w-[800px]">
        <SectionHeading
          eyebrow="frequently asked"
          align="center"
          sub="everything you need to know before joining. if your question isn't here, reach out — we're happy to help."
        >
          questions &{" "}
          <span className="text-gradient-emerald">answers</span>
        </SectionHeading>

        <div className="mt-12">
          <FAQAccordion items={FAQ_ITEMS} />
        </div>
      </div>
      <div className="section-divider mt-16 sm:mt-24" />
    </section>
  );
}
