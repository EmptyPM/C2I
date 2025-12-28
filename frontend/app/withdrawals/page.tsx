'use client';

import { useState, useEffect, FormEvent, ChangeEvent } from 'react';
import { useRouter } from 'next/navigation';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { api } from '@/lib/api-client';
import { useCurrentUser } from '@/hooks/useCurrentUser';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';

type Withdrawal = {
  id: number;
  amount: string | number;
  fee: string | number;
  netAmount: string | number;
  source: 'PROFIT' | 'REFERRAL';
  status: 'PENDING' | 'APPROVED' | 'REJECTED';
  createdAt: string;
  processedAt?: string | null;
};

const fetchMyWithdrawals = async (): Promise<Withdrawal[]> => {
  const res = await api.get('/withdrawals/my');
  return res.data;
};

const formatBalance = (value: string | number): string => {
  const num = typeof value === 'string' ? parseFloat(value) : value;
  return isNaN(num) ? '0.00' : num.toFixed(2);
};

const formatDate = (dateString: string): string => {
  const date = new Date(dateString);
  return date.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
};

export default function WithdrawalsPage() {
  const router = useRouter();
  const queryClient = useQueryClient();
  const { data: user, isLoading: userLoading } = useCurrentUser();
  const [mounted, setMounted] = useState(false);

  const [amount, setAmount] = useState('');
  const [source, setSource] = useState<'PROFIT' | 'REFERRAL'>('PROFIT');
  const [walletAddress, setWalletAddress] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [walletAddressError, setWalletAddressError] = useState<string | null>(null);

  // TRC20 address validation function
  const validateTRC20Address = (address: string): boolean => {
    if (!address || !address.trim()) {
      return false;
    }
    const trimmed = address.trim();
    // TRC20 addresses start with 'T' and are exactly 34 characters long
    // They use base58 encoding (alphanumeric, excluding 0, O, I, l)
    const trc20Pattern = /^T[1-9A-HJ-NP-Za-km-z]{33}$/;
    return trc20Pattern.test(trimmed);
  };

  useEffect(() => {
    setMounted(true);
  }, []);

  // Redirect if not authenticated
  useEffect(() => {
    if (!userLoading && !user) {
      router.push('/login');
    }
  }, [user, userLoading, router]);

  const { data: withdrawals, isLoading: withdrawalsLoading } = useQuery({
    queryKey: ['myWithdrawals'],
    queryFn: fetchMyWithdrawals,
    enabled: !!user,
  });

  const createWithdrawalMutation = useMutation({
    mutationFn: async (data: { amount: number; source: 'PROFIT' | 'REFERRAL'; walletAddress: string }) => {
      const res = await api.post('/withdrawals', data);
      return res.data as Withdrawal;
    },
    onSuccess: () => {
      setAmount('');
      setWalletAddress('');
      setError(null);
      setWalletAddressError(null);
      queryClient.invalidateQueries({ queryKey: ['myWithdrawals'] });
      queryClient.invalidateQueries({ queryKey: ['currentUser'] });
    },
    onError: (err: any) => {
      setError(err.response?.data?.message || 'Failed to create withdrawal. Please try again.');
    },
  });

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError(null);
    setWalletAddressError(null);

    const amountNum = parseFloat(amount);
    if (isNaN(amountNum) || amountNum < 10) {
      setError('Amount must be at least 10 USDT');
      return;
    }

    if (!user) {
      setError('You must be logged in to withdraw');
      return;
    }

    if (!walletAddress.trim()) {
      setError('Wallet address is required');
      setWalletAddressError('Please enter your TRC20 wallet address.');
      return;
    }

    // Validate TRC20 address format
    if (!validateTRC20Address(walletAddress)) {
      setError('Invalid TRC20 wallet address format.');
      setWalletAddressError("TRC20 addresses must start with 'T' and be 34 characters long.");
      return;
    }

    // Check balance
    const availableBalance =
      source === 'PROFIT'
        ? parseFloat(String(user.profitBalance))
        : parseFloat(String(user.referralBalance));

    if (amountNum > availableBalance) {
      setError(`Insufficient balance. Available: ${formatBalance(availableBalance)}`);
      return;
    }

    createWithdrawalMutation.mutate({
      amount: amountNum,
      source,
      walletAddress: walletAddress.trim(),
    });
  };

  const handleWalletAddressChange = (e: ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setWalletAddress(value);
    setWalletAddressError(null);
    setError(null);
    
    // Real-time validation feedback
    if (value.trim() && !validateTRC20Address(value)) {
      setWalletAddressError('Invalid TRC20 address format');
    }
  };

  const availableProfitBalance = user
    ? parseFloat(String(user.profitBalance))
    : 0;
  const availableReferralBalance = user
    ? parseFloat(String(user.referralBalance))
    : 0;

  // Show loading while checking authentication
  if (userLoading || (!user && mounted)) {
    return (
      <main className="min-h-screen bg-slate-950 text-slate-50">
        <div className="max-w-4xl mx-auto px-4 py-8">
          <div className="space-y-6">
            <Skeleton className="h-10 w-48 bg-slate-800" />
            <Skeleton className="h-64 w-full bg-slate-800 rounded-2xl" />
            <Skeleton className="h-48 w-full bg-slate-800 rounded-2xl" />
          </div>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-slate-950 text-slate-50">
      <div className="max-w-4xl mx-auto px-4 py-8">
        <div className="space-y-6">
          <div>
            <h1 className="text-3xl font-bold text-white mb-2">Withdrawals</h1>
            <p className="text-slate-400">
              Request withdrawals from your profit or referral balance
            </p>
          </div>

          {/* Withdrawal Form */}
          <Card className="bg-slate-900 border-slate-800">
            <CardHeader>
              <CardTitle className="text-slate-300">Request Withdrawal</CardTitle>
            </CardHeader>
            <CardContent>
              {userLoading ? (
                <div className="space-y-4">
                  <Skeleton className="h-10 w-full bg-slate-800" />
                  <Skeleton className="h-10 w-full bg-slate-800" />
                  <Skeleton className="h-10 w-32 bg-slate-800" />
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-4">
                  {error && (
                    <div className="p-3 bg-red-500/20 border border-red-500 rounded-lg text-red-200 text-sm">
                      {error}
                    </div>
                  )}

                  <div>
                    <label
                      htmlFor="source"
                      className="block text-sm font-medium text-slate-300 mb-2"
                    >
                      Source Balance
                    </label>
                    <select
                      id="source"
                      value={source}
                      onChange={(e) => setSource(e.target.value as 'PROFIT' | 'REFERRAL')}
                      className="w-full px-4 py-2 bg-slate-800 border border-slate-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                      <option value="PROFIT">
                        PROFIT (Available: {formatBalance(availableProfitBalance)})
                      </option>
                      <option value="REFERRAL">
                        REFERRAL (Available: {formatBalance(availableReferralBalance)})
                      </option>
                    </select>
                  </div>

                  <div>
                    <label
                      htmlFor="amount"
                      className="block text-sm font-medium text-slate-300 mb-2"
                    >
                      Amount (USDT)
                    </label>
                    <input
                      id="amount"
                      type="number"
                      step="0.01"
                      min="10"
                      value={amount}
                      onChange={(e) => setAmount(e.target.value)}
                      required
                      className="w-full px-4 py-2 bg-slate-800 border border-slate-700 rounded-lg text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="Enter amount to withdraw"
                    />
                    <p className="text-xs text-slate-400 mt-1">
                      Minimum: 10 USDT. A 5% fee will be deducted.
                    </p>
                  </div>

                  <div>
                    <label
                      htmlFor="walletAddress"
                      className="block text-sm font-medium text-slate-300 mb-2"
                    >
                      Withdrawal Wallet Address <span className="text-slate-400 text-xs">(TRC20 USDT)</span>
                    </label>
                    <input
                      id="walletAddress"
                      type="text"
                      value={walletAddress}
                      onChange={handleWalletAddressChange}
                      required
                      className={`w-full px-4 py-2 bg-slate-800 border rounded-lg text-white placeholder-slate-400 focus:outline-none focus:ring-2 transition-colors ${
                        walletAddressError
                          ? 'border-red-500 focus:ring-red-500'
                          : walletAddress && validateTRC20Address(walletAddress)
                          ? 'border-emerald-500 focus:ring-emerald-500'
                          : 'border-slate-700 focus:ring-blue-500'
                      }`}
                      placeholder="Txxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx"
                    />
                    {walletAddressError && (
                      <p className="text-xs text-red-400 mt-1 flex items-center gap-1">
                        <svg className="w-3 h-3 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                        {walletAddressError}
                      </p>
                    )}
                    {walletAddress && validateTRC20Address(walletAddress) && !walletAddressError && (
                      <p className="text-xs text-emerald-400 mt-1 flex items-center gap-1">
                        <svg className="w-3 h-3 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                        Valid TRC20 address
                      </p>
                    )}
                  </div>

                  {/* Instructions Card */}
                  <div className="rounded-lg border border-blue-500/20 bg-blue-500/5 p-4 space-y-2">
                    <div className="flex items-start gap-2">
                      <svg className="w-5 h-5 text-blue-400 shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                      <div className="flex-1 space-y-1.5">
                        <p className="text-sm font-semibold text-blue-300">Important Instructions:</p>
                        <ul className="text-xs text-slate-400 space-y-1 list-disc list-inside">
                          <li>Only TRC20 (Tron) network addresses are supported</li>
                          <li>Address must start with 'T' and be exactly 34 characters</li>
                          <li>Double-check your address before submitting - transactions cannot be reversed</li>
                          <li>Minimum withdrawal: 10 USDT</li>
                          <li>A 5% processing fee will be deducted from your withdrawal amount</li>
                          <li>Withdrawals are processed within 1 - 2 hours after approval</li>
                        </ul>
                      </div>
                    </div>
                  </div>

                  {amount && !isNaN(parseFloat(amount)) && parseFloat(amount) >= 10 && (
                    <div className="p-3 bg-slate-800 rounded-lg space-y-1">
                      <div className="flex justify-between text-sm">
                        <span className="text-slate-400">Amount:</span>
                        <span className="text-white font-semibold">
                          {formatBalance(amount)} USDT
                        </span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-slate-400">Fee (5%):</span>
                        <span className="text-slate-300">
                          -{formatBalance(parseFloat(amount) * 0.05)} USDT
                        </span>
                      </div>
                      <div className="flex justify-between text-sm pt-2 border-t border-slate-700">
                        <span className="text-slate-300 font-medium">You will receive:</span>
                        <span className="text-green-400 font-bold">
                          {formatBalance(parseFloat(amount) * 0.95)} USDT
                        </span>
                      </div>
                    </div>
                  )}

                  <Button
                    type="submit"
                    disabled={createWithdrawalMutation.isPending || !user}
                    className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-blue-800 disabled:cursor-not-allowed text-white font-semibold"
                  >
                    {createWithdrawalMutation.isPending
                      ? 'Submitting...'
                      : 'Request Withdrawal'}
                  </Button>
                </form>
              )}
            </CardContent>
          </Card>

          {/* Withdrawal History */}
          <Card className="bg-slate-900 border-slate-800">
            <CardHeader>
              <CardTitle className="text-slate-300">Withdrawal History</CardTitle>
            </CardHeader>
            <CardContent>
              {withdrawalsLoading && (
                <div className="space-y-3">
                  {[1, 2, 3].map((i) => (
                    <Skeleton key={i} className="h-16 w-full bg-slate-800" />
                  ))}
                </div>
              )}

              {!withdrawalsLoading && (!withdrawals || withdrawals.length === 0) && (
                <p className="text-slate-400 text-center py-8">No withdrawals yet.</p>
              )}

              {!withdrawalsLoading && withdrawals && withdrawals.length > 0 && (
                <div className="overflow-x-auto">
                  <div className="min-w-full">
                    {/* Header */}
                    <div className="grid grid-cols-6 gap-4 pb-3 border-b border-slate-800 text-sm font-medium text-slate-400 mb-3">
                      <div>Date</div>
                      <div>Source</div>
                      <div>Amount</div>
                      <div>Fee</div>
                      <div>Net Amount</div>
                      <div>Status</div>
                    </div>
                    {/* Rows */}
                    <div className="space-y-3">
                      {withdrawals.map((withdrawal) => (
                        <div
                          key={withdrawal.id}
                          className="grid grid-cols-6 gap-4 py-3 border-b border-slate-800/50 text-sm items-center"
                        >
                          <div className="text-white">
                            {mounted ? formatDate(withdrawal.createdAt) : 'Loading...'}
                          </div>
                          <div>
                            <span
                              className={`px-2 py-1 rounded text-xs font-semibold ${
                                withdrawal.source === 'PROFIT'
                                  ? 'bg-blue-500/20 text-blue-300'
                                  : 'bg-purple-500/20 text-purple-300'
                              }`}
                            >
                              {withdrawal.source}
                            </span>
                          </div>
                          <div className="text-white font-semibold">
                            {formatBalance(withdrawal.amount)} USDT
                          </div>
                          <div className="text-slate-400">
                            {formatBalance(withdrawal.fee)} USDT
                          </div>
                          <div className="text-white font-semibold">
                            {formatBalance(withdrawal.netAmount)} USDT
                          </div>
                          <div>
                            <span
                              className={`px-2 py-1 rounded text-xs font-medium ${
                                withdrawal.status === 'APPROVED'
                                  ? 'bg-green-500/20 text-green-300'
                                  : withdrawal.status === 'REJECTED'
                                  ? 'bg-red-500/20 text-red-300'
                                  : 'bg-yellow-500/20 text-yellow-300'
                              }`}
                            >
                              {withdrawal.status}
                            </span>
                            {mounted && withdrawal.processedAt && (
                              <p className="text-xs text-slate-500 mt-1">
                                {formatDate(withdrawal.processedAt)}
                              </p>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </main>
  );
}

