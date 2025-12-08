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
    <div className="glass-card rounded-2xl border border-slate-800/50 bg-gradient-to-br from-slate-900/90 via-slate-950/90 to-slate-900/90 backdrop-blur-sm px-5 py-4 shadow-xl hover:shadow-2xl transition-all duration-300 relative overflow-hidden">
      {/* Decorative sparkle icon */}
      <div className="absolute top-3 right-3 text-slate-700/30 text-2xl">✦</div>
      
      <div className="flex items-start justify-between mb-3 relative z-10">
        <div className="flex items-center gap-2">
          {/* Stack of bills icon */}
          <div className="w-8 h-8 rounded-lg bg-sky-500/10 border border-sky-500/20 flex items-center justify-center">
            <svg className="w-5 h-5 text-sky-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <div>
            <p className="text-[11px] uppercase tracking-wider text-slate-400 font-medium">
              Total Invested
            </p>
          </div>
        </div>
        <div className="inline-flex items-center rounded-full bg-emerald-500/10 px-2.5 py-1 text-[10px] font-medium text-emerald-300 border border-emerald-500/20">
          <span className="mr-1.5 h-1.5 w-1.5 rounded-full bg-emerald-400 shadow-[0_0_6px_rgba(74,222,128,0.8)]" />
          Live
        </div>
      </div>
      <p className="text-2xl sm:text-3xl font-bold text-sky-300 tracking-tight relative z-10">
        {Math.floor(totalInvested).toLocaleString()}{" "}
        <span className="text-sm font-semibold text-slate-400">USDT</span>
      </p>
    </div>
  );
}

