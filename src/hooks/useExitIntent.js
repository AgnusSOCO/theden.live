import { useEffect, useRef } from "react";

/**
 * useExitIntent — detects exit intent and fires callback once per session.
 * Desktop: mouse leaves viewport top.
 * Mobile: visibilitychange (tab switch / app background).
 */
export default function useExitIntent(callback) {
  const firedRef = useRef(false);

  useEffect(() => {
    // Check session storage to only fire once per session
    if (sessionStorage.getItem("den_exit_shown")) {
      firedRef.current = true;
      return;
    }

    const fire = () => {
      if (firedRef.current) return;
      firedRef.current = true;
      sessionStorage.setItem("den_exit_shown", "1");
      callback();
    };

    // Desktop: mouse leaving viewport
    const handleMouseLeave = (e) => {
      if (e.clientY <= 0) fire();
    };

    // Mobile: tab switch / background
    const handleVisibility = () => {
      if (document.visibilityState === "hidden") fire();
    };

    // Delay listeners so they don't fire immediately on page load
    const timer = setTimeout(() => {
      document.addEventListener("mouseleave", handleMouseLeave);
      document.addEventListener("visibilitychange", handleVisibility);
    }, 15000); // 15s delay before arming

    return () => {
      clearTimeout(timer);
      document.removeEventListener("mouseleave", handleMouseLeave);
      document.removeEventListener("visibilitychange", handleVisibility);
    };
  }, [callback]);
}
