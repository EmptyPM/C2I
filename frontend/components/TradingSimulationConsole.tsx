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

function generateTrade(): TradeLine {
  const pair = PAIRS[Math.floor(Math.random() * PAIRS.length)];

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

export function TradingSimulationConsole() {
  const [lines, setLines] = useState<TradeLine[]>([]);
  const containerRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    // On weekends → show PAUSED state + stop updates
    if (isWeekend()) {
      setLines([
        {
          id: 1,
          pair: "XAU/USD",
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
    for (let i = 0; i < 20; i++) initial.push(generateTrade());
    setLines(initial);

    const interval = setInterval(() => {
      if (!isWeekend()) {
        setLines((prev) => {
          const next = [...prev, generateTrade()];
          if (next.length > 40) next.splice(0, next.length - 40);
          return next;
        });
      }
    }, 350);

    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    if (containerRef.current) {
      containerRef.current.scrollTop =
        containerRef.current.scrollHeight;
    }
  }, [lines]);

  return (
    <div className="glass-card bg-slate-950/90 border-slate-800">
      <div className="flex items-center justify-between px-3 pt-3 pb-2">
        <p className="text-xs font-semibold text-slate-200">
          Live Trading Console
        </p>

        {isWeekend() ? (
          <span className="flex items-center gap-1 text-[10px] text-rose-400">
            <span className="h-2 w-2 rounded-full bg-rose-500 shadow-[0_0_8px_rgba(248,113,113,0.9)]" />
            Paused
          </span>
        ) : (
          <span className="flex items-center gap-1 text-[10px] text-slate-400">
            <span className="h-2 w-2 rounded-full bg-emerald-400 shadow-[0_0_8px_rgba(52,211,153,0.9)]" />
            Live
          </span>
        )}
      </div>

      <div
        ref={containerRef}
        className="px-3 pb-3 h-56 overflow-y-auto font-mono text-[11px] bg-black/40 rounded-b-2xl border-t border-slate-800/60"
      >
        {isWeekend() ? (
          <div className="text-slate-500 text-center pt-8 text-xs">
            Market closed. No trading activity is running at the moment. 
            <br />
            (Saturday & Sunday)
          </div>
        ) : (
          lines.map((t) => (
            <div
              key={t.id}
              className="flex items-center gap-2 text-[11px] leading-relaxed"
            >
              <span className="text-slate-500 w-[52px]">{t.timestamp}</span>

              <span className="text-slate-100 w-[70px]">{t.pair}</span>

              <span
                className={
                  t.side === "BUY"
                    ? "text-emerald-400 w-[34px]"
                    : "text-orange-400 w-[34px]"
                }
              >
                {t.side}
              </span>

              <span className="text-slate-400 w-[60px]">
                {t.lotSize.toFixed(2)} lot
              </span>

              <span className="text-slate-400 w-[80px]">
                {t.margin.toFixed(2)} $
              </span>

              <span
                className={
                  "w-[60px] text-right " +
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
