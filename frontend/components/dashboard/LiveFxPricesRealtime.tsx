"use client";

import { useEffect, useState } from "react";
import { io, Socket } from "socket.io-client";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";

type FxPair =
  | "EUR/USD"
  | "USD/JPY"
  | "GBP/USD"
  | "AUD/USD"
  | "USD/CHF"
  | "USD/CAD"
  | "NZD/USD"
  | "XAU/USD";

type ForexPrice = {
  pair: FxPair;
  price: number | null;
};

type ForexPayload = {
  base: string;
  timestamp: string;
  prices: ForexPrice[];
  sequence?: number;
};

const PAIRS_ORDER: FxPair[] = [
  "EUR/USD",
  "USD/JPY",
  "GBP/USD",
  "AUD/USD",
  "USD/CHF",
  "USD/CAD",
  "NZD/USD",
  "XAU/USD",
];

export function LiveFxPricesRealtime() {
  const [data, setData] = useState<ForexPayload | null>(null);
  const [connected, setConnected] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [lastUpdateTime, setLastUpdateTime] = useState<Date | null>(null);

  useEffect(() => {
    // Your backend WS URL - default to port 4000 to match backend
    const backendUrl =
      process.env.NEXT_PUBLIC_BACKEND_WS_URL || "http://localhost:4000";

    const socket: Socket = io(backendUrl, {
      transports: ["websocket", "polling"], // Allow polling as fallback
      reconnection: true,
      reconnectionAttempts: Infinity,
      reconnectionDelay: 1000,
      reconnectionDelayMax: 5000,
      timeout: 20000,
      forceNew: false,
    });

    socket.on("connect", () => {
      setConnected(true);
      setError(null);
    });

    socket.on("disconnect", () => {
      setConnected(false);
    });

    socket.on("connect_error", (err) => {
      setConnected(false);
      const errorMsg = err.message || "Failed to connect to WebSocket server";
      setError(`Connection error: ${errorMsg}`);
    });

    socket.on("forex:update", (payload: ForexPayload) => {
      const updateTime = new Date();
      setData({
        ...payload,
        timestamp: updateTime.toISOString(),
        prices: payload.prices.map(p => ({ ...p })),
      });
      setLastUpdateTime(updateTime);
      setError(null);
    });

    return () => {
      socket.disconnect();
    };
  }, []);

  const sortedPrices = data
    ? [...data.prices].sort(
        (a, b) => PAIRS_ORDER.indexOf(a.pair) - PAIRS_ORDER.indexOf(b.pair)
      )
    : [];

  return (
    <Card className="glass-card">
      <CardHeader className="flex flex-col gap-1 pb-3 md:flex-row md:items-center md:justify-between">
        <div>
          <CardTitle className="text-sm font-semibold text-slate-100">
            Live Forex Prices (WebSocket)
          </CardTitle>
          <p className="text-[11px] text-slate-400">
            Streaming major FX pairs in real-time from USD base.
          </p>
        </div>
        <span
          className={`mt-2 inline-flex items-center rounded-full px-3 py-1 text-[11px] md:mt-0 ${
            connected
              ? "border border-emerald-500/60 bg-emerald-500/10 text-emerald-300"
              : "border border-slate-600 bg-slate-900/80 text-slate-300"
          }`}
        >
          <span className="mr-1 h-2 w-2 rounded-full bg-current"></span>
          {connected ? "Live" : "Connecting..."}
        </span>
      </CardHeader>
      <CardContent className="text-xs">
        {error ? (
          <div className="rounded-lg border border-rose-500/50 bg-rose-500/10 px-3 py-2">
            <p className="text-rose-300 text-[11px]">{error}</p>
            <p className="text-rose-400/70 text-[10px] mt-1">
              Make sure the backend is running on port 4000 (or set NEXT_PUBLIC_BACKEND_WS_URL)
            </p>
          </div>
        ) : !data ? (
          <p className="text-slate-400">Waiting for first price update…</p>
        ) : (
          <>
            <div className="overflow-x-auto rounded-xl border border-slate-800 bg-slate-950/60">
              <table className="min-w-full text-[11px] md:text-xs">
                <thead>
                  <tr className="border-b border-slate-800 bg-slate-900/70">
                    <th className="px-3 py-2 text-left font-normal text-slate-400">
                      Pair
                    </th>
                    <th className="px-3 py-2 text-right font-normal text-slate-400">
                      Price
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {sortedPrices.map((p) => (
                    <tr
                      key={p.pair}
                      className="border-b border-slate-900/60 last:border-none transition-colors"
                    >
                      <td className="px-3 py-2 font-medium">{p.pair}</td>
                      <td className="px-3 py-2 text-right font-mono">
                        {p.price != null ? (
                          <span className="text-slate-100">{p.price.toFixed(5)}</span>
                        ) : (
                          <span className="text-slate-500">--</span>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            {(data.timestamp || lastUpdateTime) && (
              <p className="mt-2 text-[10px] text-slate-500">
                Last update: {lastUpdateTime 
                  ? lastUpdateTime.toLocaleTimeString() 
                  : data.timestamp 
                    ? new Date(data.timestamp).toLocaleTimeString() 
                    : 'N/A'}
                {lastUpdateTime && (
                  <span className="ml-2 text-emerald-400">●</span>
                )}
              </p>
            )}
          </>
        )}
      </CardContent>
    </Card>
  );
}

