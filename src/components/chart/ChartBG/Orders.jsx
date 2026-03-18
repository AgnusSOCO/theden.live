import React from "react";
import { COLS, SPACING } from "./constants";

export default function Orders({ restingRef, yOf, offset }) {
  const baseX = 80 + (COLS - 1) * SPACING + 18 + offset;
  return (
    <>
      {restingRef.current.map((o) => {
        const y = yOf(o.price);
        const x = baseX;
        const sz = 5;
        const c = o.side === "buy" ? "#2dd4bf" : "#f87171";
        return (
          <rect
            key={`r${o.id}`}
            x={x - sz / 2}
            y={y - sz / 2}
            width={sz}
            height={sz}
            transform={`rotate(45 ${x} ${y})`}
            fill={c}
            opacity="0.6"
          />
        );
      })}
    </>
  );
}
