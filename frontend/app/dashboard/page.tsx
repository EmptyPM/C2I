'use client';

import { useEffect, useState, FormEvent } from 'react';
import { useRouter } from 'next/navigation';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { api } from '@/lib/api-client';
import { useCurrentUser } from '@/hooks/useCurrentUser';
import { Trc20DepositPanel } from '@/components/Trc20DepositPanel';
import { LiveDailyProfit } from '@/components/LiveDailyProfit';
import { TradingSimulationConsole } from '@/components/TradingSimulationConsole';
import { InvestmentPackagesSection } from '@/components/dashboard/InvestmentPackagesSection';
import { LiveFxPrices } from '@/components/dashboard/LiveFxPrices';
import { TotalInvested } from '@/components/dashboard/TotalInvested';
import { BotProgramsTeaserSection } from '@/components/dashboard/BotProgramsTeaserSection';
import { getSimulatedUserCount } from '@/lib/simulatedUserCount';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';

type DashboardUser = {
  id: number;
  email: string;
  referralCode: string;
  role: string;
  status: string;
  tradingBalance: string | number;
  profitBalance: string | number;
  referralBalance: string | number;
  createdAt: string;
  updatedAt: string;
};

type Deposit = {
  id: number;
  amount: string | number;
  txHash: string;
  status: string;
  createdAt: string;
  approvedAt?: string | null;
};

type Withdrawal = {
  id: number;
  amount: string | number;
  fee: string | number;
  netAmount: string | number;
  source: string;
  walletAddress: string | null;
  status: string;
  createdAt: string;
  processedAt?: string | null;
};

type ReferralSummary = {
  referralCode: string;
  referralBalance: string;
  totalBonusesCount: number;
  totalBonusesAmount: string;
  referredUsersCount: number;
};

type ReferralBonusItem = {
  id: number;
  amount: string;
  createdAt: string;
  fromUser: {
    id: number;
    email: string;
  };
};

type WalletTransfer = {
  id: number;
  from: "REFERRAL" | "PROFIT";
  to: "PROFIT" | "TRADING";
  amount: string | number;
  createdAt: string;
};

async function fetchCurrentUser(): Promise<DashboardUser> {
  const res = await api.get('/users/me');
  return res.data;
}

async function fetchMyDeposits(): Promise<Deposit[]> {
  const res = await api.get('/deposits/my');
  return res.data;
}

async function fetchMyWithdrawals(): Promise<Withdrawal[]> {
  const res = await api.get('/withdrawals/my');
  return res.data;
}

async function fetchReferralSummary(): Promise<ReferralSummary> {
  const res = await api.get('/referrals/summary');
  return res.data as ReferralSummary;
}

async function fetchReferralBonuses(): Promise<ReferralBonusItem[]> {
  const res = await api.get('/referrals/bonuses/my');
  return res.data as ReferralBonusItem[];
}

function formatBalance(value: string | number): string {
  const num = typeof value === 'string' ? parseFloat(value) : value;
  return `${num.toFixed(2)} USDT`;
}

function formatUSDT(value: string | number): string {
  const num = typeof value === 'string' ? parseFloat(value) : value;
  return isNaN(num) ? '0.00' : num.toFixed(2);
}

function shortenTxHash(txHash: string): string {
  if (txHash.length <= 13) return txHash;
  return `${txHash.substring(0, 10)}...`;
}

export default function DashboardPage() {
  const router = useRouter();
  const queryClient = useQueryClient();
  const [hasToken, setHasToken] = useState(false);
  const [isClient, setIsClient] = useState(false);

  // Deposit form state
  const [amount, setAmount] = useState('');
  const [txHash, setTxHash] = useState('');
  const [formError, setFormError] = useState<string | null>(null);

  // Withdrawal form state
  const [withdrawAmount, setWithdrawAmount] = useState('');
  const [withdrawWalletAddress, setWithdrawWalletAddress] = useState('');
  const [withdrawError, setWithdrawError] = useState<string | null>(null);

  // Referral copy link state
  const [copied, setCopied] = useState(false);

  // Transfer modal state
  const [transferType, setTransferType] =
    useState<"REFERRAL_TO_PROFIT" | "PROFIT_TO_TRADING" | null>(null);
  const [transferAmount, setTransferAmount] = useState("");
  const [transferError, setTransferError] = useState<string | null>(null);

  // Check for accessToken on client side only
  useEffect(() => {
    setIsClient(true);
    const token = localStorage.getItem('accessToken');
    if (!token) {
      router.push('/login');
    } else {
      setHasToken(true);
    }
  }, [router]);

  const { data: user, isLoading, isError } = useCurrentUser();

  const {
    data: deposits,
    isLoading: depositsLoading,
    isError: depositsError,
  } = useQuery({
    queryKey: ['myDeposits'],
    queryFn: fetchMyDeposits,
    enabled: isClient && hasToken,
  });

  const {
    data: withdrawals,
    isLoading: withdrawalsLoading,
    isError: withdrawalsError,
  } = useQuery({
    queryKey: ['myWithdrawals'],
    queryFn: fetchMyWithdrawals,
    enabled: isClient && hasToken,
  });

  const {
    data: referralSummary,
    isLoading: referralSummaryLoading,
    isError: referralSummaryError,
  } = useQuery({
    queryKey: ['referralSummary'],
    queryFn: fetchReferralSummary,
    enabled: isClient && hasToken,
  });

  const {
    data: referralBonuses,
    isLoading: referralBonusesLoading,
    isError: referralBonusesError,
  } = useQuery({
    queryKey: ['referralBonuses'],
    queryFn: fetchReferralBonuses,
    enabled: isClient && hasToken,
  });

  const {
    data: transfers,
    isLoading: transfersLoading,
    isError: transfersError,
  } = useQuery<WalletTransfer[]>({
    queryKey: ["walletTransfers"],
    queryFn: async () => {
      const res = await api.get("/wallet/transfers");
      return res.data;
    },
    enabled: isClient && hasToken,
  });

  const createDepositMutation = useMutation({
    mutationFn: (data: { amount: number; txHash: string }) =>
      api.post('/deposits', data).then((res) => res.data),
    onSuccess: () => {
      setAmount('');
      setTxHash('');
      setFormError(null);
      queryClient.invalidateQueries({ queryKey: ['myDeposits'] });
    },
    onError: (err: any) => {
      setFormError(
        err.response?.data?.message || 'Failed to create deposit. Please try again.'
      );
    },
  });

  const transferMutation = useMutation({
    mutationFn: async () => {
      return api.post("/wallet/transfer", {
        type: transferType,
        amount: Number(transferAmount),
      });
    },
    onSuccess: () => {
      setTransferAmount("");
      setTransferError(null);
      setTransferType(null);
      queryClient.invalidateQueries({ queryKey: ["currentUser"] });
      queryClient.invalidateQueries({ queryKey: ["walletTransfers"] });
    },
    onError: (err: any) => {
      const msg =
        err?.response?.data?.message ||
        "Transfer failed.";
      setTransferError(Array.isArray(msg) ? msg.join(", ") : msg);
    },
  });

  const createWithdrawalMutation = useMutation({
    mutationFn: async () => {
      return api.post('/withdrawals', {
        amount: Number(withdrawAmount),
        source: 'PROFIT',
        walletAddress: withdrawWalletAddress,
      }).then((res) => res.data as Withdrawal);
    },
    onSuccess: () => {
      setWithdrawAmount('');
      setWithdrawWalletAddress('');
      setWithdrawError(null);
      queryClient.invalidateQueries({ queryKey: ['myWithdrawals'] });
      queryClient.invalidateQueries({ queryKey: ['currentUser'] });
    },
    onError: (err: any) => {
      setWithdrawError(
        err.response?.data?.message || 'Failed to create withdrawal. Please try again.'
      );
    },
  });

  const handleSubmitDeposit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setFormError(null);

    // Validation
    const amountNum = parseFloat(amount);
    if (isNaN(amountNum) || amountNum < 10) {
      setFormError('Amount must be at least 10 USDT');
      return;
    }

    if (!txHash.trim()) {
      setFormError('TX Hash is required');
      return;
    }

    createDepositMutation.mutate({
      amount: amountNum,
      txHash: txHash.trim(),
    });
  };

  const handleSubmitWithdrawal = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setWithdrawError(null);

    // Validation
    const amountNum = parseFloat(withdrawAmount);
    if (isNaN(amountNum) || amountNum < 10) {
      setWithdrawError('Amount must be at least 10 USDT');
      return;
    }


    if (!withdrawWalletAddress.trim()) {
      setWithdrawError('Wallet address is required');
      return;
    }

    createWithdrawalMutation.mutate();
  };

  const handleGoToLogin = () => {
    if (typeof window !== 'undefined') {
      localStorage.removeItem('accessToken');
      localStorage.removeItem('user');
    }
    router.push('/login');
  };

  const handleMax = () => {
    if (!user || !transferType) return;
    if (transferType === "REFERRAL_TO_PROFIT") {
      setTransferAmount(String(Number(user.referralBalance || 0)));
    } else {
      setTransferAmount(String(Number(user.profitBalance || 0)));
    }
  };

  const handleConfirmTransfer = (e: React.FormEvent) => {
    e.preventDefault();
    if (!transferType) return;

    const amount = Number(transferAmount);
    if (!amount || amount <= 0) {
      setTransferError("Enter a valid amount.");
      return;
    }
    setTransferError(null);
    transferMutation.mutate();
  };

  const handleCopyLink = async () => {
    if (typeof window !== 'undefined' && referralSummary) {
      const origin = window.location.origin;
      const referralLink = `${origin}/register?ref=${referralSummary.referralCode}`;

      try {
        if (navigator.clipboard && navigator.clipboard.writeText) {
          await navigator.clipboard.writeText(referralLink);
          setCopied(true);
          setTimeout(() => setCopied(false), 3000);
        } else {
          // Fallback for older browsers
          const textArea = document.createElement('textarea');
          textArea.value = referralLink;
          textArea.style.position = 'fixed';
          textArea.style.left = '-999999px';
          document.body.appendChild(textArea);
          textArea.select();
          document.execCommand('copy');
          document.body.removeChild(textArea);
          setCopied(true);
          setTimeout(() => setCopied(false), 3000);
        }
      } catch (err) {
        console.error('Failed to copy link:', err);
      }
    }
  };

  // Compute referral link (client-side only)
  const referralLink =
    typeof window !== 'undefined' && referralSummary
      ? `${window.location.origin}/register?ref=${referralSummary.referralCode}`
      : '';

  return (
    <main className="space-y-4 sm:space-y-6">
      {(!isClient || isLoading) && (
        <div className="space-y-4 sm:space-y-6">
          {/* Balance Cards Skeleton */}
          <div className="grid gap-3 sm:gap-4 grid-cols-1 sm:grid-cols-2 md:grid-cols-3">
            {[1, 2, 3].map((i) => (
              <Card key={i} className="glass-card">
                <CardHeader className="pb-2 px-4 sm:px-6">
                  <Skeleton className="h-4 w-32 bg-slate-800" />
                </CardHeader>
                <CardContent className="px-4 sm:px-6">
                  <Skeleton className="h-8 w-24 bg-slate-800" />
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      )}

      {isError && (
        <Card className="glass-card">
          <CardContent className="pt-6 px-4 sm:px-6">
            <div className="border border-red-500 bg-red-500/10 rounded-lg p-4 sm:p-6">
              <p className="text-red-200 mb-4 text-sm sm:text-base">
                Unable to load dashboard. Please try again.
              </p>
              <Button
                onClick={handleGoToLogin}
                className="w-full sm:w-auto h-9 rounded-full bg-sky-500 hover:bg-sky-400 text-xs font-semibold text-slate-950"
              >
                Go to Login
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {user && isClient && !isLoading && !isError && (
        <>
          {/* Page Header */}
          <section className="mb-4 sm:mb-6 flex flex-col gap-2 md:flex-row md:items-center md:justify-between">
            <div>
              <h1 className="text-lg sm:text-xl md:text-2xl font-semibold tracking-tight">
                Dashboard
              </h1>
              <p className="text-[10px] sm:text-xs text-slate-400">
                Track your balances, daily profit and activity.
              </p>
            </div>
            {/* Right side actions if needed */}
          </section>

          {/* Top row: balances + quick stats */}
          <section className="space-y-4">
            <div className="grid gap-3 sm:gap-4 grid-cols-1 sm:grid-cols-2 md:grid-cols-3">
            <Card className="glass-card rounded-2xl border border-slate-800/50 bg-gradient-to-br from-slate-900/90 via-slate-950/90 to-slate-900/90 backdrop-blur-sm shadow-xl hover:shadow-2xl transition-all duration-300">
              <CardHeader className="pb-3 px-5 sm:px-6 pt-5">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-blue-500/10 border border-blue-500/20 flex items-center justify-center">
                    <svg className="w-6 h-6 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                    </svg>
                  </div>
                  <p className="text-[10px] sm:text-xs uppercase tracking-[0.2em] text-slate-400 font-medium">
                    Trading Balance
                  </p>
                </div>
              </CardHeader>
              <CardContent className="px-5 sm:px-6 pb-5">
                <p className="text-2xl sm:text-3xl font-bold text-slate-50 tracking-tight mb-2">
                  {formatUSDT(user.tradingBalance)} <span className="text-sm font-semibold text-slate-400">USDT</span>
                </p>
                <p className="text-[11px] text-slate-500 leading-relaxed">
                  Funds allocated for trades.
                </p>
              </CardContent>
            </Card>

            <Card className="glass-card rounded-2xl border border-slate-800/50 bg-gradient-to-br from-slate-900/90 via-slate-950/90 to-slate-900/90 backdrop-blur-sm shadow-xl hover:shadow-2xl transition-all duration-300">
              <CardHeader className="pb-3 px-5 sm:px-6 pt-5">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-cyan-500/10 border border-cyan-500/20 flex items-center justify-center">
                    <svg className="w-6 h-6 text-cyan-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
                    </svg>
                  </div>
                  <p className="text-[10px] sm:text-xs uppercase tracking-[0.2em] text-slate-400 font-medium">
                    Profit Wallet
                  </p>
                </div>
              </CardHeader>
              <CardContent className="px-5 sm:px-6 pb-5">
                <p className="text-2xl sm:text-3xl font-bold text-[#4fd1ff] tracking-tight mb-2">
                  {formatUSDT(user.profitBalance)} <span className="text-sm font-semibold text-slate-400">USDT</span>
                </p>
                <p className="text-[11px] text-slate-500 leading-relaxed">
                  Daily returns ready to withdraw.
                </p>
              </CardContent>
            </Card>

            <Card className="glass-card sm:col-span-2 md:col-span-1 rounded-2xl border border-slate-800/50 bg-gradient-to-br from-slate-900/90 via-slate-950/90 to-slate-900/90 backdrop-blur-sm shadow-xl hover:shadow-2xl transition-all duration-300">
              <CardHeader className="pb-3 px-5 sm:px-6 pt-5">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center">
                    <svg className="w-6 h-6 text-amber-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                    </svg>
                  </div>
                  <p className="text-[10px] sm:text-xs uppercase tracking-[0.2em] text-slate-400 font-medium">
                    Referral Wallet
                  </p>
                </div>
              </CardHeader>
              <CardContent className="px-5 sm:px-6 pb-5">
                <p className="text-2xl sm:text-3xl font-bold text-[#ffb020] tracking-tight mb-2">
                  {formatUSDT(user.referralBalance)} <span className="text-sm font-semibold text-slate-400">USDT</span>
                </p>
                <p className="text-[11px] text-slate-500 leading-relaxed">
                  Bonuses earned from your network.
                </p>
              </CardContent>
            </Card>
            </div>

            {/* Investment Packages */}
            <InvestmentPackagesSection />

            {/* Today's live profit, Active Users and Total Invested row */}
            <div className="grid gap-3 sm:gap-4 grid-cols-1 md:grid-cols-3">
              {/* Today's live profit */}
              <LiveDailyProfit tradingBalance={Number(user?.tradingBalance || 0)} />

              {/* Active Users card */}
              <div className="glass-card rounded-2xl border border-slate-800/50 bg-gradient-to-br from-slate-900/90 via-slate-950/90 to-slate-900/90 backdrop-blur-sm px-5 py-4 shadow-xl hover:shadow-2xl transition-all duration-300 relative overflow-hidden">
                <div className="flex items-start justify-between mb-3 relative z-10">
                  <div className="flex items-center gap-2">
                    {/* Person icon */}
                    <div className="w-8 h-8 rounded-lg bg-purple-500/10 border border-purple-500/20 flex items-center justify-center">
                      <svg className="w-5 h-5 text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                      </svg>
                    </div>
                    <div>
                      <p className="text-[11px] uppercase tracking-wider text-slate-400 font-medium">
                        Active Users
                      </p>
                    </div>
                  </div>
                  <div className="inline-flex items-center rounded-full bg-emerald-500/10 px-2.5 py-1 text-[10px] font-medium text-emerald-300 border border-emerald-500/20">
                    <span className="mr-1.5 h-1.5 w-1.5 rounded-full bg-emerald-400 shadow-[0_0_6px_rgba(74,222,128,0.8)]" />
                    Live
                  </div>
                </div>
                <p className="text-2xl sm:text-3xl font-bold text-sky-300 tracking-tight relative z-10">
                  {getSimulatedUserCount().toLocaleString()}
                </p>
              </div>
              
              {/* Total Invested card */}
              <TotalInvested />
            </div>

            {/* Live Trading Console */}
            <div className="grid gap-3 sm:gap-4 grid-cols-1 md:grid-cols-2">
              <TradingSimulationConsole allowedPairs={["EUR/USD", "USD/JPY", "GBP/USD"]} title="Live Trading Console (Currencies)" />
              <TradingSimulationConsole allowedPairs={["XAU/USD"]} title="Live Trading Console (Gold)" />
            </div>
          </section>

          {/* Bot Programs Teaser Section */}
          <BotProgramsTeaserSection />

        </>
      )}

    </main>
  );
}
