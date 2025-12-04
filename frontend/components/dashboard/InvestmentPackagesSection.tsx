"use client";

import { useRouter } from "next/navigation";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

const PACKAGES = [
  {
    name: "Starter",
    range: "10 – 99 USDT",
    min: 10,
    max: 99,
    dailyRate: 3,
    description: "Ideal for new investors testing the strategy.",
  },
  {
    name: "Pro",
    range: "100 – 999 USDT",
    min: 100,
    max: 999,
    dailyRate: 5,
    description: "Higher exposure with boosted daily returns.",
    highlight: true,
  },
  {
    name: "Elite",
    range: "1,000+ USDT",
    min: 1000,
    max: null,
    dailyRate: 7,
    description: "Designed for serious capital and compounding.",
  },
];

export function InvestmentPackagesSection() {
  const router = useRouter();

  return (
    <Card className="glass-card">
      <CardHeader className="pb-3 flex flex-col gap-1 md:flex-row md:items-center md:justify-between">
        <div>
          <CardTitle className="text-sm font-semibold text-slate-100">
            Investment Packages
          </CardTitle>
          <p className="text-[11px] text-slate-400">
            Fixed daily profit based on your total active deposit. Profit calculation starts at 00:00 AM.
            Deposits approved today will start earning profit from the next day. No profit on weekends.
          </p>
        </div>
        <Button
          size="sm"
          className="mt-2 h-8 rounded-full bg-sky-500 hover:bg-sky-400 text-[11px] font-semibold md:mt-0"
          onClick={() => router.push("/account?tab=deposit")}
        >
          Go to Deposit
        </Button>
      </CardHeader>
      <CardContent>
        <div className="grid gap-4 md:grid-cols-3">
          {PACKAGES.map((pkg) => (
            <div
              key={pkg.name}
              className={`relative rounded-2xl border px-4 py-3 text-xs transition ${
                pkg.highlight
                  ? "border-sky-500/70 bg-slate-950/80 shadow-[0_0_28px_rgba(56,189,248,0.35)]"
                  : "border-slate-800 bg-slate-950/60"
              }`}
            >
              {pkg.highlight && (
                <span className="absolute right-3 top-3 rounded-full bg-amber-500/10 px-2 py-[2px] text-[9px] font-semibold uppercase tracking-wide text-amber-300 border border-amber-500/60">
                  Most Popular
                </span>
              )}

              <p className="text-[11px] uppercase tracking-wide text-slate-400">
                {pkg.name}
              </p>

              <p className="mt-1 text-sm font-semibold text-slate-100">
                {pkg.range}
              </p>

              <p className="mt-2 text-[11px] text-slate-400">
                Daily profit:
              </p>
              <p className="text-lg font-semibold text-sky-300">
                {pkg.dailyRate}%{" "}
                <span className="text-[11px] font-normal text-slate-400">
                  per active day
                </span>
              </p>

              <div className="mt-3 rounded-xl border border-slate-800 bg-slate-950/70 px-3 py-2">
                <p className="text-[10px] text-slate-400 mb-1">
                  Example (30 days, Mon–Fri only):
                </p>
                <p className="text-[11px] text-slate-300">
                  On{" "}
                  <span className="font-semibold">
                    {pkg.min.toFixed(0)} USDT
                  </span>{" "}
                  you could earn around{" "}
                  <span className="font-semibold">
                    {((pkg.min * pkg.dailyRate) / 100 * 22).toFixed(2)} USDT
                  </span>{" "}
                  in a month of trading days.
                </p>
              </div>

              <p className="mt-3 text-[11px] text-slate-400">
                {pkg.description}
              </p>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}

