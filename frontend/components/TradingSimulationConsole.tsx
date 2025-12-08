"use client";

import { useEffect, useRef, useState } from "react";

type Pair = "XAU/USD" | "EUR/USD" | "USD/JPY" | "GBP/USD";

type TradeLine = {
  id: number;
  pair: Pair;
  side: "BUY" | "SELL";
  lotSize: number;
  margin: number;
  profit: number;
  isWin: boolean;
  timestamp: string;
};

const PAIRS: Pair[] = ["XAU/USD", "EUR/USD", "USD/JPY", "GBP/USD"];

function randomFromRange(min: number, max: number) {
  return Math.random() * (max - min) + min;
}

let idCounter = 1;

// Weekday helper
function isWeekend() {
  const d = new Date().getDay();
  return d === 0 || d === 6; // Sunday OR Saturday
}

function generateTrade(allowedPairs: Pair[] = PAIRS): TradeLine {
  const pair = allowedPairs[Math.floor(Math.random() * allowedPairs.length)];

  const side: "BUY" | "SELL" = Math.random() < 0.5 ? "BUY" : "SELL";

  // lot size ALWAYS < 0.99
  let lotSize = randomFromRange(0.01, 0.99);
  lotSize = parseFloat(lotSize.toFixed(2));

  // margin ALWAYS > 80 USD
  let marginMax = {
    "XAU/USD": 400,
    "USD/JPY": 250,
    "EUR/USD": 200,
    "GBP/USD": 200,
  }[pair];

  let margin = randomFromRange(80, marginMax);
  margin = parseFloat(margin.toFixed(2));

  // PnL ALWAYS < 10
  const magnitude = randomFromRange(0.10, 9.99);
  const sign = Math.random() < 0.5 ? -1 : 1;
  const profit = parseFloat((magnitude * sign).toFixed(2));
  const isWin = profit > 0;

  const now = new Date();
  const ts = now.toLocaleTimeString("en-GB", {
    hour12: false,
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
  });

  return {
    id: idCounter++,
    pair,
    side,
    lotSize,
    margin,
    profit,
    isWin,
    timestamp: ts,
  };
}

type TradingSimulationConsoleProps = {
  allowedPairs?: Pair[];
  title?: string;
};

export function TradingSimulationConsole({ allowedPairs = PAIRS, title = "Live Trading Console" }: TradingSimulationConsoleProps) {
  const [lines, setLines] = useState<TradeLine[]>([]);
  const containerRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    // On weekends → show PAUSED state + stop updates
    if (isWeekend()) {
      const defaultPair = allowedPairs[0] || "EUR/USD";
      setLines([
        {
          id: 1,
          pair: defaultPair,
          side: "BUY",
          lotSize: 0,
          margin: 0,
          profit: 0,
          isWin: true,
          timestamp: "— — : — — : — —",
        },
      ]);
      return;
    }

    const initial: TradeLine[] = [];
    for (let i = 0; i < 20; i++) initial.push(generateTrade(allowedPairs));
    setLines(initial);

    const interval = setInterval(() => {
      if (!isWeekend()) {
        setLines((prev) => {
          const next = [...prev, generateTrade(allowedPairs)];
          if (next.length > 40) next.splice(0, next.length - 40);
          return next;
        });
      }
    }, 350);

    return () => clearInterval(interval);
  }, [allowedPairs]);

  useEffect(() => {
    if (containerRef.current) {
      const container = containerRef.current;
      const isNearBottom = 
        container.scrollHeight - container.scrollTop - container.clientHeight < 50;
      
      // Only auto-scroll if user is already near the bottom
      if (isNearBottom) {
        container.scrollTop = container.scrollHeight;
      }
    }
  }, [lines]);

  return (
    <div className="glass-card rounded-2xl border border-slate-800/50 bg-gradient-to-br from-slate-900/90 via-slate-950/90 to-slate-900/90 backdrop-blur-sm shadow-xl hover:shadow-2xl transition-all duration-300 overflow-hidden">
      <div className="flex items-center justify-between px-5 pt-4 pb-3 border-b border-slate-800/50">
        <p className="text-xs font-bold text-slate-200 uppercase tracking-wider">
          {title}
        </p>

        {isWeekend() ? (
          <span className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-rose-500/10 border border-rose-500/20 text-[10px] font-medium text-rose-400">
            <span className="h-2 w-2 rounded-full bg-rose-500 shadow-[0_0_8px_rgba(248,113,113,0.9)]" />
            Paused
          </span>
        ) : (
          <span className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-[10px] font-medium text-emerald-300">
            <span className="h-2 w-2 rounded-full bg-emerald-400 shadow-[0_0_8px_rgba(52,211,153,0.9)] animate-pulse" />
            Live
          </span>
        )}
      </div>

      <div
        ref={containerRef}
        className="px-5 pb-4 pt-3 h-56 overflow-y-auto font-mono text-[11px] bg-gradient-to-b from-slate-950/50 to-black/40 [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]"
      >
        {isWeekend() ? (
          <div className="text-slate-500 text-center pt-12 text-xs leading-relaxed">
            <div className="mb-2 text-2xl">📊</div>
            Market closed. No trading activity is running at the moment. 
            <br />
            <span className="text-slate-600">(Saturday & Sunday)</span>
          </div>
        ) : (
          lines.map((t) => (
            <div
              key={t.id}
              className="flex items-center gap-3 text-[11px] leading-relaxed py-1.5 px-2 rounded-lg hover:bg-slate-800/30 transition-colors duration-150"
            >
              <span className="text-slate-500 w-[52px] font-medium">{t.timestamp}</span>

              <span className="text-slate-100 w-[70px] font-semibold">{t.pair}</span>

              <span
                className={
                  t.side === "BUY"
                    ? "text-emerald-400 w-[34px] font-bold"
                    : "text-orange-400 w-[34px] font-bold"
                }
              >
                {t.side}
              </span>

              <span className="text-slate-400 w-[60px]">
                {t.lotSize.toFixed(2)} <span className="text-slate-600">lot</span>
              </span>

              <span className="text-slate-400 w-[80px]">
                {t.margin.toFixed(2)} <span className="text-slate-600">$</span>
              </span>

              <span
                className={
                  "w-[60px] text-right font-semibold " +
                  (t.isWin ? "text-sky-400" : "text-rose-400")
                }
              >
                {t.profit > 0
                  ? `+${t.profit.toFixed(2)}`
                  : t.profit.toFixed(2)}
              </span>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
