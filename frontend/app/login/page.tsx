"use client";

import Link from "next/link";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { useQueryClient } from "@tanstack/react-query";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { PasswordInput } from "@/components/ui/password-input";
import { api } from "@/lib/api-client";

export default function LoginPage() {
  const router = useRouter();
  const queryClient = useQueryClient();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);
    try {
      const res = await api.post("/auth/login", { email, password });
      const token = res.data?.accessToken;
      if (token) {
        localStorage.setItem("accessToken", token);
        if (res.data.user) {
          localStorage.setItem("user", JSON.stringify(res.data.user));
        }
        await queryClient.clear();
        router.push("/dashboard");
      } else {
        setError("Login failed. Please try again.");
      }
    } catch (err: any) {
      const msg =
        err?.response?.data?.message || "Invalid credentials.";
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
            Welcome back
          </CardTitle>
          <CardDescription className="text-xs text-slate-400">
            Sign in to access your investment dashboard.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {error && (
            <div className="rounded-lg border border-red-500/40 bg-red-500/10 px-3 py-2 text-xs text-red-300">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
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
              <label className="text-xs text-slate-300">Password</label>
              <PasswordInput
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                required
                disabled={loading}
              />
            </div>

            <Button
              type="submit"
              className="w-full mt-1 h-9 rounded-full bg-sky-500 hover:bg-sky-400 text-xs font-semibold text-slate-950"
              disabled={loading}
            >
              {loading ? "Signing in..." : "Login"}
            </Button>
          </form>

          <p className="pt-2 text-center text-[11px] text-slate-400">
            Don&apos;t have an account?{" "}
            <Link
              href="/register"
              className="text-sky-400 hover:text-sky-300 font-medium"
            >
              Register
            </Link>
          </p>
        </CardContent>
      </Card>
    </main>
  );
}
