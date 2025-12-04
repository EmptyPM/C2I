'use client';

import { useState, FormEvent, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useQueryClient } from '@tanstack/react-query';
import { useCurrentUser } from '@/hooks/useCurrentUser';
import { api } from '@/lib/api-client';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { PasswordInput } from '@/components/ui/password-input';

export default function ProfilePage() {
  const router = useRouter();
  const queryClient = useQueryClient();
  const { data: user, isLoading, isError } = useCurrentUser();

  // Profile form state
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [profileError, setProfileError] = useState('');
  const [profileSuccess, setProfileSuccess] = useState('');
  const [profileLoading, setProfileLoading] = useState(false);

  // Password form state
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [passwordError, setPasswordError] = useState('');
  const [passwordSuccess, setPasswordSuccess] = useState('');
  const [passwordLoading, setPasswordLoading] = useState(false);

  // Pre-fill profile form when user data loads
  useEffect(() => {
    if (user) {
      setFirstName((user as any).firstName || '');
      setLastName((user as any).lastName || '');
    }
  }, [user]);

  // Redirect if not logged in
  useEffect(() => {
    if (!isLoading) {
      const hasToken = typeof window !== 'undefined' && !!localStorage.getItem('accessToken');
      if (!hasToken || isError) {
        router.push('/login');
      }
    }
  }, [isLoading, isError, router]);

  const handleProfileSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setProfileError('');
    setProfileSuccess('');
    setProfileLoading(true);

    try {
      await api.patch('/users/me/profile', {
        firstName,
        lastName,
      });

      setProfileSuccess('Profile updated successfully.');

      // Invalidate currentUser query to refetch
      await queryClient.invalidateQueries({ queryKey: ['currentUser'] });
    } catch (err: any) {
      setProfileError(
        err.response?.data?.message || 'Something went wrong. Please try again.'
      );
    } finally {
      setProfileLoading(false);
    }
  };

  const handlePasswordSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setPasswordError('');
    setPasswordSuccess('');

    // Client-side password match check
    if (newPassword !== confirmPassword) {
      setPasswordError('Passwords do not match');
      return;
    }

    setPasswordLoading(true);

    try {
      await api.patch('/users/me/change-password', {
        currentPassword,
        newPassword,
        confirmPassword,
      });

      setPasswordSuccess('Password updated successfully.');

      // Clear password fields
      setCurrentPassword('');
      setNewPassword('');
      setConfirmPassword('');
    } catch (err: any) {
      setPasswordError(
        err.response?.data?.message || 'Something went wrong. Please try again.'
      );
    } finally {
      setPasswordLoading(false);
    }
  };

  if (isLoading) {
    return (
      <main className="min-h-screen bg-slate-950 text-slate-50 flex items-center justify-center">
        <p className="text-slate-300">Loading...</p>
      </main>
    );
  }

  if (!user) {
    return null; // Will redirect in useEffect
  }

  return (
    <main className="space-y-6">
      {/* Page Header */}
      <section className="mb-2 flex flex-col gap-2 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-xl md:text-2xl font-semibold tracking-tight">
            Profile
          </h1>
          <p className="text-xs text-slate-400">
            Manage your profile settings and preferences.
          </p>
        </div>
        {/* Right side actions if needed */}
      </section>

      {/* Profile Details Card */}
      <Card className="glass-card">
        <CardHeader className="pb-2">
          <CardTitle className="text-slate-50">Profile Details</CardTitle>
        </CardHeader>
        <CardContent className="pt-0">
            {profileError && (
              <div className="mb-4 p-3 bg-red-500/20 border border-red-500 rounded-lg text-red-200 text-sm">
                {profileError}
              </div>
            )}

            {profileSuccess && (
              <div className="mb-4 p-3 bg-green-500/20 border border-green-500 rounded-lg text-green-200 text-sm">
                {profileSuccess}
              </div>
            )}

            <form onSubmit={handleProfileSubmit} className="space-y-4">
              <div>
                <label htmlFor="firstName" className="block text-sm font-medium text-gray-300 mb-1">
                  First Name
                </label>
                <input
                  id="firstName"
                  type="text"
                  value={firstName}
                  onChange={(e) => setFirstName(e.target.value)}
                  className="w-full px-4 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Enter your first name"
                />
              </div>

              <div>
                <label htmlFor="lastName" className="block text-sm font-medium text-gray-300 mb-1">
                  Last Name
                </label>
                <input
                  id="lastName"
                  type="text"
                  value={lastName}
                  onChange={(e) => setLastName(e.target.value)}
                  className="w-full px-4 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Enter your last name"
                />
              </div>

              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-300 mb-1">
                  Email
                </label>
                <input
                  id="email"
                  type="email"
                  value={user.email}
                  disabled
                  className="w-full px-4 py-2 bg-slate-600 border border-slate-600 rounded-lg text-gray-400 cursor-not-allowed"
                />
              </div>

              <Button
                type="submit"
                disabled={profileLoading}
                className="w-full h-9 rounded-full bg-sky-500 hover:bg-sky-400 text-xs font-semibold text-slate-950"
              >
                {profileLoading ? 'Saving...' : 'Save Profile'}
              </Button>
            </form>
          </CardContent>
        </Card>

      {/* Change Password Card */}
      <Card className="glass-card">
        <CardHeader className="pb-2">
          <CardTitle className="text-slate-50">Change Password</CardTitle>
        </CardHeader>
        <CardContent className="pt-0">
            {passwordError && (
              <div className="mb-4 p-3 bg-red-500/20 border border-red-500 rounded-lg text-red-200 text-sm">
                {passwordError}
              </div>
            )}

            {passwordSuccess && (
              <div className="mb-4 p-3 bg-green-500/20 border border-green-500 rounded-lg text-green-200 text-sm">
                {passwordSuccess}
              </div>
            )}

            <form onSubmit={handlePasswordSubmit} className="space-y-4">
              <div>
                <label htmlFor="currentPassword" className="block text-sm font-medium text-gray-300 mb-1">
                  Current Password
                </label>
                <PasswordInput
                    id="currentPassword"
                    value={currentPassword}
                    onChange={(e) => setCurrentPassword(e.target.value)}
                  placeholder="Enter your current password"
                    required
                    disabled={passwordLoading}
                  className="w-full px-4 py-2 pr-10 bg-slate-700 border border-slate-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
                />
              </div>

              <div>
                <label htmlFor="newPassword" className="block text-sm font-medium text-gray-300 mb-1">
                  New Password
                </label>
                <PasswordInput
                    id="newPassword"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                  placeholder="Enter your new password"
                    required
                    disabled={passwordLoading}
                  className="w-full px-4 py-2 pr-10 bg-slate-700 border border-slate-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
                />
              </div>

              <div>
                <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-300 mb-1">
                  Confirm Password
                </label>
                <PasswordInput
                    id="confirmPassword"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="Confirm your new password"
                    required
                    disabled={passwordLoading}
                  className="w-full px-4 py-2 pr-10 bg-slate-700 border border-slate-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
                />
              </div>

              <Button
                type="submit"
                disabled={passwordLoading}
                className="w-full h-9 rounded-full bg-sky-500 hover:bg-sky-400 text-xs font-semibold text-slate-950"
              >
                {passwordLoading ? 'Updating...' : 'Update Password'}
              </Button>
            </form>
        </CardContent>
      </Card>
    </main>
  );
}

