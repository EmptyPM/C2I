'use client';

import { useQuery } from '@tanstack/react-query';
import { api } from '@/lib/api-client';
import { useCurrentUser } from '@/hooks/useCurrentUser';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
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

type AdminWithdrawal = {
  id: number;
  amount: string | number;
  fee: string | number;
  netAmount: string | number;
  source: string;
  status: string;
  createdAt: string;
  processedAt?: string | null;
  user: {
    id: number;
    email: string;
  };
};

type AdminUser = {
  id: number;
  email: string;
  role: string;
  status: string;
  isFrozen: boolean;
};

const fetchPendingDeposits = async (): Promise<AdminDeposit[]> => {
  const res = await api.get('/admin/deposits/pending');
  return res.data;
};

const fetchPendingWithdrawals = async (): Promise<AdminWithdrawal[]> => {
  const res = await api.get('/admin/withdrawals/pending');
  return res.data;
};

const fetchAllUsers = async (): Promise<AdminUser[]> => {
  const res = await api.get('/admin/users');
  return res.data;
};

const fetchTotalInvested = async (): Promise<{ totalInvested: string }> => {
  const res = await api.get('/admin/deposits/stats/total-invested');
  return res.data;
};

const fetchTotalWithdrawals = async (): Promise<{ totalAmount: string; totalCount: number }> => {
  const res = await api.get('/admin/withdrawals/stats/total-withdrawals');
  return res.data;
};

const fetchAvailableForWithdrawal = async (): Promise<{ totalAvailable: string; profitBalance: string; referralBalance: string }> => {
  const res = await api.get('/admin/users/stats/available-for-withdrawal');
  return res.data;
};

const fetchTotalReinvested = async (): Promise<{ totalReinvested: string; totalCount: number }> => {
  const res = await api.get('/wallet/admin/stats/total-reinvested');
  return res.data;
};

export default function AdminOverviewPage() {
  const { data: user, isLoading: userLoading } = useCurrentUser();

  const { data: pendingDeposits, isLoading: depositsLoading } = useQuery({
    queryKey: ['adminPendingDeposits'],
    queryFn: fetchPendingDeposits,
  });

  const { data: pendingWithdrawals, isLoading: withdrawalsLoading } = useQuery({
    queryKey: ['adminPendingWithdrawals'],
    queryFn: fetchPendingWithdrawals,
  });

  const { data: allUsers, isLoading: usersLoading } = useQuery({
    queryKey: ['adminUsers'],
    queryFn: fetchAllUsers,
  });

  const { data: totalInvested, isLoading: totalInvestedLoading } = useQuery({
    queryKey: ['adminTotalInvested'],
    queryFn: fetchTotalInvested,
  });

  const { data: totalWithdrawals, isLoading: totalWithdrawalsLoading } = useQuery({
    queryKey: ['adminTotalWithdrawals'],
    queryFn: fetchTotalWithdrawals,
  });

  const { data: totalReinvested, isLoading: totalReinvestedLoading } = useQuery({
    queryKey: ['adminTotalReinvested'],
    queryFn: fetchTotalReinvested,
  });

  const { data: availableForWithdrawal, isLoading: availableForWithdrawalLoading } = useQuery({
    queryKey: ['adminAvailableForWithdrawal'],
    queryFn: fetchAvailableForWithdrawal,
  });

  const pendingDepositsCount = pendingDeposits?.length || 0;
  const pendingWithdrawalsCount = pendingWithdrawals?.length || 0;
  const totalUsersCount = allUsers?.length || 0;
  const frozenUsersCount = allUsers?.filter((u) => u.isFrozen).length || 0;
  const bannedUsersCount = allUsers?.filter((u) => u.status === 'BANNED').length || 0;

  return (
    <main className="space-y-6 w-full">
      <h1 className="text-xl md:text-2xl font-semibold tracking-tight">Admin</h1>

      {/* Stats grid - Top Row */}
      <section className="grid gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-4">
        {/* Pending Deposits Card */}
        <Card className="glass-card">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-slate-300">
              Pending Deposits
            </CardTitle>
          </CardHeader>
          <CardContent>
            {depositsLoading ? (
              <Skeleton className="h-8 w-16 bg-slate-800" />
            ) : (
              <p className="text-2xl font-semibold text-[#4fd1ff]">
                {pendingDepositsCount}
              </p>
            )}
            <p className="text-xs text-slate-500 mt-1">
              Deposits waiting for approval.
            </p>
          </CardContent>
        </Card>

        {/* Pending Withdrawals Card */}
        <Card className="glass-card">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-slate-300">
              Pending Withdrawals
            </CardTitle>
          </CardHeader>
          <CardContent>
            {withdrawalsLoading ? (
              <Skeleton className="h-8 w-16 bg-slate-800" />
            ) : (
              <p className="text-2xl font-semibold text-[#ffb020]">
                {pendingWithdrawalsCount}
              </p>
            )}
            <p className="text-xs text-slate-500 mt-1">
              Withdrawals waiting for approval.
            </p>
          </CardContent>
        </Card>

        {/* Total Users Card */}
        <Card className="glass-card">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-slate-300">
              Total Users
            </CardTitle>
          </CardHeader>
          <CardContent>
            {usersLoading ? (
              <Skeleton className="h-8 w-16 bg-slate-800" />
            ) : (
              <p className="text-2xl font-semibold text-[#4fd1ff]">
                {totalUsersCount}
              </p>
            )}
            <p className="text-xs text-slate-500 mt-1">
              Registered users.
            </p>
          </CardContent>
        </Card>

        {/* Total Invested Card */}
        <Card className="glass-card">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-slate-300 flex items-center gap-2">
              Total Invested
              <svg className="w-4 h-4 text-emerald-400" fill="currentColor" viewBox="0 0 20 20">
                <path d="M8.433 7.418c.155-.103.346-.196.567-.267v1.698a2.305 2.305 0 01-.567-.267C8.07 8.34 8 8.114 8 8c0-.114.07-.34.433-.582zM11 12.849v-1.698c.22.071.412.164.567.267.364.243.433.468.433.582 0 .114-.07.34-.433.582a2.305 2.305 0 01-.567.267z" />
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-13a1 1 0 10-2 0v.092a4.535 4.535 0 00-1.676.662C6.602 6.234 6 7.009 6 8c0 .99.602 1.765 1.324 2.246.48.32 1.054.545 1.676.662v1.941c-.391-.127-.68-.317-.843-.504a1 1 0 10-1.51 1.31c.562.649 1.413 1.076 2.353 1.253V15a1 1 0 102 0v-.092a4.535 4.535 0 001.676-.662C13.398 13.766 14 12.991 14 12c0-.99-.602-1.765-1.324-2.246A4.535 4.535 0 0011 9.092V7.151c.391.127.68.317.843.504a1 1 0 101.511-1.31c-.563-.649-1.413-1.076-2.354-1.253V5z" clipRule="evenodd" />
              </svg>
            </CardTitle>
          </CardHeader>
          <CardContent>
            {totalInvestedLoading ? (
              <Skeleton className="h-8 w-20 bg-slate-800" />
            ) : (
              <p className="text-2xl font-semibold text-emerald-400">
                {parseFloat(totalInvested?.totalInvested || '0').toFixed(2)} <span className="text-xs text-slate-500">USDT</span>
              </p>
            )}
            <p className="text-xs text-slate-500 mt-1">
              Total approved deposits.
            </p>
          </CardContent>
        </Card>
      </section>

      {/* Stats grid - Bottom Row */}
      <section className="grid gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
        {/* Available for Withdrawal Card */}
        <Card className="glass-card">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-slate-300 flex items-center gap-2">
              Available for Withdrawal
              <svg className="w-4 h-4 text-amber-400" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-11a1 1 0 10-2 0v3.586L7.707 9.293a1 1 0 00-1.414 1.414l3 3a1 1 0 001.414 0l3-3a1 1 0 00-1.414-1.414L11 10.586V7z" clipRule="evenodd" />
              </svg>
            </CardTitle>
          </CardHeader>
          <CardContent>
            {availableForWithdrawalLoading ? (
              <Skeleton className="h-8 w-20 bg-slate-800" />
            ) : (
              <div>
                <p className="text-2xl font-semibold text-amber-400">
                  {parseFloat(availableForWithdrawal?.totalAvailable || '0').toFixed(2)} <span className="text-xs text-slate-500">USDT</span>
                </p>
                <p className="text-sm text-slate-400 mt-1">
                  Profit: {parseFloat(availableForWithdrawal?.profitBalance || '0').toFixed(2)} • 
                  Referral: {parseFloat(availableForWithdrawal?.referralBalance || '0').toFixed(2)}
                </p>
              </div>
            )}
            <p className="text-xs text-slate-500 mt-1">
              Total amount users can withdraw today.
            </p>
          </CardContent>
        </Card>

        {/* Total Reinvested Card */}
        <Card className="glass-card">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-slate-300 flex items-center gap-2">
              Total Reinvested
              <svg className="w-4 h-4 text-purple-400" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M4 2a1 1 0 011 1v2.101a7.002 7.002 0 0111.601 2.566 1 1 0 11-1.885.666A5.002 5.002 0 005.999 7H9a1 1 0 010 2H4a1 1 0 01-1-1V3a1 1 0 011-1zm.008 9.057a1 1 0 011.276.61A5.002 5.002 0 0014.001 13H11a1 1 0 110-2h5a1 1 0 011 1v5a1 1 0 11-2 0v-2.101a7.002 7.002 0 01-11.601-2.566 1 1 0 01.61-1.276z" clipRule="evenodd" />
              </svg>
            </CardTitle>
          </CardHeader>
          <CardContent>
            {totalReinvestedLoading ? (
              <Skeleton className="h-8 w-20 bg-slate-800" />
            ) : (
              <div>
                <p className="text-2xl font-semibold text-purple-400">
                  {parseFloat(totalReinvested?.totalReinvested || '0').toFixed(2)} <span className="text-xs text-slate-500">USDT</span>
                </p>
                <p className="text-sm text-slate-400 mt-1">
                  {totalReinvested?.totalCount || 0} reinvestment transactions
                </p>
              </div>
            )}
            <p className="text-xs text-slate-500 mt-1">
              Profits reinvested into trading.
            </p>
          </CardContent>
        </Card>

        {/* Platform Balance Card */}
        <Card className="glass-card">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-slate-300 flex items-center gap-2">
              Net Platform Balance
              <svg className="w-4 h-4 text-sky-400" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M4 4a2 2 0 00-2 2v4a2 2 0 002 2V6h10a2 2 0 00-2-2H4zm2 6a2 2 0 012-2h8a2 2 0 012 2v4a2 2 0 01-2 2H8a2 2 0 01-2-2v-4zm6 4a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" />
              </svg>
            </CardTitle>
          </CardHeader>
          <CardContent>
            {totalInvestedLoading || totalWithdrawalsLoading ? (
              <Skeleton className="h-8 w-20 bg-slate-800" />
            ) : (
              <p className="text-2xl font-semibold text-sky-400">
                {(parseFloat(totalInvested?.totalInvested || '0') - parseFloat(totalWithdrawals?.totalAmount || '0')).toFixed(2)}{' '}
                <span className="text-xs text-slate-500">USDT</span>
              </p>
            )}
            <p className="text-xs text-slate-500 mt-1">
              Invested minus withdrawn.
            </p>
          </CardContent>
        </Card>
      </section>

      {/* System Info */}
      <section>
        <Card className="glass-card">
          <CardHeader>
            <CardTitle className="text-sm font-medium text-slate-300">
              System Information
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="flex justify-between items-center text-sm">
              <span className="text-slate-400">Total Users</span>
              {usersLoading ? (
                <Skeleton className="h-4 w-8 bg-slate-800" />
              ) : (
                <span className="text-slate-200 font-medium">{totalUsersCount}</span>
              )}
            </div>
            <div className="flex justify-between items-center text-sm">
              <span className="text-slate-400">Frozen Accounts</span>
              {usersLoading ? (
                <Skeleton className="h-4 w-8 bg-slate-800" />
              ) : (
                <span className="text-amber-400 font-medium">{frozenUsersCount}</span>
              )}
            </div>
            <div className="flex justify-between items-center text-sm">
              <span className="text-slate-400">Banned Accounts</span>
              {usersLoading ? (
                <Skeleton className="h-4 w-8 bg-slate-800" />
              ) : (
                <span className="text-red-400 font-medium">{bannedUsersCount}</span>
              )}
            </div>
            <div className="pt-2 border-t border-slate-800">
              <p className="text-xs text-slate-500">
                Monitor user statuses and account restrictions from the Users page.
              </p>
            </div>
          </CardContent>
        </Card>
      </section>
    </main>
  );
}
