import React, { useMemo } from "react";
import {
  WIDTH, HEIGHT, PAD_TOP, PAD_BOTTOM, COLS, SPACING, CANDLE_SECONDS, SHOW_BB
} from "./constants";
import useGBMEngine from "./useGBMEngine";
import useOrders from "./useOrders";
import useIndicators from "./useIndicators";
import Candles from "./Candles";
import Orders from "./Orders";
import Tape from "./Tape";

/**
 * Orchestrator: wires engine + orders + indicators and renders the SVG.
 * Keep this under your page shell exactly like the old <ChartBG /> usage.
 */
export default function ChartBG() {
  const { dataRef, priceRef, formingStartRef, frame } = useGBMEngine();
  const { restingRef, fillsRef } = useOrders({ priceRef, dataRef, formingStartRef });

  // y scale helpers (recomputed each frame)
  const viewData = dataRef.current;
  const maxP = Math.max(...viewData.map(d => d.h));
  const minP = Math.min(...viewData.map(d => d.l));
  const range = (maxP - minP) * 1.25 || 1;
  const top = PAD_TOP, bottom = HEIGHT - PAD_BOTTOM;
  const pxPerUnit = (bottom - top) / range;
  const yOf = (price) => bottom - (price - (maxP + minP) / 2 + range / 2) * pxPerUnit;

  const candleElapsed = (performance.now() - formingStartRef.current) / 1000;
  const offset = -SPACING * (candleElapsed / CANDLE_SECONDS);

  const { emaPath, bb } = useIndicators({ viewData, frame });

  // Build EMA points (price-space) then map y in Indicators
  const ema20Points = useMemo(() => emaPath(20, offset), [viewData, offset]); // "x,y;..."
  const ema50Points = useMemo(() => emaPath(50, offset), [viewData, offset]);

  return (
    <svg
      viewBox={`0 0 ${WIDTH} ${HEIGHT}`}
      preserveAspectRatio="xMidYMid slice"
      width="100%"
      height="100%"
      className="absolute inset-0 h-full w-full select-none pointer-events-none"
      aria-hidden="true"
    >
      <defs>
        <linearGradient id="grad" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#0a0a0a" />
          <stop offset="100%" stopColor="#0b0b0b" />
        </linearGradient>
      </defs>

      {/* base */}
      <rect width={WIDTH} height={HEIGHT} fill="url(#grad)" />

      {/* grid */}
      {Array.from({ length: 18 }).map((_, i) => (
        <line key={`r${i}`} x1={0} x2={WIDTH} y1={100 + i * 60} y2={100 + i * 60} stroke="#111" strokeWidth={1} />
      ))}
      {Array.from({ length: 60 }).map((_, i) => (
        <line key={`c${i}`} y1={0} y2={HEIGHT} x1={60 + i * 24} x2={60 + i * 24} stroke="#101010" strokeWidth={1} />
      ))}
      <rect width={WIDTH} height={HEIGHT} fill="#000" opacity={0.25} />

      {/* band */}
      {SHOW_BB && bb && (
        <>
          <path d={`M 80 ${yOf(bb.upper)} L ${80 + (COLS - 1) * SPACING + offset} ${yOf(bb.upper)}`} stroke="#2a9d8f" strokeOpacity="0.18" strokeWidth="1" />
          <path d={`M 80 ${yOf(bb.lower)} L ${80 + (COLS - 1) * SPACING + offset} ${yOf(bb.lower)}`} stroke="#ef4444" strokeOpacity="0.18" strokeWidth="1" />
        </>
      )}

      {/* scroll group (candles + orders + ema) */}
      <g transform={`translate(${offset},0)`}>
        <Candles viewData={viewData} yOf={yOf} />
        {/* EMA/BB are drawn outside with offset compensate — but to keep it simple, we draw inside group via offset baked into points */}
      </g>

      {/* EMA lines drawn as absolute paths (points include offset in x) */}
      <g>
        <path d={pointsToPath(ema50Points, yOf)} stroke="#c4c4c4" strokeOpacity="0.5" strokeWidth="1" fill="none" />
        <path d={pointsToPath(ema20Points, yOf)} stroke="#9be0c2" strokeOpacity="0.65" strokeWidth="1.5" fill="none" />
      </g>

      {/* resting orders (need offset) */}
      <g>
        <Orders restingRef={restingRef} yOf={yOf} offset={offset} />
      </g>

      {/* fills tape */}
      <Tape fillsRef={fillsRef} />

      {/* film layer */}
      <rect width={WIDTH} height={HEIGHT} fill="#000" opacity="0.18" />
    </svg>
  );
}

function pointsToPath(points, yOf) {
  if (!points) return "";
  const arr = points.split(";").filter(Boolean).map(p => p.split(",").map(Number));
  if (!arr.length) return "";
  let d = `M ${arr[0][0]} ${yOf(arr[0][1])}`;
  for (let i = 1; i < arr.length; i++) d += ` L ${arr[i][0]} ${yOf(arr[i][1])}`;
  return d;
}
