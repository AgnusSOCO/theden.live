import React, { useState, useEffect, useRef } from "react";
import useReveal from "../../hooks/useReveal";

const STATS = [
  { label: "active members", value: 500, suffix: "+", prefix: "" },
  { label: "signals shared", value: 2400, suffix: "+", prefix: "" },
  { label: "evaluations supported", value: 180, suffix: "+", prefix: "" },
  { label: "live sessions held", value: 320, suffix: "+", prefix: "" },
];

function AnimatedCounter({ target, suffix = "", prefix = "" }) {
  const [count, setCount] = useState(0);
  const ref = useRef(null);
  const started = useRef(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !started.current) {
          started.current = true;
          const duration = 2000;
          const start = performance.now();
          const animate = (now) => {
            const progress = Math.min((now - start) / duration, 1);
            const eased = 1 - Math.pow(1 - progress, 3); // ease-out cubic
            setCount(Math.floor(eased * target));
            if (progress < 1) requestAnimationFrame(animate);
          };
          requestAnimationFrame(animate);
          observer.unobserve(el);
        }
      },
      { threshold: 0.5 }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, [target]);

  return (
    <span ref={ref}>
      {prefix}{count.toLocaleString()}{suffix}
    </span>
  );
}

/**
 * TrustBar — animated stat counters in glass panels.
 */
export default function TrustBar() {
  const revealRef = useReveal();

  return (
    <section className="relative py-16 sm:py-20 px-5 sm:px-8 md:px-12">
      <div ref={revealRef} className="mx-auto max-w-[1100px]">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-4">
          {STATS.map((stat, i) => (
            <div key={i} className="glass-strong p-5 sm:p-6 text-center">
              <div className="text-2xl sm:text-3xl md:text-4xl font-extrabold text-zinc-100">
                <AnimatedCounter
                  target={stat.value}
                  suffix={stat.suffix}
                  prefix={stat.prefix}
                />
              </div>
              <div className="mt-2 text-xs sm:text-sm text-zinc-500 uppercase tracking-wider font-medium">
                {stat.label}
              </div>
            </div>
          ))}
        </div>
      </div>
      <div className="section-divider mt-16 sm:mt-20" />
    </section>
  );
}
