"use client";

import { useEffect, useMemo, useRef, useState } from "react";

type Props = {
  tradingBalance: number;
};

function getDailyRate(balance: number): number {
  if (balance >= 10 && balance <= 99) return 0.03;
  if (balance >= 100 && balance <= 999) return 0.05;
  if (balance >= 1000) return 0.07;
  return 0;
}

function getProgressInDay(): number {
  const now = new Date();
  const start = new Date(now);
  start.setHours(0, 0, 0, 0);
  const elapsedMs = now.getTime() - start.getTime();
  const msPerDay = 24 * 60 * 60 * 1000;
  const raw = elapsedMs / msPerDay;
  return Math.min(Math.max(raw, 0), 1);
}

export const LiveDailyProfit: React.FC<Props> = ({ tradingBalance }) => {
  const [value, setValue] = useState(0);
  const [direction, setDirection] = useState<"up" | "down" | "flat">("flat");
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  const rate = useMemo(() => getDailyRate(tradingBalance), [tradingBalance]);
  const targetProfit = useMemo(
    () => tradingBalance * rate,
    [tradingBalance, rate]
  );

  useEffect(() => {
    if (!tradingBalance || rate === 0) {
      setValue(0);
      setDirection("flat");
      return;
    }

    // initial value
    const initialProgress = getProgressInDay();
    setValue(targetProfit * initialProgress);

    const tick = () => {
      const progress = getProgressInDay();

      // Day finished → lock to target
      if (progress >= 1) {
        setDirection("flat");
        setValue(targetProfit);
        if (timerRef.current) clearInterval(timerRef.current);
        return;
      }

      setValue((prev) => {
        const base = targetProfit * progress;

        // random noise up or down, about +/- 3% of target
        const noiseRange = targetProfit * 0.03;
        let candidate =
          base + (Math.random() * 2 - 1) * noiseRange; // [-range, +range]

        // do not let it go crazy down compared to previous
        const maxDrop = targetProfit * 0.01; // 1% of target per step
        candidate = Math.max(prev - maxDrop, candidate);

        // keep inside [0, targetProfit]
        candidate = Math.min(targetProfit, Math.max(0, candidate));

        const newVal = 0.6 * prev + 0.4 * candidate; // smooth

        if (newVal > prev + 0.0001) setDirection("up");
        else if (newVal < prev - 0.0001) setDirection("down");
        else setDirection("flat");

        return newVal;
      });
    };

    // tick every 5 seconds (you can change this)
    timerRef.current = setInterval(tick, 5000);
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [tradingBalance, rate, targetProfit]);

  // Weekend: no live profit
  const isWeekend = useMemo(() => {
    const day = new Date().getDay(); // 0 Sunday, 6 Saturday
    return day === 0 || day === 6;
  }, []);

  // Check if user has no balance (new user who hasn't deposited)
  const hasNoBalance = !tradingBalance || tradingBalance === 0;

  if (hasNoBalance) {
    return (
      <div className="glass-card rounded-2xl border border-slate-800/50 bg-gradient-to-br from-slate-900/90 via-slate-950/90 to-slate-900/90 backdrop-blur-sm px-5 py-4 shadow-xl">
        <div className="flex items-start justify-between mb-3">
          <div>
            <p className="text-[11px] uppercase tracking-wider text-slate-400 font-medium mb-2">Today&apos;s Live Profit</p>
            <p className="text-2xl sm:text-3xl font-bold text-slate-500 mb-1 tracking-tight">
              0.00 <span className="text-sm font-semibold text-slate-400">USDT</span>
            </p>
          </div>
          <div className="flex items-center gap-2 px-2.5 py-1 rounded-full bg-slate-800/50 border border-slate-700/50">
            <span className="h-2 w-2 rounded-full bg-slate-500" />
            <span className="text-[10px] font-medium text-slate-400">Pending</span>
          </div>
        </div>
        <p className="text-[10px] text-slate-500 leading-relaxed">
          You need to deposit money to start earning profits
        </p>
      </div>
    );
  }

  if (rate === 0 || isWeekend) {
    return (
      <div className="rounded-xl border border-slate-800 bg-slate-900/70 px-4 py-3 text-xs text-slate-400">
        Live profit is paused. Daily profits are earned Monday–Friday only.
      </div>
    );
  }

  const formatted = value.toFixed(4);
  const progress = targetProfit > 0 ? Math.min((value / targetProfit) * 100, 100) : 0;

  return (
    <div className="glass-card rounded-2xl border border-slate-800/50 bg-gradient-to-br from-slate-900/90 via-slate-950/90 to-slate-900/90 backdrop-blur-sm px-5 py-4 shadow-xl hover:shadow-2xl transition-all duration-300">
      <div className="flex items-start justify-between mb-3">
        <div>
          <p className="text-[11px] uppercase tracking-wider text-slate-400 font-medium mb-2">Today&apos;s Live Profit</p>
          <p className="text-2xl sm:text-3xl font-bold text-emerald-400 mb-1 tracking-tight">
            {formatted} <span className="text-sm font-semibold text-slate-400">USDT</span>
          </p>
        </div>
        <div className="flex flex-col items-end gap-1.5">
          <div className="flex items-center gap-2 px-2.5 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20">
            <span
              className={
                direction === "up"
                  ? "h-2 w-2 rounded-full bg-emerald-400 shadow-[0_0_8px_rgba(74,222,128,0.8)] animate-pulse"
                  : direction === "down"
                  ? "h-2 w-2 rounded-full bg-red-400 shadow-[0_0_8px_rgba(248,113,113,0.8)]"
                  : "h-2 w-2 rounded-full bg-slate-500"
              }
            />
            <span className="text-[10px] font-medium text-emerald-300">
              {direction === "up"
                ? "Ticking up"
                : direction === "down"
                ? "Ticking down"
                : "Stable"}
            </span>
          </div>
        </div>
      </div>
      
      {/* Progress Bar */}
      <div className="mb-3">
        <div className="h-2 bg-slate-800/50 rounded-full overflow-hidden backdrop-blur-sm">
          <div 
            className="h-full bg-gradient-to-r from-emerald-500 via-emerald-400 to-emerald-500 rounded-full transition-all duration-500 ease-out shadow-[0_0_10px_rgba(74,222,128,0.5)]"
            style={{ width: `${progress}%` }}
          />
        </div>
      </div>
      
      <p className="text-[10px] text-slate-500 leading-relaxed">
        Target for today: <span className="text-slate-400 font-medium">{(targetProfit || 0).toFixed(4)} USDT</span> ({(rate * 100).toFixed(1)}% of your trading balance)
      </p>
    </div>
  );
};




