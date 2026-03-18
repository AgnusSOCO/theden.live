import React from "react";
import SectionHeading from "../SectionHeading";
import TestimonialCard from "../TestimonialCard";
import useReveal from "../../hooks/useReveal";

const TESTIMONIALS = [
  {
    type: "quote",
    name: "Marcus T.",
    role: "member since 2024",
    text: "I was completely lost before joining. The structured education path and live sessions changed everything for me. Passed my FTMO challenge on the second attempt.",
  },
  {
    type: "milestone",
    name: "Jordan K.",
    role: "funded trader",
    milestone: { label: "first payout", value: "$4,200" },
    text: "From zero trading knowledge to my first funded payout in 5 months. The mentorship and community support made it possible.",
  },
  {
    type: "quote",
    name: "Samira W.",
    role: "member since 2023",
    text: "What sets this apart is the accountability. It's not just signals — it's having someone check your risk management and tell you when you're overtrading.",
  },
  {
    type: "milestone",
    name: "David R.",
    role: "prop firm trader",
    milestone: { label: "evaluation passed", value: "$100k" },
    text: "Passed my $100k prop firm evaluation following the system and signals. The live breakdowns are what made the difference for me.",
  },
  {
    type: "quote",
    name: "Alex M.",
    role: "beginner trader",
    text: "I tried three other 'trading groups' before this. The Den is the only one that actually teaches you WHY trades work, not just what to click.",
  },
  {
    type: "milestone",
    name: "Priya S.",
    role: "funded since 2024",
    milestone: { label: "monthly average", value: "$2,800" },
    text: "Consistency was my biggest struggle. The accountability tools and community helped me stay disciplined and actually stick to my plan.",
  },
];

/**
 * SocialProof — testimonials + milestone cards in a masonry-style grid.
 */
export default function SocialProof() {
  const ref = useReveal();

  return (
    <section id="testimonials" className="relative py-16 sm:py-24 px-5 sm:px-8 md:px-12">
      <div className="mx-auto max-w-[1100px]">
        <SectionHeading
          eyebrow="from our members"
          align="center"
          sub="real traders. real progress. no fake screenshots, no unrealistic claims — just honest results from members putting in the work."
        >
          traders building{" "}
          <span className="text-gradient-emerald">real results</span>
        </SectionHeading>

        <div ref={ref} className="mt-12 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {TESTIMONIALS.map((t, i) => (
            <TestimonialCard key={i} {...t} />
          ))}
        </div>

        <p className="mt-8 text-center text-[11px] text-zinc-600 max-w-lg mx-auto">
          * Results are not typical. Trading involves significant risk of loss. These testimonials reflect individual experiences and are not guarantees of future performance.
        </p>
      </div>
      <div className="section-divider mt-16 sm:mt-24" />
    </section>
  );
}
