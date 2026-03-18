import React from "react";
import useReveal from "../hooks/useReveal";

/**
 * SectionHeading — consistent branded section header.
 */
export default function SectionHeading({
  eyebrow,
  children,
  sub,
  className = "",
  align = "left",
}) {
  const ref = useReveal();
  const alignment = align === "center" ? "text-center mx-auto" : "";

  return (
    <div ref={ref} className={`max-w-3xl ${alignment} ${className}`}>
      {eyebrow && (
        <div className="text-den-emerald text-xs sm:text-sm font-semibold uppercase tracking-[0.2em] mb-3">
          {eyebrow}
        </div>
      )}
      <h2 className="text-[clamp(28px,6vw,48px)] font-extrabold leading-[1.1] tracking-tight lowercase text-zinc-100">
        {children}
      </h2>
      {sub && (
        <p className="mt-4 text-base sm:text-lg text-zinc-400 leading-relaxed max-w-2xl">
          {sub}
        </p>
      )}
    </div>
  );
}
