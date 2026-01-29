import React, { useState, useEffect } from "react";
import { TrendingUp, TrendingDown } from "lucide-react";

/**
 * Crypto Price Ticker Component
 * Shows live price with coin logo and 24h change
 * 
 * Usage in markdown: <!-- price:bitcoin --> or <!-- price:ethereum -->
 * Props:
 * - coin: CoinGecko coin ID (e.g., "bitcoin", "ethereum", "solana")
 * - showChange: Show 24h price change (default: true)
 * - showLogo: Show coin logo (default: true)
 */

const COIN_LOGOS = {
  bitcoin: "https://assets.coingecko.com/coins/images/1/small/bitcoin.png",
  ethereum: "https://assets.coingecko.com/coins/images/279/small/ethereum.png",
  solana: "https://assets.coingecko.com/coins/images/4128/small/solana.png",
  bnb: "https://assets.coingecko.com/coins/images/825/small/bnb-icon2_2x.png",
  xrp: "https://assets.coingecko.com/coins/images/44/small/xrp-symbol-white-128.png",
  cardano: "https://assets.coingecko.com/coins/images/975/small/cardano.png",
  dogecoin: "https://assets.coingecko.com/coins/images/5/small/dogecoin.png",
  polygon: "https://assets.coingecko.com/coins/images/4713/small/matic-token-icon.png",
  avalanche: "https://assets.coingecko.com/coins/images/12559/small/Avalanche_Circle_RedWhite_Trans.png",
  chainlink: "https://assets.coingecko.com/coins/images/877/small/chainlink-new-logo.png",
};

const COIN_SYMBOLS = {
  bitcoin: "BTC",
  ethereum: "ETH",
  solana: "SOL",
  bnb: "BNB",
  xrp: "XRP",
  cardano: "ADA",
  dogecoin: "DOGE",
  polygon: "MATIC",
  avalanche: "AVAX",
  chainlink: "LINK",
};

export default function CryptoPrice({ 
  coin = "bitcoin", 
  showChange = true,
  showLogo = true 
}) {
  const [price, setPrice] = useState(null);
  const [change, setChange] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    const fetchPrice = async () => {
      try {
        const response = await fetch(
          `https://api.coingecko.com/api/v3/simple/price?ids=${coin}&vs_currencies=usd&include_24hr_change=true`
        );
        const data = await response.json();
        if (data[coin]) {
          setPrice(data[coin].usd);
          setChange(data[coin].usd_24h_change);
          setLoading(false);
        } else {
          setError(true);
          setLoading(false);
        }
      } catch (err) {
        setError(true);
        setLoading(false);
      }
    };

    fetchPrice();
    const interval = setInterval(fetchPrice, 60000);
    return () => clearInterval(interval);
  }, [coin]);

  const symbol = COIN_SYMBOLS[coin] || coin.toUpperCase();
  const logo = COIN_LOGOS[coin];
  const isPositive = change >= 0;

  if (loading) {
    return (
      <span className="inline-flex items-center gap-2 px-3 py-1.5 rounded-lg bg-white/5 border border-white/10 animate-pulse">
        <span className="w-5 h-5 rounded-full bg-white/10" />
        <span className="w-16 h-4 bg-white/10 rounded" />
      </span>
    );
  }

  if (error) {
    return (
      <span className="inline-flex items-center gap-2 px-3 py-1.5 rounded-lg bg-white/5 border border-white/10 text-zinc-400">
        {symbol}: --
      </span>
    );
  }

  return (
    <span className="inline-flex items-center gap-2 px-3 py-1.5 rounded-lg bg-white/5 border border-white/10">
      {showLogo && logo && (
        <img src={logo} alt={coin} className="w-5 h-5 rounded-full" />
      )}
      <span className="font-medium text-zinc-100">{symbol}</span>
      <span className="text-zinc-300">
        ${price?.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
      </span>
      {showChange && change !== null && (
        <span className={`flex items-center gap-0.5 text-sm ${isPositive ? 'text-emerald-400' : 'text-red-400'}`}>
          {isPositive ? <TrendingUp className="w-3 h-3" /> : <TrendingDown className="w-3 h-3" />}
          {isPositive ? '+' : ''}{change?.toFixed(2)}%
        </span>
      )}
    </span>
  );
}
