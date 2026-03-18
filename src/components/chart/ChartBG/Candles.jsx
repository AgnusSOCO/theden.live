import React from "react";
import { SPACING } from "./constants";

export default function Candles({ viewData, yOf }) {
  return (
    <>
      {viewData.map((d, i) => {
        const x = 80 + i * SPACING;
        const yO = yOf(d.o), yC = yOf(d.c), yH = yOf(d.h), yL = yOf(d.l);
        const bull = d.c >= d.o, color = bull ? "#56f0a8" : "#ff5d5d";
        const bodyTop = Math.min(yO, yC), bodyH = Math.max(3, Math.abs(yO - yC));
        return (
          <g key={`c${i}`}>
            <rect x={x + 6} y={yH} width={2} height={Math.max(1, yL - yH)} fill={color} opacity={0.6} />
            <rect x={x} y={bodyTop} width={14} height={bodyH} rx={3} fill={color} />
          </g>
        );
      })}
    </>
  );
}
