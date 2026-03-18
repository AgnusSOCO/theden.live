import React from "react";
import { Quote } from "lucide-react";

/**
 * TestimonialCard — premium glass card for member testimonials.
 */
export default function TestimonialCard({ name, role, text, milestone, type = "quote" }) {
  if (type === "milestone") {
    return (
      <div className="glass-strong p-5 sm:p-6 flex flex-col gap-3">
        <div className="flex items-center gap-2">
          <div className="h-2 w-2 rounded-full bg-den-emerald animate-pulse" />
          <span className="text-xs font-semibold uppercase tracking-wider text-den-emerald">
            {milestone?.label || "milestone"}
          </span>
        </div>
        <div className="text-2xl sm:text-3xl font-extrabold text-zinc-100">
          {milestone?.value || "$—"}
        </div>
        <p className="text-sm text-zinc-400">{text}</p>
        <div className="mt-auto pt-3 border-t border-white/8">
          <div className="text-sm font-semibold text-zinc-200">{name}</div>
          {role && <div className="text-xs text-zinc-500">{role}</div>}
        </div>
      </div>
    );
  }

  return (
    <div className="glass p-5 sm:p-6 flex flex-col gap-4">
      <Quote className="h-5 w-5 text-den-emerald/60" />
      <p className="text-[14px] sm:text-[15px] text-zinc-300 leading-relaxed italic">
        "{text}"
      </p>
      <div className="mt-auto pt-3 border-t border-white/8">
        <div className="text-sm font-semibold text-zinc-200">{name}</div>
        {role && <div className="text-xs text-zinc-500">{role}</div>}
      </div>
    </div>
  );
}
