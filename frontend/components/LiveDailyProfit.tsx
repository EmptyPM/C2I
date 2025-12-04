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
      <div className="rounded-2xl border border-slate-800 bg-slate-900/80 px-4 py-3 flex items-center justify-between gap-3">
        <div>
          <p className="text-xs text-slate-400">Today&apos;s live profit</p>
          <p className="text-lg font-semibold text-sky-300">
            0.00 <span className="text-xs text-slate-400">USDT</span>
          </p>
          <p className="text-[11px] text-slate-500 mt-1">
            You need to deposit money to start earning profits
          </p>
        </div>
        <div className="flex items-center gap-2">
          <span className="h-2 w-2 rounded-full bg-slate-500" />
          <span className="text-[11px] text-slate-400">Pending</span>
        </div>
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

  return (
    <div className="rounded-2xl border border-slate-800 bg-slate-900/80 px-4 py-3 flex items-center justify-between gap-3">
      <div>
        <p className="text-xs text-slate-400">Today&apos;s live profit</p>
        <p className="text-lg font-semibold text-sky-300">
          {formatted} <span className="text-xs text-slate-400">USDT</span>
        </p>
        <p className="text-[11px] text-slate-500 mt-1">
          Target for today: {(targetProfit || 0).toFixed(4)} USDT ({(rate * 100).toFixed(1)}
          % of your trading balance)
        </p>
      </div>
      <div className="flex items-center gap-2">
        <span
          className={
            direction === "up"
              ? "h-2 w-2 rounded-full bg-emerald-400 shadow-[0_0_12px_rgba(74,222,128,0.9)]"
              : direction === "down"
              ? "h-2 w-2 rounded-full bg-red-400 shadow-[0_0_12px_rgba(248,113,113,0.9)]"
              : "h-2 w-2 rounded-full bg-slate-500"
          }
        />
        <span className="text-[11px] text-slate-400">
          {direction === "up"
            ? "Ticking up"
            : direction === "down"
            ? "Ticking down"
            : "Stable"}
        </span>
      </div>
    </div>
  );
};




