import React from "react";
import { COLS, SPACING, WIDTH } from "./constants";

/**
 * emaPoints: "x,y;x,y;..." in price space. We map y via yOf here.
 */
function pathFromPoints(points, yOf) {
  if (!points) return "";
  const arr = points.split(";").filter(Boolean).map(p => p.split(",").map(Number));
  if (!arr.length) return "";
  let d = `M ${arr[0][0]} ${yOf(arr[0][1])}`;
  for (let i = 1; i < arr.length; i++) {
    d += ` L ${arr[i][0]} ${yOf(arr[i][1])}`;
  }
  return d;
}

export default function Indicators({ ema20Points, ema50Points, bb, yOf, offset }) {
  const endX = 80 + (COLS - 1) * SPACING + offset;

  return (
    <>
      {bb && (
        <>
          <path d={`M 80 ${yOf(bb.upper)} L ${endX} ${yOf(bb.upper)}`} stroke="#2a9d8f" strokeOpacity="0.18" strokeWidth="1" />
          <path d={`M 80 ${yOf(bb.lower)} L ${endX} ${yOf(bb.lower)}`} stroke="#ef4444" strokeOpacity="0.18" strokeWidth="1" />
        </>
      )}

      <path d={pathFromPoints(ema50Points, yOf)} stroke="#c4c4c4" strokeOpacity="0.5" strokeWidth="1" fill="none" />
      <path d={pathFromPoints(ema20Points, yOf)} stroke="#9be0c2" strokeOpacity="0.65" strokeWidth="1.5" fill="none" />
    </>
  );
}
