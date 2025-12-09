export default function RiskDisclosurePage() {
  return (
    <main className="min-h-screen py-8 px-4">
      <div className="mx-auto max-w-4xl">
        <div className="glass-card rounded-2xl border border-slate-800 bg-slate-950/80 p-6 sm:p-8 md:p-12">
          <h1 className="text-2xl sm:text-3xl font-bold text-slate-50 mb-2">
            Risk Disclosure Statement
          </h1>
          <p className="text-sm text-slate-400 mb-8">
            Last Updated: December 2025
          </p>

          <div className="space-y-8 text-slate-300">
            {/* Warning Banner */}
            <div className="bg-amber-500/10 border border-amber-500/30 rounded-xl p-4">
              <div className="flex items-start gap-3">
                <svg className="w-6 h-6 text-amber-400 flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                </svg>
                <div>
                  <p className="font-semibold text-amber-300 mb-1">Important Risk Warning</p>
                  <p className="text-sm text-amber-200/90">
                    Trading and investing in digital assets involves substantial risk. You should only invest funds you can afford to lose entirely.
                  </p>
                </div>
              </div>
            </div>

            {/* Section 1 */}
            <section>
              <h2 className="text-xl font-semibold text-slate-100 mb-3">
                1. General Trading Risk
              </h2>
              <p className="leading-relaxed mb-3">
                Digital asset trading involves risk. Prices can be volatile and unpredictable.
              </p>
              <p className="leading-relaxed font-semibold text-amber-400">
                You should invest only what you can afford to lose.
              </p>
            </section>

            {/* Section 2 */}
            <section>
              <h2 className="text-xl font-semibold text-slate-100 mb-3">
                2. Bot Performance Risk
              </h2>
              <p className="leading-relaxed mb-3">
                Our automated bots (Forex, Crypto, Arbitrage, Sniper) perform strategies based on internal logic.
              </p>
              <p className="mb-3">There is no guarantee that:</p>
              <ul className="list-disc list-inside space-y-2 ml-4">
                <li>profits will continue at past levels</li>
                <li>market conditions remain stable</li>
                <li>systems perform without error</li>
              </ul>
              <p className="leading-relaxed mt-3 font-semibold text-red-400">
                Simulations do not represent real financial performance.
              </p>
            </section>

            {/* Section 3 */}
            <section>
              <h2 className="text-xl font-semibold text-slate-100 mb-3">
                3. Platform Risk
              </h2>
              <p className="mb-3">The Platform may experience:</p>
              <ul className="list-disc list-inside space-y-2 ml-4">
                <li>technical errors</li>
                <li>delayed transactions</li>
                <li>WebSocket disconnects</li>
                <li>server downtime</li>
                <li>stuck jobs (cron)</li>
                <li>incorrect bot signals</li>
                <li>delayed profit calculations</li>
              </ul>
              <p className="leading-relaxed mt-3">
                We attempt to minimize such issues but cannot eliminate them completely.
              </p>
            </section>

            {/* Section 4 */}
            <section>
              <h2 className="text-xl font-semibold text-slate-100 mb-3">
                4. Regulatory Risk
              </h2>
              <p className="leading-relaxed mb-3">
                Crypto regulations vary by country. Using this Platform may not be permitted in your jurisdiction.
              </p>
              <p className="leading-relaxed font-semibold text-amber-400">
                You are responsible for ensuring local compliance.
              </p>
            </section>

            {/* Section 5 */}
            <section>
              <h2 className="text-xl font-semibold text-slate-100 mb-3">
                5. Deposit & Withdrawal Risk
              </h2>
              <div className="bg-red-500/10 border border-red-500/30 rounded-lg p-4 mb-3">
                <p className="font-semibold text-red-300">
                  Deposits are locked and cannot be withdrawn. Only profits can be withdrawn.
                </p>
              </div>
              <p className="mb-3">Admin approval is required for:</p>
              <ul className="list-disc list-inside space-y-2 ml-4">
                <li>Deposits</li>
                <li>Withdrawals</li>
              </ul>
              <p className="mb-3 mt-3">There may be delays due to:</p>
              <ul className="list-disc list-inside space-y-2 ml-4">
                <li>manual verification</li>
                <li>network congestion</li>
                <li>compliance checks</li>
              </ul>
            </section>

            {/* Section 6 */}
            <section>
              <h2 className="text-xl font-semibold text-slate-100 mb-3">
                6. Market Data Risk
              </h2>
              <p className="leading-relaxed mb-3">
                Real-time forex prices in the system are from external APIs.
              </p>
              <p className="mb-3">We cannot guarantee:</p>
              <ul className="list-disc list-inside space-y-2 ml-4">
                <li>accuracy</li>
                <li>completeness</li>
                <li>real-time updates</li>
                <li>uninterrupted availability</li>
              </ul>
            </section>

            {/* Section 7 */}
            <section>
              <h2 className="text-xl font-semibold text-slate-100 mb-3">
                7. Referral Program Risk
              </h2>
              <p className="mb-3">Referral bonuses depend on:</p>
              <ul className="list-disc list-inside space-y-2 ml-4">
                <li>referred user deposits</li>
                <li>system rules</li>
                <li>anti-fraud checks</li>
              </ul>
              <p className="leading-relaxed mt-3">
                Referral abuse results in account termination.
              </p>
            </section>

            {/* Section 8 */}
            <section>
              <h2 className="text-xl font-semibold text-slate-100 mb-3">
                8. No Guarantee of Returns
              </h2>
              <p className="mb-3">Even though fixed profit tiers exist:</p>
              <ul className="list-disc list-inside space-y-2 ml-4">
                <li>profits are not guaranteed</li>
                <li>the platform does not assure long-term performance</li>
                <li>the platform is not a bank or regulated financial advisor</li>
              </ul>
              <div className="bg-slate-900/60 border border-slate-800 rounded-lg p-4 mt-4">
                <h4 className="text-sm font-semibold text-slate-200 mb-2">Current Profit Tiers:</h4>
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-slate-700">
                      <th className="text-left py-2 text-slate-400 font-medium">Balance Range</th>
                      <th className="text-right py-2 text-slate-400 font-medium">Daily Rate</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr className="border-b border-slate-800">
                      <td className="py-2">10–99 USDT</td>
                      <td className="text-right">3%</td>
                    </tr>
                    <tr className="border-b border-slate-800">
                      <td className="py-2">100–999 USDT</td>
                      <td className="text-right">5%</td>
                    </tr>
                    <tr>
                      <td className="py-2">1,000+ USDT</td>
                      <td className="text-right">7%</td>
                    </tr>
                  </tbody>
                </table>
                <p className="text-xs text-slate-500 mt-3">
                  * Rates are subject to change. Profits calculated Mon-Fri only.
                </p>
              </div>
            </section>

            {/* Section 9 */}
            <section>
              <h2 className="text-xl font-semibold text-slate-100 mb-3">
                9. User Responsibility
              </h2>
              <p className="mb-3">By using the Platform, you acknowledge:</p>
              <ul className="list-disc list-inside space-y-2 ml-4">
                <li>You understand all risks</li>
                <li>You take full responsibility for your investments</li>
                <li>You will not hold the Platform or its team liable for losses</li>
              </ul>
            </section>

            {/* Final Warning */}
            <div className="bg-red-500/10 border-2 border-red-500/30 rounded-xl p-6 mt-8">
              <div className="flex items-start gap-3">
                <svg className="w-8 h-8 text-red-400 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                </svg>
                <div>
                  <p className="font-bold text-red-300 text-lg mb-2">
                    Investment Warning
                  </p>
                  <p className="text-red-200 leading-relaxed">
                    Cryptocurrency and forex trading carries substantial risk of loss. Past performance does not guarantee future results. 
                    You should carefully consider whether trading is appropriate for you based on your experience, objectives, and financial resources. 
                    Never invest money you cannot afford to lose.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}










