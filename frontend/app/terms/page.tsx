export default function TermsOfServicePage() {
  return (
    <main className="min-h-screen py-8 px-4">
      <div className="mx-auto max-w-4xl">
        <div className="glass-card rounded-2xl border border-slate-800 bg-slate-950/80 p-6 sm:p-8 md:p-12">
          <h1 className="text-2xl sm:text-3xl font-bold text-slate-50 mb-2">
            Terms of Service
          </h1>
          <p className="text-sm text-slate-400 mb-8">
            Last Updated: December 2025
          </p>

          <div className="space-y-8 text-slate-300">
            {/* Section 1 */}
            <section>
              <h2 className="text-xl font-semibold text-slate-100 mb-3">
                1. Introduction
              </h2>
              <p className="leading-relaxed">
                Welcome to our automated trading and investment platform ("the Platform").
                By creating an account, accessing the website, or using any service offered by the Platform, you agree to these Terms of Service.
              </p>
              <p className="leading-relaxed mt-3">
                If you do not agree with these terms, please discontinue use of the Platform immediately.
              </p>
            </section>

            {/* Section 2 */}
            <section>
              <h2 className="text-xl font-semibold text-slate-100 mb-3">
                2. Eligibility
              </h2>
              <p className="mb-3">You must:</p>
              <ul className="list-disc list-inside space-y-2 ml-4">
                <li>Be at least 18 years old</li>
                <li>Not be restricted by local laws from participating in digital asset platforms</li>
                <li>Provide accurate information during registration</li>
                <li>Use the Platform only for lawful purposes</li>
              </ul>
              <p className="leading-relaxed mt-3">
                We reserve the right to refuse service to any user at our discretion.
              </p>
            </section>

            {/* Section 3 */}
            <section>
              <h2 className="text-xl font-semibold text-slate-100 mb-3">
                3. Nature of the Platform
              </h2>
              <p className="mb-3">The Platform provides:</p>
              <ul className="list-disc list-inside space-y-2 ml-4">
                <li>Automated trading bots (Forex, Crypto, Arbitrage, Sniper strategies)</li>
                <li>Fixed-rate investment packages</li>
                <li>Referral bonus programs</li>
                <li>User wallets (Trading Wallet, Profit Wallet, Referral Wallet)</li>
                <li>Daily profit calculations and trading simulations</li>
              </ul>
              <p className="leading-relaxed mt-3">
                The system does not provide financial advice, and we are not a licensed financial institution.
              </p>
              <p className="leading-relaxed mt-3">
                Users deposit USDT (TRC20), and profits are generated based on predefined rules, not guaranteed returns.
              </p>
            </section>

            {/* Section 4 */}
            <section>
              <h2 className="text-xl font-semibold text-slate-100 mb-3">
                4. Deposits & Profit Rules
              </h2>
              <ul className="list-disc list-inside space-y-2 ml-4 mb-3">
                <li>Minimum deposit: 10 USDT</li>
                <li>Deposits are locked and cannot be withdrawn</li>
              </ul>
              <p className="mb-3">Profits are calculated according to the tier system:</p>
              <div className="bg-slate-900/60 border border-slate-800 rounded-lg p-4 mb-3">
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
                      <td className="py-2">1000+ USDT</td>
                      <td className="text-right">7%</td>
                    </tr>
                  </tbody>
                </table>
              </div>
              <ul className="list-disc list-inside space-y-2 ml-4">
                <li>Profits are generated only on Monday–Friday (no weekends)</li>
                <li>Profits start the day after deposit approval</li>
              </ul>
              <p className="leading-relaxed mt-3">
                We reserve the right to adjust rates with prior notice.
              </p>
            </section>

            {/* Section 5 */}
            <section>
              <h2 className="text-xl font-semibold text-slate-100 mb-3">
                5. Withdrawals
              </h2>
              <ul className="list-disc list-inside space-y-2 ml-4">
                <li>Withdrawals are allowed from Profit Wallet only</li>
                <li>Minimum withdrawal: 10 USDT</li>
                <li>A 5% withdrawal fee applies</li>
                <li>Withdrawal requests must be manually approved by admins</li>
                <li>Withdrawal processing may take 24–72 hours</li>
              </ul>
              <p className="leading-relaxed mt-3">
                We may reject withdrawals if suspicious activity is detected.
              </p>
            </section>

            {/* Section 6 */}
            <section>
              <h2 className="text-xl font-semibold text-slate-100 mb-3">
                6. Referral Program
              </h2>
              <p className="mb-3">Users may earn:</p>
              <ul className="list-disc list-inside space-y-2 ml-4">
                <li>5% on direct referral's first deposit</li>
              </ul>
              <p className="mb-3 mt-3">Referral earnings cannot be withdrawn directly.</p>
              <p className="mb-3">Referral earnings can be:</p>
              <ul className="list-disc list-inside space-y-2 ml-4">
                <li>Transferred to Profit Wallet</li>
                <li>Reinvested into Trading Wallet</li>
              </ul>
              <p className="leading-relaxed mt-3">
                Fraudulent or fake referrals will be terminated without notice.
              </p>
            </section>

            {/* Section 7 */}
            <section>
              <h2 className="text-xl font-semibold text-slate-100 mb-3">
                7. User Responsibilities
              </h2>
              <p className="mb-3">You agree not to:</p>
              <ul className="list-disc list-inside space-y-2 ml-4">
                <li>Engage in fraud, abuse, or illegal activity</li>
                <li>Attempt to reverse engineer the Platform</li>
                <li>Create multiple accounts to game the system</li>
                <li>Misrepresent the Platform publicly</li>
                <li>Upload harmful content or malicious code</li>
              </ul>
              <p className="leading-relaxed mt-3">
                Violation may result in permanent ban without refund.
              </p>
            </section>

            {/* Section 8 */}
            <section>
              <h2 className="text-xl font-semibold text-slate-100 mb-3">
                8. System Availability
              </h2>
              <p className="mb-3">We strive for 24/7 uptime but do not guarantee:</p>
              <ul className="list-disc list-inside space-y-2 ml-4">
                <li>uninterrupted service</li>
                <li>error-free system</li>
                <li>accurate market data</li>
                <li>continuous trading bot activity</li>
              </ul>
              <p className="leading-relaxed mt-3">
                The Platform may undergo maintenance, updates, or downtime.
              </p>
            </section>

            {/* Section 9 */}
            <section>
              <h2 className="text-xl font-semibold text-slate-100 mb-3">
                9. Limitation of Liability
              </h2>
              <p className="mb-3">The Platform, its owners, and its team are not liable for:</p>
              <ul className="list-disc list-inside space-y-2 ml-4">
                <li>Any financial loss</li>
                <li>Market fluctuations</li>
                <li>Trading bot performance</li>
                <li>Delayed deposits or withdrawals</li>
                <li>Service interruptions</li>
                <li>Unauthorized account access</li>
              </ul>
              <p className="leading-relaxed mt-3 font-semibold text-amber-400">
                Users invest at their own risk.
              </p>
            </section>

            {/* Section 10 */}
            <section>
              <h2 className="text-xl font-semibold text-slate-100 mb-3">
                10. Account Termination
              </h2>
              <p className="mb-3">We may suspend or terminate accounts for:</p>
              <ul className="list-disc list-inside space-y-2 ml-4">
                <li>Fraud</li>
                <li>Abuse</li>
                <li>Multi-account manipulation</li>
                <li>Chargebacks</li>
                <li>Violation of these Terms</li>
              </ul>
              <p className="leading-relaxed mt-3">
                All decisions are final.
              </p>
            </section>

            {/* Section 11 */}
            <section>
              <h2 className="text-xl font-semibold text-slate-100 mb-3">
                11. Modifications
              </h2>
              <p className="leading-relaxed">
                The Platform may update these Terms at any time.
                Continued use constitutes acceptance of new Terms.
              </p>
            </section>

            {/* Section 12 */}
            <section>
              <h2 className="text-xl font-semibold text-slate-100 mb-3">
                12. Contact Information
              </h2>
              <p className="leading-relaxed">
                For support, contact the admin team through the in-platform support channel.
              </p>
            </section>
          </div>
        </div>
      </div>
    </main>
  );
}


