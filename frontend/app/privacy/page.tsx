export default function PrivacyPolicyPage() {
  return (
    <main className="min-h-screen py-8 px-4">
      <div className="mx-auto max-w-4xl">
        <div className="glass-card rounded-2xl border border-slate-800 bg-slate-950/80 p-6 sm:p-8 md:p-12">
          <h1 className="text-2xl sm:text-3xl font-bold text-slate-50 mb-2">
            Privacy Policy
          </h1>
          <p className="text-sm text-slate-400 mb-8">
            Last Updated: December 2025
          </p>

          <div className="space-y-8 text-slate-300">
            {/* Section 1 */}
            <section>
              <h2 className="text-xl font-semibold text-slate-100 mb-3">
                1. Overview
              </h2>
              <p className="leading-relaxed">
                This Privacy Policy explains how we collect, store, use, and protect your information when you use the Platform.
              </p>
            </section>

            {/* Section 2 */}
            <section>
              <h2 className="text-xl font-semibold text-slate-100 mb-3">
                2. Information We Collect
              </h2>
              
              <h3 className="text-lg font-medium text-slate-200 mb-2 mt-4">
                Account Information
              </h3>
              <ul className="list-disc list-inside space-y-2 ml-4">
                <li>First name, last name</li>
                <li>Email address</li>
                <li>Referral code</li>
                <li>Country</li>
                <li>Password (encrypted)</li>
              </ul>

              <h3 className="text-lg font-medium text-slate-200 mb-2 mt-4">
                Usage Data
              </h3>
              <ul className="list-disc list-inside space-y-2 ml-4">
                <li>Login logs</li>
                <li>Device information</li>
                <li>Wallet balances (trading, profit, referral)</li>
              </ul>

              <h3 className="text-lg font-medium text-slate-200 mb-2 mt-4">
                Blockchain Data
              </h3>
              <ul className="list-disc list-inside space-y-2 ml-4">
                <li>Deposit transaction hashes</li>
                <li>Withdrawal addresses</li>
              </ul>

              <h3 className="text-lg font-medium text-slate-200 mb-2 mt-4">
                System Data
              </h3>
              <ul className="list-disc list-inside space-y-2 ml-4">
                <li>Trading bot performance</li>
                <li>Daily profit logs</li>
                <li>API & WebSocket usage</li>
              </ul>
            </section>

            {/* Section 3 */}
            <section>
              <h2 className="text-xl font-semibold text-slate-100 mb-3">
                3. How We Use Your Information
              </h2>
              <p className="mb-3">We use user data to:</p>
              <ul className="list-disc list-inside space-y-2 ml-4">
                <li>Provide trading automation services</li>
                <li>Calculate daily profits</li>
                <li>Approve deposits & withdrawals</li>
                <li>Enhance platform performance</li>
                <li>Improve user experience</li>
                <li>Detect fraud or suspicious behavior</li>
                <li>Maintain account security</li>
                <li>Generate system analytics</li>
              </ul>
              <p className="leading-relaxed mt-3 font-semibold text-emerald-400">
                We do not sell user data.
              </p>
            </section>

            {/* Section 4 */}
            <section>
              <h2 className="text-xl font-semibold text-slate-100 mb-3">
                4. Cookies
              </h2>
              <p className="mb-3">We use cookies to:</p>
              <ul className="list-disc list-inside space-y-2 ml-4">
                <li>Maintain login sessions</li>
                <li>Improve performance</li>
                <li>Monitor dashboard usage</li>
              </ul>
            </section>

            {/* Section 5 */}
            <section>
              <h2 className="text-xl font-semibold text-slate-100 mb-3">
                5. Data Storage & Security
              </h2>
              <ul className="list-disc list-inside space-y-2 ml-4">
                <li>Passwords are hashed using industry-standard encryption</li>
                <li>Access tokens (JWT) are securely generated</li>
                <li>Database follows Prisma best practices</li>
                <li>Email reset tokens stored securely</li>
              </ul>
              <p className="leading-relaxed mt-3">
                We cannot guarantee absolute security due to the nature of the internet.
              </p>
            </section>

            {/* Section 6 */}
            <section>
              <h2 className="text-xl font-semibold text-slate-100 mb-3">
                6. How We Share Data
              </h2>
              <p className="mb-3">We may share limited data with:</p>
              <ul className="list-disc list-inside space-y-2 ml-4">
                <li>Payment processors</li>
                <li>Compliance or law enforcement (if legally required)</li>
                <li>Analytics providers</li>
                <li>Email service providers</li>
              </ul>
              <p className="leading-relaxed mt-3">
                We do not disclose private trading wallet balances publicly.
              </p>
            </section>

            {/* Section 7 */}
            <section>
              <h2 className="text-xl font-semibold text-slate-100 mb-3">
                7. User Rights
              </h2>
              <p className="mb-3">You may request:</p>
              <ul className="list-disc list-inside space-y-2 ml-4">
                <li>Account deletion</li>
                <li>Data correction</li>
                <li>Email change</li>
                <li>Password reset</li>
                <li>Download of your data</li>
              </ul>
            </section>

            {/* Section 8 */}
            <section>
              <h2 className="text-xl font-semibold text-slate-100 mb-3">
                8. Data Retention
              </h2>
              <p className="mb-3">We retain:</p>
              <ul className="list-disc list-inside space-y-2 ml-4">
                <li>Account data: until the account is deleted</li>
                <li>Logs: up to 12 months</li>
                <li>Profit & wallet history: permanently for auditing</li>
                <li>Transaction hashes: permanently</li>
              </ul>
            </section>

            {/* Section 9 */}
            <section>
              <h2 className="text-xl font-semibold text-slate-100 mb-3">
                9. Children's Privacy
              </h2>
              <p className="leading-relaxed">
                We do not allow users under 18.
              </p>
            </section>

            {/* Section 10 */}
            <section>
              <h2 className="text-xl font-semibold text-slate-100 mb-3">
                10. Updates
              </h2>
              <p className="leading-relaxed">
                We may revise this Privacy Policy. Updated versions take effect upon publication.
              </p>
            </section>
          </div>
        </div>
      </div>
    </main>
  );
}



















