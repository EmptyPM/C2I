'use client';

import { useEffect, useState } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { useCurrentUser } from '@/hooks/useCurrentUser';
import Link from 'next/link';
import { Skeleton } from '@/components/ui/skeleton';

const adminNavItems = [
  { label: 'Overview', href: '/admin' },
  { label: 'Users', href: '/admin/users' },
  { label: 'Deposits', href: '/admin/deposits' },
  { label: 'Withdrawals', href: '/admin/withdrawals' },
  { label: 'Profits', href: '/admin/profits' },
  { label: 'Settings', href: '/admin/settings' },
];

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();
  const [hasToken, setHasToken] = useState(false);
  const [isClient, setIsClient] = useState(false);

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

  // Check if user is admin
  useEffect(() => {
    if (!isLoading && user && user.role !== 'ADMIN') {
      router.push('/dashboard');
    }
  }, [user, isLoading, router]);

  if (!isClient || isLoading) {
    return (
      <div className="w-full space-y-6">
        <Skeleton className="h-8 w-48 bg-slate-800" />
        <div className="grid gap-4 md:grid-cols-3">
          {[1, 2, 3].map((i) => (
            <Skeleton key={i} className="h-32 bg-slate-800" />
          ))}
        </div>
      </div>
    );
  }

  if (isError || !user) {
    return (
      <div className="w-full">
        <div className="border border-red-500 bg-red-500/10 rounded-lg p-6">
          <p className="text-red-200">Unable to load admin panel. Please try again.</p>
        </div>
      </div>
    );
  }

  if (user.role !== 'ADMIN') {
    return (
      <div className="w-full">
        <div className="border border-amber-500 bg-amber-500/10 rounded-lg p-6">
          <p className="text-amber-200">You do not have permission to access this area.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full space-y-6">
      {/* Admin Navigation */}
      <nav className="glass-card border border-slate-800 rounded-2xl p-4">
        <div className="flex flex-wrap gap-2">
          {adminNavItems.map((item) => {
            const isActive = pathname === item.href;
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`rounded-full px-4 py-2 text-xs font-medium transition-all ${
                  isActive
                    ? 'bg-[#4fd1ff] text-slate-950'
                    : 'bg-slate-800/50 text-slate-300 hover:bg-slate-700/50 hover:text-slate-100'
                }`}
              >
                {item.label}
              </Link>
            );
          })}
        </div>
      </nav>

      {/* Admin Content */}
      {children}
    </div>
  );
}
