import React from "react";
import { Wallet, TrendingUp, TrendingDown } from "lucide-react";

/**
 * Account Balance Component
 * Displays current account balance with change from starting
 * 
 * Usage in markdown: <!-- balance:1047.50:1000 -->
 * Format: current:starting
 */
export default function AccountBalance({ current, starting = 1000 }) {
  const currentVal = parseFloat(current);
  const startingVal = parseFloat(starting);
  const change = currentVal - startingVal;
  const changePercent = ((change / startingVal) * 100);
  const isPositive = change >= 0;

  return (
    <div className="my-6 rounded-xl border border-white/10 bg-gradient-to-br from-white/5 to-white/[0.02] p-5">
      <div className="flex items-center gap-2 text-xs text-zinc-500 uppercase tracking-wider mb-2">
        <Wallet className="w-4 h-4" />
        Account Balance
      </div>
      <div className="flex items-end gap-4">
        <div className="text-3xl font-bold text-zinc-100">
          ${currentVal.toLocaleString(undefined, { minimumFractionDigits: 2 })}
        </div>
        <div className={`flex items-center gap-1 text-sm font-medium ${isPositive ? 'text-emerald-400' : 'text-red-400'}`}>
          {isPositive ? <TrendingUp className="w-4 h-4" /> : <TrendingDown className="w-4 h-4" />}
          {isPositive ? '+' : ''}{changePercent.toFixed(2)}%
          <span className="text-zinc-500 ml-1">
            ({isPositive ? '+' : ''}${change.toFixed(2)})
          </span>
        </div>
      </div>
      <div className="mt-3 h-2 bg-white/10 rounded-full overflow-hidden">
        <div 
          className={`h-full rounded-full transition-all duration-500 ${isPositive ? 'bg-gradient-to-r from-emerald-500 to-emerald-400' : 'bg-gradient-to-r from-red-500 to-red-400'}`}
          style={{ width: `${Math.min(Math.max(changePercent + 50, 0), 100)}%` }}
        />
      </div>
      <div className="flex justify-between mt-1 text-xs text-zinc-500">
        <span>Start: ${startingVal.toLocaleString()}</span>
        <span>Goal: $10,000</span>
      </div>
    </div>
  );
}
