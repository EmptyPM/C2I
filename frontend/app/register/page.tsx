"use client";

import Link from "next/link";
import { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useQueryClient } from "@tanstack/react-query";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { PasswordInput } from "@/components/ui/password-input";
import { api } from "@/lib/api-client";

export default function RegisterPage() {
  const router = useRouter();
  const queryClient = useQueryClient();
  const searchParams = useSearchParams();
  const refFromUrl = searchParams.get("ref") || "";

  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [referralCode, setReferralCode] = useState(refFromUrl);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (password !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    setLoading(true);
    try {
      const res = await api.post("/auth/register", {
        firstName,
        lastName,
        email,
        password,
        confirmPassword,
        referralCode: referralCode || undefined,
      });
      const token = res.data?.accessToken;
      if (token) {
        localStorage.setItem("accessToken", token);
        if (res.data.user) {
          localStorage.setItem("user", JSON.stringify(res.data.user));
        }
        await queryClient.clear();
        router.push("/dashboard");
      } else {
        router.push("/login");
      }
    } catch (err: any) {
      const msg =
        err?.response?.data?.message || "Registration failed.";
      setError(Array.isArray(msg) ? msg.join(", ") : msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen flex items-center justify-center  px-4">
      <Card className="glass-card w-full max-w-md">
        <CardHeader className="space-y-1 pb-4">
          <CardTitle className="text-xl font-semibold text-slate-50">
            Create your account
          </CardTitle>
          <CardDescription className="text-xs text-slate-400">
            Join the automated crypto investment platform.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {error && (
            <div className="rounded-lg border border-red-500/40 bg-red-500/10 px-3 py-2 text-xs text-red-300">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-3">
            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
              <div className="space-y-1">
                <label className="text-xs text-slate-300">
                  First name
                </label>
                <input
                  type="text"
                  required
                  value={firstName}
                  onChange={(e) => setFirstName(e.target.value)}
                  className="w-full rounded-md border border-slate-700 bg-slate-900/80 px-3 py-2 text-sm text-white outline-none focus:border-sky-500"
                />
              </div>
              <div className="space-y-1">
                <label className="text-xs text-slate-300">
                  Last name
                </label>
                <input
                  type="text"
                  required
                  value={lastName}
                  onChange={(e) => setLastName(e.target.value)}
                  className="w-full rounded-md border border-slate-700 bg-slate-900/80 px-3 py-2 text-sm text-white outline-none focus:border-sky-500"
                />
              </div>
            </div>

            <div className="space-y-1">
              <label className="text-xs text-slate-300">Email</label>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full rounded-md border border-slate-700 bg-slate-900/80 px-3 py-2 text-sm text-white outline-none focus:border-sky-500"
                placeholder="you@example.com"
              />
            </div>

            <div className="space-y-1">
              <label className="text-xs text-slate-300">
                Password
              </label>
              <PasswordInput
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                required
                disabled={loading}
              />
            </div>

            <div className="space-y-1">
              <label className="text-xs text-slate-300">
                Confirm password
              </label>
              <PasswordInput
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="••••••••"
                required
                disabled={loading}
              />
            </div>

            <div className="space-y-1">
              <label className="text-xs text-slate-300">
                Referral code (optional)
              </label>
              <input
                type="text"
                value={referralCode}
                onChange={(e) => setReferralCode(e.target.value)}
                className="w-full rounded-md border border-slate-700 bg-slate-900/80 px-3 py-2 text-sm text-white outline-none focus:border-sky-500"
                placeholder="Enter referral code"
              />
            </div>

            <Button
              type="submit"
              className="w-full mt-1 h-9 rounded-full bg-sky-500 hover:bg-sky-400 text-xs font-semibold text-slate-950"
              disabled={loading}
            >
              {loading ? "Creating account..." : "Register"}
            </Button>
          </form>

          <p className="pt-2 text-center text-[11px] text-slate-400">
            Already have an account?{" "}
            <Link
              href="/login"
              className="text-sky-400 hover:text-sky-300 font-medium"
            >
              Login
            </Link>
          </p>
        </CardContent>
      </Card>
    </main>
  );
}
