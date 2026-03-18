import React from "react";
import { Link } from "react-router-dom";
import { CheckCircle, ArrowRight, MessageCircle, BookOpen } from "lucide-react";
import GlowButton from "../components/GlowButton";

/**
 * ThankYou — post-submission confirmation page.
 */
export default function ThankYou() {
  return (
    <div className="relative min-h-[100dvh] bg-black text-zinc-100 flex flex-col items-center justify-center px-5 sm:px-8">
      {/* Subtle glow */}
      <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] rounded-full bg-den-emerald/[0.04] blur-[100px] pointer-events-none" />

      <div className="relative z-10 text-center max-w-lg">
        <div className="mb-6 inline-flex items-center justify-center h-16 w-16 rounded-2xl bg-den-emerald/15 border border-den-emerald/20">
          <CheckCircle className="h-8 w-8 text-den-emerald" />
        </div>

        <h1 className="text-3xl sm:text-4xl font-extrabold lowercase text-zinc-100">
          you're in.
        </h1>
        <p className="mt-4 text-base sm:text-lg text-zinc-400 leading-relaxed">
          your application has been submitted. check your email for next steps and access instructions.
        </p>

        {/* Next steps */}
        <div className="mt-10 space-y-3 text-left">
          <div className="glass p-4 flex items-start gap-3">
            <MessageCircle className="h-5 w-5 text-den-emerald flex-shrink-0 mt-0.5" />
            <div>
              <div className="text-sm font-semibold text-zinc-200">join the community</div>
              <div className="text-xs text-zinc-500 mt-1">
                you'll receive a Telegram/Discord invite link via email within minutes.
              </div>
            </div>
          </div>
          <div className="glass p-4 flex items-start gap-3">
            <BookOpen className="h-5 w-5 text-den-emerald flex-shrink-0 mt-0.5" />
            <div>
              <div className="text-sm font-semibold text-zinc-200">start the beginner roadmap</div>
              <div className="text-xs text-zinc-500 mt-1">
                once inside, check the pinned resources for your personalized learning path.
              </div>
            </div>
          </div>
        </div>

        <div className="mt-10">
          <Link to="/">
            <GlowButton size="md" variant="ghost" id="thank_you_back" section="thank_you">
              ← back to the den
            </GlowButton>
          </Link>
        </div>
      </div>
    </div>
  );
}
