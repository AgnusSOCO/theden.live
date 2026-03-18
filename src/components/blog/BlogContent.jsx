import React from "react";
import ReactMarkdown from "react-markdown";
import TradingViewChart from "./TradingViewChart";
import CryptoPrice from "./CryptoPrice";
import TradeCard from "./TradeCard";
import PnLBadge from "./PnLBadge";
import CoinLogo from "./CoinLogo";
import Callout from "./Callout";
import AccountBalance from "./AccountBalance";

/**
 * BlogContent Component
 * Renders markdown content with support for custom embed components
 * 
 * Supported embeds (use HTML comments in markdown):
 * - <!-- chart:BTCUSD --> or <!-- chart:AAPL:weekly -->
 * - <!-- price:bitcoin --> or <!-- price:ethereum -->
 * - <!-- trade:BTC|long|42000|45000|0.5 -->
 * - <!-- pnl:+15.5 --> or <!-- pnl:-3.2 -->
 * - <!-- coin:bitcoin --> or <!-- coin:ethereum:large -->
 * - <!-- callout:tip:Your message here -->
 * - <!-- balance:1047.50:1000 -->
 */

function parseEmbeds(content) {
  const parts = [];
  const embedRegex = /<!--\s*(chart|price|trade|pnl|coin|callout|balance):([^>]+)\s*-->/g;
  
  let lastIndex = 0;
  let match;
  
  while ((match = embedRegex.exec(content)) !== null) {
    // Add text before the embed
    if (match.index > lastIndex) {
      parts.push({
        type: 'markdown',
        content: content.slice(lastIndex, match.index)
      });
    }
    
    // Add the embed
    const [, embedType, embedParams] = match;
    parts.push({
      type: embedType,
      params: embedParams.trim()
    });
    
    lastIndex = match.index + match[0].length;
  }
  
  // Add remaining text
  if (lastIndex < content.length) {
    parts.push({
      type: 'markdown',
      content: content.slice(lastIndex)
    });
  }
  
  return parts;
}

function renderEmbed(embed, index) {
  const { type, params } = embed;
  const paramParts = params.split(':');
  
  switch (type) {
    case 'chart': {
      const [symbol, interval] = paramParts;
      return <TradingViewChart key={index} symbol={symbol} interval={interval || 'D'} />;
    }
    
    case 'price': {
      const [coin] = paramParts;
      return <CryptoPrice key={index} coin={coin} />;
    }
    
    case 'trade': {
      const [symbol, direction, entry, exit, size] = params.split('|');
      return (
        <TradeCard 
          key={index}
          symbol={symbol}
          direction={direction}
          entry={entry}
          exit={exit}
          size={size}
        />
      );
    }
    
    case 'pnl': {
      const [value] = paramParts;
      return <PnLBadge key={index} value={value} />;
    }
    
    case 'coin': {
      const [coin, size] = paramParts;
      return <CoinLogo key={index} coin={coin} size={size || 'default'} showSymbol />;
    }
    
    case 'callout': {
      const [calloutType, ...messageParts] = paramParts;
      const message = messageParts.join(':');
      return <Callout key={index} type={calloutType}>{message}</Callout>;
    }
    
    case 'balance': {
      const [current, starting] = paramParts;
      return <AccountBalance key={index} current={current} starting={starting} />;
    }
    
    default:
      return null;
  }
}

export default function BlogContent({ content }) {
  const parts = parseEmbeds(content);
  
  return (
    <div className="blog-content text-zinc-300 leading-relaxed">
      {parts.map((part, index) => {
        if (part.type === 'markdown') {
          return (
            <div 
              key={index}
              className="
                [&_h2]:text-xl [&_h2]:font-bold [&_h2]:text-zinc-200 [&_h2]:lowercase [&_h2]:mt-6 [&_h2]:mb-3
                [&_h3]:text-lg [&_h3]:font-bold [&_h3]:text-zinc-200 [&_h3]:lowercase [&_h3]:mt-6 [&_h3]:mb-3
                [&_p]:mb-4 [&_p]:text-zinc-300
                [&_ul]:my-4 [&_ul]:pl-6 [&_ul]:list-disc
                [&_ol]:my-4 [&_ol]:pl-6 [&_ol]:list-decimal
                [&_li]:my-1 [&_li]:text-zinc-300
                [&_strong]:text-emerald-400 [&_strong]:font-semibold
                [&_a]:text-emerald-400 [&_a]:no-underline hover:[&_a]:underline
                [&_blockquote]:border-l-4 [&_blockquote]:border-emerald-500/50 [&_blockquote]:pl-4 [&_blockquote]:italic [&_blockquote]:text-zinc-400
                [&_code]:bg-white/10 [&_code]:px-1.5 [&_code]:py-0.5 [&_code]:rounded [&_code]:text-sm [&_code]:text-emerald-300
                [&_pre]:bg-white/5 [&_pre]:p-4 [&_pre]:rounded-lg [&_pre]:overflow-x-auto [&_pre]:my-4
                [&_hr]:border-white/10 [&_hr]:my-6
              "
            >
              <ReactMarkdown>{part.content}</ReactMarkdown>
            </div>
          );
        }
        return renderEmbed(part, index);
      })}
    </div>
  );
}
