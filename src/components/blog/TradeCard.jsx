import React from "react";
import { TrendingUp, TrendingDown, ArrowRight } from "lucide-react";

/**
 * Trade Card Component
 * Displays a trade with entry, exit, and PnL
 * 
 * Usage in markdown: 
 * <!-- trade:BTC|long|42000|45000|2.5 -->
 * Format: symbol|direction|entry|exit|size
 */
export default function TradeCard({ 
  symbol = "BTC",
  direction = "long",
  entry,
  exit,
  size,
  date,
  notes
}) {
  const isLong = direction.toLowerCase() === "long";
  const entryPrice = parseFloat(entry);
  const exitPrice = parseFloat(exit);
  const positionSize = parseFloat(size) || 1;
  
  const pnlPercent = isLong 
    ? ((exitPrice - entryPrice) / entryPrice) * 100
    : ((entryPrice - exitPrice) / entryPrice) * 100;
  
  const pnlDollar = isLong
    ? (exitPrice - entryPrice) * positionSize
    : (entryPrice - exitPrice) * positionSize;
  
  const isWin = pnlPercent > 0;

  return (
    <div className="my-6 rounded-xl border border-white/10 bg-white/5 overflow-hidden">
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-3 border-b border-white/10 bg-white/5">
        <div className="flex items-center gap-3">
          <span className={`px-2 py-0.5 rounded text-xs font-bold uppercase ${
            isLong ? 'bg-emerald-500/20 text-emerald-400' : 'bg-red-500/20 text-red-400'
          }`}>
            {direction}
          </span>
          <span className="font-bold text-zinc-100">{symbol}</span>
        </div>
        {date && (
          <span className="text-xs text-zinc-500">{date}</span>
        )}
      </div>
      
      {/* Trade Details */}
      <div className="p-4">
        <div className="flex items-center justify-between gap-4">
          {/* Entry */}
          <div className="flex-1">
            <div className="text-xs text-zinc-500 uppercase mb-1">Entry</div>
            <div className="text-lg font-bold text-zinc-100">
              ${entryPrice?.toLocaleString()}
            </div>
          </div>
          
          {/* Arrow */}
          <ArrowRight className={`w-5 h-5 ${isWin ? 'text-emerald-400' : 'text-red-400'}`} />
          
          {/* Exit */}
          <div className="flex-1">
            <div className="text-xs text-zinc-500 uppercase mb-1">Exit</div>
            <div className="text-lg font-bold text-zinc-100">
              ${exitPrice?.toLocaleString()}
            </div>
          </div>
          
          {/* PnL */}
          <div className="flex-1 text-right">
            <div className="text-xs text-zinc-500 uppercase mb-1">P&L</div>
            <div className={`text-lg font-bold flex items-center justify-end gap-1 ${
              isWin ? 'text-emerald-400' : 'text-red-400'
            }`}>
              {isWin ? <TrendingUp className="w-4 h-4" /> : <TrendingDown className="w-4 h-4" />}
              {isWin ? '+' : ''}{pnlPercent.toFixed(2)}%
            </div>
            {size && (
              <div className={`text-sm ${isWin ? 'text-emerald-400/70' : 'text-red-400/70'}`}>
                {isWin ? '+' : ''}${pnlDollar.toFixed(2)}
              </div>
            )}
          </div>
        </div>
        
        {/* Notes */}
        {notes && (
          <div className="mt-4 pt-4 border-t border-white/10">
            <div className="text-xs text-zinc-500 uppercase mb-1">Notes</div>
            <p className="text-sm text-zinc-400">{notes}</p>
          </div>
        )}
      </div>
    </div>
  );
}
