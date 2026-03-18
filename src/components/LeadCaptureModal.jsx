import React, { useRef, useEffect, useState } from "react";
import { X, ArrowRight } from "lucide-react";
import { trackFormOpen, trackFormSubmit } from "../hooks/useAnalytics";

/**
 * LeadCaptureModal — lightweight lead capture overlay.
 * Step 1: Name + Email (quick capture)
 * Step 2: Optional qualification fields
 */
export default function LeadCaptureModal({ open, onClose, variant = "default" }) {
  const nameRef = useRef(null);
  const emailRef = useRef(null);
  const [step, setStep] = useState(1);
  const [submitted, setSubmitted] = useState(false);

  // Qualification fields (step 2)
  const experienceRef = useRef(null);
  const goalsRef = useRef(null);
  const propFirmRef = useRef(null);

  useEffect(() => {
    if (open) {
      document.body.classList.add("body-lock");
      trackFormOpen("lead_capture");
      // Reset state when opening
      setStep(1);
      setSubmitted(false);
    } else {
      document.body.classList.remove("body-lock");
    }
    return () => document.body.classList.remove("body-lock");
  }, [open]);

  if (!open) return null;

  const headlines = {
    default: { title: "get started with the den", sub: "enter your details to join 500+ focused traders." },
    exit: { title: "wait — before you go", sub: "grab our free prop firm starter guide. no spam, ever." },
    guide: { title: "download the free starter guide", sub: "the exact roadmap to prepare for your first prop firm evaluation." },
  };

  const { title, sub } = headlines[variant] || headlines.default;

  const handleStep1 = (e) => {
    e.preventDefault();
    const name = nameRef.current?.value?.trim();
    const email = emailRef.current?.value?.trim();
    if (!name || !email) return;

    trackFormSubmit("lead_capture_step1", { name, email });
    setStep(2);
  };

  const handleStep2 = async (e) => {
    e.preventDefault();
    const payload = {
      name: nameRef.current?.value?.trim() || "",
      email: emailRef.current?.value?.trim() || "",
      experience: experienceRef.current?.value || "",
      goals: goalsRef.current?.value?.trim() || "",
      used_prop_firms: propFirmRef.current?.value || "",
      variant,
      ts: new Date().toISOString(),
    };

    trackFormSubmit("lead_capture_step2", payload);

    try {
      await fetch("/api/apply", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
    } catch (_) {}

    setSubmitted(true);
  };

  const handleSkip = async () => {
    const payload = {
      name: nameRef.current?.value?.trim() || "",
      email: emailRef.current?.value?.trim() || "",
      variant,
      ts: new Date().toISOString(),
    };

    try {
      await fetch("/api/apply", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
    } catch (_) {}

    setSubmitted(true);
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4"
      onClick={onClose}
    >
      <div
        className="glass-strong w-full max-w-[480px] overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between p-5 border-b border-white/8">
          <div>
            <h3 className="text-lg sm:text-xl font-bold text-zinc-100 lowercase">{title}</h3>
            <p className="text-xs sm:text-sm text-zinc-400 mt-1">{sub}</p>
          </div>
          <button
            onClick={onClose}
            className="rounded-xl border border-white/10 bg-white/8 p-2 hover:bg-white/14 transition"
            aria-label="close"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Body */}
        <div className="p-5">
          {submitted ? (
            <div className="text-center py-8">
              <div className="text-3xl mb-3">✓</div>
              <h4 className="text-lg font-bold text-zinc-100 lowercase">you're in</h4>
              <p className="text-sm text-zinc-400 mt-2">check your email for next steps. welcome to the den.</p>
              <button
                onClick={onClose}
                className="glow-btn px-6 py-3 text-sm font-bold mt-6"
              >
                close
              </button>
            </div>
          ) : step === 1 ? (
            <form onSubmit={handleStep1} className="space-y-4">
              <div>
                <label className="text-xs text-zinc-400 font-medium">name</label>
                <input
                  ref={nameRef}
                  required
                  placeholder="your name"
                  className="mt-1 w-full rounded-xl border border-white/10 bg-black/40 px-4 py-3 text-[16px] text-zinc-100 outline-none focus:border-den-emerald/50 transition placeholder:text-zinc-600"
                />
              </div>
              <div>
                <label className="text-xs text-zinc-400 font-medium">email</label>
                <input
                  ref={emailRef}
                  type="email"
                  required
                  placeholder="you@email.com"
                  className="mt-1 w-full rounded-xl border border-white/10 bg-black/40 px-4 py-3 text-[16px] text-zinc-100 outline-none focus:border-den-emerald/50 transition placeholder:text-zinc-600"
                />
              </div>
              <button
                type="submit"
                className="glow-btn w-full px-6 py-4 text-[15px] font-bold flex items-center justify-center gap-2"
              >
                continue <ArrowRight className="h-4 w-4" />
              </button>
              <p className="text-[11px] text-zinc-600 text-center">no spam. unsubscribe anytime.</p>
            </form>
          ) : (
            <form onSubmit={handleStep2} className="space-y-4">
              <p className="text-xs text-zinc-400 mb-2">optional — help us personalize your experience</p>
              <div>
                <label className="text-xs text-zinc-400 font-medium">trading experience</label>
                <select
                  ref={experienceRef}
                  className="mt-1 w-full rounded-xl border border-white/10 bg-black/40 px-4 py-3 text-[15px] text-zinc-100 outline-none focus:border-den-emerald/50 transition"
                >
                  <option value="beginner">complete beginner</option>
                  <option value="some">some experience (under 1 year)</option>
                  <option value="intermediate">intermediate (1–3 years)</option>
                  <option value="advanced">advanced (3+ years)</option>
                </select>
              </div>
              <div>
                <label className="text-xs text-zinc-400 font-medium">what are your goals?</label>
                <input
                  ref={goalsRef}
                  placeholder="pass a prop firm, learn trading, build consistency..."
                  className="mt-1 w-full rounded-xl border border-white/10 bg-black/40 px-4 py-3 text-[15px] text-zinc-100 outline-none focus:border-den-emerald/50 transition placeholder:text-zinc-600"
                />
              </div>
              <div>
                <label className="text-xs text-zinc-400 font-medium">used prop firms before?</label>
                <select
                  ref={propFirmRef}
                  className="mt-1 w-full rounded-xl border border-white/10 bg-black/40 px-4 py-3 text-[15px] text-zinc-100 outline-none focus:border-den-emerald/50 transition"
                >
                  <option value="no">no, never</option>
                  <option value="tried">yes, but haven't passed</option>
                  <option value="passed">yes, I've passed before</option>
                  <option value="funded">yes, currently funded</option>
                </select>
              </div>
              <button
                type="submit"
                className="glow-btn w-full px-6 py-4 text-[15px] font-bold flex items-center justify-center gap-2"
              >
                submit & get access <ArrowRight className="h-4 w-4" />
              </button>
              <button
                type="button"
                onClick={handleSkip}
                className="w-full text-center text-xs text-zinc-500 hover:text-zinc-300 transition py-2 cursor-pointer"
              >
                skip this step →
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
