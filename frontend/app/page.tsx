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

      {/* Key Metrics Section */}
      <section className="py-12 md:py-16">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* ROI Card */}
          <Card className="glass-card rounded-2xl border border-blue-500/30 bg-gradient-to-br from-blue-950/40 via-slate-950/60 to-blue-950/40 backdrop-blur-sm shadow-xl hover:shadow-2xl hover:border-blue-500/50 transition-all duration-300">
            <CardContent className="p-6 text-center">
              <div className="flex items-center justify-center mb-3">
                <div className="w-14 h-14 rounded-xl bg-blue-500/20 border border-blue-500/30 flex items-center justify-center">
                  <svg className="w-8 h-8 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
                  </svg>
                </div>
              </div>
              <p className="text-4xl md:text-5xl font-bold text-blue-400 mb-2">18.4%</p>
              <p className="text-sm text-slate-400 uppercase tracking-wider">Average Annual ROI</p>
              <p className="text-xs text-slate-500 mt-2">From diversified portfolios</p>
            </CardContent>
          </Card>

          {/* Active Investors Card */}
          <Card className="glass-card rounded-2xl border border-amber-500/30 bg-gradient-to-br from-amber-950/40 via-slate-950/60 to-amber-950/40 backdrop-blur-sm shadow-xl hover:shadow-2xl hover:border-amber-500/50 transition-all duration-300">
            <CardContent className="p-6 text-center">
              <div className="flex items-center justify-center mb-3">
                <div className="w-14 h-14 rounded-xl bg-amber-500/20 border border-amber-500/30 flex items-center justify-center">
                  <svg className="w-8 h-8 text-amber-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                  </svg>
                </div>
              </div>
              <p className="text-4xl md:text-5xl font-bold text-amber-400 mb-2">120,000+</p>
              <p className="text-sm text-slate-400 uppercase tracking-wider">Active Investors</p>
              <p className="text-xs text-slate-500 mt-2">Growing daily</p>
            </CardContent>
          </Card>

          {/* Total Volume Card */}
          <Card className="glass-card rounded-2xl border border-cyan-500/30 bg-gradient-to-br from-cyan-950/40 via-slate-950/60 to-cyan-950/40 backdrop-blur-sm shadow-xl hover:shadow-2xl hover:border-cyan-500/50 transition-all duration-300">
            <CardContent className="p-6 text-center">
              <div className="flex items-center justify-center mb-3">
                <div className="w-14 h-14 rounded-xl bg-cyan-500/20 border border-cyan-500/30 flex items-center justify-center">
                  <svg className="w-8 h-8 text-cyan-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
              </div>
              <p className="text-4xl md:text-5xl font-bold text-cyan-400 mb-2">$87M+</p>
              <p className="text-sm text-slate-400 uppercase tracking-wider">Total Investment</p>
              <p className="text-xs text-slate-500 mt-2">On our platform</p>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Value Points Section */}
      <section className="py-16 md:py-24 relative overflow-hidden">
        {/* Animated background effects */}
        <div className="absolute inset-0 bg-gradient-to-br from-blue-950/10 via-purple-950/10 to-cyan-950/10" />
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-blue-500/5 rounded-full blur-3xl animate-pulse" />
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-purple-500/5 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }} />
        
        <div className="relative z-10">
          <div className="text-center mb-16">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-gradient-to-r from-blue-500/10 to-purple-500/10 border border-blue-500/20 mb-6">
              <svg className="w-5 h-5 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <span className="text-sm font-semibold text-blue-300">Why Choose Us</span>
            </div>
            <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold text-slate-100 mb-6 bg-gradient-to-r from-slate-100 via-blue-100 to-cyan-100 bg-clip-text text-transparent">
              Why Choose Our Platform?
            </h2>
            <p className="text-lg md:text-xl text-slate-400 max-w-3xl mx-auto leading-relaxed">
              Trusted by thousands of investors worldwide with proven results and cutting-edge technology
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
            {/* Value Point 1 */}
            <Card className="group relative overflow-hidden rounded-3xl border border-blue-500/20 bg-gradient-to-br from-slate-900/95 via-blue-950/30 to-slate-950/95 backdrop-blur-xl shadow-2xl hover:shadow-[0_0_40px_rgba(59,130,246,0.3)] hover:border-blue-500/40 transition-all duration-500 hover:-translate-y-2">
              {/* Animated gradient overlay */}
              <div className="absolute inset-0 bg-gradient-to-br from-blue-500/0 via-blue-500/0 to-blue-500/0 group-hover:from-blue-500/10 group-hover:via-blue-500/5 group-hover:to-blue-500/10 transition-all duration-500" />
              
              <CardContent className="p-8 relative z-10">
                <div className="relative mb-6">
                  <div className="absolute inset-0 bg-blue-500/20 rounded-2xl blur-xl group-hover:bg-blue-500/30 transition-all duration-500" />
                  <div className="relative w-16 h-16 rounded-2xl bg-gradient-to-br from-blue-500/20 to-blue-600/20 border-2 border-blue-500/30 flex items-center justify-center group-hover:scale-110 group-hover:rotate-3 transition-all duration-500">
                    <svg className="w-8 h-8 text-blue-400 group-hover:text-blue-300 transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                    </svg>
                  </div>
                </div>
                <h3 className="text-2xl font-bold text-slate-100 mb-3 group-hover:text-blue-100 transition-colors">
                  18.4% Avg Annual Return
                </h3>
                <p className="text-sm md:text-base text-slate-400 leading-relaxed group-hover:text-slate-300 transition-colors">
                  From diversified portfolios across multiple asset classes and trading strategies
                </p>
              </CardContent>
            </Card>

            {/* Value Point 2 */}
            <Card className="group relative overflow-hidden rounded-3xl border border-amber-500/20 bg-gradient-to-br from-slate-900/95 via-amber-950/30 to-slate-950/95 backdrop-blur-xl shadow-2xl hover:shadow-[0_0_40px_rgba(245,158,11,0.3)] hover:border-amber-500/40 transition-all duration-500 hover:-translate-y-2">
              <div className="absolute inset-0 bg-gradient-to-br from-amber-500/0 via-amber-500/0 to-amber-500/0 group-hover:from-amber-500/10 group-hover:via-amber-500/5 group-hover:to-amber-500/10 transition-all duration-500" />
              
              <CardContent className="p-8 relative z-10">
                <div className="relative mb-6">
                  <div className="absolute inset-0 bg-amber-500/20 rounded-2xl blur-xl group-hover:bg-amber-500/30 transition-all duration-500" />
                  <div className="relative w-16 h-16 rounded-2xl bg-gradient-to-br from-amber-500/20 to-amber-600/20 border-2 border-amber-500/30 flex items-center justify-center group-hover:scale-110 group-hover:rotate-3 transition-all duration-500">
                    <svg className="w-8 h-8 text-amber-400 group-hover:text-amber-300 transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>
                </div>
                <h3 className="text-2xl font-bold text-slate-100 mb-3 group-hover:text-amber-100 transition-colors">
                  $87 Million+ Invested
                </h3>
                <p className="text-sm md:text-base text-slate-400 leading-relaxed group-hover:text-slate-300 transition-colors">
                  Total investment volume on our secure and regulated platform
                </p>
              </CardContent>
            </Card>

            {/* Value Point 3 */}
            <Card className="group relative overflow-hidden rounded-3xl border border-purple-500/20 bg-gradient-to-br from-slate-900/95 via-purple-950/30 to-slate-950/95 backdrop-blur-xl shadow-2xl hover:shadow-[0_0_40px_rgba(168,85,247,0.3)] hover:border-purple-500/40 transition-all duration-500 hover:-translate-y-2">
              <div className="absolute inset-0 bg-gradient-to-br from-purple-500/0 via-purple-500/0 to-purple-500/0 group-hover:from-purple-500/10 group-hover:via-purple-500/5 group-hover:to-purple-500/10 transition-all duration-500" />
              
              <CardContent className="p-8 relative z-10">
                <div className="relative mb-6">
                  <div className="absolute inset-0 bg-purple-500/20 rounded-2xl blur-xl group-hover:bg-purple-500/30 transition-all duration-500" />
                  <div className="relative w-16 h-16 rounded-2xl bg-gradient-to-br from-purple-500/20 to-purple-600/20 border-2 border-purple-500/30 flex items-center justify-center group-hover:scale-110 group-hover:rotate-3 transition-all duration-500">
                    <svg className="w-8 h-8 text-purple-400 group-hover:text-purple-300 transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                    </svg>
                  </div>
                </div>
                <h3 className="text-2xl font-bold text-slate-100 mb-3 group-hover:text-purple-100 transition-colors">
                  120,000+ Active Investors
                </h3>
                <p className="text-sm md:text-base text-slate-400 leading-relaxed group-hover:text-slate-300 transition-colors">
                  Growing daily with real-time trading and automated strategies
                </p>
              </CardContent>
            </Card>

            {/* Value Point 4 */}
            <Card className="group relative overflow-hidden rounded-3xl border border-emerald-500/20 bg-gradient-to-br from-slate-900/95 via-emerald-950/30 to-slate-950/95 backdrop-blur-xl shadow-2xl hover:shadow-[0_0_40px_rgba(16,185,129,0.3)] hover:border-emerald-500/40 transition-all duration-500 hover:-translate-y-2">
              <div className="absolute inset-0 bg-gradient-to-br from-emerald-500/0 via-emerald-500/0 to-emerald-500/0 group-hover:from-emerald-500/10 group-hover:via-emerald-500/5 group-hover:to-emerald-500/10 transition-all duration-500" />
              
              <CardContent className="p-8 relative z-10">
                <div className="relative mb-6">
                  <div className="absolute inset-0 bg-emerald-500/20 rounded-2xl blur-xl group-hover:bg-emerald-500/30 transition-all duration-500" />
                  <div className="relative w-16 h-16 rounded-2xl bg-gradient-to-br from-emerald-500/20 to-emerald-600/20 border-2 border-emerald-500/30 flex items-center justify-center group-hover:scale-110 group-hover:rotate-3 transition-all duration-500">
                    <svg className="w-8 h-8 text-emerald-400 group-hover:text-emerald-300 transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>
                </div>
                <h3 className="text-2xl font-bold text-slate-100 mb-3 group-hover:text-emerald-100 transition-colors">
                  97% User Satisfaction
                </h3>
                <p className="text-sm md:text-base text-slate-400 leading-relaxed group-hover:text-slate-300 transition-colors">
                  Based on real surveys from our active investor community
                </p>
              </CardContent>
            </Card>

            {/* Value Point 5 */}
            <Card className="group relative overflow-hidden rounded-3xl border border-cyan-500/20 bg-gradient-to-br from-slate-900/95 via-cyan-950/30 to-slate-950/95 backdrop-blur-xl shadow-2xl hover:shadow-[0_0_40px_rgba(6,182,212,0.3)] hover:border-cyan-500/40 transition-all duration-500 hover:-translate-y-2">
              <div className="absolute inset-0 bg-gradient-to-br from-cyan-500/0 via-cyan-500/0 to-cyan-500/0 group-hover:from-cyan-500/10 group-hover:via-cyan-500/5 group-hover:to-cyan-500/10 transition-all duration-500" />
              
              <CardContent className="p-8 relative z-10">
                <div className="relative mb-6">
                  <div className="absolute inset-0 bg-cyan-500/20 rounded-2xl blur-xl group-hover:bg-cyan-500/30 transition-all duration-500" />
                  <div className="relative w-16 h-16 rounded-2xl bg-gradient-to-br from-cyan-500/20 to-cyan-600/20 border-2 border-cyan-500/30 flex items-center justify-center group-hover:scale-110 group-hover:rotate-3 transition-all duration-500">
                    <svg className="w-8 h-8 text-cyan-400 group-hover:text-cyan-300 transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                    </svg>
                  </div>
                </div>
                <h3 className="text-2xl font-bold text-slate-100 mb-3 group-hover:text-cyan-100 transition-colors">
                  Real-time AI Insights
                </h3>
                <p className="text-sm md:text-base text-slate-400 leading-relaxed group-hover:text-slate-300 transition-colors">
                  Optimize your investments with advanced AI-powered trading algorithms
                </p>
              </CardContent>
            </Card>

            {/* Value Point 6 - Security */}
            <Card className="group relative overflow-hidden rounded-3xl border border-red-500/20 bg-gradient-to-br from-slate-900/95 via-red-950/30 to-slate-950/95 backdrop-blur-xl shadow-2xl hover:shadow-[0_0_40px_rgba(239,68,68,0.3)] hover:border-red-500/40 transition-all duration-500 hover:-translate-y-2">
              <div className="absolute inset-0 bg-gradient-to-br from-red-500/0 via-red-500/0 to-red-500/0 group-hover:from-red-500/10 group-hover:via-red-500/5 group-hover:to-red-500/10 transition-all duration-500" />
              
              <CardContent className="p-8 relative z-10">
                <div className="relative mb-6">
                  <div className="absolute inset-0 bg-red-500/20 rounded-2xl blur-xl group-hover:bg-red-500/30 transition-all duration-500" />
                  <div className="relative w-16 h-16 rounded-2xl bg-gradient-to-br from-red-500/20 to-red-600/20 border-2 border-red-500/30 flex items-center justify-center group-hover:scale-110 group-hover:rotate-3 transition-all duration-500">
                    <svg className="w-8 h-8 text-red-400 group-hover:text-red-300 transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                    </svg>
                  </div>
                </div>
                <h3 className="text-2xl font-bold text-slate-100 mb-3 group-hover:text-red-100 transition-colors">
                  Bank-Level Security
                </h3>
                <p className="text-sm md:text-base text-slate-400 leading-relaxed group-hover:text-slate-300 transition-colors">
                  Your funds are protected with industry-leading encryption and security protocols
                </p>
              </CardContent>
            </Card>
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

        {/* Testimonials */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Card className="glass-card rounded-2xl border border-slate-800/50 bg-gradient-to-br from-slate-900/90 via-slate-950/90 to-slate-900/90 backdrop-blur-sm shadow-xl">
            <CardContent className="p-6">
              <div className="flex items-center gap-1 mb-4">
                {[...Array(5)].map((_, i) => (
                  <svg key={i} className="w-5 h-5 text-amber-400" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                  </svg>
                ))}
              </div>
              <p className="text-slate-300 mb-4 leading-relaxed">
                "I've been investing for 6 months and already seeing consistent returns. The platform is intuitive and the support team is always helpful."
              </p>
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-500 to-cyan-500 flex items-center justify-center text-white font-bold">
                  SM
                </div>
                <div>
                  <p className="font-semibold text-slate-100">Sarah Mitchell</p>
                  <p className="text-xs text-slate-500">Active Investor</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="glass-card rounded-2xl border border-slate-800/50 bg-gradient-to-br from-slate-900/90 via-slate-950/90 to-slate-900/90 backdrop-blur-sm shadow-xl">
            <CardContent className="p-6">
              <div className="flex items-center gap-1 mb-4">
                {[...Array(5)].map((_, i) => (
                  <svg key={i} className="w-5 h-5 text-amber-400" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                  </svg>
                ))}
              </div>
              <p className="text-slate-300 mb-4 leading-relaxed">
                "The AI insights have helped me optimize my portfolio significantly. Returns are better than I expected, and the process is completely automated."
              </p>
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-amber-500 to-orange-500 flex items-center justify-center text-white font-bold">
                  JD
                </div>
                <div>
                  <p className="font-semibold text-slate-100">James Davis</p>
                  <p className="text-xs text-slate-500">Premium Investor</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* AI-Powered Trading Bots Section */}
      <section className="py-16 md:py-20 relative overflow-hidden">
        {/* Animated background effects */}
        <div className="absolute inset-0 bg-gradient-to-br from-blue-950/30 via-purple-950/20 to-cyan-950/30" />
        <div className="absolute top-1/4 left-0 w-72 h-72 bg-blue-500/10 rounded-full blur-3xl animate-pulse" />
        <div className="absolute bottom-1/4 right-0 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }} />
        
        <div className="relative z-10">
          {/* Section Header */}
          <div className="text-center mb-12 md:mb-16">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-gradient-to-r from-blue-500/10 to-purple-500/10 border border-blue-500/20 mb-6">
              <svg className="w-5 h-5 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
              </svg>
              <span className="text-sm font-semibold text-blue-300">AI-Powered Trading</span>
            </div>
            <h2 className="text-3xl md:text-5xl font-bold text-slate-100 mb-4">
              Our Automation Suite
            </h2>
            <p className="text-base md:text-lg text-slate-400 max-w-3xl mx-auto leading-relaxed">
              Multiple trading engines, one platform. Powered by advanced AI algorithms that analyze market patterns 24/7 to maximize your returns.
            </p>
          </div>

          {/* Bot Cards Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6 mb-8">
            {/* FOREX BOT (ACTIVE) */}
            <Card className="group relative flex flex-col justify-between border-2 border-emerald-500/40 bg-gradient-to-br from-slate-950/95 via-emerald-950/20 to-slate-900/80 shadow-[0_0_32px_rgba(16,185,129,0.25)] hover:border-emerald-500/60 hover:shadow-[0_0_40px_rgba(16,185,129,0.4)] transition-all duration-300 overflow-hidden">
              {/* Animated background pattern */}
              <div className="absolute inset-0 opacity-10">
                <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-400 rounded-full blur-2xl animate-pulse" />
              </div>
              
              <CardContent className="p-6 relative z-10">
                <div className="flex items-start justify-between gap-3 mb-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <div className="w-10 h-10 rounded-xl bg-emerald-500/20 border border-emerald-500/30 flex items-center justify-center">
                        <svg className="w-6 h-6 text-emerald-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                        </svg>
                      </div>
                      <h3 className="text-lg font-bold text-emerald-300">Forex Auto Trading Bot</h3>
                    </div>
                    <p className="text-sm text-slate-400 leading-relaxed mb-4">
                      Live bot trading XAU/USD and major FX pairs 24/5 with AI-powered market analysis.
                    </p>
                  </div>
                  <span className="shrink-0 rounded-full border border-emerald-500/70 bg-emerald-500/20 px-3 py-1.5 text-[10px] font-bold uppercase tracking-wider text-emerald-300 shadow-[0_0_12px_rgba(16,185,129,0.5)] animate-pulse">
                    Active
                  </span>
                </div>

                <div className="space-y-3 mb-4">
                  <div className="flex items-center gap-2 text-sm">
                    <div className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></div>
                    <span className="text-slate-200"><span className="font-bold text-emerald-300">3%</span> daily • 10 – 99 USDT</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm">
                    <div className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" style={{ animationDelay: '0.2s' }}></div>
                    <span className="text-slate-200"><span className="font-bold text-emerald-300">5%</span> daily • 100 – 999 USDT</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm">
                    <div className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" style={{ animationDelay: '0.4s' }}></div>
                    <span className="text-slate-200"><span className="font-bold text-emerald-300">7%</span> daily • 1,000+ USDT</span>
                  </div>
                </div>

                <div className="pt-3 border-t border-slate-800/50 mb-4">
                  <p className="text-xs text-slate-400 leading-relaxed">
                    Referral bonus: <span className="font-semibold text-emerald-300">5%</span> of your invitee&apos;s first deposit. Profits paid only on trading days (Mon–Fri).
                  </p>
                </div>

                <Button
                  onClick={() => router.push("/register")}
                  className="w-full h-11 rounded-xl bg-gradient-to-r from-emerald-500 to-emerald-600 text-sm font-bold text-white hover:from-emerald-400 hover:to-emerald-500 shadow-[0_4px_16px_rgba(16,185,129,0.4)] hover:shadow-[0_6px_20px_rgba(16,185,129,0.6)] transition-all duration-200"
                >
                  Start with Forex bot
                </Button>
              </CardContent>
            </Card>

            {/* CRYPTO AUTO TRADING (COMING SOON) */}
            <Card className="group relative flex flex-col justify-between border border-sky-500/30 bg-gradient-to-br from-slate-950/95 via-sky-950/20 to-slate-900/80 hover:border-sky-500/50 hover:shadow-[0_0_24px_rgba(56,189,248,0.2)] transition-all duration-300 overflow-hidden">
              <div className="absolute inset-0 opacity-10">
                <div className="absolute top-0 right-0 w-32 h-32 bg-sky-400 rounded-full blur-2xl" />
              </div>
              
              <CardContent className="p-6 relative z-10">
                <div className="flex items-start justify-between gap-3 mb-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <div className="w-10 h-10 rounded-xl bg-sky-500/20 border border-sky-500/30 flex items-center justify-center">
                        <svg className="w-6 h-6 text-sky-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                      </div>
                      <h3 className="text-lg font-bold text-sky-300">Crypto Auto Trading</h3>
                    </div>
                    <p className="text-sm text-slate-400 leading-relaxed mb-4">
                      Automated spot & futures strategies on BTC, ETH and majors with machine learning optimization.
                    </p>
                  </div>
                  <span className="shrink-0 rounded-full border border-slate-700/80 bg-slate-900/90 px-3 py-1.5 text-[10px] font-bold uppercase tracking-wider text-slate-400">
                    Coming soon
                  </span>
                </div>

                <div className="space-y-3 mb-4">
                  <div className="flex items-center gap-2 text-sm">
                    <div className="w-2 h-2 rounded-full bg-sky-400/60"></div>
                    <span className="text-slate-200"><span className="font-bold text-sky-300">5%</span> daily • 10 – 99 USDT</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm">
                    <div className="w-2 h-2 rounded-full bg-sky-400/60"></div>
                    <span className="text-slate-200"><span className="font-bold text-sky-300">7%</span> daily • 100 – 999 USDT</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm">
                    <div className="w-2 h-2 rounded-full bg-sky-400/60"></div>
                    <span className="text-slate-200"><span className="font-bold text-sky-300">10%</span> daily • 1,000+ USDT</span>
                  </div>
                </div>

                <div className="pt-3 border-t border-slate-800/50">
                  <p className="text-xs text-slate-400 leading-relaxed">
                    5% referral rewards will also apply here. Early investors will get priority access when the crypto engine goes live.
                  </p>
                </div>
              </CardContent>
            </Card>

            {/* ARBITRAGE BOT (COMING SOON) */}
            <Card className="group relative flex flex-col justify-between border border-amber-500/30 bg-gradient-to-br from-slate-950/95 via-amber-950/20 to-slate-900/80 hover:border-amber-500/50 hover:shadow-[0_0_24px_rgba(245,158,11,0.2)] transition-all duration-300 overflow-hidden">
              <div className="absolute inset-0 opacity-10">
                <div className="absolute top-0 right-0 w-32 h-32 bg-amber-400 rounded-full blur-2xl" />
              </div>
              
              <CardContent className="p-6 relative z-10">
                <div className="flex items-start justify-between gap-3 mb-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <div className="w-10 h-10 rounded-xl bg-amber-500/20 border border-amber-500/30 flex items-center justify-center">
                        <svg className="w-6 h-6 text-amber-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
                        </svg>
                      </div>
                      <h3 className="text-lg font-bold text-amber-300">Crypto Arbitrage Bot</h3>
                    </div>
                    <p className="text-sm text-slate-400 leading-relaxed mb-4">
                      Captures price gaps between exchanges with market-neutral strategies powered by real-time AI analysis.
                    </p>
                  </div>
                  <span className="shrink-0 rounded-full border border-slate-700/80 bg-slate-900/90 px-3 py-1.5 text-[10px] font-bold uppercase tracking-wider text-slate-400">
                    Coming soon
                  </span>
                </div>

                <div className="rounded-xl border-2 border-amber-500/30 bg-gradient-to-br from-amber-500/10 to-amber-500/5 p-4 mb-4 backdrop-blur-sm">
                  <div className="flex items-center gap-2 mb-1">
                    <svg className="w-5 h-5 text-amber-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                    </svg>
                    <p className="text-sm font-semibold text-slate-100">
                      Target ROI: <span className="text-2xl font-bold text-amber-300">up to 200%</span>
                    </p>
                  </div>
                  <p className="text-xs text-amber-300/80">per strategy cycle</p>
                </div>

                <div className="pt-3 border-t border-slate-800/50">
                  <p className="text-xs text-slate-400 leading-relaxed">
                    Focused on low-risk, high-frequency trades around spreads and funding mis-pricings. Ideal for investors who prefer smoother equity curves.
                  </p>
                </div>
              </CardContent>
            </Card>

            {/* CRYPTO SNIPER BOT (COMING SOON) */}
            <Card className="group relative flex flex-col justify-between border border-fuchsia-500/30 bg-gradient-to-br from-slate-950/95 via-fuchsia-950/20 to-slate-900/80 hover:border-fuchsia-500/50 hover:shadow-[0_0_24px_rgba(217,70,239,0.2)] transition-all duration-300 overflow-hidden">
              <div className="absolute inset-0 opacity-10">
                <div className="absolute top-0 right-0 w-32 h-32 bg-fuchsia-400 rounded-full blur-2xl" />
              </div>
              
              <CardContent className="p-6 relative z-10">
                <div className="flex items-start justify-between gap-3 mb-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <div className="w-10 h-10 rounded-xl bg-fuchsia-500/20 border border-fuchsia-500/30 flex items-center justify-center">
                        <svg className="w-6 h-6 text-fuchsia-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                        </svg>
                      </div>
                      <h3 className="text-lg font-bold text-fuchsia-300">Crypto Sniper Bot</h3>
                    </div>
                    <p className="text-sm text-slate-400 leading-relaxed mb-4">
                      High-volatility breakout system for aggressive upside on trending coins with AI pattern recognition.
                    </p>
                  </div>
                  <span className="shrink-0 rounded-full border border-slate-700/80 bg-slate-900/90 px-3 py-1.5 text-[10px] font-bold uppercase tracking-wider text-slate-400">
                    Coming soon
                  </span>
                </div>

                <div className="rounded-xl border-2 border-fuchsia-500/30 bg-gradient-to-br from-fuchsia-500/10 to-fuchsia-500/5 p-4 mb-4 backdrop-blur-sm">
                  <div className="flex items-center gap-2 mb-1">
                    <svg className="w-5 h-5 text-fuchsia-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                    </svg>
                    <p className="text-sm font-semibold text-slate-100">
                      Target ROI: <span className="text-2xl font-bold text-fuchsia-300">up to 300%</span>
                    </p>
                  </div>
                  <p className="text-xs text-fuchsia-300/80">per high-risk cycle</p>
                </div>

                <div className="pt-3 border-t border-slate-800/50">
                  <p className="text-xs text-slate-400 leading-relaxed">
                    Built for advanced investors comfortable with deeper drawdowns in exchange for potentially explosive returns on strong market trends.
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Footer Note */}
          <div className="pt-6 mt-8 border-t border-slate-800/50">
            <p className="text-xs text-slate-500 leading-relaxed text-center max-w-3xl mx-auto">
              All ROI figures are strategy targets only and depend on market conditions and risk settings. Capital is subject to trading risk; never invest funds you cannot afford to keep in long-term programs.
            </p>
          </div>
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
