import React, { useRef, useState } from "react";
import ChartBG from "@/components/chart/ChartBG/ChartBG";
import Glass from "./components/Glass";
import Modal from "./components/Modal";
import AccessForm from "./features/AccessForm";

export default function TheDen() {
  const [openForm, setOpenForm] = useState(false);
  const joinBtnRef = useRef(null);

  return (
    <main
      className="
        relative mx-auto min-h-screen w-full max-w-[1280px]
        bg-black text-zinc-100
        aspect-auto md:[aspect-ratio:3/4]
        shadow-2xl
        overflow-hidden overflow-x-hidden
        px-4 sm:px-6 md:px-8
      "
      aria-hidden={openForm ? true : false}
    >
      {/* background chart */}
      <ChartBG />

      {/* top bar */}
      <div
        className="
          relative z-20 flex items-start justify-between
          px-2 sm:px-4 md:px-8
          pt-[max(0.75rem,env(safe-area-inset-top))]
          sm:pt-6 md:pt-8
        "
      >
        <h1 className="text-[clamp(28px,9vw,72px)] leading-none font-extrabold tracking-tight lowercase text-zinc-200">
          the den
        </h1>
        <button
          ref={joinBtnRef}
          onClick={() => setOpenForm(true)}
          className="rounded-2xl border border-white/20 bg-white/8 px-4 py-2 text-[14px] sm:text-[16px] md:text-[18px] text-zinc-100 backdrop-blur-xl transition hover:bg-white/12"
          aria-haspopup="dialog"
          aria-controls="access-modal"
        >
          Join Now
        </button>
      </div>

      {/* hero card + form area */}
      <div className="relative z-20 mt-8 sm:mt-16 md:mt-[380px] lg:mt-[480px] px-4 sm:px-6 md:px-8">
        <Glass className="flex w-full max-w-[860px] items-center gap-4 p-5 sm:p-6">
          <div className="grid h-16 w-16 place-items-center rounded-full bg-[#2AABEE]">
            <svg width="28" height="28" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M21.5 3.5L2.8 10.4c-.7.3-.7 1.3-.1 1.6l4.5 1.6 1.7 5.3c.2.7 1.1.8 1.6.3l2.6-2.6 4.6 3.4c.6.5 1.5.1 1.7-.7l3.3-14.4c.2-.9-.6-1.6-1.3-1.2z" fill="white"/>
            </svg>
          </div>
          <div className="pr-2">
            <div className="text-[clamp(24px,6.5vw,40px)] font-black leading-none tracking-tight">the den</div>
            <div className="mt-1 text-[18px] sm:text-[20px] md:text-[22px] text-zinc-300">Private Telegram Group</div>
          </div>
        </Glass>

        <Glass className="mt-5 w-full max-w-[860px] p-5 sm:p-6">
          <input
            placeholder="Email address"
            className="w-full bg-transparent text-[16px] sm:text-[20px] md:text-[22px] placeholder:text-zinc-300/80 outline-none"
          />
        </Glass>

        <Glass className="mt-5 inline-flex w-full max-w-[860px] items-center justify-center p-5 sm:p-6">
          <button
            onClick={() => setOpenForm(true)}
            className="flex w-full items-center justify-center gap-2 text-[16px] sm:text-[22px] md:text-[26px] font-semibold text-zinc-100"
          >
            Request Invite
          </button>
        </Glass>
      </div>

      <div className="pointer-events-none absolute inset-2 sm:inset-4 rounded-[20px] sm:rounded-[28px] border border-white/8 hidden sm:block" />

      {/* Modal */}
      <Modal
        open={openForm}
        onClose={() => setOpenForm(false)}
        labelledBy="modal-title"
        describedBy="modal-desc"
        className="mx-0 my-0 md:my-10"
      >
        <AccessForm onClose={() => setOpenForm(false)} />
      </Modal>
    </main>
  );
}
