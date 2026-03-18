import React from "react";
import { trackCTA } from "../hooks/useAnalytics";

/**
 * GlowButton — premium CTA with emerald glow effect.
 * Wraps a button or anchor element with analytics tracking.
 */
export default function GlowButton({
  children,
  onClick,
  href,
  className = "",
  id = "cta",
  section = "unknown",
  size = "lg",
  variant = "primary",
  ...rest
}) {
  const sizes = {
    sm: "px-5 py-2.5 text-[14px]",
    md: "px-6 py-3 text-[15px] sm:text-[16px]",
    lg: "px-8 py-4 text-[16px] sm:text-[18px]",
    xl: "px-10 py-5 text-[18px] sm:text-[20px]",
  };

  const variants = {
    primary: "glow-btn",
    ghost:
      "rounded-2xl border border-white/20 bg-white/8 text-zinc-100 backdrop-blur-xl hover:bg-white/14 transition-all duration-300",
  };

  const handleClick = (e) => {
    trackCTA(id, section);
    onClick?.(e);
  };

  const cls = `${variants[variant]} ${sizes[size]} font-bold inline-flex items-center justify-center gap-2 cursor-pointer ${className}`;

  if (href) {
    return (
      <a href={href} className={cls} onClick={handleClick} {...rest}>
        {children}
      </a>
    );
  }

  return (
    <button className={cls} onClick={handleClick} {...rest}>
      {children}
    </button>
  );
}
