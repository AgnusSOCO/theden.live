import React, { useEffect, useRef, useState } from "react";
import { Send, X } from "lucide-react";

function Glass({ className = "", children }) {
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

function ChartBG() {
  const COLS = 60;
  const SPACING = 22;
  const WIDTH = 1200;
  const HEIGHT = 1400;
  const PAD_TOP = 120;
  const PAD_BOTTOM = 320;

  const TICK_RATE = 12;
  const CANDLE_SECONDS = 6;
  const MU = 0.08;
  const SIGMA = 1.2;
  const SECONDS_PER_TRADING_YEAR = 252 * 6.5 * 3600;

  const dataRef = useRef(() => {
    const arr = [];
    let p = 100;
    for (let i = 0; i < COLS; i++) {
      const o = p;
      const c = o + (Math.random() - 0.5) * 1.2;
      const h = Math.max(o, c) + Math.random() * 0.6;
      const l = Math.min(o, c) - Math.random() * 0.6;
      arr.push({ o, h, l, c });
      p = c;
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

  const randn = () => {
    let u = 0, v = 0;
    while (u === 0) u = Math.random();
    while (v === 0) v = Math.random();
    return Math.sqrt(-2.0 * Math.log(u)) * Math.cos(2.0 * Math.PI * v);
  };

  useEffect(() => {
    window.__DEN_PUSH = (p) => {
      liveModeRef.current = true;
      sourceRef.current = priceRef.current;
      targetRef.current = Math.max(0.0001, Number(p));
      sourceTimeRef.current = performance.now();
    };
  }, []);

  const [frame, setFrame] = useState(0);
  useEffect(() => {
    let raf = 0;
    let lastTick = performance.now();

    const loop = (now) => {
      if (now - lastTick >= tickIntervalMs && !liveModeRef.current) {
        lastTick = now;
        const last = priceRef.current;
        const z = randn();
        const dt_seconds = 1 / TICK_RATE;
        const dt_years = dt_seconds / SECONDS_PER_TRADING_YEAR;
        const gbm = last * Math.exp((MU - 0.5 * SIGMA * SIGMA) * dt_years + SIGMA * Math.sqrt(dt_years) * z);
        sourceRef.current = last;
        targetRef.current = gbm;
        sourceTimeRef.current = now;
      }

      const t = Math.min(1, (now - sourceTimeRef.current) / tickIntervalMs);
      priceRef.current = sourceRef.current + (targetRef.current - sourceRef.current) * (0.15 + 0.85 * t);

      const data = dataRef.current;
      const forming = data[data.length - 1];
      forming.c = priceRef.current;
      forming.h = Math.max(forming.h, forming.c);
      forming.l = Math.min(forming.l, forming.c);

      if (now - formingStartRef.current > CANDLE_SECONDS * 1000) {
        const nextOpen = forming.c;
        const next = { o: nextOpen, h: nextOpen, l: nextOpen, c: nextOpen };
        data.push(next);
        while (data.length > COLS) data.shift();
        formingStartRef.current = now;
      }

      if (now - lastRenderRef.current > 1000 / 60) {
        lastRenderRef.current = now;
        setFrame((f) => f + 1);
      }

      raf = requestAnimationFrame(loop);
    };

    raf = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(raf);
  }, []);

  const viewData = dataRef.current;
  const maxP = Math.max(...viewData.map((d) => d.h));
  const minP = Math.min(...viewData.map((d) => d.l));
  const range = (maxP - minP) * 1.25 || 1;
  const top = PAD_TOP;
  const bottom = HEIGHT - PAD_BOTTOM;
  const pxPerUnit = (bottom - top) / range;
  const yOf = (price) => bottom - (price - (maxP + minP) / 2 + range / 2) * pxPerUnit;

  const candleElapsed = (performance.now() - formingStartRef.current) / 1000;
  const offset = -SPACING * (candleElapsed / CANDLE_SECONDS);

  return (
    <svg viewBox={`0 0 ${WIDTH} ${HEIGHT}`} className="absolute inset-0 h-full w-full select-none">
      <defs>
        <linearGradient id="grad" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#0a0a0a" />
          <stop offset="100%" stopColor="#0b0b0b" />
        </linearGradient>
      </defs>

      <rect width={WIDTH} height={HEIGHT} fill="url(#grad)" />

      {Array.from({ length: 18 }).map((_, i) => (
        <line key={`r${i}`} x1={0} x2={WIDTH} y1={100 + i * 60} y2={100 + i * 60} stroke="#111" strokeWidth={1} />
      ))}
      {Array.from({ length: 60 }).map((_, i) => (
        <line key={`c${i}`} y1={0} y2={HEIGHT} x1={60 + i * 24} x2={60 + i * 24} stroke="#101010" strokeWidth={1} />
      ))}

      <rect width={WIDTH} height={HEIGHT} fill="#000" opacity={0.25} />

      <g transform={`translate(${offset},0)`}>
        {viewData.map((d, i) => {
          const x = 80 + i * SPACING;
          const yO = yOf(d.o);
          const yC = yOf(d.c);
          const yH = yOf(d.h);
          const yL = yOf(d.l);
          const bull = d.c >= d.o;
          const color = bull ? "#56f0a8" : "#ff5d5d";
          const bodyTop = Math.min(yO, yC);
          const bodyH = Math.max(3, Math.abs(yO - yC));
          return (
            <g key={i}>
              <rect x={x + 6} y={yH} width={2} height={Math.max(1, yL - yH)} fill={color} opacity={0.6} />
              <rect className="candle-body" x={x} y={bodyTop} width={14} height={bodyH} rx={3} fill={color} />
            </g>
          );
        })}
      </g>

      <rect width={WIDTH} height={HEIGHT} fill="#000" opacity={0.18} />
    </svg>
  );
}

export default function TheDen_Landing_PixelPerfect() {
  const [openForm, setOpenForm] = useState(false);

  return (
    <main className="relative mx-auto min-h-screen max-w-[1280px] overflow-hidden bg-black text-zinc-100 [aspect-ratio:3/4] sm:[aspect-ratio:3/4] md:[aspect-ratio:3/4] lg:[aspect-ratio:3/4] xl:[aspect-ratio:3/4] 2xl:[aspect-ratio:3/4] aspect-auto shadow-2xl">
      <ChartBG />

      <div className="relative z-20 flex items-start justify-between px-4 sm:px-6 md:px-8 pt-4 sm:pt-6 md:pt-8">
        <h1 className="text-[42px] sm:text-[56px] md:text-[72px] leading-none font-extrabold tracking-tight lowercase text-zinc-200">the den</h1>
        <button
          onClick={() => setOpenForm(true)}
          className="rounded-2xl border border-white/20 bg-white/8 px-5 py-2 text-[18px] text-zinc-100 backdrop-blur-xl transition hover:bg-white/12"
        >
          Join Now
        </button>
      </div>

      <div className="relative z-20 mt-[220px] sm:mt-[340px] md:mt-[520px] px-4 sm:px-6 md:px-8">
        <Glass className="flex max-w-[860px] items-center gap-4 p-6">
          <div className="grid h-16 w-16 place-items-center rounded-full bg-[#2AABEE]">
            <svg width="28" height="28" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M21.5 3.5L2.8 10.4c-.7.3-.7 1.3-.1 1.6l4.5 1.6 1.7 5.3c.2.7 1.1.8 1.6.3l2.6-2.6 4.6 3.4c.6.5 1.5.1 1.7-.7l3.3-14.4c.2-.9-.6-1.6-1.3-1.2z" fill="white"/>
            </svg>
          </div>
          <div className="pr-2">
            <div className="text-[40px] font-black leading-none tracking-tight">the den</div>
            <div className="mt-1 text-[22px] text-zinc-300">Private Telegram Group</div>
          </div>
        </Glass>

        <Glass className="mt-5 max-w-[860px] p-6">
          <input
            placeholder="Email address"
            className="w-full bg-transparent text-[22px] placeholder:text-zinc-300/80 outline-none"
          />
        </Glass>

        <Glass className="mt-5 inline-flex max-w-[860px] items-center justify-center p-6">
          <button
            onClick={() => setOpenForm(true)}
            className="flex w-full items-center justify-center gap-2 text-[26px] font-semibold text-zinc-100"
          >
            Request Invite
          </button>
        </Glass>
      </div>

      <div className="pointer-events-none absolute inset-4 rounded-[28px] border border-white/8" />

      {openForm && (
        <div className="fixed inset-0 z-50 grid place-items-center bg-black/70 backdrop-blur-sm overflow-y-auto">
          <div className="w-[760px] max-w-[92vw] rounded-[26px] border border-white/12 bg-white/6 p-6 text-zinc-100 shadow-2xl">
            <div className="mb-4 flex items-center justify-between">
              <div className="text-2xl font-bold lowercase">request access — the den</div>
              <button
                onClick={() => setOpenForm(false)}
                className="rounded-xl border border-white/10 bg-white/10 p-2 hover:bg-white/20"
                aria-label="close form"
              >
                ✕
              </button>
            </div>

            <form className="grid grid-cols-1 gap-4 md:grid-cols-2">
              <label className="text-xs text-zinc-300">
                name
                <input className="mt-1 w-full rounded-xl border border-white/10 bg-black/40 px-3 py-2 text-sm outline-none focus:border-emerald-400/60" placeholder="your name" />
              </label>
              <label className="text-xs text-zinc-300">
                email
                <input className="mt-1 w-full rounded-xl border border-white/10 bg-black/40 px-3 py-2 text-sm outline-none focus:border-emerald-400/60" placeholder="you@domain.com" />
              </label>
              <label className="text-xs text-zinc-300">
                telegram @handle
                <input className="mt-1 w-full rounded-xl border border-white/10 bg-black/40 px-3 py-2 text-sm outline-none focus:border-emerald-400/60" placeholder="@username" />
              </label>
              <label className="text-xs text-zinc-300">
                what do you trade?
                <input className="mt-1 w-full rounded-xl border border-white/10 bg-black/40 px-3 py-2 text-sm outline-none focus:border-emerald-400/60" placeholder="equities, futures, crypto, options…" />
              </label>
              <label className="col-span-1 text-xs text-zinc-300 md:col-span-2">
                proof of work (link)
                <input className="mt-1 w-full rounded-xl border border-white/10 bg-black/40 px-3 py-2 text-sm outline-none focus:border-emerald-400/60" placeholder="imgur/drive/telegraph link" />
              </label>
              <label className="col-span-1 flex items-center gap-2 text-xs text-zinc-300 md:col-span-2">
                <input type="checkbox" className="h-4 w-4 rounded border-white/20 bg-black/60" /> I agree to the rules (no spam, no signals-for-sale, post entries/exits when possible)
              </label>
              <button type="submit" className="col-span-1 mt-2 rounded-xl border border-white/10 bg-white/10 px-5 py-3 text-sm font-semibold hover:bg-white/20 md:col-span-2">
                submit application
              </button>
            </form>
          </div>
        </div>
      )}
    </main>
  );
}
