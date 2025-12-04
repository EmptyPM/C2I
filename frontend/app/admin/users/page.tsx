'use client';

import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { api } from '@/lib/api-client';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';

type AdminUser = {
  id: number;
  email: string;
  firstName: string | null;
  lastName: string | null;
  role: 'USER' | 'ADMIN';
  status: 'ACTIVE' | 'BANNED';
  isFrozen: boolean;
  tradingBalance: string | number;
  profitBalance: string | number;
  referralBalance: string | number;
  createdAt: string;
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
    year: 'numeric' 
  });
};

export default function AdminUsersPage() {
  const queryClient = useQueryClient();

  const { data: users, isLoading, isError } = useQuery({
    queryKey: ['adminUsers'],
    queryFn: async () => {
      const res = await api.get('/admin/users');
      return res.data as AdminUser[];
    },
  });

  const banUnbanMutation = useMutation({
    mutationFn: async (params: { id: number; status: 'ACTIVE' | 'BANNED' }) => {
      await api.patch(`/admin/users/${params.id}/status`, { status: params.status });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['adminUsers'] });
    },
  });

  const freezeUnfreezeMutation = useMutation({
    mutationFn: async (params: { id: number; isFrozen: boolean }) => {
      await api.patch(`/admin/users/${params.id}/freeze`, { isFrozen: params.isFrozen });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['adminUsers'] });
    },
  });

  const changeRoleMutation = useMutation({
    mutationFn: async (params: { id: number; role: 'USER' | 'ADMIN' }) => {
      await api.patch(`/admin/users/${params.id}/role`, { role: params.role });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['adminUsers'] });
    },
  });

  const handleBanUnban = (user: AdminUser) => {
    const newStatus = user.status === 'ACTIVE' ? 'BANNED' : 'ACTIVE';
    banUnbanMutation.mutate({ id: user.id, status: newStatus });
  };

  const handleFreezeUnfreeze = (user: AdminUser) => {
    freezeUnfreezeMutation.mutate({ id: user.id, isFrozen: !user.isFrozen });
  };

  const handleChangeRole = (user: AdminUser) => {
    const newRole = user.role === 'USER' ? 'ADMIN' : 'USER';
    changeRoleMutation.mutate({ id: user.id, role: newRole });
  };

  return (
    <main className="space-y-4 sm:space-y-6 w-full">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <div>
          <h1 className="text-xl md:text-2xl font-semibold tracking-tight text-slate-50">
            User Management
          </h1>
          <p className="text-xs sm:text-sm text-slate-400 mt-1">
            Manage user accounts, roles, and permissions
          </p>
        </div>
        {!isLoading && users && (
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-slate-900/60 border border-slate-800">
            <span className="text-xs text-slate-400">Total Users:</span>
            <span className="text-sm font-semibold text-[#4fd1ff]">{users.length}</span>
          </div>
        )}
      </div>

      {/* Loading State */}
          {isLoading && (
            <div className="space-y-3">
              {[1, 2, 3, 4, 5].map((i) => (
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
              <p className="text-red-400 font-medium">Failed to load users</p>
              <p className="text-slate-500 text-sm mt-1">Please try again later</p>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Empty State */}
          {!isLoading && !isError && (!users || users.length === 0) && (
        <Card className="glass-card">
          <CardContent className="pt-6">
            <div className="text-center py-12">
              <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-slate-800/50 mb-4">
                <svg className="w-8 h-8 text-slate-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                </svg>
              </div>
              <p className="text-slate-400 text-lg font-medium">No users found</p>
              <p className="text-slate-500 text-sm mt-1">Users will appear here once they register</p>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Desktop Table View (hidden on mobile) */}
          {!isLoading && !isError && users && users.length > 0 && (
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
                        Role
                      </th>
                      <th className="text-left px-4 py-3 text-xs font-semibold text-slate-400 uppercase tracking-wider">
                        Status
                      </th>
                      <th className="text-left px-4 py-3 text-xs font-semibold text-slate-400 uppercase tracking-wider">
                        Balances (T/P/R)
                      </th>
                      <th className="text-left px-4 py-3 text-xs font-semibold text-slate-400 uppercase tracking-wider">
                        Joined
                      </th>
                      <th className="text-right px-4 py-3 text-xs font-semibold text-slate-400 uppercase tracking-wider">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-800/30">
                {users.map((user) => (
                      <tr 
                    key={user.id}
                        className="hover:bg-slate-900/40 transition-colors"
                  >
                        <td className="px-4 py-4">
                          <div className="flex items-center gap-3">
                            <div className="flex items-center justify-center w-10 h-10 rounded-full bg-gradient-to-br from-sky-500/20 to-blue-600/20 border border-sky-500/30">
                              <span className="text-sm font-semibold text-sky-300">
                                {user.email[0].toUpperCase()}
                              </span>
                            </div>
                      <div>
                              <p className="text-sm font-medium text-slate-50">{user.email}</p>
                              <p className="text-xs text-slate-500">
                                {user.firstName || user.lastName
                                  ? `${user.firstName || ''} ${user.lastName || ''}`.trim()
                                  : 'No name set'}
                              </p>
                            </div>
                          </div>
                        </td>
                        <td className="px-4 py-4">
                          <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium ${
                            user.role === 'ADMIN' 
                              ? 'bg-amber-500/10 text-amber-300 border border-amber-500/30' 
                              : 'bg-slate-700/50 text-slate-300 border border-slate-600/30'
                          }`}>
                            {user.role === 'ADMIN' && (
                              <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                                <path fillRule="evenodd" d="M9.504 1.132a1 1 0 01.992 0l1.75 1a1 1 0 11-.992 1.736L10 3.152l-1.254.716a1 1 0 11-.992-1.736l1.75-1zM5.618 4.504a1 1 0 01-.372 1.364L5.016 6l.23.132a1 1 0 11-.992 1.736L4 7.723V8a1 1 0 01-2 0V6a.996.996 0 01.52-.878l1.734-.99a1 1 0 011.364.372zm8.764 0a1 1 0 011.364-.372l1.733.99A1.002 1.002 0 0118 6v2a1 1 0 11-2 0v-.277l-.254.145a1 1 0 11-.992-1.736l.23-.132-.23-.132a1 1 0 01-.372-1.364zm-7 4a1 1 0 011.364-.372L10 8.848l1.254-.716a1 1 0 11.992 1.736L11 10.58V12a1 1 0 11-2 0v-1.42l-1.246-.712a1 1 0 01-.372-1.364zM3 11a1 1 0 011 1v1.42l1.246.712a1 1 0 11-.992 1.736l-1.75-1A1 1 0 012 14v-2a1 1 0 011-1zm14 0a1 1 0 011 1v2a1 1 0 01-.504.868l-1.75 1a1 1 0 11-.992-1.736L16 13.42V12a1 1 0 011-1zm-9.618 5.504a1 1 0 011.364-.372l.254.145V16a1 1 0 112 0v.277l.254-.145a1 1 0 11.992 1.736l-1.735.992a.995.995 0 01-.963 0l-1.735-.992a1 1 0 01-.372-1.364z" clipRule="evenodd" />
                              </svg>
                            )}
                            {user.role}
                          </span>
                        </td>
                        <td className="px-4 py-4">
                          <div className="flex flex-col gap-1">
                            <span className={`inline-flex items-center gap-1.5 w-fit px-2.5 py-1 rounded-full text-xs font-medium ${
                              user.status === 'ACTIVE' 
                                ? 'bg-emerald-500/10 text-emerald-300 border border-emerald-500/30' 
                                : 'bg-red-500/10 text-red-300 border border-red-500/30'
                            }`}>
                              <span className={`w-1.5 h-1.5 rounded-full ${
                                user.status === 'ACTIVE' ? 'bg-emerald-400' : 'bg-red-400'
                              }`} />
                              {user.status}
                            </span>
                            {user.isFrozen && (
                              <span className="inline-flex items-center gap-1.5 w-fit px-2.5 py-1 rounded-full text-xs font-medium bg-amber-500/10 text-amber-300 border border-amber-500/30">
                                <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                                  <path fillRule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clipRule="evenodd" />
                                </svg>
                                Frozen
                              </span>
                            )}
                          </div>
                        </td>
                        <td className="px-4 py-4">
                          <div className="flex flex-col gap-0.5 font-mono text-xs">
                            <div className="text-slate-400">
                              <span className="text-slate-500">T:</span> <span className="text-slate-200">{formatBalance(user.tradingBalance)}</span>
                            </div>
                            <div className="text-slate-400">
                              <span className="text-slate-500">P:</span> <span className="text-[#4fd1ff]">{formatBalance(user.profitBalance)}</span>
                            </div>
                            <div className="text-slate-400">
                              <span className="text-slate-500">R:</span> <span className="text-[#ffb020]">{formatBalance(user.referralBalance)}</span>
                            </div>
                          </div>
                        </td>
                        <td className="px-4 py-4">
                          <p className="text-sm text-slate-400">{formatDate(user.createdAt)}</p>
                        </td>
                        <td className="px-4 py-4">
                          <div className="flex items-center justify-end gap-2">
                            <Button
                              onClick={() => handleBanUnban(user)}
                              disabled={banUnbanMutation.isPending}
                              size="sm"
                              className={`h-7 px-3 rounded-full text-xs font-medium transition-all ${
                                user.status === 'ACTIVE'
                                  ? 'bg-red-500/10 hover:bg-red-500/20 text-red-300 border border-red-500/30'
                                  : 'bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                              }`}
                            >
                              {user.status === 'ACTIVE' ? 'Ban' : 'Unban'}
                            </Button>
                            <Button
                              onClick={() => handleFreezeUnfreeze(user)}
                              disabled={freezeUnfreezeMutation.isPending}
                              size="sm"
                              className="h-7 px-3 rounded-full text-xs font-medium bg-amber-500/10 hover:bg-amber-500/20 text-amber-300 border border-amber-500/30 transition-all"
                            >
                              {user.isFrozen ? 'Unfreeze' : 'Freeze'}
                            </Button>
                            <Button
                              onClick={() => handleChangeRole(user)}
                              disabled={changeRoleMutation.isPending}
                              size="sm"
                              className="h-7 px-3 rounded-full text-xs font-medium bg-sky-500/10 hover:bg-sky-500/20 text-sky-300 border border-sky-500/30 transition-all"
                            >
                              {user.role === 'USER' ? 'Make Admin' : 'Make User'}
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

          {/* Mobile Card View (shown on mobile/tablet) */}
          <div className="lg:hidden space-y-3">
            {users.map((user) => (
              <Card key={user.id} className="glass-card overflow-hidden">
                <CardContent className="p-4">
                  {/* User Header */}
                  <div className="flex items-start justify-between gap-3 mb-4">
                    <div className="flex items-center gap-3 flex-1 min-w-0">
                      <div className="flex-shrink-0 flex items-center justify-center w-12 h-12 rounded-full bg-gradient-to-br from-sky-500/20 to-blue-600/20 border border-sky-500/30">
                        <span className="text-base font-semibold text-sky-300">
                          {user.email[0].toUpperCase()}
                        </span>
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-slate-50 truncate">{user.email}</p>
                        <p className="text-xs text-slate-500">
                          {user.firstName || user.lastName
                            ? `${user.firstName || ''} ${user.lastName || ''}`.trim()
                            : 'No name set'}
                        </p>
                      </div>
                    </div>
                    <span className={`flex-shrink-0 inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium ${
                      user.role === 'ADMIN' 
                        ? 'bg-amber-500/10 text-amber-300 border border-amber-500/30' 
                        : 'bg-slate-700/50 text-slate-300 border border-slate-600/30'
                    }`}>
                          {user.role}
                        </span>
                      </div>

                  {/* Status Badges */}
                  <div className="flex flex-wrap gap-2 mb-4">
                    <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium ${
                            user.status === 'ACTIVE'
                        ? 'bg-emerald-500/10 text-emerald-300 border border-emerald-500/30' 
                        : 'bg-red-500/10 text-red-300 border border-red-500/30'
                    }`}>
                      <span className={`w-1.5 h-1.5 rounded-full ${
                        user.status === 'ACTIVE' ? 'bg-emerald-400' : 'bg-red-400'
                      }`} />
                          {user.status}
                        </span>
                    {user.isFrozen && (
                      <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium bg-amber-500/10 text-amber-300 border border-amber-500/30">
                        <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clipRule="evenodd" />
                        </svg>
                        Frozen
                      </span>
                    )}
                    <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium bg-slate-700/50 text-slate-400 border border-slate-600/30">
                      <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zm0 5a1 1 0 000 2h8a1 1 0 100-2H6z" clipRule="evenodd" />
                      </svg>
                      {formatDate(user.createdAt)}
                    </span>
                  </div>

                  {/* Balances */}
                  <div className="grid grid-cols-3 gap-2 mb-4">
                    <div className="bg-slate-900/40 rounded-lg p-2 border border-slate-800/50">
                      <p className="text-[10px] text-slate-500 uppercase tracking-wide mb-0.5">Trading</p>
                      <p className="text-sm font-semibold text-slate-200 font-mono">{formatBalance(user.tradingBalance)}</p>
                      </div>
                    <div className="bg-slate-900/40 rounded-lg p-2 border border-slate-800/50">
                      <p className="text-[10px] text-slate-500 uppercase tracking-wide mb-0.5">Profit</p>
                      <p className="text-sm font-semibold text-[#4fd1ff] font-mono">{formatBalance(user.profitBalance)}</p>
                      </div>
                    <div className="bg-slate-900/40 rounded-lg p-2 border border-slate-800/50">
                      <p className="text-[10px] text-slate-500 uppercase tracking-wide mb-0.5">Referral</p>
                      <p className="text-sm font-semibold text-[#ffb020] font-mono">{formatBalance(user.referralBalance)}</p>
                      </div>
                      </div>

                  {/* Action Buttons */}
                  <div className="grid grid-cols-3 gap-2">
                        <Button
                          onClick={() => handleBanUnban(user)}
                          disabled={banUnbanMutation.isPending}
                      size="sm"
                      className={`h-9 rounded-lg text-xs font-medium transition-all ${
                        user.status === 'ACTIVE'
                          ? 'bg-red-500/10 hover:bg-red-500/20 text-red-300 border border-red-500/30'
                          : 'bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                      }`}
                        >
                          {user.status === 'ACTIVE' ? 'Ban' : 'Unban'}
                        </Button>
                        <Button
                          onClick={() => handleFreezeUnfreeze(user)}
                          disabled={freezeUnfreezeMutation.isPending}
                      size="sm"
                      className="h-9 rounded-lg text-xs font-medium bg-amber-500/10 hover:bg-amber-500/20 text-amber-300 border border-amber-500/30 transition-all"
                        >
                          {user.isFrozen ? 'Unfreeze' : 'Freeze'}
                        </Button>
                        <Button
                          onClick={() => handleChangeRole(user)}
                          disabled={changeRoleMutation.isPending}
                      size="sm"
                      className="h-9 rounded-lg text-xs font-medium bg-sky-500/10 hover:bg-sky-500/20 text-sky-300 border border-sky-500/30 transition-all"
                        >
                          {user.role === 'USER' ? 'Make Admin' : 'Make User'}
                        </Button>
                      </div>
                </CardContent>
              </Card>
                  ))}
                </div>
        </>
          )}
    </main>
  );
}
