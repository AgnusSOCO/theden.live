import React, { useEffect, useRef } from "react";
import useFocusTrap from "../hooks/useFocusTrap";

export default function Modal({
  open,
  onClose,
  labelledBy,              // id of title element
  describedBy,             // id of descriptive element
  children,
  className = "",
}) {
  const overlayRef = useRef(null);
  const cardRef = useRef(null);
  const firstFocusRef = useRef(null);
  const triggerRef = useRef(null); // parent provides ref to button if needed

  useEffect(() => {
    if (open) document.body.classList.add("body-lock");
    else document.body.classList.remove("body-lock");
    return () => document.body.classList.remove("body-lock");
  }, [open]);

  useFocusTrap({
    containerRef: cardRef,
    initialFocusRef: firstFocusRef,
    returnRef: triggerRef,
    onEscape: onClose,
  });

  if (!open) return null;

  return (
    <div
      ref={overlayRef}
      role="presentation"
      className="fixed inset-0 z-50 flex flex-col md:grid md:place-items-center bg-black/70 backdrop-blur-sm overscroll-contain"
      onClick={onClose}
      aria-hidden={false}
    >
      <div
        ref={cardRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby={labelledBy}
        aria-describedby={describedBy}
        className={
          "modal-viewport modal-safe w-full md:max-w-[760px] " +
          "border border-white/12 bg-white/6 text-zinc-100 shadow-2xl " +
          "rounded-none md:rounded-[26px] " + className
        }
        onClick={(e) => e.stopPropagation()}
      >
        {/**
         * Expose ref for first focusable
         * Usage: <button ref={firstFocusRef} .../>
         */}
        {React.Children.map(children, child =>
          React.isValidElement(child)
            ? React.cloneElement(child, { __modalFirstFocusRef: firstFocusRef })
            : child
        )}
      </div>
    </div>
  );
}

/** Allow parent to pass a button ref so focus returns to it after close */
Modal.TriggerRef = React.createContext(null);
