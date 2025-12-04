'use client';

import { useState, FormEvent } from 'react';
import Link from 'next/link';
import { api } from '@/lib/api-client';

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [devToken, setDevToken] = useState('');

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError('');
    setSuccessMessage('');
    setDevToken('');
    setLoading(true);

    try {
      const response = await api.post('/auth/forgot-password', {
        email,
      });

      setSuccessMessage(
        response.data.message || 'If this email exists, reset instructions were generated.'
      );

      // Display token for development/testing if present
      if (response.data.token) {
        setDevToken(response.data.token);
      }
    } catch (err: any) {
      setError(
        err.response?.data?.message || 'Something went wrong. Please try again.'
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen flex items-center justify-center bg-slate-900">
      <div className="w-full max-w-md bg-slate-800 rounded-xl p-6 shadow-lg">
        <h1 className="text-3xl font-bold text-white mb-6 text-center">
          Forgot Password
        </h1>

        {error && (
          <div className="mb-4 p-3 bg-red-500/20 border border-red-500 rounded-lg text-red-200 text-sm">
            {error}
          </div>
        )}

        {successMessage && (
          <div className="mb-4 p-3 bg-green-500/20 border border-green-500 rounded-lg text-green-200 text-sm">
            {successMessage}
            {devToken && (
              <div className="mt-2 pt-2 border-t border-green-500/30">
                <p className="text-xs text-green-300 mb-1">Dev token:</p>
                <p className="text-xs font-mono break-all">{devToken}</p>
              </div>
            )}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-300 mb-1">
              Email
            </label>
            <input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              disabled={loading || !!successMessage}
              className="w-full px-4 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
              placeholder="Enter your email"
            />
          </div>

          <button
            type="submit"
            disabled={loading || !!successMessage}
            className="w-full py-2 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-800 disabled:cursor-not-allowed text-white font-semibold rounded-lg transition-colors"
          >
            {loading ? 'Sending...' : 'Send reset link'}
          </button>
        </form>

        <p className="mt-4 text-center text-sm text-gray-400">
          Remember your password?{' '}
          <Link href="/login" className="text-blue-400 hover:text-blue-300 underline">
            Login
          </Link>
        </p>
      </div>
    </main>
  );
}






