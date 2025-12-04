"use client";

import { useQuery } from "@tanstack/react-query";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { api } from "@/lib/api-client";

type FxPrice = {
  pair: string;
  price: number | null;
};

type ForexResponse = {
  base: string;
  timestamp: string;
  prices: FxPrice[];
};

export function LiveFxPrices() {
  const { data, isLoading, isError, refetch, isFetching } =
    useQuery<ForexResponse>({
      queryKey: ["forexPrices"],
      queryFn: async () => {
        const res = await api.get("/forex/prices");
        return res.data;
      },
      refetchInterval: 10_000, // refresh every 10 seconds
      staleTime: 0,
      refetchOnWindowFocus: true,
    });

  return (
    <Card className="glass-card">
      <CardHeader className="flex flex-col gap-1 pb-3 md:flex-row md:items-center md:justify-between">
        <div>
          <CardTitle className="text-sm font-semibold text-slate-100">
            Live Forex Prices
          </CardTitle>
          <p className="text-[11px] text-slate-400">
            Real-time snapshot for major FX pairs (prices in {data?.base || "USD"}).
          </p>
        </div>
        <button
          onClick={() => refetch()}
          className="mt-2 inline-flex items-center rounded-full border border-slate-700 bg-slate-900/80 px-3 py-1 text-[11px] text-slate-200 hover:border-sky-500 md:mt-0"
        >
          {isFetching ? "Refreshing..." : "Refresh"}
        </button>
      </CardHeader>
      <CardContent className="text-xs">
        {isLoading ? (
          <p className="text-slate-400">Loading prices…</p>
        ) : isError ? (
          <p className="text-red-400">
            Failed to load FX prices. Please try again later.
          </p>
        ) : !data || !data.prices?.length ? (
          <p className="text-slate-400">No data available.</p>
        ) : (
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
                  <th className="px-3 py-2 text-right font-normal text-slate-400">
                    Source
                  </th>
                </tr>
              </thead>
              <tbody>
                {data.prices.map((p) => (
                  <tr
                    key={p.pair}
                    className="border-b border-slate-900/60 last:border-none"
                  >
                    <td className="px-3 py-2">{p.pair}</td>
                    <td className="px-3 py-2 text-right">
                      {p.price != null ? p.price.toFixed(5) : "--"}
                    </td>
                    <td className="px-3 py-2 text-right text-[10px] text-slate-500">
                      Real-time FX API
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {data?.timestamp && (
          <p className="mt-2 text-[10px] text-slate-500">
            Last updated: {data.timestamp}
          </p>
        )}
      </CardContent>
    </Card>
  );
}



