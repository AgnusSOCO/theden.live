import { useEffect, useRef } from "react";
import {
  ORDER_SPAWN_PER_SEC, ORDER_PRICE_DIST, MAX_RESTING_ORDERS, MAX_RECENT_FILLS, TICK_RATE, CANDLE_SECONDS
} from "./constants";

/**
 * Orders: spawns resting orders around mid, detects fills by wick cross,
 * maintains recent fills tape. Call this on every frame in ChartBG orchestrator.
 */
export default function useOrders({ priceRef, dataRef, formingStartRef }) {
  const restingRef = useRef([]);  // {id, price, side, created}
  const fillsRef = useRef([]);    // {id, price, side, ts}

  const randn = () => {
    let u = 0, v = 0; while (u === 0) u = Math.random(); while (v === 0) v = Math.random();
    return Math.sqrt(-2.0 * Math.log(u)) * Math.cos(2.0 * Math.PI * v);
  };

  useEffect(() => {
    let raf = 0;
    let spawnCarry = 0;

    const step = () => {
      // spawn near mid at fixed expected rate
      spawnCarry += ORDER_SPAWN_PER_SEC / 60;
      while (spawnCarry >= 1 && restingRef.current.length < MAX_RESTING_ORDERS) {
        spawnCarry -= 1;
        const side = Math.random() < 0.5 ? "buy" : "sell";
        const dev = randn() * ORDER_PRICE_DIST;
        const price = priceRef.current * (1 + (side === "buy" ? -Math.abs(dev) : Math.abs(dev)) / 100);
        const id = Math.random().toString(36).slice(2);
        restingRef.current.push({ id, price, side, created: performance.now() });
      }

      // fill detection by wick cross on current forming candle
      const d = dataRef.current;
      const forming = d[d.length - 1];
      const wickHigh = forming.h, wickLow = forming.l;
      for (let i = restingRef.current.length - 1; i >= 0; i--) {
        const o = restingRef.current[i];
        const hit =
          (o.side === "buy" && wickLow <= o.price) ||
          (o.side === "sell" && wickHigh >= o.price);
        if (hit) {
          fillsRef.current.unshift({ id: o.id, price: o.price, side: o.side, ts: performance.now() });
          if (fillsRef.current.length > MAX_RECENT_FILLS) fillsRef.current.pop();
          restingRef.current.splice(i, 1);
          sound(o.side === "buy" ? 520 : 360);
        }
      }

      raf = requestAnimationFrame(step);
    };

    raf = requestAnimationFrame(step);
    return () => cancelAnimationFrame(raf);
  }, [priceRef, dataRef, formingStartRef]);

  return { restingRef, fillsRef };
}
