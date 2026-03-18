import React from "react";

/**
 * Footer — minimal footer with copyright and links.
 */
export default function Footer() {
  return (
    <footer className="relative py-8 sm:py-12 px-5 sm:px-8 md:px-12 border-t border-white/6">
      <div className="mx-auto max-w-[1100px]">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
          <div>
            <div className="text-lg font-extrabold lowercase text-zinc-300">the den</div>
            <div className="text-xs text-zinc-600 mt-1">premium trading community</div>
          </div>

          <div className="flex items-center gap-6 text-xs text-zinc-500">
            <a href="#features" className="hover:text-zinc-300 transition">features</a>
            <a href="#how-it-works" className="hover:text-zinc-300 transition">how it works</a>
            <a href="#faq" className="hover:text-zinc-300 transition">faq</a>
            <a href="#join" className="hover:text-zinc-300 transition">join</a>
          </div>
        </div>

        <div className="mt-8 pt-6 border-t border-white/6">
          <p className="text-[10px] sm:text-[11px] text-zinc-700 leading-relaxed text-center max-w-3xl mx-auto">
            © {new Date().getFullYear()} The Den. All rights reserved. Trading involves risk. This
            site is for educational purposes only. We do not provide financial advice. Past results
            are not indicative of future performance. By using this site, you acknowledge the risks
            involved in trading financial instruments.
          </p>
        </div>
      </div>
    </footer>
  );
}
