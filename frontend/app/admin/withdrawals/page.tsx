'use client';

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { api } from '@/lib/api-client';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';

type AdminWithdrawal = {
  id: number;
  amount: string | number;
  fee: string | number;
  netAmount: string | number;
  source: string;
  walletAddress: string | null;
  status: string;
  createdAt: string;
  processedAt?: string | null;
  user: {
    id: number;
    email: string;
  };
};

const fetchPendingWithdrawals = async (): Promise<AdminWithdrawal[]> => {
  const res = await api.get('/admin/withdrawals/pending');
  return res.data;
};

const fetchAllWithdrawals = async (): Promise<AdminWithdrawal[]> => {
  const res = await api.get('/admin/withdrawals');
  return res.data;
};

const formatBalance = (value: string | number): string => {
  const num = typeof value === 'string' ? parseFloat(value) : value;
  return isNaN(num) ? '0.00' : num.toFixed(2);
};

const formatDate = (dateString: string): string => {
  const date = new Date(dateString);
  return date.toLocaleDateString('en-US', { 
    month: 'short', 
    day: 'numeric', 
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  });
};

const shortenAddress = (address: string): string => {
  if (!address || address.length <= 16) return address;
  return `${address.substring(0, 8)}...${address.substring(address.length - 8)}`;
};

export default function AdminWithdrawalsPage() {
  const queryClient = useQueryClient();

  const { data: withdrawals, isLoading, isError } = useQuery({
    queryKey: ['adminPendingWithdrawals'],
    queryFn: fetchPendingWithdrawals,
  });

  const { data: allWithdrawals, isLoading: allWithdrawalsLoading } = useQuery({
    queryKey: ['adminAllWithdrawals'],
    queryFn: fetchAllWithdrawals,
  });

  const approveMutation = useMutation({
    mutationFn: async (id: number) => {
      const res = await api.patch(`/admin/withdrawals/${id}/approve`);
      return res.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['adminPendingWithdrawals'] });
      queryClient.invalidateQueries({ queryKey: ['adminAllWithdrawals'] });
      queryClient.invalidateQueries({ queryKey: ['currentUser'] });
    },
  });

  const rejectMutation = useMutation({
    mutationFn: async (id: number) => {
      const res = await api.patch(`/admin/withdrawals/${id}/reject`);
      return res.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['adminPendingWithdrawals'] });
      queryClient.invalidateQueries({ queryKey: ['adminAllWithdrawals'] });
      queryClient.invalidateQueries({ queryKey: ['currentUser'] });
    },
  });

  return (
    <main className="space-y-4 sm:space-y-6 w-full">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <div>
          <h1 className="text-xl md:text-2xl font-semibold tracking-tight text-slate-50">
            Pending Withdrawals
          </h1>
          <p className="text-xs sm:text-sm text-slate-400 mt-1">
            Review and process withdrawal requests
          </p>
        </div>
        {!isLoading && withdrawals && (
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-amber-500/10 border border-amber-500/30">
            <span className="h-2 w-2 rounded-full bg-amber-400 animate-pulse" />
            <span className="text-xs text-slate-400">Pending:</span>
            <span className="text-sm font-semibold text-amber-300">{withdrawals.length}</span>
          </div>
        )}
      </div>

      {/* Loading State */}
      {isLoading && (
        <div className="space-y-3">
          {[1, 2, 3].map((i) => (
            <Skeleton key={i} className="h-40 sm:h-24 w-full bg-slate-800/50 rounded-2xl" />
          ))}
        </div>
      )}

      {/* Error State */}
      {isError && (
        <Card className="glass-card border-red-500/20">
          <CardContent className="pt-6">
            <div className="text-center py-8">
              <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-red-500/10 mb-4">
                <svg className="w-6 h-6 text-red-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <p className="text-red-400 font-medium">Failed to load withdrawals</p>
              <p className="text-slate-500 text-sm mt-1">Please try again later</p>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Empty State */}
      {!isLoading && !isError && (!withdrawals || withdrawals.length === 0) && (
        <Card className="glass-card">
          <CardContent className="pt-6">
            <div className="text-center py-12">
              <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-emerald-500/10 mb-4">
                <svg className="w-8 h-8 text-emerald-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <p className="text-slate-300 text-lg font-medium">All caught up!</p>
              <p className="text-slate-500 text-sm mt-1">No pending withdrawals to review</p>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Desktop Table View */}
      {!isLoading && !isError && withdrawals && withdrawals.length > 0 && (
        <>
          <div className="hidden lg:block">
            <Card className="glass-card overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-slate-800/50 bg-slate-900/40">
                      <th className="text-left px-4 py-3 text-xs font-semibold text-slate-400 uppercase tracking-wider">
                        User
                      </th>
                      <th className="text-left px-4 py-3 text-xs font-semibold text-slate-400 uppercase tracking-wider">
                        Source
                      </th>
                      <th className="text-left px-4 py-3 text-xs font-semibold text-slate-400 uppercase tracking-wider">
                        Amount / Fee
                      </th>
                      <th className="text-left px-4 py-3 text-xs font-semibold text-slate-400 uppercase tracking-wider">
                        Wallet Address
                      </th>
                      <th className="text-left px-4 py-3 text-xs font-semibold text-slate-400 uppercase tracking-wider">
                        Submitted
                      </th>
                      <th className="text-right px-4 py-3 text-xs font-semibold text-slate-400 uppercase tracking-wider">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-800/30">
                    {withdrawals.map((withdrawal) => (
                      <tr 
                        key={withdrawal.id} 
                        className="hover:bg-slate-900/40 transition-colors"
                      >
                        <td className="px-4 py-4">
                          <div className="flex items-center gap-3">
                            <div className="flex items-center justify-center w-10 h-10 rounded-full bg-gradient-to-br from-sky-500/20 to-blue-600/20 border border-sky-500/30">
                              <span className="text-sm font-semibold text-sky-300">
                                {withdrawal.user.email[0].toUpperCase()}
                              </span>
                            </div>
                            <div>
                              <p className="text-sm font-medium text-slate-50">{withdrawal.user.email}</p>
                              <p className="text-xs text-slate-500">User ID: {withdrawal.user.id}</p>
                            </div>
                          </div>
                        </td>
                        <td className="px-4 py-4">
                          <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium ${
                            withdrawal.source === 'PROFIT'
                              ? 'bg-[#4fd1ff]/10 text-[#4fd1ff] border border-[#4fd1ff]/30'
                              : 'bg-[#ffb020]/10 text-[#ffb020] border border-[#ffb020]/30'
                          }`}>
                            {withdrawal.source === 'PROFIT' ? (
                              <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                                <path fillRule="evenodd" d="M12 7a1 1 0 110-2h5a1 1 0 011 1v5a1 1 0 11-2 0V8.414l-4.293 4.293a1 1 0 01-1.414 0L8 10.414l-4.293 4.293a1 1 0 01-1.414-1.414l5-5a1 1 0 011.414 0L11 10.586 14.586 7H12z" clipRule="evenodd" />
                              </svg>
                            ) : (
                              <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                                <path d="M13 6a3 3 0 11-6 0 3 3 0 016 0zM18 8a2 2 0 11-4 0 2 2 0 014 0zM14 15a4 4 0 00-8 0v3h8v-3zM6 8a2 2 0 11-4 0 2 2 0 014 0zM16 18v-3a5.972 5.972 0 00-.75-2.906A3.005 3.005 0 0119 15v3h-3zM4.75 12.094A5.973 5.973 0 004 15v3H1v-3a3 3 0 013.75-2.906z" />
                              </svg>
                            )}
                            {withdrawal.source}
                          </span>
                        </td>
                        <td className="px-4 py-4">
                          <div className="flex flex-col gap-0.5">
                            <div className="flex items-center gap-2">
                              <span className="text-sm font-semibold text-slate-200">
                                {formatBalance(withdrawal.amount)}
                              </span>
                              <span className="text-xs text-slate-500">USDT</span>
                            </div>
                            <div className="text-xs text-slate-500">
                              Fee: {formatBalance(withdrawal.fee)} • Net: {formatBalance(withdrawal.netAmount)}
                            </div>
                          </div>
                        </td>
                        <td className="px-4 py-4">
                          <div className="flex items-center gap-2">
                            <code className="text-xs text-slate-300 bg-slate-900/60 px-2 py-1 rounded border border-slate-800 font-mono">
                              {shortenAddress(withdrawal.walletAddress || '-')}
                            </code>
                            {withdrawal.walletAddress && (
                              <button
                                onClick={() => navigator.clipboard.writeText(withdrawal.walletAddress!)}
                                className="text-slate-500 hover:text-slate-300 transition-colors"
                                title="Copy address"
                              >
                                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                                </svg>
                              </button>
                            )}
                          </div>
                        </td>
                        <td className="px-4 py-4">
                          <p className="text-sm text-slate-400">{formatDate(withdrawal.createdAt)}</p>
                        </td>
                        <td className="px-4 py-4">
                          <div className="flex items-center justify-end gap-2">
                            <Button
                              onClick={() => approveMutation.mutate(withdrawal.id)}
                              disabled={approveMutation.isPending || rejectMutation.isPending}
                              size="sm"
                              className="h-8 px-4 rounded-full text-xs font-semibold bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 transition-all"
                            >
                              {approveMutation.isPending && approveMutation.variables === withdrawal.id
                                ? 'Approving...'
                                : 'Approve'}
                            </Button>
                            <Button
                              onClick={() => rejectMutation.mutate(withdrawal.id)}
                              disabled={approveMutation.isPending || rejectMutation.isPending}
                              size="sm"
                              className="h-8 px-4 rounded-full text-xs font-medium bg-red-500/10 hover:bg-red-500/20 text-red-300 border border-red-500/30 transition-all"
                            >
                              {rejectMutation.isPending && rejectMutation.variables === withdrawal.id
                                ? 'Rejecting...'
                                : 'Reject'}
                            </Button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </Card>
          </div>

          {/* Mobile Card View */}
          <div className="lg:hidden space-y-3">
            {withdrawals.map((withdrawal) => (
              <Card key={withdrawal.id} className="glass-card overflow-hidden">
                <CardContent className="p-4">
                  {/* User Info */}
                  <div className="flex items-start justify-between gap-3 mb-4">
                    <div className="flex items-center gap-3 flex-1 min-w-0">
                      <div className="flex-shrink-0 flex items-center justify-center w-12 h-12 rounded-full bg-gradient-to-br from-sky-500/20 to-blue-600/20 border border-sky-500/30">
                        <span className="text-base font-semibold text-sky-300">
                          {withdrawal.user.email[0].toUpperCase()}
                        </span>
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-slate-50 truncate">{withdrawal.user.email}</p>
                        <p className="text-xs text-slate-500">User ID: {withdrawal.user.id}</p>
                      </div>
                    </div>
                    <span className={`flex-shrink-0 inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium ${
                      withdrawal.source === 'PROFIT'
                        ? 'bg-[#4fd1ff]/10 text-[#4fd1ff] border border-[#4fd1ff]/30'
                        : 'bg-[#ffb020]/10 text-[#ffb020] border border-[#ffb020]/30'
                    }`}>
                      {withdrawal.source === 'PROFIT' ? (
                        <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M12 7a1 1 0 110-2h5a1 1 0 011 1v5a1 1 0 11-2 0V8.414l-4.293 4.293a1 1 0 01-1.414 0L8 10.414l-4.293 4.293a1 1 0 01-1.414-1.414l5-5a1 1 0 011.414 0L11 10.586 14.586 7H12z" clipRule="evenodd" />
                        </svg>
                      ) : (
                        <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                          <path d="M13 6a3 3 0 11-6 0 3 3 0 016 0zM18 8a2 2 0 11-4 0 2 2 0 014 0zM14 15a4 4 0 00-8 0v3h8v-3zM6 8a2 2 0 11-4 0 2 2 0 014 0zM16 18v-3a5.972 5.972 0 00-.75-2.906A3.005 3.005 0 0119 15v3h-3zM4.75 12.094A5.973 5.973 0 004 15v3H1v-3a3 3 0 013.75-2.906z" />
                        </svg>
                      )}
                      {withdrawal.source}
                    </span>
                  </div>

                  {/* Amount Details */}
                  <div className="grid grid-cols-3 gap-2 mb-4">
                    <div className="bg-slate-900/40 rounded-lg p-2.5 border border-slate-800/50">
                      <p className="text-[10px] text-slate-500 uppercase tracking-wide mb-0.5">Amount</p>
                      <p className="text-sm font-semibold text-slate-200">{formatBalance(withdrawal.amount)}</p>
                    </div>
                    <div className="bg-slate-900/40 rounded-lg p-2.5 border border-slate-800/50">
                      <p className="text-[10px] text-slate-500 uppercase tracking-wide mb-0.5">Fee</p>
                      <p className="text-sm font-semibold text-red-400">{formatBalance(withdrawal.fee)}</p>
                    </div>
                    <div className="bg-emerald-500/10 rounded-lg p-2.5 border border-emerald-500/30">
                      <p className="text-[10px] text-emerald-400 uppercase tracking-wide mb-0.5">Net</p>
                      <p className="text-sm font-semibold text-emerald-300">{formatBalance(withdrawal.netAmount)}</p>
                    </div>
                  </div>

                  {/* Wallet Address */}
                  <div className="mb-4">
                    <p className="text-[10px] text-slate-500 uppercase tracking-wide mb-1">Wallet Address</p>
                    <div className="flex items-center gap-2">
                      <code className="flex-1 text-xs text-slate-300 bg-slate-900/60 px-2 py-1.5 rounded border border-slate-800 font-mono truncate">
                        {withdrawal.walletAddress || 'N/A'}
                      </code>
                      {withdrawal.walletAddress && (
                        <button
                          onClick={() => navigator.clipboard.writeText(withdrawal.walletAddress!)}
                          className="flex-shrink-0 p-2 text-slate-500 hover:text-slate-300 transition-colors"
                          title="Copy"
                        >
                          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                          </svg>
                        </button>
                      )}
                    </div>
                  </div>

                  {/* Date */}
                  <div className="flex items-center gap-2 text-xs text-slate-400 mb-4">
                    <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z" clipRule="evenodd" />
                    </svg>
                    <span>Submitted: {formatDate(withdrawal.createdAt)}</span>
                  </div>

                  {/* Action Buttons */}
                  <div className="grid grid-cols-2 gap-2">
                    <Button
                      onClick={() => approveMutation.mutate(withdrawal.id)}
                      disabled={approveMutation.isPending || rejectMutation.isPending}
                      className="h-10 rounded-lg text-xs font-semibold bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 transition-all"
                    >
                      {approveMutation.isPending && approveMutation.variables === withdrawal.id
                        ? 'Approving...'
                        : '✓ Approve'}
                    </Button>
                    <Button
                      onClick={() => rejectMutation.mutate(withdrawal.id)}
                      disabled={approveMutation.isPending || rejectMutation.isPending}
                      className="h-10 rounded-lg text-xs font-medium bg-red-500/10 hover:bg-red-500/20 text-red-300 border border-red-500/30 transition-all"
                    >
                      {rejectMutation.isPending && rejectMutation.variables === withdrawal.id
                        ? 'Rejecting...'
                        : '✕ Reject'}
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </>
      )}

      {/* All Withdrawals History */}
      <div className="mt-8">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="text-lg font-semibold text-slate-50">All Withdrawals History</h2>
            <p className="text-xs text-slate-400 mt-1">Complete transaction history with all statuses</p>
          </div>
          {!allWithdrawalsLoading && allWithdrawals && (
            <span className="text-xs text-slate-500">
              Total: <span className="font-semibold text-slate-300">{allWithdrawals.length}</span> withdrawals
            </span>
          )}
        </div>

        {/* Loading */}
        {allWithdrawalsLoading && (
          <div className="space-y-3">
            {[1, 2, 3].map((i) => (
              <Skeleton key={i} className="h-24 w-full bg-slate-800/50 rounded-2xl" />
            ))}
          </div>
        )}

        {/* Empty State */}
        {!allWithdrawalsLoading && (!allWithdrawals || allWithdrawals.length === 0) && (
          <Card className="glass-card">
            <CardContent className="pt-6">
              <div className="text-center py-8">
                <p className="text-slate-400">No withdrawals found</p>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Desktop Table */}
        {!allWithdrawalsLoading && allWithdrawals && allWithdrawals.length > 0 && (
          <>
            <div className="hidden lg:block">
              <Card className="glass-card overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b border-slate-800/50 bg-slate-900/40">
                        <th className="text-left px-4 py-3 text-xs font-semibold text-slate-400 uppercase tracking-wider">User</th>
                        <th className="text-left px-4 py-3 text-xs font-semibold text-slate-400 uppercase tracking-wider">Source</th>
                        <th className="text-left px-4 py-3 text-xs font-semibold text-slate-400 uppercase tracking-wider">Amount / Net</th>
                        <th className="text-left px-4 py-3 text-xs font-semibold text-slate-400 uppercase tracking-wider">Status</th>
                        <th className="text-left px-4 py-3 text-xs font-semibold text-slate-400 uppercase tracking-wider">Wallet</th>
                        <th className="text-left px-4 py-3 text-xs font-semibold text-slate-400 uppercase tracking-wider">Submitted</th>
                        <th className="text-left px-4 py-3 text-xs font-semibold text-slate-400 uppercase tracking-wider">Processed</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-800/30">
                      {allWithdrawals.map((withdrawal) => (
                        <tr key={withdrawal.id} className="hover:bg-slate-900/40 transition-colors">
                          <td className="px-4 py-3">
                            <div className="flex items-center gap-2">
                              <div className="flex items-center justify-center w-8 h-8 rounded-full bg-gradient-to-br from-sky-500/20 to-blue-600/20 border border-sky-500/30">
                                <span className="text-xs font-semibold text-sky-300">
                                  {withdrawal.user.email[0].toUpperCase()}
                                </span>
                              </div>
                              <div>
                                <p className="text-sm text-slate-50">{withdrawal.user.email}</p>
                              </div>
                            </div>
                          </td>
                          <td className="px-4 py-3">
                            <span className={`inline-flex items-center gap-1.5 px-2 py-1 rounded-full text-xs font-medium ${
                              withdrawal.source === 'PROFIT'
                                ? 'bg-[#4fd1ff]/10 text-[#4fd1ff] border border-[#4fd1ff]/30'
                                : 'bg-[#ffb020]/10 text-[#ffb020] border border-[#ffb020]/30'
                            }`}>
                              {withdrawal.source}
                            </span>
                          </td>
                          <td className="px-4 py-3">
                            <div className="flex flex-col gap-0.5">
                              <span className="text-sm text-slate-300">{formatBalance(withdrawal.amount)} USDT</span>
                              <span className="text-xs text-emerald-400">Net: {formatBalance(withdrawal.netAmount)}</span>
                            </div>
                          </td>
                          <td className="px-4 py-3">
                            <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium ${
                              withdrawal.status === 'APPROVED'
                                ? 'bg-emerald-500/10 text-emerald-300 border border-emerald-500/30'
                                : withdrawal.status === 'REJECTED'
                                ? 'bg-red-500/10 text-red-300 border border-red-500/30'
                                : 'bg-amber-500/10 text-amber-300 border border-amber-500/30'
                            }`}>
                              <span className={`w-1.5 h-1.5 rounded-full ${
                                withdrawal.status === 'APPROVED'
                                  ? 'bg-emerald-400'
                                  : withdrawal.status === 'REJECTED'
                                  ? 'bg-red-400'
                                  : 'bg-amber-400'
                              }`} />
                              {withdrawal.status}
                            </span>
                          </td>
                          <td className="px-4 py-3">
                            <code className="text-xs text-slate-300 bg-slate-900/60 px-2 py-1 rounded border border-slate-800 font-mono">
                              {shortenAddress(withdrawal.walletAddress || '-')}
                            </code>
                          </td>
                          <td className="px-4 py-3">
                            <p className="text-sm text-slate-400">{formatDate(withdrawal.createdAt)}</p>
                          </td>
                          <td className="px-4 py-3">
                            <p className="text-sm text-slate-400">
                              {withdrawal.processedAt ? formatDate(withdrawal.processedAt) : '-'}
                            </p>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </Card>
            </div>

            {/* Mobile Cards */}
            <div className="lg:hidden space-y-3">
              {allWithdrawals.map((withdrawal) => (
                <Card key={withdrawal.id} className="glass-card">
                  <CardContent className="p-4">
                    <div className="flex items-start justify-between gap-3 mb-3">
                      <div className="flex items-center gap-2 flex-1 min-w-0">
                        <div className="flex-shrink-0 flex items-center justify-center w-10 h-10 rounded-full bg-gradient-to-br from-sky-500/20 to-blue-600/20 border border-sky-500/30">
                          <span className="text-sm font-semibold text-sky-300">
                            {withdrawal.user.email[0].toUpperCase()}
                          </span>
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium text-slate-50 truncate">{withdrawal.user.email}</p>
                        </div>
                      </div>
                      <div className="flex flex-col gap-1 items-end">
                        <span className={`flex-shrink-0 inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium ${
                          withdrawal.status === 'APPROVED'
                            ? 'bg-emerald-500/10 text-emerald-300 border border-emerald-500/30'
                            : withdrawal.status === 'REJECTED'
                            ? 'bg-red-500/10 text-red-300 border border-red-500/30'
                            : 'bg-amber-500/10 text-amber-300 border border-amber-500/30'
                        }`}>
                          <span className={`w-1.5 h-1.5 rounded-full ${
                            withdrawal.status === 'APPROVED'
                              ? 'bg-emerald-400'
                              : withdrawal.status === 'REJECTED'
                              ? 'bg-red-400'
                              : 'bg-amber-400'
                          }`} />
                          {withdrawal.status}
                        </span>
                        <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                          withdrawal.source === 'PROFIT'
                            ? 'bg-[#4fd1ff]/10 text-[#4fd1ff] border border-[#4fd1ff]/30'
                            : 'bg-[#ffb020]/10 text-[#ffb020] border border-[#ffb020]/30'
                        }`}>
                          {withdrawal.source}
                        </span>
                      </div>
                    </div>
                    <div className="grid grid-cols-3 gap-2 mb-3">
                      <div className="bg-slate-900/40 rounded-lg p-2 border border-slate-800/50">
                        <p className="text-[10px] text-slate-500 uppercase tracking-wide mb-0.5">Amount</p>
                        <p className="text-sm font-semibold text-slate-200">{formatBalance(withdrawal.amount)}</p>
                      </div>
                      <div className="bg-slate-900/40 rounded-lg p-2 border border-slate-800/50">
                        <p className="text-[10px] text-slate-500 uppercase tracking-wide mb-0.5">Fee</p>
                        <p className="text-sm font-semibold text-red-400">{formatBalance(withdrawal.fee)}</p>
                      </div>
                      <div className="bg-emerald-500/10 rounded-lg p-2 border border-emerald-500/30">
                        <p className="text-[10px] text-emerald-400 uppercase tracking-wide mb-0.5">Net</p>
                        <p className="text-sm font-semibold text-emerald-300">{formatBalance(withdrawal.netAmount)}</p>
                      </div>
                    </div>
                    <div className="text-xs text-slate-500">
                      <div className="mb-1">Submitted: {formatDate(withdrawal.createdAt)}</div>
                      {withdrawal.processedAt && (
                        <div>Processed: {formatDate(withdrawal.processedAt)}</div>
                      )}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </>
        )}
      </div>
    </main>
  );
}
