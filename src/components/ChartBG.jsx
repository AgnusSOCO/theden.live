import React, { useEffect, useRef, useState } from "react";

export default function ChartBG() {
  const COLS = 60, SPACING = 22, WIDTH = 1200, HEIGHT = 1400;
  const PAD_TOP = 120, PAD_BOTTOM = 320;
  const TICK_RATE = 12, CANDLE_SECONDS = 6, MU = 0.08, SIGMA = 1.2;
  const SECONDS_PER_TRADING_YEAR = 252 * 6.5 * 3600;

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
  const priceRef = useRef(dataRef.current[COLS-1].c);
  const sourceRef = useRef(priceRef.current);
  const targetRef = useRef(priceRef.current);
  const sourceTimeRef = useRef(performance.now());
  const tickIntervalMs = 1000 / TICK_RATE;
  const liveModeRef = useRef(false);

  const randn = () => {
    let u=0,v=0; while(u===0)u=Math.random(); while(v===0)v=Math.random();
    return Math.sqrt(-2*Math.log(u))*Math.cos(2*Math.PI*v);
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
    let raf=0, lastTick = performance.now();
    const loop = (now) => {
      if (now - lastTick >= tickIntervalMs && !liveModeRef.current) {
        lastTick = now;
        const last = priceRef.current, z = randn();
        const dt_seconds = 1 / TICK_RATE;
        const dt_years = dt_seconds / SECONDS_PER_TRADING_YEAR;
        const gbm = last * Math.exp((MU - 0.5*SIGMA*SIGMA)*dt_years + SIGMA*Math.sqrt(dt_years)*z);
        sourceRef.current = last; targetRef.current = gbm; sourceTimeRef.current = now;
      }
      const t = Math.min(1, (now - sourceTimeRef.current) / tickIntervalMs);
      priceRef.current = sourceRef.current + (targetRef.current - sourceRef.current) * (0.15 + 0.85 * t);

      const d = dataRef.current, forming = d[d.length-1];
      forming.c = priceRef.current; forming.h = Math.max(forming.h, forming.c); forming.l = Math.min(forming.l, forming.c);

      if (now - formingStartRef.current > CANDLE_SECONDS*1000) {
        const nextOpen = forming.c; d.push({ o: nextOpen, h: nextOpen, l: nextOpen, c: nextOpen });
        while (d.length > COLS) d.shift(); formingStartRef.current = now;
      }
      if (now - lastRenderRef.current > 1000/60) { lastRenderRef.current = now; setFrame(f => f+1); }
      raf = requestAnimationFrame(loop);
    };
    raf = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(raf);
  }, []);

  const viewData = dataRef.current;
  const maxP = Math.max(...viewData.map(d=>d.h));
  const minP = Math.min(...viewData.map(d=>d.l));
  const range = (maxP - minP) * 1.25 || 1;
  const top = PAD_TOP, bottom = HEIGHT - PAD_BOTTOM;
  const pxPerUnit = (bottom - top) / range;
  const yOf = (price) => bottom - (price - (maxP + minP)/2 + range/2) * pxPerUnit;

  const candleElapsed = (performance.now() - formingStartRef.current) / 1000;
  const offset = -SPACING * (candleElapsed / CANDLE_SECONDS);

  return (
    <svg
      viewBox={`0 0 ${WIDTH} ${HEIGHT}`}
      preserveAspectRatio="xMidYMid slice"
      width="100%" height="100%"
      className="absolute inset-0 h-full w-full select-none pointer-events-none"
    >
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
          const yO = yOf(d.o), yC = yOf(d.c), yH = yOf(d.h), yL = yOf(d.l);
          const bull = d.c >= d.o, color = bull ? "#56f0a8" : "#ff5d5d";
          const bodyTop = Math.min(yO, yC), bodyH = Math.max(3, Math.abs(yO - yC));
          return (
            <g key={i}>
              <rect x={x + 6} y={yH} width={2} height={Math.max(1, yL - yH)} fill={color} opacity={0.6} />
              <rect x={x} y={bodyTop} width={14} height={bodyH} rx={3} fill={color} />
            </g>
          );
        })}
      </g>

      <rect width={WIDTH} height={HEIGHT} fill="#000" opacity={0.18} />
    </svg>
  );
}
