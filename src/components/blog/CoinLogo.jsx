import React from "react";

/**
 * Coin Logo Component
 * Displays a cryptocurrency logo
 * 
 * Usage in markdown: <!-- coin:bitcoin --> or <!-- coin:ethereum:large -->
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
  usdt: "https://assets.coingecko.com/coins/images/325/small/Tether.png",
  usdc: "https://assets.coingecko.com/coins/images/6319/small/usdc.png",
  pepe: "https://assets.coingecko.com/coins/images/29850/small/pepe-token.jpeg",
  shiba: "https://assets.coingecko.com/coins/images/11939/small/shiba.png",
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
  usdt: "USDT",
  usdc: "USDC",
  pepe: "PEPE",
  shiba: "SHIB",
};

export default function CoinLogo({ coin = "bitcoin", size = "default", showSymbol = false }) {
  const logo = COIN_LOGOS[coin.toLowerCase()];
  const symbol = COIN_SYMBOLS[coin.toLowerCase()] || coin.toUpperCase();
  
  const sizeClasses = {
    small: "w-4 h-4",
    default: "w-6 h-6",
    large: "w-8 h-8",
    xlarge: "w-12 h-12"
  };

  if (!logo) {
    return (
      <span className={`inline-flex items-center justify-center rounded-full bg-white/10 text-zinc-400 text-xs font-bold ${sizeClasses[size]}`}>
        {symbol.slice(0, 2)}
      </span>
    );
  }

  return (
    <span className="inline-flex items-center gap-1.5">
      <img 
        src={logo} 
        alt={coin} 
        className={`rounded-full ${sizeClasses[size]}`}
      />
      {showSymbol && (
        <span className="font-medium text-zinc-200">{symbol}</span>
      )}
    </span>
  );
}
