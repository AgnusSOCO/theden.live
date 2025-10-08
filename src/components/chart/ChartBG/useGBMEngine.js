import { useEffect, useRef, useState } from "react";
import {
  COLS, TICK_RATE, CANDLE_SECONDS, MU, SIGMA, SECONDS_PER_TRADING_YEAR
} from "./constants";

/**
 * GBM engine: maintains candle array + forming candle,
 * exposes priceRef, formingStartRef, and triggers frame updates.
 */
export default function useGBMEngine() {
  // init candles
  const dataRef = useRef(() => {
    const arr = []; let p = 100;
    for (let i = 0; i < COLS; i++) {
      const o = p, c = o + (Math.random() - 0.5) * 1.2;
      const h = Math.max(o, c) + Math.random() * 0.6;
      const l = Math.min(o, c) - Math.random() * 0.6;
      arr.push({ o, h, l, c }); p = c;
    }
    return arr;
  });
  if (typeof dataRef.current === "function") dataRef.current = dataRef.current();

  const formingStartRef = useRef(performance.now());
  const lastRenderRef = useRef(performance.now());

  const priceRef = useRef(dataRef.current[COLS - 1].c);
  const sourceRef = useRef(priceRef.current);
  const targetRef = useRef(priceRef.current);
  const sourceTimeRef = useRef(performance.now());
  const tickIntervalMs = 1000 / TICK_RATE;
  const liveModeRef = useRef(false);

  const [frame, setFrame] = useState(0);

  const randn = () => {
    let u = 0, v = 0; while (u === 0) u = Math.random(); while (v === 0) v = Math.random();
    return Math.sqrt(-2.0 * Math.log(u)) * Math.cos(2.0 * Math.PI * v);
  };

  // live price push (optional external feed)
  useEffect(() => {
    window.__DEN_PUSH = (p) => {
      liveModeRef.current = true;
      sourceRef.current = priceRef.current;
      targetRef.current = Math.max(0.0001, Number(p));
      sourceTimeRef.current = performance.now();
    };
  }, []);

  useEffect(() => {
    let raf = 0;
    let lastTick = performance.now();

    const loop = (now) => {
      if (now - lastTick >= tickIntervalMs && !liveModeRef.current) {
        lastTick = now;
        const last = priceRef.current, z = randn();
        const dt_seconds = 1 / TICK_RATE;
        const dt_years = dt_seconds / SECONDS_PER_TRADING_YEAR;
        const gbm = last * Math.exp((MU - 0.5 * SIGMA * SIGMA) * dt_years + SIGMA * Math.sqrt(dt_years) * z);
        sourceRef.current = last; targetRef.current = gbm; sourceTimeRef.current = now;
      }

      const t = Math.min(1, (now - sourceTimeRef.current) / tickIntervalMs);
      priceRef.current = sourceRef.current + (targetRef.current - sourceRef.current) * (0.12 + 0.88 * t);

      const data = dataRef.current;
      const forming = data[data.length - 1];
      forming.c = priceRef.current;
      forming.h = Math.max(forming.h, forming.c);
      forming.l = Math.min(forming.l, forming.c);

      if (now - formingStartRef.current > CANDLE_SECONDS * 1000) {
        const nextOpen = forming.c;
        const next = { o: nextOpen, h: nextOpen, l: nextOpen, c: nextOpen };
        data.push(next); while (data.length > COLS) data.shift();
        formingStartRef.current = now;
      }

      if (now - lastRenderRef.current > 1000 / 60) {
        lastRenderRef.current = now; setFrame(f => f + 1);
      }

      raf = requestAnimationFrame(loop);
    };

    raf = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(raf);
  }, []);

  return {
    dataRef, priceRef, formingStartRef, frame,
  };
}
