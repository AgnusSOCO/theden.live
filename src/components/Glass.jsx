import React from "react";

export default function Glass({ className = "", children }) {
  return (
    <div
      className={
        "rounded-[22px] border border-white/12 bg-white/6 backdrop-blur-xl " +
        "shadow-[0_0_0_1px_rgba(255,255,255,0.04)_inset] " +
        className
      }
    >
      {children}
    </div>
  );
}
