"use client";

import { useEffect, useState } from "react";

// Helper to get a deterministic starting value based on date
function getInitialTotalInvested(): number {
  const today = new Date().toDateString();
  const baseValue = 153257; // Starting value
  // Add a small random increment based on day to make it feel natural
  const dayHash = today.split("").reduce((acc, char) => acc + char.charCodeAt(0), 0);
  const dailyIncrement = (dayHash % 1000) + 200; // 200-1200 range
  return baseValue + dailyIncrement;
}

export function TotalInvested() {
  const [totalInvested, setTotalInvested] = useState(() => getInitialTotalInvested());

  useEffect(() => {
    // Update randomly every 10-20 seconds (slower)
    const getRandomInterval = () => {
      return 10000 + Math.random() * 10000; // 10-20 seconds
    };

    const updateValue = () => {
      setTotalInvested((prev) => {
        // Random increment between 10-100 USD
        const increment = 10 + Math.random() * 90;
        return Number((prev + increment).toFixed(2));
      });

      // Schedule next update
      const nextInterval = getRandomInterval();
      setTimeout(updateValue, nextInterval);
    };

    // Start first update after random delay
    const initialDelay = getRandomInterval();
    const timeoutId = setTimeout(updateValue, initialDelay);

    return () => {
      clearTimeout(timeoutId);
    };
  }, []);

  return (
    <div className="glass-card rounded-2xl border border-slate-800 bg-slate-950/70 px-4 py-3">
      <div className="flex items-center justify-between mb-1">
        <p className="text-[11px] uppercase tracking-wide text-slate-400">
          Total Invested
        </p>
        <div className="inline-flex items-center rounded-full bg-slate-900/80 px-2.5 sm:px-3 py-1 text-[10px] sm:text-xs text-slate-300 border border-slate-700/60">
          <span className="mr-1 h-1.5 w-1.5 rounded-full bg-emerald-400" />
          Live
        </div>
      </div>
      <p className="mt-1 text-2xl font-semibold text-sky-300">
        {Math.floor(totalInvested).toLocaleString()}{" "}
        <span className="text-sm text-slate-400">USDT</span>
      </p>
    </div>
  );
}

