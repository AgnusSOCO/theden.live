import React from "react";
import { Check, ArrowRight, Star, Zap, Crown } from "lucide-react";
import SectionHeading from "../SectionHeading";
import GlowButton from "../GlowButton";
import useReveal from "../../hooks/useReveal";

const PLANS = [
  {
    id: "monthly",
    name: "monthly",
    price: 49,
    period: "/mo",
    desc: "full access, cancel anytime",
    icon: Zap,
    popular: false,
    features: [
      "private Telegram & Discord access",
      "daily signals & trade ideas",
      "live trading sessions",
      "education library",
      "community access",
      "prop firm guidance",
    ],
    // Replace with your actual Stripe Payment Link
    checkoutUrl: "https://buy.stripe.com/YOUR_MONTHLY_LINK",
  },
  {
    id: "quarterly",
    name: "quarterly",
    price: 99,
    period: "/3 mo",
    savings: "save 33%",
    desc: "most popular — best value",
    icon: Star,
    popular: true,
    features: [
      "everything in monthly",
      "one-on-one mentorship access",
      "prop firm evaluation support",
      "trading books & resources",
      "priority community support",
      "accountability check-ins",
    ],
    checkoutUrl: "https://buy.stripe.com/YOUR_QUARTERLY_LINK",
  },
  {
    id: "lifetime",
    name: "lifetime",
    price: 299,
    period: "one-time",
    savings: "best deal",
    desc: "pay once, access forever",
    icon: Crown,
    popular: false,
    features: [
      "everything in quarterly",
      "lifetime access — no renewals",
      "all future content & features",
      "founding member status",
      "direct mentor access",
      "exclusive lifetime channel",
    ],
    checkoutUrl: "https://buy.stripe.com/YOUR_LIFETIME_LINK",
  },
];

function PricingCard({ plan, onCheckout }) {
  const ref = useReveal();
  const Icon = plan.icon;

  return (
    <div
      ref={ref}
      className={`
        relative flex flex-col p-6 sm:p-8 overflow-hidden
        ${plan.popular
          ? "glass-strong border-den-emerald/30 ring-1 ring-den-emerald/20"
          : "glass"
        }
      `}
    >
      {/* Popular badge */}
      {plan.popular && (
        <div className="absolute top-0 right-0">
          <div className="bg-den-emerald text-black text-[10px] sm:text-xs font-bold uppercase tracking-wider px-4 py-1.5 rounded-bl-xl">
            most popular
          </div>
        </div>
      )}

      {/* Header */}
      <div className="flex items-center gap-3 mb-4">
        <div className={`h-10 w-10 rounded-xl flex items-center justify-center ${
          plan.popular ? "bg-den-emerald/20" : "bg-white/8"
        }`}>
          <Icon className={`h-5 w-5 ${plan.popular ? "text-den-emerald" : "text-zinc-400"}`} />
        </div>
        <div>
          <h3 className="text-lg font-bold text-zinc-100 lowercase">{plan.name}</h3>
          {plan.savings && (
            <span className="text-[10px] font-bold uppercase tracking-wider text-den-emerald">
              {plan.savings}
            </span>
          )}
        </div>
      </div>

      {/* Price */}
      <div className="mb-1">
        <span className="text-4xl sm:text-5xl font-extrabold text-zinc-100">${plan.price}</span>
        <span className="text-sm text-zinc-500 ml-1">{plan.period}</span>
      </div>
      <p className="text-xs sm:text-sm text-zinc-400 mb-6">{plan.desc}</p>

      {/* Features */}
      <ul className="space-y-2.5 mb-8 flex-1">
        {plan.features.map((f, i) => (
          <li key={i} className="flex items-start gap-2.5">
            <Check className={`h-4 w-4 flex-shrink-0 mt-0.5 ${
              plan.popular ? "text-den-emerald" : "text-zinc-500"
            }`} />
            <span className="text-[13px] sm:text-[14px] text-zinc-300 leading-snug">{f}</span>
          </li>
        ))}
      </ul>

      {/* CTA */}
      <GlowButton
        size="lg"
        variant={plan.popular ? "primary" : "ghost"}
        onClick={() => onCheckout(plan)}
        id={`pricing_${plan.id}`}
        section="pricing"
        className="w-full"
      >
        {plan.popular ? "Get Started" : "Choose Plan"}
        <ArrowRight className="h-4 w-4" />
      </GlowButton>
    </div>
  );
}

/**
 * Pricing — subscription tier selection with Stripe checkout integration.
 */
export default function Pricing({ onCheckout }) {
  return (
    <section id="pricing" className="relative py-16 sm:py-24 px-5 sm:px-8 md:px-12">
      <div className="mx-auto max-w-[1100px]">
        <SectionHeading
          eyebrow="membership"
          align="center"
          sub="choose the plan that fits your goals. every tier includes full community access and trading support. cancel anytime."
        >
          invest in your{" "}
          <span className="text-gradient-emerald">trading future</span>
        </SectionHeading>

        <div className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-4 sm:gap-5">
          {PLANS.map((plan) => (
            <PricingCard key={plan.id} plan={plan} onCheckout={onCheckout} />
          ))}
        </div>

        <div className="mt-8 text-center">
          <p className="text-xs text-zinc-600">
            secure payment via Stripe · cancel anytime · instant access after payment
          </p>
        </div>
      </div>
      <div className="section-divider mt-16 sm:mt-24" />
    </section>
  );
}

export { PLANS };
