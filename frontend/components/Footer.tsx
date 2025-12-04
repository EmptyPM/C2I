export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="w-full border-t border-slate-800 bg-slate-950/50 backdrop-blur-sm">
      <div className="mx-auto max-w-[1280px] px-4 py-8 md:py-12">
        <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
          {/* Company Info */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-slate-50">Fynex</h3>
            <p className="text-sm text-slate-400">
              Advanced cryptocurrency investment solutions with automated trading and real-time analytics.
            </p>
          </div>

          {/* Quick Links */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-slate-50">Quick Links</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <a href="/dashboard" className="text-slate-400 transition-colors hover:text-slate-200">
                  Dashboard
                </a>
              </li>
              <li>
                <a href="/account" className="text-slate-400 transition-colors hover:text-slate-200">
                  Account
                </a>
              </li>
              <li>
                <a href="/withdrawals" className="text-slate-400 transition-colors hover:text-slate-200">
                  Withdrawals
                </a>
              </li>
            </ul>
          </div>

          {/* Legal */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-slate-50">Legal</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <a href="/terms" className="text-slate-400 transition-colors hover:text-slate-200">
                  Terms of Service
                </a>
              </li>
              <li>
                <a href="/privacy" className="text-slate-400 transition-colors hover:text-slate-200">
                  Privacy Policy
                </a>
              </li>
              <li>
                <a href="/risk" className="text-slate-400 transition-colors hover:text-slate-200">
                  Risk Disclosure
                </a>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="mt-8 border-t border-slate-800 pt-8">
          <div className="flex flex-col items-center justify-between gap-4 text-sm text-slate-400 md:flex-row">
            <p>&copy; {currentYear} Fynex. All rights reserved.</p>
            <p className="text-xs">
              Trading cryptocurrencies carries risk. Past performance does not guarantee future results.
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
}



