import React from "react";
import { TrendingUp, TrendingDown, Minus } from "lucide-react";

/**
 * PnL Badge Component
 * Simple profit/loss indicator badge
 * 
 * Usage in markdown: <!-- pnl:+15.5 --> or <!-- pnl:-3.2 -->
 */
export default function PnLBadge({ value, showIcon = true, size = "default" }) {
  const numValue = parseFloat(value);
  const isPositive = numValue > 0;
  const isNeutral = numValue === 0;
  
  const sizeClasses = {
    small: "text-xs px-2 py-0.5",
    default: "text-sm px-3 py-1",
    large: "text-base px-4 py-1.5"
  };

  const colorClasses = isNeutral 
    ? "bg-zinc-500/20 text-zinc-400"
    : isPositive 
      ? "bg-emerald-500/20 text-emerald-400" 
      : "bg-red-500/20 text-red-400";

  const Icon = isNeutral ? Minus : isPositive ? TrendingUp : TrendingDown;

  return (
    <span className={`inline-flex items-center gap-1 rounded-full font-semibold ${sizeClasses[size]} ${colorClasses}`}>
      {showIcon && <Icon className="w-3 h-3" />}
      {isPositive ? '+' : ''}{numValue.toFixed(2)}%
    </span>
  );
}
