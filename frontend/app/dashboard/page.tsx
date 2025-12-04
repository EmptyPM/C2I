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
            <Card className="glass-card">
              <CardHeader className="pb-2 px-4 sm:px-6">
                <p className="text-[10px] sm:text-xs uppercase tracking-[0.2em] text-slate-500">
                  Trading Balance
                </p>
              </CardHeader>
              <CardContent className="px-4 sm:px-6">
                <p className="text-xl sm:text-2xl font-semibold text-slate-50">
                  {formatUSDT(user.tradingBalance)} <span className="text-[10px] sm:text-xs text-slate-400">USDT</span>
                </p>
                <p className="mt-2 text-[10px] sm:text-xs text-slate-400">
                  Funds allocated for trades.
                </p>
              </CardContent>
            </Card>

            <Card className="glass-card">
              <CardHeader className="pb-2 px-4 sm:px-6">
                <p className="text-[10px] sm:text-xs uppercase tracking-[0.2em] text-slate-500">
                  Profit Wallet
                </p>
              </CardHeader>
              <CardContent className="px-4 sm:px-6">
                <p className="text-xl sm:text-2xl font-semibold text-[#4fd1ff]">
                  {formatUSDT(user.profitBalance)} <span className="text-[10px] sm:text-xs text-slate-400">USDT</span>
                </p>
                <p className="text-[10px] sm:text-xs text-slate-400 mt-2">
                  Daily returns ready to withdraw.
                </p>
              </CardContent>
            </Card>

            <Card className="glass-card sm:col-span-2 md:col-span-1">
              <CardHeader className="pb-2 px-4 sm:px-6">
                <p className="text-[10px] sm:text-xs uppercase tracking-[0.2em] text-slate-500">
                  Referral Wallet
                </p>
              </CardHeader>
              <CardContent className="px-4 sm:px-6">
                <p className="text-xl sm:text-2xl font-semibold text-[#ffb020]">
                  {formatUSDT(user.referralBalance)} <span className="text-[10px] sm:text-xs text-slate-400">USDT</span>
                </p>
                <p className="text-[10px] sm:text-xs text-slate-400 mt-2">
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
              <div className="glass-card rounded-2xl border border-slate-800 bg-slate-950/70 px-4 py-3">
                <div className="flex items-center justify-between mb-1">
                  <p className="text-[11px] uppercase tracking-wide text-slate-400">
                    Active Users
                  </p>
                <div className="inline-flex items-center rounded-full bg-slate-900/80 px-2.5 sm:px-3 py-1 text-[10px] sm:text-xs text-slate-300 border border-slate-700/60">
                  <span className="mr-1 h-1.5 w-1.5 rounded-full bg-emerald-400" />
                  Live
                  </div>
                </div>
                <p className="mt-1 text-2xl font-semibold text-sky-300">
                  {getSimulatedUserCount().toLocaleString()}
                </p>
              </div>
              
              {/* Total Invested card */}
              <TotalInvested />
            </div>

            {/* Live Trading Console */}
            <TradingSimulationConsole />
          </section>

          {/* Bot Programs Teaser Section */}
          <BotProgramsTeaserSection />

        </>
      )}

    </main>
  );
}
