import { useEffect, useRef } from "react";

/**
 * Simple focus trap:
 * - Traps TAB/Shift+TAB within container
 * - ESC calls onEscape
 * - Restores focus to returnRef on unmount
 */
export default function useFocusTrap({ containerRef, initialFocusRef, returnRef, onEscape }) {
  const lastActiveRef = useRef(null);

  useEffect(() => {
    const root = containerRef.current;
    if (!root) return;

    lastActiveRef.current = document.activeElement;

    // Move initial focus
    const focusTarget = initialFocusRef?.current || root.querySelector("button, [href], input, select, textarea, [tabindex]:not([tabindex='-1'])");
    if (focusTarget) focusTarget.focus({ preventScroll: true });

    const keydown = (e) => {
      if (e.key === "Escape") {
        e.stopPropagation();
        onEscape?.();
        return;
      }
      if (e.key !== "Tab") return;

      const focusable = root.querySelectorAll("button, [href], input, select, textarea, [tabindex]:not([tabindex='-1'])");
      const f = Array.from(focusable).filter(el => !el.hasAttribute("disabled") && el.tabIndex !== -1);
      if (f.length === 0) return;

      const first = f[0], last = f[f.length - 1];
      if (e.shiftKey) {
        if (document.activeElement === first) {
          e.preventDefault(); last.focus(); return;
        }
      } else {
        if (document.activeElement === last) {
          e.preventDefault(); first.focus(); return;
        }
      }
    };

    document.addEventListener("keydown", keydown, true);
    return () => {
      document.removeEventListener("keydown", keydown, true);
      // Restore focus
      if (returnRef?.current) returnRef.current.focus({ preventScroll: true });
      else if (lastActiveRef.current && lastActiveRef.current.focus) lastActiveRef.current.focus({ preventScroll: true });
    };
  }, [containerRef, initialFocusRef, returnRef, onEscape]);
}
