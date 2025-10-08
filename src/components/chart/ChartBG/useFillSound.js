import { useEffect, useRef } from "react";

export default function useFillSound() {
  const ctxRef = useRef(null);
  const enabledRef = useRef(false);

  useEffect(() => {
    const enable = () => { enabledRef.current = true; };
    window.addEventListener("pointerdown", enable, { once: true });
    return () => window.removeEventListener("pointerdown", enable);
  }, []);

  const blip = (tone = 440) => {
    if (!enabledRef.current) return;
    if (!ctxRef.current) ctxRef.current = new (window.AudioContext || window.webkitAudioContext)();
    const ctx = ctxRef.current;
    const t0 = ctx.currentTime;
    const o = ctx.createOscillator();
    const g = ctx.createGain();
    o.type = "triangle";
    o.frequency.value = tone + Math.random() * 80 - 40;
    g.gain.setValueAtTime(0.0001, t0);
    g.gain.exponentialRampToValueAtTime(0.06, t0 + 0.01);
    g.gain.exponentialRampToValueAtTime(0.0001, t0 + 0.12);
    o.connect(g).connect(ctx.destination);
    o.start(t0); o.stop(t0 + 0.14);
  };

  return blip;
}
