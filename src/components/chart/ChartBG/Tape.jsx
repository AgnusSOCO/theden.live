import React from "react";
import { WIDTH, PAD_TOP } from "./constants";

export default function Tape({ fillsRef }) {
  const x = WIDTH - 260, y = PAD_TOP - 70;
  return (
    <g transform={`translate(${x}, ${y})`}>
      <rect x="0" y="0" width="240" height="92" rx="10" fill="#000" opacity="0.25" />
      <text x="12" y="20" fontSize="12" fill="#a3a3a3">recent fills</text>
      {fillsRef.current.slice(0, 6).map((f, i) => (
        <text key={f.id} x="12" y={38 + i * 14} fontSize="12" fill={f.side === "buy" ? "#9be0c2" : "#fca5a5"}>
          {f.side === "buy" ? "B" : "S"} · {f.price.toFixed(2)}
        </text>
      ))}
    </g>
  );
}
