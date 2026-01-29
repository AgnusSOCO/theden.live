import React, { useEffect, useRef } from "react";

/**
 * TradingView Chart Embed Component
 * 
 * Usage in markdown: Add <!-- tradingview:BTCUSD --> or <!-- tradingview:AAPL:daily -->
 * Props:
 * - symbol: Trading pair (e.g., "BTCUSD", "AAPL", "EURUSD")
 * - interval: Chart interval (default: "D" for daily)
 * - theme: "dark" or "light" (default: "dark")
 * - height: Chart height in pixels (default: 400)
 */
export default function TradingViewChart({ 
  symbol = "BTCUSD", 
  interval = "D",
  theme = "dark",
  height = 400 
}) {
  const containerRef = useRef(null);
  const widgetId = `tradingview_${symbol}_${Math.random().toString(36).substr(2, 9)}`;

  useEffect(() => {
    if (!containerRef.current) return;

    const script = document.createElement("script");
    script.src = "https://s3.tradingview.com/tv.js";
    script.async = true;
    script.onload = () => {
      if (window.TradingView) {
        new window.TradingView.widget({
          autosize: true,
          symbol: symbol,
          interval: interval,
          timezone: "Etc/UTC",
          theme: theme,
          style: "1",
          locale: "en",
          toolbar_bg: "#0a0a0a",
          enable_publishing: false,
          hide_top_toolbar: false,
          hide_legend: false,
          save_image: false,
          container_id: widgetId,
          hide_volume: false,
          backgroundColor: "rgba(0, 0, 0, 0)",
        });
      }
    };
    document.head.appendChild(script);

    return () => {
      if (script.parentNode) {
        script.parentNode.removeChild(script);
      }
    };
  }, [symbol, interval, theme, widgetId]);

  return (
    <div className="my-6 rounded-xl overflow-hidden border border-white/10">
      <div 
        id={widgetId} 
        ref={containerRef}
        style={{ height: `${height}px` }}
        className="w-full bg-black/40"
      />
    </div>
  );
}
