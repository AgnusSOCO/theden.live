import React, { useState } from "react";
import { ChevronDown } from "lucide-react";

/**
 * FAQAccordion — glass-styled expandable FAQ items.
 */
export function FAQItem({ question, answer, defaultOpen = false }) {
  const [open, setOpen] = useState(defaultOpen);

  return (
    <div className="glass overflow-hidden transition-all duration-300">
      <button
        onClick={() => setOpen(!open)}
        className="w-full flex items-center justify-between p-5 sm:p-6 text-left cursor-pointer group"
        aria-expanded={open}
      >
        <span className="text-[15px] sm:text-[17px] font-semibold text-zinc-100 pr-4 lowercase">
          {question}
        </span>
        <ChevronDown
          className={`h-5 w-5 text-zinc-400 flex-shrink-0 transition-transform duration-300 ${
            open ? "rotate-180" : ""
          }`}
        />
      </button>
      <div className={`accordion-content ${open ? "open" : ""}`}>
        <div>
          <div className="px-5 sm:px-6 pb-5 sm:pb-6 text-[14px] sm:text-[15px] text-zinc-400 leading-relaxed">
            {answer}
          </div>
        </div>
      </div>
    </div>
  );
}

export default function FAQAccordion({ items }) {
  return (
    <div className="space-y-3">
      {items.map((item, i) => (
        <FAQItem key={i} question={item.q} answer={item.a} />
      ))}
    </div>
  );
}
