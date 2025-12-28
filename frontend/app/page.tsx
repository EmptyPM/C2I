"use client";

import { useRouter } from "next/navigation";
import { TradingSimulationConsole } from "@/components/TradingSimulationConsole";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

export default function Home() {
  const router = useRouter();

  return (
    <main className="min-h-screen">
      {/* Hero Section */}
      <section className="relative py-16 md:py-24 overflow-hidden">
        {/* Background gradient effects */}
        <div className="absolute inset-0 bg-gradient-to-br from-blue-950/20 via-slate-950/50 to-amber-950/20" />
        <div className="absolute top-0 right-0 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl" />
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-amber-500/10 rounded-full blur-3xl" />
        
        <div className="relative z-10 text-center space-y-8">
          <div className="space-y-4">
            <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold tracking-tight bg-gradient-to-r from-blue-400 via-cyan-300 to-amber-400 bg-clip-text text-transparent">
              Invest Smarter. Grow Faster.
            </h1>
            <p className="text-lg md:text-xl text-slate-300 max-w-2xl mx-auto leading-relaxed">
              Join <span className="text-amber-400 font-semibold">120,000+</span> investors growing their wealth today with AI-powered trading strategies and proven returns.
            </p>
          </div>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <Button
              onClick={() => router.push("/register")}
              className="bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-500 hover:to-cyan-500 text-white font-semibold px-8 py-6 text-lg rounded-xl shadow-lg shadow-blue-500/50 hover:shadow-xl hover:shadow-blue-500/60 transition-all duration-300"
            >
              Start Investing Today
            </Button>
            <Button
              onClick={() => router.push("/login")}
              variant="outline"
              className="border-2 border-slate-700 text-slate-300 hover:bg-slate-800 hover:text-white font-semibold px-8 py-6 text-lg rounded-xl transition-all duration-300"
            >
              Sign In
            </Button>
          </div>
        </div>
      </section>

      {/* Live Trading Consoles Section */}
      <section className="py-12 md:py-16">
        <div className="text-center mb-8">
          <h2 className="text-3xl md:text-4xl font-bold text-slate-100 mb-4">
            Live Trading Activity
          </h2>
          <p className="text-slate-400 max-w-2xl mx-auto">
            Watch real-time trades happening on our platform across currencies and precious metals
          </p>
        </div>
        
        <div className="grid gap-4 md:grid-cols-2">
          <TradingSimulationConsole allowedPairs={["EUR/USD", "USD/JPY", "GBP/USD"]} title="Live Trading Console (Currencies)" />
          <TradingSimulationConsole allowedPairs={["XAU/USD"]} title="Live Trading Console (Gold)" />
        </div>
      </section>

      {/* Trust Building Section */}
      <section className="py-12 md:py-16">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-slate-100 mb-4">
            Trusted by Investors Worldwide
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          {/* Badge 1 */}
          <Card className="glass-card rounded-2xl border border-slate-800/50 bg-gradient-to-br from-slate-900/90 via-slate-950/90 to-slate-900/90 backdrop-blur-sm shadow-xl">
            <CardContent className="p-6 text-center">
              <div className="w-16 h-16 rounded-full bg-blue-500/20 border-2 border-blue-500/30 flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                </svg>
              </div>
              <h3 className="text-lg font-bold text-slate-100 mb-2">Regulated Platform</h3>
              <p className="text-sm text-slate-400">Fully compliant with financial regulations</p>
            </CardContent>
          </Card>

          {/* Badge 2 */}
          <Card className="glass-card rounded-2xl border border-slate-800/50 bg-gradient-to-br from-slate-900/90 via-slate-950/90 to-slate-900/90 backdrop-blur-sm shadow-xl">
            <CardContent className="p-6 text-center">
              <div className="w-16 h-16 rounded-full bg-amber-500/20 border-2 border-amber-500/30 flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-amber-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h3 className="text-lg font-bold text-slate-100 mb-2">Transparent Fees</h3>
              <p className="text-sm text-slate-400">No hidden charges, clear pricing</p>
            </CardContent>
          </Card>

          {/* Badge 3 */}
          <Card className="glass-card rounded-2xl border border-slate-800/50 bg-gradient-to-br from-slate-900/90 via-slate-950/90 to-slate-900/90 backdrop-blur-sm shadow-xl">
            <CardContent className="p-6 text-center">
              <div className="w-16 h-16 rounded-full bg-emerald-500/20 border-2 border-emerald-500/30 flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-emerald-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
              </div>
              <h3 className="text-lg font-bold text-slate-100 mb-2">24/7 Support</h3>
              <p className="text-sm text-slate-400">Round-the-clock customer assistance</p>
            </CardContent>
          </Card>
        </div>

      </section>

      {/* Final CTA Section */}
      <section className="py-16 md:py-24 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-blue-600/20 via-cyan-600/20 to-amber-600/20" />
        <div className="relative z-10 text-center space-y-8">
          <h2 className="text-3xl md:text-5xl font-bold text-slate-100">
            Your Money Deserves More
          </h2>
          <p className="text-lg md:text-xl text-slate-300 max-w-2xl mx-auto">
            Start Investing Confidently Today
          </p>
          <Button
            onClick={() => router.push("/register")}
            className="bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-500 hover:to-cyan-500 text-white font-semibold px-10 py-7 text-xl rounded-xl shadow-lg shadow-blue-500/50 hover:shadow-xl hover:shadow-blue-500/60 transition-all duration-300"
          >
            Start Investing Today
          </Button>
        </div>
      </section>
    </main>
  );
}
