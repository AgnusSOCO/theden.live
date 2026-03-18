import React, { useMemo } from "react";
import {
  WIDTH, HEIGHT, PAD_TOP, PAD_BOTTOM, COLS, SPACING, CANDLE_SECONDS, SHOW_BB
} from "./constants";
import useGBMEngine from "./useGBMEngine";
import useOrders from "./useOrders";
import useIndicators from "./useIndicators";

/**
 * Enhanced ChartBG — immersive trading terminal background.
 *
 * Features:
 * - GBM candlestick engine with smooth scroll
 * - Volume bars beneath candles
 * - EMA 20/50 indicator lines
 * - Bollinger band zones
 * - Resting buy/sell order diamonds
 * - Order book depth bars (bid/ask ladder)
 * - Live price line with pulsing dot
 * - Recent fills tape
 * - Floating price labels on Y axis
 * - Ambient grid with subtle glow
 * - Film grain overlay
 */
export default function ChartBG() {
  const { dataRef, priceRef, formingStartRef, frame } = useGBMEngine();
  const { restingRef, fillsRef } = useOrders({ priceRef, dataRef, formingStartRef });

  // y scale helpers
  const viewData = dataRef.current;
  const maxP = Math.max(...viewData.map(d => d.h));
  const minP = Math.min(...viewData.map(d => d.l));
  const range = (maxP - minP) * 1.25 || 1;
  const top = PAD_TOP, bottom = HEIGHT - PAD_BOTTOM;
  const pxPerUnit = (bottom - top) / range;
  const midPrice = (maxP + minP) / 2;
  const yOf = (price) => bottom - (price - midPrice + range / 2) * pxPerUnit;

  const candleElapsed = (performance.now() - formingStartRef.current) / 1000;
  const offset = -SPACING * (candleElapsed / CANDLE_SECONDS);

  const { emaPath, bb } = useIndicators({ viewData, frame });
  const ema20Points = useMemo(() => emaPath(20, offset), [viewData, offset]);
  const ema50Points = useMemo(() => emaPath(50, offset), [viewData, offset]);

  const currentPrice = priceRef.current;
  const prevClose = viewData.length > 1 ? viewData[viewData.length - 2].c : currentPrice;
  const isBullish = currentPrice >= prevClose;

  // Generate volume bars (synthetic from candle body size)
  const volumes = viewData.map(d => Math.abs(d.c - d.o) + Math.abs(d.h - d.l) * 0.3);
  const maxVol = Math.max(...volumes, 0.001);

  // Order book depth (synthetic — group resting orders into price buckets)
  const orderBook = useMemo(() => {
    const bids = [];
    const asks = [];
    for (const o of restingRef.current) {
      if (o.side === "buy") bids.push(o.price);
      else asks.push(o.price);
    }
    // Group into 8 levels
    const levels = 8;
    const step = range / levels;
    const bidLevels = Array(levels).fill(0);
    const askLevels = Array(levels).fill(0);
    for (const p of bids) {
      const idx = Math.floor((maxP - p) / step);
      if (idx >= 0 && idx < levels) bidLevels[idx]++;
    }
    for (const p of asks) {
      const idx = Math.floor((maxP - p) / step);
      if (idx >= 0 && idx < levels) askLevels[idx]++;
    }
    return { bidLevels, askLevels, step };
  }, [restingRef.current.length, range, maxP, frame]);

  // Price axis labels
  const priceLabels = useMemo(() => {
    const labels = [];
    const steps = 6;
    for (let i = 0; i <= steps; i++) {
      const price = minP + (range * i) / steps;
      labels.push({ price, y: yOf(price) });
    }
    return labels;
  }, [minP, range, frame]);

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
        <linearGradient id="bg-grad" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#050505" />
          <stop offset="50%" stopColor="#0a0a0a" />
          <stop offset="100%" stopColor="#080808" />
        </linearGradient>
        <linearGradient id="vol-bull" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#56f0a8" stopOpacity="0.3" />
          <stop offset="100%" stopColor="#56f0a8" stopOpacity="0.05" />
        </linearGradient>
        <linearGradient id="vol-bear" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#ff5d5d" stopOpacity="0.3" />
          <stop offset="100%" stopColor="#ff5d5d" stopOpacity="0.05" />
        </linearGradient>
        <linearGradient id="bid-depth" x1="1" y1="0" x2="0" y2="0">
          <stop offset="0%" stopColor="#56f0a8" stopOpacity="0.15" />
          <stop offset="100%" stopColor="#56f0a8" stopOpacity="0" />
        </linearGradient>
        <linearGradient id="ask-depth" x1="1" y1="0" x2="0" y2="0">
          <stop offset="0%" stopColor="#ff5d5d" stopOpacity="0.15" />
          <stop offset="100%" stopColor="#ff5d5d" stopOpacity="0" />
        </linearGradient>
        <filter id="glow-green">
          <feGaussianBlur stdDeviation="3" result="blur" />
          <feMerge><feMergeNode in="blur" /><feMergeNode in="SourceGraphic" /></feMerge>
        </filter>
        <filter id="glow-red">
          <feGaussianBlur stdDeviation="3" result="blur" />
          <feMerge><feMergeNode in="blur" /><feMergeNode in="SourceGraphic" /></feMerge>
        </filter>
        <radialGradient id="price-pulse" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor={isBullish ? "#56f0a8" : "#ff5d5d"} stopOpacity="0.8" />
          <stop offset="100%" stopColor={isBullish ? "#56f0a8" : "#ff5d5d"} stopOpacity="0" />
        </radialGradient>
      </defs>

      {/* ── Base ── */}
      <rect width={WIDTH} height={HEIGHT} fill="url(#bg-grad)" />

      {/* ── Grid ── */}
      {/* Horizontal grid lines */}
      {Array.from({ length: 22 }).map((_, i) => (
        <line key={`h${i}`} x1={0} x2={WIDTH} y1={80 + i * 50} y2={80 + i * 50}
          stroke="#ffffff" strokeOpacity="0.03" strokeWidth={1} />
      ))}
      {/* Vertical grid lines */}
      {Array.from({ length: 55 }).map((_, i) => (
        <line key={`v${i}`} y1={0} y2={HEIGHT} x1={40 + i * 22} x2={40 + i * 22}
          stroke="#ffffff" strokeOpacity="0.025" strokeWidth={1} />
      ))}

      {/* ── Order Book Depth (left side) ── */}
      {orderBook.bidLevels.map((count, i) => {
        if (count === 0) return null;
        const yStart = top + i * (bottom - top) / 8;
        const barW = Math.min(count * 18, 120);
        return (
          <rect key={`bid${i}`} x={0} y={yStart} width={barW}
            height={(bottom - top) / 8 - 1} fill="url(#bid-depth)" rx={2} />
        );
      })}
      {orderBook.askLevels.map((count, i) => {
        if (count === 0) return null;
        const yStart = top + i * (bottom - top) / 8;
        const barW = Math.min(count * 18, 120);
        return (
          <rect key={`ask${i}`} x={WIDTH - barW} y={yStart} width={barW}
            height={(bottom - top) / 8 - 1} fill="url(#ask-depth)" rx={2} />
        );
      })}

      {/* ── Bollinger Band Zone ── */}
      {SHOW_BB && bb && (
        <>
          {/* Band fill */}
          <rect x={80} y={yOf(bb.upper)} width={COLS * SPACING}
            height={Math.abs(yOf(bb.lower) - yOf(bb.upper))}
            fill="#56f0a8" opacity="0.015" rx={4} />
          {/* Band lines */}
          <line x1={80} y1={yOf(bb.upper)} x2={80 + COLS * SPACING} y2={yOf(bb.upper)}
            stroke="#2a9d8f" strokeOpacity="0.15" strokeWidth="1" strokeDasharray="4 4" />
          <line x1={80} y1={yOf(bb.lower)} x2={80 + COLS * SPACING} y2={yOf(bb.lower)}
            stroke="#ef4444" strokeOpacity="0.15" strokeWidth="1" strokeDasharray="4 4" />
          <line x1={80} y1={yOf(bb.mid)} x2={80 + COLS * SPACING} y2={yOf(bb.mid)}
            stroke="#ffffff" strokeOpacity="0.06" strokeWidth="1" strokeDasharray="2 6" />
        </>
      )}

      {/* ── Scroll group: candles + volume ── */}
      <g transform={`translate(${offset},0)`}>
        {/* Volume bars */}
        {viewData.map((d, i) => {
          const x = 80 + i * SPACING;
          const bull = d.c >= d.o;
          const volH = (volumes[i] / maxVol) * 60;
          return (
            <rect key={`vol${i}`} x={x + 1} y={bottom - volH} width={12}
              height={volH} fill={bull ? "url(#vol-bull)" : "url(#vol-bear)"} rx={1} />
          );
        })}

        {/* Candles with enhanced styling */}
        {viewData.map((d, i) => {
          const x = 80 + i * SPACING;
          const yO = yOf(d.o), yC = yOf(d.c), yH = yOf(d.h), yL = yOf(d.l);
          const bull = d.c >= d.o;
          const color = bull ? "#56f0a8" : "#ff5d5d";
          const bodyTop = Math.min(yO, yC);
          const bodyH = Math.max(3, Math.abs(yO - yC));
          const isForming = i === viewData.length - 1;
          return (
            <g key={`c${i}`}>
              {/* Wick */}
              <rect x={x + 6} y={yH} width={2} height={Math.max(1, yL - yH)}
                fill={color} opacity={isForming ? 0.8 : 0.5} />
              {/* Body */}
              <rect x={x} y={bodyTop} width={14} height={bodyH} rx={3}
                fill={color} opacity={isForming ? 0.9 : 0.7} />
              {/* Body glow on forming candle */}
              {isForming && (
                <rect x={x - 2} y={bodyTop - 2} width={18} height={bodyH + 4} rx={5}
                  fill={color} opacity={0.15} filter={bull ? "url(#glow-green)" : "url(#glow-red)"} />
              )}
            </g>
          );
        })}
      </g>

      {/* ── EMA Lines ── */}
      <g>
        <path d={pointsToPath(ema50Points, yOf)} stroke="#666" strokeOpacity="0.4"
          strokeWidth="1" fill="none" />
        <path d={pointsToPath(ema20Points, yOf)} stroke="#9be0c2" strokeOpacity="0.5"
          strokeWidth="1.5" fill="none" />
      </g>

      {/* ── Live Price Line ── */}
      {(() => {
        const priceY = yOf(currentPrice);
        const lineColor = isBullish ? "#56f0a8" : "#ff5d5d";
        return (
          <g>
            {/* Dashed price line across chart */}
            <line x1={80} y1={priceY} x2={WIDTH - 80} y2={priceY}
              stroke={lineColor} strokeOpacity="0.3" strokeWidth="1" strokeDasharray="6 4" />
            {/* Price label box (right side) */}
            <rect x={WIDTH - 120} y={priceY - 12} width={80} height={24} rx={6}
              fill={lineColor} opacity="0.15" />
            <text x={WIDTH - 80} y={priceY + 4} textAnchor="middle"
              fontSize="11" fontWeight="700" fontFamily="monospace"
              fill={lineColor} opacity="0.9">
              {currentPrice.toFixed(2)}
            </text>
            {/* Pulsing dot at line end */}
            <circle cx={WIDTH - 130} cy={priceY} r="3" fill={lineColor} opacity="0.9">
              <animate attributeName="r" values="3;6;3" dur="1.5s" repeatCount="indefinite" />
              <animate attributeName="opacity" values="0.9;0.3;0.9" dur="1.5s" repeatCount="indefinite" />
            </circle>
            <circle cx={WIDTH - 130} cy={priceY} r="12" fill="url(#price-pulse)" opacity="0.4">
              <animate attributeName="r" values="8;16;8" dur="1.5s" repeatCount="indefinite" />
              <animate attributeName="opacity" values="0.4;0.1;0.4" dur="1.5s" repeatCount="indefinite" />
            </circle>
          </g>
        );
      })()}

      {/* ── Resting Orders (diamonds along right edge) ── */}
      {(() => {
        const baseX = 80 + (COLS - 1) * SPACING + 18 + offset;
        return restingRef.current.map((o) => {
          const y = yOf(o.price);
          const isBuy = o.side === "buy";
          const c = isBuy ? "#2dd4bf" : "#f87171";
          const sz = 5;
          return (
            <g key={`order-${o.id}`}>
              {/* Order line extending left */}
              <line x1={baseX - 30} y1={y} x2={baseX} y2={y}
                stroke={c} strokeOpacity="0.15" strokeWidth="1" strokeDasharray="2 3" />
              {/* Diamond */}
              <rect x={baseX - sz / 2} y={y - sz / 2} width={sz} height={sz}
                transform={`rotate(45 ${baseX} ${y})`}
                fill={c} opacity="0.55" />
            </g>
          );
        });
      })()}

      {/* ── Fills tape (enhanced) ── */}
      {(() => {
        const fills = fillsRef.current;
        if (!fills.length) return null;
        const tx = WIDTH - 260, ty = PAD_TOP - 70;
        return (
          <g transform={`translate(${tx}, ${ty})`}>
            <rect x="0" y="0" width="240" height={24 + fills.length * 16} rx="10"
              fill="#000" opacity="0.35" />
            <rect x="0" y="0" width="240" height={24 + fills.length * 16} rx="10"
              stroke="#fff" strokeOpacity="0.05" fill="none" />
            <text x="14" y="18" fontSize="10" fontWeight="600" fill="#666"
              fontFamily="monospace" letterSpacing="0.1em">
              RECENT FILLS
            </text>
            {fills.slice(0, 6).map((f, i) => {
              const isBuy = f.side === "buy";
              return (
                <g key={f.id}>
                  <circle cx="14" cy={34 + i * 16} r="2.5"
                    fill={isBuy ? "#56f0a8" : "#ff5d5d"} opacity="0.7" />
                  <text x="24" y={38 + i * 16} fontSize="11" fontFamily="monospace"
                    fill={isBuy ? "#9be0c2" : "#fca5a5"}>
                    {isBuy ? "BUY" : "SELL"} · {f.price.toFixed(2)}
                  </text>
                </g>
              );
            })}
          </g>
        );
      })()}

      {/* ── Price Axis Labels (right side) ── */}
      {priceLabels.map((lbl, i) => (
        <g key={`pl${i}`}>
          <text x={WIDTH - 35} y={lbl.y + 3} textAnchor="end"
            fontSize="9" fontFamily="monospace" fill="#333">
            {lbl.price.toFixed(2)}
          </text>
          <line x1={WIDTH - 30} y1={lbl.y} x2={WIDTH - 25} y2={lbl.y}
            stroke="#333" strokeWidth="1" />
        </g>
      ))}

      {/* ── "LIVE" badge top-left ── */}
      <g transform="translate(30, 30)">
        <rect x="0" y="0" width="60" height="22" rx="6" fill="#000" opacity="0.4" />
        <circle cx="14" cy="11" r="3" fill="#56f0a8">
          <animate attributeName="opacity" values="1;0.3;1" dur="2s" repeatCount="indefinite" />
        </circle>
        <text x="24" y="15" fontSize="10" fontWeight="700" fontFamily="monospace"
          fill="#56f0a8" letterSpacing="0.15em" opacity="0.8">
          LIVE
        </text>
      </g>

      {/* ── Pair label ── */}
      <g transform="translate(100, 30)">
        <text x="0" y="15" fontSize="11" fontWeight="600" fontFamily="monospace"
          fill="#444" letterSpacing="0.05em">
          EUR/USD · 1m
        </text>
      </g>

      {/* ── Film noise / overlay ── */}
      <rect width={WIDTH} height={HEIGHT} fill="#000" opacity="0.12" />

      {/* ── Subtle vignette ── */}
      <rect width={WIDTH} height={HEIGHT}
        fill="url(#vignette)" opacity="0.5" />
      <defs>
        <radialGradient id="vignette" cx="50%" cy="50%" r="70%">
          <stop offset="0%" stopColor="transparent" />
          <stop offset="100%" stopColor="#000" stopOpacity="0.4" />
        </radialGradient>
      </defs>
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
