"use client";

import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";

export function BotProgramsTeaserSection() {
  const router = useRouter();

  return (
    <section className="space-y-4">
      <div className="space-y-2">
        <h2 className="text-base font-bold text-slate-100 tracking-tight">
          Our automation suite
        </h2>
        <p className="text-xs text-slate-400 leading-relaxed max-w-2xl">
          Multiple trading engines, one platform. Forex is live today, advanced
          crypto bots are already in the pipeline.
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        {/* FOREX BOT (ACTIVE) */}
        <Card className="group flex flex-col justify-between border-2 border-emerald-500/40 bg-gradient-to-br from-slate-950/95 to-slate-900/80 shadow-[0_0_32px_rgba(16,185,129,0.25)] hover:border-emerald-500/60 hover:shadow-[0_0_40px_rgba(16,185,129,0.4)] transition-all duration-300">
          <CardHeader className="pb-3">
            <div className="flex items-start justify-between gap-3">
              <div className="flex-1">
                <CardTitle className="text-sm font-bold text-emerald-300 mb-1.5">
                  Forex Auto Trading Bot
                </CardTitle>
                <p className="text-xs text-slate-400 leading-relaxed">
                  Live bot trading XAU/USD and major FX pairs 24/5.
                </p>
              </div>
              <span className="shrink-0 rounded-full border border-emerald-500/70 bg-emerald-500/20 px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider text-emerald-300 shadow-[0_0_12px_rgba(16,185,129,0.5)]">
                Active
              </span>
            </div>
          </CardHeader>
          <CardContent className="space-y-3 text-xs">
            <ul className="space-y-1.5 text-slate-200">
              <li className="flex items-center gap-2">
                <span className="h-1.5 w-1.5 rounded-full bg-emerald-400/60"></span>
                <span><span className="font-semibold text-emerald-300">3%</span> daily • 10 – 99 USDT</span>
              </li>
              <li className="flex items-center gap-2">
                <span className="h-1.5 w-1.5 rounded-full bg-emerald-400/60"></span>
                <span><span className="font-semibold text-emerald-300">5%</span> daily • 100 – 999 USDT</span>
              </li>
              <li className="flex items-center gap-2">
                <span className="h-1.5 w-1.5 rounded-full bg-emerald-400/60"></span>
                <span><span className="font-semibold text-emerald-300">7%</span> daily • 1,000+ USDT</span>
              </li>
            </ul>
            <div className="pt-2 border-t border-slate-800/50">
              <p className="text-[10px] text-slate-400 leading-relaxed">
                Referral bonus: <span className="font-semibold text-emerald-300">5%</span> of your
                invitee&apos;s first deposit. Profits paid only on trading days
                (Mon–Fri).
              </p>
            </div>
            <Button
              size="sm"
              className="mt-3 h-9 w-full rounded-full bg-gradient-to-r from-emerald-500 to-emerald-600 text-xs font-bold text-white hover:from-emerald-400 hover:to-emerald-500 shadow-[0_4px_16px_rgba(16,185,129,0.4)] hover:shadow-[0_6px_20px_rgba(16,185,129,0.6)] transition-all duration-200"
              onClick={() => router.push("/account?tab=deposit")}
            >
              Start with Forex bot
            </Button>
          </CardContent>
        </Card>

        {/* CRYPTO AUTO TRADING (COMING SOON) */}
        <Card className="group flex flex-col justify-between border border-sky-500/30 bg-gradient-to-br from-slate-950/95 to-slate-900/80 hover:border-sky-500/50 hover:shadow-[0_0_24px_rgba(56,189,248,0.2)] transition-all duration-300">
          <CardHeader className="pb-3">
            <div className="flex items-start justify-between gap-3">
              <div className="flex-1">
                <CardTitle className="text-sm font-bold text-sky-300 mb-1.5">
                  Crypto Auto Trading
                </CardTitle>
                <p className="text-xs text-slate-400 leading-relaxed">
                  Automated spot & futures strategies on BTC, ETH and majors.
                </p>
              </div>
              <span className="shrink-0 rounded-full border border-slate-700/80 bg-slate-900/90 px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider text-slate-400">
                Coming soon
              </span>
            </div>
          </CardHeader>
          <CardContent className="space-y-3 text-xs">
            <ul className="space-y-1.5 text-slate-200">
              <li className="flex items-center gap-2">
                <span className="h-1.5 w-1.5 rounded-full bg-sky-400/40"></span>
                <span><span className="font-semibold text-sky-300">5%</span> daily • 10 – 99 USDT</span>
              </li>
              <li className="flex items-center gap-2">
                <span className="h-1.5 w-1.5 rounded-full bg-sky-400/40"></span>
                <span><span className="font-semibold text-sky-300">7%</span> daily • 100 – 999 USDT</span>
              </li>
              <li className="flex items-center gap-2">
                <span className="h-1.5 w-1.5 rounded-full bg-sky-400/40"></span>
                <span><span className="font-semibold text-sky-300">10%</span> daily • 1,000+ USDT</span>
              </li>
            </ul>
            <div className="pt-2 border-t border-slate-800/50">
              <p className="text-[10px] text-slate-400 leading-relaxed">
                5% referral rewards will also apply here. Early investors will get
                priority access when the crypto engine goes live.
              </p>
            </div>
          </CardContent>
        </Card>

        {/* ARBITRAGE BOT (COMING SOON) */}
        <Card className="group flex flex-col justify-between border border-amber-500/30 bg-gradient-to-br from-slate-950/95 to-slate-900/80 hover:border-amber-500/50 hover:shadow-[0_0_24px_rgba(245,158,11,0.2)] transition-all duration-300">
          <CardHeader className="pb-3">
            <div className="flex items-start justify-between gap-3">
              <div className="flex-1">
                <CardTitle className="text-sm font-bold text-amber-300 mb-1.5">
                  Crypto Arbitrage Bot
                </CardTitle>
                <p className="text-xs text-slate-400 leading-relaxed">
                  Captures price gaps between exchanges with market-neutral
                  strategies.
                </p>
              </div>
              <span className="shrink-0 rounded-full border border-slate-700/80 bg-slate-900/90 px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider text-slate-400">
                Coming soon
              </span>
            </div>
          </CardHeader>
          <CardContent className="space-y-3 text-xs">
            <div className="rounded-lg border border-amber-500/20 bg-amber-500/5 p-2.5">
              <p className="text-slate-200">
                Target ROI: <span className="font-bold text-amber-300">up to 200%</span> per
                strategy cycle.
              </p>
            </div>
            <div className="pt-2 border-t border-slate-800/50">
              <p className="text-[10px] text-slate-400 leading-relaxed">
                Focused on low-risk, high-frequency trades around spreads and
                funding mis-pricings. Ideal for investors who prefer smoother
                equity curves.
              </p>
            </div>
          </CardContent>
        </Card>

        {/* CRYPTO SNIPER BOT (COMING SOON) */}
        <Card className="group flex flex-col justify-between border border-fuchsia-500/30 bg-gradient-to-br from-slate-950/95 to-slate-900/80 hover:border-fuchsia-500/50 hover:shadow-[0_0_24px_rgba(217,70,239,0.2)] transition-all duration-300">
          <CardHeader className="pb-3">
            <div className="flex items-start justify-between gap-3">
              <div className="flex-1">
                <CardTitle className="text-sm font-bold text-fuchsia-300 mb-1.5">
                  Crypto Sniper Bot
                </CardTitle>
                <p className="text-xs text-slate-400 leading-relaxed">
                  High-volatility breakout system for aggressive upside on
                  trending coins.
                </p>
              </div>
              <span className="shrink-0 rounded-full border border-slate-700/80 bg-slate-900/90 px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider text-slate-400">
                Coming soon
              </span>
            </div>
          </CardHeader>
          <CardContent className="space-y-3 text-xs">
            <div className="rounded-lg border border-fuchsia-500/20 bg-fuchsia-500/5 p-2.5">
              <p className="text-slate-200">
                Target ROI: <span className="font-bold text-fuchsia-300">up to 300%</span> per
                high-risk cycle.
              </p>
            </div>
            <div className="pt-2 border-t border-slate-800/50">
              <p className="text-[10px] text-slate-400 leading-relaxed">
                Built for advanced investors comfortable with deeper drawdowns in
                exchange for potentially explosive returns on strong market
                trends.
              </p>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="pt-2 mt-4 border-t border-slate-800/50">
        <p className="text-[10px] text-slate-500 leading-relaxed text-center max-w-3xl mx-auto">
          All ROI figures are strategy targets only and depend on market
          conditions and risk settings. Capital is subject to trading risk; never
          invest funds you cannot afford to keep in long-term programs.
        </p>
      </div>
    </section>
  );
}

