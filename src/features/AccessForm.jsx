import React, { useRef } from "react";
import { X } from "lucide-react";

/**
 * Props:
 * - onClose: () => void
 * - firstFocusRef: forwarded via __modalFirstFocusRef from Modal
 */
export default function AccessForm({ onClose, __modalFirstFocusRef }) {
  const nameRef = useRef(null);
  const emailRef = useRef(null);
  const handleRef = useRef(null);
  const whatRef = useRef(null);
  const powRef = useRef(null);
  const agreeRef = useRef(null);

  const onSubmit = async (e) => {
    e.preventDefault();
    const payload = {
      name: nameRef.current?.value?.trim() || "",
      email: emailRef.current?.value?.trim() || "",
      telegram_handle: handleRef.current?.value?.trim() || "",
      instruments: whatRef.current?.value?.trim() || "",
      proof_link: powRef.current?.value?.trim() || "",
      agree_rules: !!agreeRef.current?.checked,
      user_agent: navigator.userAgent,
      ts: new Date().toISOString(),
    };

    // Send to your API → bot
    const res = await fetch("/api/apply", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });

    // Optional: toast/feedback
    if (res.ok) onClose();
    else alert("Submission failed. Please try again.");
  };

  return (
    <>
      {/* Sticky header */}
      <div className="sticky top-0 z-10 flex items-center justify-between border-b border-white/10 bg-black/40 px-4 py-3 md:rounded-t-[26px]">
        <div id="modal-title" className="text-xl sm:text-2xl font-bold lowercase">
          request access — the den
        </div>
        <button
          ref={__modalFirstFocusRef}
          onClick={onClose}
          className="rounded-xl border border-white/10 bg-white/10 p-2 hover:bg-white/20 active:scale-[0.98]"
          aria-label="close form"
        >
          <X className="h-6 w-6" />
        </button>
      </div>

      {/* Body */}
      <div id="modal-desc" className="p-4 sm:p-6">
        <form onSubmit={onSubmit} className="grid grid-cols-1 gap-4 md:grid-cols-2">
          <label className="text-xs text-zinc-300">
            name
            <input
              ref={nameRef}
              className="mt-1 w-full rounded-xl border border-white/10 bg-black/40 px-3 py-3 text-[16px] outline-none focus:border-emerald-400/60"
              placeholder="your name"
              required
            />
          </label>
          <label className="text-xs text-zinc-300">
            email
            <input
              ref={emailRef}
              type="email"
              className="mt-1 w-full rounded-xl border border-white/10 bg-black/40 px-3 py-3 text-[16px] outline-none focus:border-emerald-400/60"
              placeholder="you@domain.com"
              required
            />
          </label>
          <label className="text-xs text-zinc-300">
            telegram @handle
            <input
              ref={handleRef}
              className="mt-1 w-full rounded-xl border border-white/10 bg-black/40 px-3 py-3 text-[16px] outline-none focus:border-emerald-400/60"
              placeholder="@username"
              required
            />
          </label>
          <label className="text-xs text-zinc-300">
            what do you trade?
            <input
              ref={whatRef}
              className="mt-1 w-full rounded-xl border border-white/10 bg-black/40 px-3 py-3 text-[16px] outline-none focus:border-emerald-400/60"
              placeholder="equities, futures, crypto, options…"
            />
          </label>
          <label className="col-span-1 text-xs text-zinc-300 md:col-span-2">
            proof of work (link)
            <input
              ref={powRef}
              className="mt-1 w-full rounded-xl border border-white/10 bg-black/40 px-3 py-3 text-[16px] outline-none focus:border-emerald-400/60"
              placeholder="imgur/drive/telegraph link"
            />
          </label>
          <label className="col-span-1 flex items-start gap-2 text-xs text-zinc-300 md:col-span-2">
            <input ref={agreeRef} type="checkbox" className="mt-0.5 h-5 w-5 rounded border-white/20 bg-black/60" required />
            <span className="leading-snug">
              I agree to the rules (no spam, no signals-for-sale, post entries/exits when possible)
            </span>
          </label>
          <button
            type="submit"
            className="col-span-1 mt-2 rounded-xl border border-white/10 bg-white/10 px-5 py-3 text-[16px] font-semibold hover:bg-white/20 md:col-span-2"
          >
            submit application
          </button>
        </form>
      </div>
    </>
  );
}
