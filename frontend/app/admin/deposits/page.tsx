'use client';

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { api } from '@/lib/api-client';
import { Trc20DepositPanel } from '@/components/Trc20DepositPanel';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';

type AdminDeposit = {
  id: number;
  amount: string | number;
  txHash: string;
  status: string;
  createdAt: string;
  approvedAt?: string | null;
  user: {
    id: number;
    email: string;
  };
};

const fetchPendingDeposits = async (): Promise<AdminDeposit[]> => {
  const res = await api.get('/admin/deposits/pending');
  return res.data;
};

const fetchAllDeposits = async (): Promise<AdminDeposit[]> => {
  const res = await api.get('/admin/deposits');
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

const shortenTxHash = (hash: string): string => {
  if (!hash || hash.length <= 16) return hash;
  return `${hash.substring(0, 8)}...${hash.substring(hash.length - 8)}`;
};

export default function AdminDepositsPage() {
  const queryClient = useQueryClient();

  const { data: deposits, isLoading, isError } = useQuery({
    queryKey: ['adminPendingDeposits'],
    queryFn: fetchPendingDeposits,
  });

  const { data: allDeposits, isLoading: allDepositsLoading } = useQuery({
    queryKey: ['adminAllDeposits'],
    queryFn: fetchAllDeposits,
  });

  const approveMutation = useMutation({
    mutationFn: async (id: number) => {
      const res = await api.patch(`/admin/deposits/${id}/approve`);
      return res.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['adminPendingDeposits'] });
      queryClient.invalidateQueries({ queryKey: ['adminAllDeposits'] });
      queryClient.invalidateQueries({ queryKey: ['currentUser'] });
    },
  });

  const rejectMutation = useMutation({
    mutationFn: async (id: number) => {
      const res = await api.patch(`/admin/deposits/${id}/reject`);
      return res.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['adminPendingDeposits'] });
      queryClient.invalidateQueries({ queryKey: ['adminAllDeposits'] });
    },
  });

  return (
    <main className="space-y-4 sm:space-y-6 w-full">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <div>
          <h1 className="text-xl md:text-2xl font-semibold tracking-tight text-slate-50">
            Pending Deposits
          </h1>
          <p className="text-xs sm:text-sm text-slate-400 mt-1">
            Review and approve TRC20 USDT deposits
          </p>
        </div>
        {!isLoading && deposits && (
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-amber-500/10 border border-amber-500/30">
            <span className="h-2 w-2 rounded-full bg-amber-400 animate-pulse" />
            <span className="text-xs text-slate-400">Pending:</span>
            <span className="text-sm font-semibold text-amber-300">{deposits.length}</span>
          </div>
        )}
      </div>

      {/* Deposit Address Info */}
      <Trc20DepositPanel />

      {/* Loading State */}
      {isLoading && (
        <div className="space-y-3">
          {[1, 2, 3].map((i) => (
            <Skeleton key={i} className="h-32 sm:h-20 w-full bg-slate-800/50 rounded-2xl" />
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
              <p className="text-red-400 font-medium">Failed to load deposits</p>
              <p className="text-slate-500 text-sm mt-1">Please try again later</p>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Empty State */}
      {!isLoading && !isError && (!deposits || deposits.length === 0) && (
        <Card className="glass-card">
          <CardContent className="pt-6">
            <div className="text-center py-12">
              <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-emerald-500/10 mb-4">
                <svg className="w-8 h-8 text-emerald-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <p className="text-slate-300 text-lg font-medium">All caught up!</p>
              <p className="text-slate-500 text-sm mt-1">No pending deposits to review</p>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Desktop Table View */}
      {!isLoading && !isError && deposits && deposits.length > 0 && (
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
                        Amount
                      </th>
                      <th className="text-left px-4 py-3 text-xs font-semibold text-slate-400 uppercase tracking-wider">
                        TX Hash
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
                    {deposits.map((deposit) => (
                      <tr 
                        key={deposit.id} 
                        className="hover:bg-slate-900/40 transition-colors"
                      >
                        <td className="px-4 py-4">
                          <div className="flex items-center gap-3">
                            <div className="flex items-center justify-center w-10 h-10 rounded-full bg-gradient-to-br from-sky-500/20 to-blue-600/20 border border-sky-500/30">
                              <span className="text-sm font-semibold text-sky-300">
                                {deposit.user.email[0].toUpperCase()}
                              </span>
                            </div>
                            <div>
                              <p className="text-sm font-medium text-slate-50">{deposit.user.email}</p>
                              <p className="text-xs text-slate-500">User ID: {deposit.user.id}</p>
                            </div>
                          </div>
                        </td>
                        <td className="px-4 py-4">
                          <div className="flex items-center gap-2">
                            <svg className="w-5 h-5 text-emerald-400" fill="currentColor" viewBox="0 0 20 20">
                              <path d="M8.433 7.418c.155-.103.346-.196.567-.267v1.698a2.305 2.305 0 01-.567-.267C8.07 8.34 8 8.114 8 8c0-.114.07-.34.433-.582zM11 12.849v-1.698c.22.071.412.164.567.267.364.243.433.468.433.582 0 .114-.07.34-.433.582a2.305 2.305 0 01-.567.267z" />
                              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-13a1 1 0 10-2 0v.092a4.535 4.535 0 00-1.676.662C6.602 6.234 6 7.009 6 8c0 .99.602 1.765 1.324 2.246.48.32 1.054.545 1.676.662v1.941c-.391-.127-.68-.317-.843-.504a1 1 0 10-1.51 1.31c.562.649 1.413 1.076 2.353 1.253V15a1 1 0 102 0v-.092a4.535 4.535 0 001.676-.662C13.398 13.766 14 12.991 14 12c0-.99-.602-1.765-1.324-2.246A4.535 4.535 0 0011 9.092V7.151c.391.127.68.317.843.504a1 1 0 101.511-1.31c-.563-.649-1.413-1.076-2.354-1.253V5z" clipRule="evenodd" />
                            </svg>
                            <span className="text-lg font-semibold text-emerald-300">
                              {formatBalance(deposit.amount)}
                            </span>
                            <span className="text-xs text-slate-500">USDT</span>
                          </div>
                        </td>
                        <td className="px-4 py-4">
                          <div className="flex items-center gap-2">
                            <code className="text-xs text-slate-300 bg-slate-900/60 px-2 py-1 rounded border border-slate-800">
                              {shortenTxHash(deposit.txHash)}
                            </code>
                            <button
                              onClick={() => navigator.clipboard.writeText(deposit.txHash)}
                              className="text-slate-500 hover:text-slate-300 transition-colors"
                              title="Copy full hash"
                            >
                              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                              </svg>
                            </button>
                          </div>
                        </td>
                        <td className="px-4 py-4">
                          <p className="text-sm text-slate-400">{formatDate(deposit.createdAt)}</p>
                        </td>
                        <td className="px-4 py-4">
                          <div className="flex items-center justify-end gap-2">
                            <Button
                              onClick={() => approveMutation.mutate(deposit.id)}
                              disabled={approveMutation.isPending || rejectMutation.isPending}
                              size="sm"
                              className="h-8 px-4 rounded-full text-xs font-semibold bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 transition-all"
                            >
                              {approveMutation.isPending && approveMutation.variables === deposit.id
                                ? 'Approving...'
                                : 'Approve'}
                            </Button>
                            <Button
                              onClick={() => rejectMutation.mutate(deposit.id)}
                              disabled={approveMutation.isPending || rejectMutation.isPending}
                              size="sm"
                              className="h-8 px-4 rounded-full text-xs font-medium bg-red-500/10 hover:bg-red-500/20 text-red-300 border border-red-500/30 transition-all"
                            >
                              {rejectMutation.isPending && rejectMutation.variables === deposit.id
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
            {deposits.map((deposit) => (
              <Card key={deposit.id} className="glass-card overflow-hidden">
                <CardContent className="p-4">
                  {/* User Info */}
                  <div className="flex items-center gap-3 mb-4">
                    <div className="flex-shrink-0 flex items-center justify-center w-12 h-12 rounded-full bg-gradient-to-br from-sky-500/20 to-blue-600/20 border border-sky-500/30">
                      <span className="text-base font-semibold text-sky-300">
                        {deposit.user.email[0].toUpperCase()}
                      </span>
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-slate-50 truncate">{deposit.user.email}</p>
                      <p className="text-xs text-slate-500">User ID: {deposit.user.id}</p>
                    </div>
                  </div>

                  {/* Amount */}
                  <div className="bg-slate-900/40 rounded-xl p-3 mb-4 border border-slate-800/50">
                    <div className="flex items-center justify-between">
                      <span className="text-xs text-slate-400 uppercase tracking-wide">Deposit Amount</span>
                      <div className="flex items-center gap-2">
                        <svg className="w-5 h-5 text-emerald-400" fill="currentColor" viewBox="0 0 20 20">
                          <path d="M8.433 7.418c.155-.103.346-.196.567-.267v1.698a2.305 2.305 0 01-.567-.267C8.07 8.34 8 8.114 8 8c0-.114.07-.34.433-.582zM11 12.849v-1.698c.22.071.412.164.567.267.364.243.433.468.433.582 0 .114-.07.34-.433.582a2.305 2.305 0 01-.567.267z" />
                          <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-13a1 1 0 10-2 0v.092a4.535 4.535 0 00-1.676.662C6.602 6.234 6 7.009 6 8c0 .99.602 1.765 1.324 2.246.48.32 1.054.545 1.676.662v1.941c-.391-.127-.68-.317-.843-.504a1 1 0 10-1.51 1.31c.562.649 1.413 1.076 2.353 1.253V15a1 1 0 102 0v-.092a4.535 4.535 0 001.676-.662C13.398 13.766 14 12.991 14 12c0-.99-.602-1.765-1.324-2.246A4.535 4.535 0 0011 9.092V7.151c.391.127.68.317.843.504a1 1 0 101.511-1.31c-.563-.649-1.413-1.076-2.354-1.253V5z" clipRule="evenodd" />
                        </svg>
                        <span className="text-xl font-bold text-emerald-300">
                          {formatBalance(deposit.amount)}
                        </span>
                        <span className="text-xs text-slate-500">USDT</span>
                      </div>
                    </div>
                  </div>

                  {/* TX Hash */}
                  <div className="mb-4">
                    <p className="text-[10px] text-slate-500 uppercase tracking-wide mb-1">Transaction Hash</p>
                    <div className="flex items-center gap-2">
                      <code className="flex-1 text-xs text-slate-300 bg-slate-900/60 px-2 py-1.5 rounded border border-slate-800 font-mono truncate">
                        {deposit.txHash}
                      </code>
                      <button
                        onClick={() => navigator.clipboard.writeText(deposit.txHash)}
                        className="flex-shrink-0 p-2 text-slate-500 hover:text-slate-300 transition-colors"
                        title="Copy"
                      >
                        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                        </svg>
                      </button>
                    </div>
                  </div>

                  {/* Date */}
                  <div className="flex items-center gap-2 text-xs text-slate-400 mb-4">
                    <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z" clipRule="evenodd" />
                    </svg>
                    <span>Submitted: {formatDate(deposit.createdAt)}</span>
                  </div>

                  {/* Action Buttons */}
                  <div className="grid grid-cols-2 gap-2">
                    <Button
                      onClick={() => approveMutation.mutate(deposit.id)}
                      disabled={approveMutation.isPending || rejectMutation.isPending}
                      className="h-10 rounded-lg text-xs font-semibold bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 transition-all"
                    >
                      {approveMutation.isPending && approveMutation.variables === deposit.id
                        ? 'Approving...'
                        : '✓ Approve'}
                    </Button>
                    <Button
                      onClick={() => rejectMutation.mutate(deposit.id)}
                      disabled={approveMutation.isPending || rejectMutation.isPending}
                      className="h-10 rounded-lg text-xs font-medium bg-red-500/10 hover:bg-red-500/20 text-red-300 border border-red-500/30 transition-all"
                    >
                      {rejectMutation.isPending && rejectMutation.variables === deposit.id
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

      {/* All Deposits History */}
      <div className="mt-8">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="text-lg font-semibold text-slate-50">All Deposits History</h2>
            <p className="text-xs text-slate-400 mt-1">Complete transaction history with all statuses</p>
          </div>
          {!allDepositsLoading && allDeposits && (
            <span className="text-xs text-slate-500">
              Total: <span className="font-semibold text-slate-300">{allDeposits.length}</span> deposits
            </span>
          )}
        </div>

        {/* Loading */}
        {allDepositsLoading && (
          <div className="space-y-3">
            {[1, 2, 3].map((i) => (
              <Skeleton key={i} className="h-20 w-full bg-slate-800/50 rounded-2xl" />
            ))}
          </div>
        )}

        {/* Empty State */}
        {!allDepositsLoading && (!allDeposits || allDeposits.length === 0) && (
          <Card className="glass-card">
            <CardContent className="pt-6">
              <div className="text-center py-8">
                <p className="text-slate-400">No deposits found</p>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Desktop Table */}
        {!allDepositsLoading && allDeposits && allDeposits.length > 0 && (
          <>
            <div className="hidden lg:block">
              <Card className="glass-card overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b border-slate-800/50 bg-slate-900/40">
                        <th className="text-left px-4 py-3 text-xs font-semibold text-slate-400 uppercase tracking-wider">User</th>
                        <th className="text-left px-4 py-3 text-xs font-semibold text-slate-400 uppercase tracking-wider">Amount</th>
                        <th className="text-left px-4 py-3 text-xs font-semibold text-slate-400 uppercase tracking-wider">TX Hash</th>
                        <th className="text-left px-4 py-3 text-xs font-semibold text-slate-400 uppercase tracking-wider">Status</th>
                        <th className="text-left px-4 py-3 text-xs font-semibold text-slate-400 uppercase tracking-wider">Submitted</th>
                        <th className="text-left px-4 py-3 text-xs font-semibold text-slate-400 uppercase tracking-wider">Processed</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-800/30">
                      {allDeposits.map((deposit) => (
                        <tr key={deposit.id} className="hover:bg-slate-900/40 transition-colors">
                          <td className="px-4 py-3">
                            <div className="flex items-center gap-2">
                              <div className="flex items-center justify-center w-8 h-8 rounded-full bg-gradient-to-br from-sky-500/20 to-blue-600/20 border border-sky-500/30">
                                <span className="text-xs font-semibold text-sky-300">
                                  {deposit.user.email[0].toUpperCase()}
                                </span>
                              </div>
                              <div>
                                <p className="text-sm text-slate-50">{deposit.user.email}</p>
                              </div>
                            </div>
                          </td>
                          <td className="px-4 py-3">
                            <span className="text-sm font-semibold text-emerald-300">
                              {formatBalance(deposit.amount)} <span className="text-xs text-slate-500">USDT</span>
                            </span>
                          </td>
                          <td className="px-4 py-3">
                            <code className="text-xs text-slate-300 bg-slate-900/60 px-2 py-1 rounded border border-slate-800">
                              {shortenTxHash(deposit.txHash)}
                            </code>
                          </td>
                          <td className="px-4 py-3">
                            <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium ${
                              deposit.status === 'APPROVED'
                                ? 'bg-emerald-500/10 text-emerald-300 border border-emerald-500/30'
                                : deposit.status === 'REJECTED'
                                ? 'bg-red-500/10 text-red-300 border border-red-500/30'
                                : 'bg-amber-500/10 text-amber-300 border border-amber-500/30'
                            }`}>
                              <span className={`w-1.5 h-1.5 rounded-full ${
                                deposit.status === 'APPROVED'
                                  ? 'bg-emerald-400'
                                  : deposit.status === 'REJECTED'
                                  ? 'bg-red-400'
                                  : 'bg-amber-400'
                              }`} />
                              {deposit.status}
                            </span>
                          </td>
                          <td className="px-4 py-3">
                            <p className="text-sm text-slate-400">{formatDate(deposit.createdAt)}</p>
                          </td>
                          <td className="px-4 py-3">
                            <p className="text-sm text-slate-400">
                              {deposit.approvedAt ? formatDate(deposit.approvedAt) : '-'}
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
              {allDeposits.map((deposit) => (
                <Card key={deposit.id} className="glass-card">
                  <CardContent className="p-4">
                    <div className="flex items-start justify-between gap-3 mb-3">
                      <div className="flex items-center gap-2 flex-1 min-w-0">
                        <div className="flex-shrink-0 flex items-center justify-center w-10 h-10 rounded-full bg-gradient-to-br from-sky-500/20 to-blue-600/20 border border-sky-500/30">
                          <span className="text-sm font-semibold text-sky-300">
                            {deposit.user.email[0].toUpperCase()}
                          </span>
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium text-slate-50 truncate">{deposit.user.email}</p>
                        </div>
                      </div>
                      <span className={`flex-shrink-0 inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium ${
                        deposit.status === 'APPROVED'
                          ? 'bg-emerald-500/10 text-emerald-300 border border-emerald-500/30'
                          : deposit.status === 'REJECTED'
                          ? 'bg-red-500/10 text-red-300 border border-red-500/30'
                          : 'bg-amber-500/10 text-amber-300 border border-amber-500/30'
                      }`}>
                        <span className={`w-1.5 h-1.5 rounded-full ${
                          deposit.status === 'APPROVED'
                            ? 'bg-emerald-400'
                            : deposit.status === 'REJECTED'
                            ? 'bg-red-400'
                            : 'bg-amber-400'
                        }`} />
                        {deposit.status}
                      </span>
                    </div>
                    <div className="grid grid-cols-2 gap-2 mb-3">
                      <div className="bg-slate-900/40 rounded-lg p-2 border border-slate-800/50">
                        <p className="text-[10px] text-slate-500 uppercase tracking-wide mb-0.5">Amount</p>
                        <p className="text-sm font-semibold text-emerald-300">{formatBalance(deposit.amount)} USDT</p>
                      </div>
                      <div className="bg-slate-900/40 rounded-lg p-2 border border-slate-800/50">
                        <p className="text-[10px] text-slate-500 uppercase tracking-wide mb-0.5">Submitted</p>
                        <p className="text-xs text-slate-400">{formatDate(deposit.createdAt)}</p>
                      </div>
                    </div>
                    <div className="text-xs text-slate-500">
                      <span className="font-mono">{shortenTxHash(deposit.txHash)}</span>
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
