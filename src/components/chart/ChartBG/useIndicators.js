import { useMemo, useRef } from "react";
import { BB_LEN, BB_STD, COLS, SPACING } from "./constants";

/**
 * Indicator helpers: EMA paths built from viewData,
 * simple Bollinger band on a rolling closes window.
 */
export default function useIndicators({ viewData, frame }) {
  // EMA path generator (returns SVG path string)
  const emaPath = (len, offset = 0) => {
    if (!viewData.length) return "";
    let ema = viewData[0].c;
    const k = 2 / (len + 1);
    let d = `M ${80 + offset} ${0}`; // y filled later
    d = `M ${80 + offset} ${NaN}`;   // init, we’ll set direct in loop
    let path = "";
    for (let i = 0; i < viewData.length; i++) {
      const x = 80 + i * SPACING + offset;
      ema = (viewData[i].c - ema) * k + ema;
      const y = ema; // y mapping is handled by parent (we return price)
      path += `${x},${y};`;
    }
    return path; // "x,y;x,y;..."
  };

  // Bollinger on closes (rolling)
  const closesRef = useRef(viewData.map(d => d.c).slice(-BB_LEN));
  const bb = useMemo(() => {
    const closes = viewData.map(d => d.c).slice(-BB_LEN);
    closesRef.current = closes;
    if (closes.length < BB_LEN) return null;
    const mean = closes.reduce((a, b) => a + b, 0) / closes.length;
    const variance = closes.reduce((a, b) => a + (b - mean) * (b - mean), 0) / closes.length;
    const sd = Math.sqrt(variance);
    return { mid: mean, upper: mean + BB_STD * sd, lower: mean - BB_STD * sd };
  }, [viewData, frame]);

  return { emaPath, bb };
}
