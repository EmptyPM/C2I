"use client";

import { useEffect, useState } from "react";

import {
  useMutation,
  useQuery,
  useQueryClient,
} from "@tanstack/react-query";

import { cn } from "@/lib/utils";

import { useCurrentUser } from "@/hooks/useCurrentUser";

import { api } from "@/lib/api-client";
import { PasswordInput } from "@/components/ui/password-input";

import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
} from "@/components/ui/card";

import { Button } from "@/components/ui/button";

import { Trc20DepositPanel } from "@/components/Trc20DepositPanel"; // we created earlier

type TabKey =
  | "account"
  | "deposit"
  | "withdraw"
  | "referral"
  | "wallet"
  | "history";

const tabs: { key: TabKey; label: string }[] = [
  { key: "account", label: "Account" },
  { key: "deposit", label: "Deposit" },
  { key: "withdraw", label: "Withdraw" },
  { key: "referral", label: "Referral" },
  { key: "wallet", label: "Wallet Transactions" },
  { key: "history", label: "Transactions History" },
];

type Deposit = {
  id: number;
  amount: number;
  txHash: string;
  status: "PENDING" | "APPROVED" | "REJECTED";
  createdAt: string;
};

type Withdrawal = {
  id: number;
  amount: number;
  fee: number;
  netAmount: number;
  walletAddress: string | null;
  source: "PROFIT" | "TRADING";
  status: "PENDING" | "APPROVED" | "REJECTED";
  createdAt: string;
};

type ReferralEntry = {
  id: number;
  referredEmail: string;
  firstDepositAmount: number | null;
  createdAt: string;
};

type WalletName = "TRADING" | "PROFIT" | "REFERRAL";

type WalletTransfer = {
  id: number;
  fromWallet: WalletName;
  toWallet: WalletName;
  amount: number;
  description?: string | null;
  createdAt: string;
};

type ProfitLog = {
  id: number;
  amount: number;
  percentage: number;
  note: string | null;
  createdAt: string;
};

function formatWalletLabel(w: WalletName) {
  if (w === "TRADING") return "Trading";
  if (w === "PROFIT") return "Profit";
  return "Referral";
}

export default function AccountPage() {
  const [activeTab, setActiveTab] = useState<TabKey>("account");
  const [mounted, setMounted] = useState(false);
  const { data: user, isLoading } = useCurrentUser();
  const queryClient = useQueryClient();

  /* ------------------ ACCOUNT TAB STATE ------------------ */

  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");

  const [profileMessage, setProfileMessage] = useState<string | null>(null);
  const [profileError, setProfileError] = useState<string | null>(null);

  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmNewPassword, setConfirmNewPassword] = useState("");

  const [passwordMessage, setPasswordMessage] = useState<string | null>(null);
  const [passwordError, setPasswordError] = useState<string | null>(null);

  // Fix hydration: only render after mount
  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (user) {
      setFirstName(user.firstName || "");
      setLastName(user.lastName || "");
    }
  }, [user]);

  const updateProfileMutation = useMutation({
    mutationFn: async () => {
      return api.patch("/users/me/profile", {
        firstName,
        lastName,
      });
    },
    onSuccess: () => {
      setProfileError(null);
      setProfileMessage("Profile updated successfully.");
      queryClient.invalidateQueries({ queryKey: ["currentUser"] });
      setTimeout(() => setProfileMessage(null), 2500);
    },
    onError: (err: any) => {
      const msg =
        err?.response?.data?.message ||
        "Unable to update profile. Please try again.";
      setProfileError(Array.isArray(msg) ? msg.join(", ") : msg);
      setProfileMessage(null);
    },
  });

  const changePasswordMutation = useMutation({
    mutationFn: async () => {
      return api.patch("/users/me/change-password", {
        currentPassword,
        newPassword,
        confirmPassword: confirmNewPassword,
      });
    },
    onSuccess: () => {
      setPasswordError(null);
      setPasswordMessage("Password updated successfully.");
      setCurrentPassword("");
      setNewPassword("");
      setConfirmNewPassword("");
      setTimeout(() => setPasswordMessage(null), 2500);
    },
    onError: (err: any) => {
      const msg =
        err?.response?.data?.message ||
        "Unable to change password. Please check your current password.";
      setPasswordError(Array.isArray(msg) ? msg.join(", ") : msg);
      setPasswordMessage(null);
    },
  });

  const handleProfileSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setProfileError(null);
    setProfileMessage(null);
    updateProfileMutation.mutate();
  };

  const handlePasswordSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setPasswordError(null);
    setPasswordMessage(null);

    if (newPassword.length < 8) {
      setPasswordError("New password must be at least 8 characters.");
      return;
    }
    if (newPassword !== confirmNewPassword) {
      setPasswordError("New passwords do not match.");
      return;
    }

    changePasswordMutation.mutate();
  };

  /* ------------------ DEPOSIT TAB STATE ------------------ */

  const [depositAmount, setDepositAmount] = useState("");
  const [depositTxHash, setDepositTxHash] = useState("");
  const [depositError, setDepositError] = useState<string | null>(null);
  const [depositMessage, setDepositMessage] = useState<string | null>(null);

  const myDepositsQuery = useQuery<Deposit[]>({
    queryKey: ["myDeposits"],
    queryFn: async () => {
      const res = await api.get("/deposits/my");
      return res.data;
    },
    staleTime: 0,
    refetchOnMount: "always",
  });

  const createDepositMutation = useMutation({
    mutationFn: async () => {
      return api.post("/deposits", {
        amount: Number(depositAmount),
        txHash: depositTxHash,
      });
    },
    onSuccess: () => {
      setDepositError(null);
      setDepositMessage("Deposit request submitted. Waiting for approval.");
      setDepositAmount("");
      setDepositTxHash("");
      queryClient.invalidateQueries({ queryKey: ["myDeposits"] });
      setTimeout(() => setDepositMessage(null), 2500);
    },
    onError: (err: any) => {
      const msg =
        err?.response?.data?.message ||
        "Unable to submit deposit. Please check details.";
      setDepositError(Array.isArray(msg) ? msg.join(", ") : msg);
      setDepositMessage(null);
    },
  });

  const handleDepositSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setDepositError(null);
    setDepositMessage(null);

    const amountNum = Number(depositAmount);
    if (!amountNum || isNaN(amountNum) || amountNum < 10) {
      setDepositError("Minimum deposit is 10 USDT.");
      return;
    }
    if (!depositTxHash.trim()) {
      setDepositError("Transaction hash is required.");
      return;
    }

    createDepositMutation.mutate();
  };

  /* ------------------ WITHDRAW TAB STATE ------------------ */

  const [withdrawAmount, setWithdrawAmount] = useState("");
  const [withdrawSource] = useState<"PROFIT">("PROFIT");
  const [withdrawWallet, setWithdrawWallet] = useState("");
  const [withdrawError, setWithdrawError] = useState<string | null>(null);
  const [withdrawMessage, setWithdrawMessage] = useState<string | null>(null);
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

  const myWithdrawalsQuery = useQuery<Withdrawal[]>({
    queryKey: ["myWithdrawals"],
    queryFn: async () => {
      const res = await api.get("/withdrawals/my");
      return res.data;
    },
    staleTime: 0,
    refetchOnMount: "always",
  });

  const createWithdrawalMutation = useMutation({
    mutationFn: async () => {
      return api.post("/withdrawals", {
        amount: Number(withdrawAmount),
        source: withdrawSource,
        walletAddress: withdrawWallet,
      });
    },
    onSuccess: () => {
      setWithdrawError(null);
      setWithdrawMessage(
        "Withdrawal request submitted. A 5% fee will be applied on approval."
      );
      setWithdrawAmount("");
      setWithdrawWallet("");
      queryClient.invalidateQueries({ queryKey: ["myWithdrawals"] });
      queryClient.invalidateQueries({ queryKey: ["currentUser"] });
      setTimeout(() => setWithdrawMessage(null), 2500);
    },
    onError: (err: any) => {
      const msg =
        err?.response?.data?.message ||
        "Unable to submit withdrawal. Please check details.";
      setWithdrawError(Array.isArray(msg) ? msg.join(", ") : msg);
      setWithdrawMessage(null);
    },
  });

  const handleWithdrawSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setWithdrawError(null);
    setWithdrawMessage(null);
    setWalletAddressError(null);

    const amountNum = Number(withdrawAmount);
    if (!amountNum || isNaN(amountNum) || amountNum < 10) {
      setWithdrawError("Minimum withdrawal is 10 USDT.");
      return;
    }
    
    if (!withdrawWallet.trim()) {
      setWithdrawError("Wallet address is required.");
      setWalletAddressError("Please enter your TRC20 wallet address.");
      return;
    }

    // Validate TRC20 address format
    if (!validateTRC20Address(withdrawWallet)) {
      setWithdrawError("Invalid TRC20 wallet address format.");
      setWalletAddressError("TRC20 addresses must start with 'T' and be 34 characters long.");
      return;
    }

    const sourceBalance = Number(user?.profitBalance || 0);

    if (amountNum > sourceBalance) {
      setWithdrawError("Insufficient profit balance.");
      return;
    }

    createWithdrawalMutation.mutate();
  };

  const handleWalletAddressChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setWithdrawWallet(value);
    setWalletAddressError(null);
    setWithdrawError(null);
    
    // Real-time validation feedback
    if (value.trim() && !validateTRC20Address(value)) {
      setWalletAddressError("Invalid TRC20 address format");
    }
  };

  /* ------------------ REFERRAL TAB STATE ------------------ */

  const referralCode = user?.referralCode || "";
  const appUrl =
    process.env.NEXT_PUBLIC_APP_URL ?? "http://localhost:3000";
  const referralLink = referralCode
    ? `${appUrl}/register?ref=${referralCode}`
    : "";

  const [copyMessage, setCopyMessage] = useState<string | null>(null);

  const referralsQuery = useQuery<ReferralEntry[]>({
    queryKey: ["myReferrals"],
    queryFn: async () => {
      const res = await api.get("/referrals/me");
      return res.data;
    },
    staleTime: 0,
    refetchOnMount: "always",
    retry: false,
  });

  const totalReferralEarnings =
    Number(user?.referralBalance || 0).toFixed(2);

  /* ------------------ WALLET TRANSACTIONS TAB STATE ------------------ */

  const [reinvestAmount, setReinvestAmount] = useState("");
  const [refToProfitAmount, setRefToProfitAmount] = useState("");

  const [walletMsg, setWalletMsg] = useState<string | null>(null);
  const [walletError, setWalletError] = useState<string | null>(null);

  const walletTransferMutation = useMutation({
    mutationFn: async (params: {
      type: "REFERRAL_TO_PROFIT" | "PROFIT_TO_TRADING";
      amount: number;
    }) => {
      return api.post("/wallet/transfer", params);
    },
    onSuccess: () => {
      setWalletError(null);
      setWalletMsg("Transfer completed successfully.");
      queryClient.invalidateQueries({ queryKey: ["currentUser"] });
      queryClient.invalidateQueries({ queryKey: ["walletTransfers"] });
      setTimeout(() => setWalletMsg(null), 2500);
    },
    onError: (err: any) => {
      const msg =
        err?.response?.data?.message ||
        "Unable to perform transfer. Please check details.";
      setWalletError(Array.isArray(msg) ? msg.join(", ") : msg);
      setWalletMsg(null);
    },
  });

  const handleReinvest = (e: React.FormEvent) => {
    e.preventDefault();
    setWalletError(null);
    setWalletMsg(null);

    const amt = Number(reinvestAmount);
    if (!amt || isNaN(amt) || amt <= 0) {
      setWalletError("Enter a valid amount to reinvest.");
      return;
    }
    if (amt > Number(user?.profitBalance || 0)) {
      setWalletError("Amount exceeds your Profit wallet balance.");
      return;
    }

    walletTransferMutation.mutate({
      type: "PROFIT_TO_TRADING",
      amount: amt,
    });
    setReinvestAmount("");
  };

  const handleRefToProfit = (e: React.FormEvent) => {
    e.preventDefault();
    setWalletError(null);
    setWalletMsg(null);

    const amt = Number(refToProfitAmount);
    if (!amt || isNaN(amt) || amt <= 0) {
      setWalletError("Enter a valid amount to transfer.");
      return;
    }
    if (amt > Number(user?.referralBalance || 0)) {
      setWalletError("Amount exceeds your Referral wallet balance.");
      return;
    }

    walletTransferMutation.mutate({
      type: "REFERRAL_TO_PROFIT",
      amount: amt,
    });
    setRefToProfitAmount("");
  };

  /* ------------------ TRANSACTIONS HISTORY TAB STATE ------------------ */

  const walletTransfersQuery = useQuery<WalletTransfer[]>({
    queryKey: ["walletTransfers"],
    queryFn: async () => {
      const res = await api.get("/wallet/transfers");
      // Map backend response (from/to) to frontend type (fromWallet/toWallet)
      return res.data.map((t: any) => ({
        ...t,
        fromWallet: t.from,
        toWallet: t.to,
      }));
    },
    staleTime: 0,
    refetchOnMount: "always",
  });

  const profitLogsQuery = useQuery<ProfitLog[]>({
    queryKey: ["profitLogs"],
    queryFn: async () => {
      const res = await api.get("/users/me/profit-logs");
      return res.data;
    },
    staleTime: 0,
    refetchOnMount: "always",
  });

  const handleCopyReferral = async () => {
    if (!referralLink) return;
    await navigator.clipboard.writeText(referralLink);
    setCopyMessage("Referral link copied.");
    setTimeout(() => setCopyMessage(null), 2000);
  };

  /* ------------------ RENDER ------------------ */

  return (
    <main className="space-y-6">
      {/* Page header */}
      <section className="mb-4 space-y-3">
          <h1 className="text-xl md:text-2xl font-semibold tracking-tight">
          Profile
          </h1>

        {/* Wallet overview under title */}
        <div className="grid gap-3 text-xs grid-cols-1 sm:grid-cols-2 md:grid-cols-3">
          <div className="rounded-2xl border border-slate-800 bg-slate-950/70 px-3 py-2">
            <p className="text-[11px] uppercase tracking-wide text-slate-400">
              Trading account
            </p>
            <p className="mt-1 text-sm font-semibold text-sky-300">
              {Number(user?.tradingBalance || 0).toFixed(2)} USDT
            </p>
          </div>

          <div className="rounded-2xl border border-slate-800 bg-slate-950/70 px-3 py-2">
            <p className="text-[11px] uppercase tracking-wide text-slate-400">
              Profit wallet
            </p>
            <p className="mt-1 text-sm font-semibold text-sky-300">
              {Number(user?.profitBalance || 0).toFixed(2)} USDT
            </p>
          </div>

          <div className="rounded-2xl border border-slate-800 bg-slate-950/70 px-3 py-2 sm:col-span-2 md:col-span-1">
            <p className="text-[11px] uppercase tracking-wide text-slate-400">
              Referral wallet
            </p>
            <p className="mt-1 text-sm font-semibold text-sky-300">
              {Number(user?.referralBalance || 0).toFixed(2)} USDT
            </p>
          </div>
        </div>
      </section>

      {/* Mobile: Horizontal tabs, Desktop: 2-column layout */}
      {/* Mobile horizontal tabs */}
      <div className="mb-4 md:hidden sticky top-14 z-30 bg-slate-950/95 backdrop-blur-sm border-b border-slate-800/50 -mx-4 px-4 pb-2 pt-2">
        <div className="overflow-x-auto scrollbar-hide">
          <nav className="flex gap-2.5 pb-1 min-w-max">
            {tabs.map((tab) => (
              <button
                key={tab.key}
                type="button"
                onClick={() => setActiveTab(tab.key)}
                className={cn(
                  "whitespace-nowrap rounded-full px-4 py-2.5 text-xs font-medium transition-all",
                  "border min-w-[90px] flex-shrink-0 text-center",
                  "active:scale-95 touch-manipulation",
                  activeTab === tab.key
                    ? "border-sky-500/70 bg-sky-500/20 text-sky-200 shadow-[0_0_20px_rgba(56,189,248,0.4)] font-semibold scale-105"
                    : "border-slate-700/80 bg-slate-900/80 text-slate-300 hover:border-slate-600 hover:bg-slate-900/90"
                )}
              >
                {tab.label}
              </button>
            ))}
          </nav>
        </div>
      </div>

      {/* 2-column layout for desktop */}
      <section className="grid gap-4 md:grid-cols-12">
        {/* LEFT: vertical sidebar menu (desktop only) */}
        <Card className="hidden md:block glass-card p-0 overflow-hidden md:col-span-3">
          <nav className="flex flex-col divide-y divide-slate-800/80">
            {tabs.map((tab) => (
              <button
                key={tab.key}
                type="button"
                onClick={() => setActiveTab(tab.key)}
                className={cn(
                  "w-full px-4 py-3 text-left text-sm transition",
                  "hover:bg-slate-900/80",
                  activeTab === tab.key
                    ? "bg-slate-900/90 text-sky-300 font-medium"
                    : "text-slate-200"
                )}
              >
                {tab.label}
              </button>
            ))}
          </nav>
        </Card>

        {/* RIGHT: content area */}
        <Card className="glass-card md:col-span-9 md:col-start-4">
          <CardHeader className="pb-3 px-4 sm:px-6">
            <CardTitle className="text-sm font-semibold text-slate-100">
              {activeTab === "account" && "Account details"}
              {activeTab === "deposit" && "Deposit"}
              {activeTab === "withdraw" && "Withdraw"}
              {activeTab === "referral" && "Referral program"}
              {activeTab === "wallet" && "Wallet transactions"}
              {activeTab === "history" && "Transactions history"}
          </CardTitle>
        </CardHeader>
          <CardContent className="text-sm text-slate-200 px-4 sm:px-6">
            {/* --------------- ACCOUNT TAB --------------- */}
            {activeTab === "account" && (
              <div className="space-y-6">
                {!mounted || isLoading ? (
                  <p className="text-xs text-slate-400">
                    Loading profile…
                  </p>
                ) : (
                  <>
                    {/* Profile form */}
                    <section className="space-y-3">
                      <h2 className="text-xs font-semibold uppercase tracking-wide text-slate-400">
                        Profile information
                      </h2>

                      {profileError && (
                        <div className="rounded-md border border-red-500/40 bg-red-500/10 px-3 py-2 text-xs text-red-300">
                          {profileError}
                        </div>
                      )}
                      {profileMessage && (
                        <div className="rounded-md border border-emerald-500/40 bg-emerald-500/10 px-3 py-2 text-xs text-emerald-300">
                          {profileMessage}
                        </div>
                      )}

                      <form
                        onSubmit={handleProfileSubmit}
                        className="space-y-3"
                      >
                        <div className="grid gap-3 md:grid-cols-2">
                          <div className="space-y-1">
                            <label className="text-xs text-slate-300">
                              First name
                            </label>
                            <input
                              type="text"
                              required
                              value={firstName}
                              onChange={(e) =>
                                setFirstName(e.target.value)
                              }
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
                              onChange={(e) =>
                                setLastName(e.target.value)
                              }
                              className="w-full rounded-md border border-slate-700 bg-slate-900/80 px-3 py-2 text-sm text-white outline-none focus:border-sky-500"
                            />
                          </div>
                        </div>

                        <div className="space-y-1">
                          <label className="text-xs text-slate-300">
                            Email
                          </label>
                          <input
                            type="email"
                            value={user?.email || ""}
                            disabled
                            className="w-full rounded-md border border-slate-700 bg-slate-900/60 px-3 py-2 text-sm text-slate-400 outline-none"
                          />
                          <p className="text-[11px] text-slate-500">
                            Email changes are managed by the administrator.
                          </p>
                        </div>

                        <div className="flex justify-end">
                          <Button
                            type="submit"
                            className="w-full sm:w-auto h-8 rounded-full bg-sky-500 hover:bg-sky-400 text-xs font-semibold"
                            disabled={updateProfileMutation.isPending}
                          >
                            {updateProfileMutation.isPending
                              ? "Saving…"
                              : "Save changes"}
                          </Button>
                        </div>
                      </form>
                    </section>

                    <hr className="border-slate-800/80" />

                    {/* Change password */}
                    <section className="space-y-3">
                      <h2 className="text-xs font-semibold uppercase tracking-wide text-slate-400">
                        Change password
                      </h2>

                      {passwordError && (
                        <div className="rounded-md border border-red-500/40 bg-red-500/10 px-3 py-2 text-xs text-red-300">
                          {passwordError}
                        </div>
                      )}
                      {passwordMessage && (
                        <div className="rounded-md border border-emerald-500/40 bg-emerald-500/10 px-3 py-2 text-xs text-emerald-300">
                          {passwordMessage}
                        </div>
                      )}

                      <form
                        onSubmit={handlePasswordSubmit}
                        className="space-y-3"
                      >
                        <div className="space-y-1">
                          <label className="text-xs text-slate-300">
                            Current password
                          </label>
                          <PasswordInput
                              value={currentPassword}
                            onChange={(e) => setCurrentPassword(e.target.value)}
                              placeholder="••••••••"
                            required
                            disabled={changePasswordMutation.isPending}
                          />
                        </div>

                        <div className="grid gap-3 md:grid-cols-2">
                          <div className="space-y-1">
                            <label className="text-xs text-slate-300">
                              New password
                            </label>
                            <PasswordInput
                                value={newPassword}
                              onChange={(e) => setNewPassword(e.target.value)}
                                placeholder="Minimum 8 characters"
                              required
                              disabled={changePasswordMutation.isPending}
                            />
                          </div>
                          <div className="space-y-1">
                            <label className="text-xs text-slate-300">
                              Confirm new password
                            </label>
                            <PasswordInput
                                value={confirmNewPassword}
                              onChange={(e) => setConfirmNewPassword(e.target.value)}
                                placeholder="Re-enter new password"
                              required
                              disabled={changePasswordMutation.isPending}
                            />
                          </div>
                        </div>

                        <p className="text-[11px] text-slate-500">
                          Use at least 8 characters. Avoid reusing your old
                          passwords.
                        </p>

                        <div className="flex justify-end">
                          <Button
                            type="submit"
                            className="w-full sm:w-auto h-8 rounded-full bg-sky-500 hover:bg-sky-400 text-xs font-semibold"
                            disabled={changePasswordMutation.isPending}
                          >
                            {changePasswordMutation.isPending
                              ? "Updating…"
                              : "Update password"}
                          </Button>
                        </div>
                      </form>
                    </section>
                  </>
                )}
              </div>
            )}

            {/* --------------- DEPOSIT TAB --------------- */}
            {activeTab === "deposit" && (
              <div className="space-y-5">
                <Trc20DepositPanel />

                <section className="space-y-3">
                  <h2 className="text-xs font-semibold uppercase tracking-wide text-slate-400">
                    New deposit
                  </h2>

                  {depositError && (
                    <div className="rounded-md border border-red-500/40 bg-red-500/10 px-3 py-2 text-xs text-red-300">
                      {depositError}
                    </div>
                  )}
                  {depositMessage && (
                    <div className="rounded-md border border-emerald-500/40 bg-emerald-500/10 px-3 py-2 text-xs text-emerald-300">
                      {depositMessage}
                    </div>
                  )}

                  <form
                    onSubmit={handleDepositSubmit}
                    className="space-y-3"
                  >
                    <div className="grid gap-3 grid-cols-1 md:grid-cols-2">
                      <div className="space-y-1">
                        <label className="text-xs text-slate-300">
                          Amount (USDT)
                        </label>
                        <input
                          type="number"
                          min={10}
                          step="0.01"
                          value={depositAmount}
                          onChange={(e) =>
                            setDepositAmount(e.target.value)
                          }
                          className="w-full rounded-md border border-slate-700 bg-slate-900/80 px-3 py-2 text-sm text-white outline-none focus:border-sky-500"
                          placeholder="Minimum 10 USDT"
                        />
                      </div>
                      <div className="space-y-1">
                        <label className="text-xs text-slate-300">
                          Transaction hash (TXID)
                        </label>
                        <input
                          type="text"
                          value={depositTxHash}
                          onChange={(e) =>
                            setDepositTxHash(e.target.value)
                          }
                          className="w-full rounded-md border border-slate-700 bg-slate-900/80 px-3 py-2 text-sm text-white outline-none focus:border-sky-500"
                          placeholder="Paste your blockchain TXID"
                        />
                      </div>
                    </div>

                    <p className="text-[11px] text-slate-500">
                      After sending USDT to the TRC20 address above, paste
                      your transaction hash here. Admin will verify and
                      approve your deposit.
                    </p>

                    <div className="flex justify-end">
                      <Button
                        type="submit"
                        className="w-full sm:w-auto h-8 rounded-full bg-sky-500 hover:bg-sky-400 text-xs font-semibold"
                        disabled={createDepositMutation.isPending}
                      >
                        {createDepositMutation.isPending
                          ? "Submitting…"
                          : "Submit deposit"}
                      </Button>
                    </div>
                  </form>
                </section>

                <section className="space-y-2">
                  <h2 className="text-xs font-semibold uppercase tracking-wide text-slate-400">
                    Deposit history
                  </h2>
                  {myDepositsQuery.isLoading ? (
                    <p className="text-xs text-slate-400">
                      Loading deposits…
                    </p>
                  ) : !myDepositsQuery.data ||
                    myDepositsQuery.data.length === 0 ? (
                    <p className="text-xs text-slate-400">
                      No deposits yet.
                    </p>
                  ) : (
                    <div className="overflow-x-auto rounded-xl border border-slate-800 bg-slate-950/40 -mx-1 sm:mx-0">
                      <table className="min-w-full text-[10px] sm:text-[11px] md:text-xs">
                        <thead>
                          <tr className="border-b border-slate-800/80 bg-slate-900/70">
                            <th className="px-2 sm:px-3 py-2 text-left font-normal text-slate-400">
                              Date
                            </th>
                            <th className="px-2 sm:px-3 py-2 text-right font-normal text-slate-400">
                              Amount
                            </th>
                            <th className="px-2 sm:px-3 py-2 text-left font-normal text-slate-400">
                              TX hash
                            </th>
                            <th className="px-2 sm:px-3 py-2 text-left font-normal text-slate-400">
                              Status
                            </th>
                          </tr>
                        </thead>
                        <tbody>
                          {myDepositsQuery.data.map((d) => (
                            <tr
                              key={d.id}
                              className="border-b border-slate-900/60 last:border-none"
                            >
                              <td className="px-2 sm:px-3 py-2">
                                {new Date(
                                  d.createdAt
                                ).toLocaleString()}
                              </td>
                              <td className="px-2 sm:px-3 py-2 text-right">
                                {Number(d.amount).toFixed(2)} USDT
                              </td>
                              <td className="px-2 sm:px-3 py-2 max-w-[120px] sm:max-w-[180px] truncate text-[9px] sm:text-[11px]">
                                {d.txHash}
                              </td>
                              <td className="px-2 sm:px-3 py-2">
                                <span
                                  className={cn(
                                    "rounded-full px-1.5 sm:px-2 py-[2px] text-[9px] sm:text-[10px] uppercase tracking-wide",
                                    d.status === "APPROVED" &&
                                      "bg-emerald-500/10 text-emerald-300 border border-emerald-500/40",
                                    d.status === "PENDING" &&
                                      "bg-amber-500/10 text-amber-300 border border-amber-500/40",
                                    d.status === "REJECTED" &&
                                      "bg-rose-500/10 text-rose-300 border border-rose-500/40"
                                  )}
                                >
                                  {d.status}
                                </span>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  )}
                </section>
              </div>
            )}

            {/* --------------- WITHDRAW TAB --------------- */}
            {activeTab === "withdraw" && (
              <div className="space-y-5">
                <section className="space-y-3">
                  <h2 className="text-xs font-semibold uppercase tracking-wide text-slate-400">
                    Request withdrawal
                  </h2>

                  {withdrawError && (
                    <div className="rounded-md border border-red-500/40 bg-red-500/10 px-3 py-2 text-xs text-red-300">
                      {withdrawError}
                    </div>
                  )}
                  {withdrawMessage && (
                    <div className="rounded-md border border-emerald-500/40 bg-emerald-500/10 px-3 py-2 text-xs text-emerald-300">
                      {withdrawMessage}
                    </div>
                  )}

                  <form
                    onSubmit={handleWithdrawSubmit}
                    className="space-y-3"
                  >
                    <div className="grid gap-3 grid-cols-1 md:grid-cols-2">
                      <div className="space-y-1">
                        <label className="text-xs text-slate-300">
                          Source
                        </label>
                        <div className="w-full rounded-md border border-slate-700 bg-slate-900/60 px-3 py-2 text-sm text-slate-400">
                          Profit wallet (
                          {Number(
                            user?.profitBalance || 0
                          ).toFixed(2)}{" "}
                          USDT)
                        </div>
                      </div>

                      <div className="space-y-1">
                        <label className="text-xs text-slate-300">
                          Amount (USDT)
                        </label>
                        <input
                          type="number"
                          min={10}
                          step="0.01"
                          value={withdrawAmount}
                          onChange={(e) =>
                            setWithdrawAmount(e.target.value)
                          }
                          className="w-full rounded-md border border-slate-700 bg-slate-900/80 px-3 py-2 text-sm text-white outline-none focus:border-sky-500"
                          placeholder="Minimum 10 USDT"
                        />
                      </div>
                    </div>

                    <div className="space-y-1">
                      <label className="text-xs text-slate-300">
                        <span className="block sm:inline">Withdrawal wallet address</span>
                        <span className="block sm:inline text-[10px] sm:text-xs text-slate-400"> (TRC20 USDT)</span>
                      </label>
                      <input
                        type="text"
                        value={withdrawWallet}
                        onChange={handleWalletAddressChange}
                        className={cn(
                          "w-full rounded-md border bg-slate-900/80 px-3 py-2 text-sm text-white outline-none transition-colors",
                          walletAddressError
                            ? "border-red-500/50 focus:border-red-500"
                            : withdrawWallet && validateTRC20Address(withdrawWallet)
                            ? "border-emerald-500/50 focus:border-emerald-500"
                            : "border-slate-700 focus:border-sky-500"
                        )}
                        placeholder="Txxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx"
                      />
                      {walletAddressError && (
                        <p className="text-[10px] sm:text-[11px] text-red-400 flex items-center gap-1">
                          <svg className="w-3 h-3 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                          </svg>
                          {walletAddressError}
                        </p>
                      )}
                      {withdrawWallet && validateTRC20Address(withdrawWallet) && !walletAddressError && (
                        <p className="text-[10px] sm:text-[11px] text-emerald-400 flex items-center gap-1">
                          <svg className="w-3 h-3 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                          </svg>
                          Valid TRC20 address
                        </p>
                      )}
                    </div>

                    {/* Instructions Card */}
                    <div className="rounded-lg border border-blue-500/20 bg-blue-500/5 p-3 space-y-2">
                      <div className="flex items-start gap-2">
                        <svg className="w-4 h-4 text-blue-400 shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                        <div className="flex-1 space-y-1.5">
                          <p className="text-[10px] sm:text-[11px] font-semibold text-blue-300">Important Instructions:</p>
                          <ul className="text-[10px] sm:text-[11px] text-slate-400 space-y-1 list-disc list-inside">
                            <li>Only TRC20 (Tron) network addresses are supported</li>
                            <li>Address must start with 'T' and be exactly 34 characters</li>
                            <li>Double-check your address before submitting - transactions cannot be reversed</li>
                            <li>Minimum withdrawal: 10 USDT</li>
                            <li>A 5% processing fee will be deducted from your withdrawal amount</li>
                            <li>Withdrawals are processed within 24-48 hours after approval</li>
                          </ul>
                        </div>
                      </div>
                    </div>

                    <p className="text-[10px] sm:text-[11px] text-slate-500">
                      Minimum withdrawal is 10 USDT. A 5% fee will be
                      deducted from the amount you request.
                    </p>

                    <div className="flex justify-end">
                      <Button
                        type="submit"
                        className="w-full sm:w-auto h-8 rounded-full bg-sky-500 hover:bg-sky-400 text-xs font-semibold"
                        disabled={createWithdrawalMutation.isPending}
                      >
                        {createWithdrawalMutation.isPending
                          ? "Submitting…"
                          : "Request withdrawal"}
                      </Button>
                    </div>
                  </form>
                </section>

                <section className="space-y-2">
                  <h2 className="text-xs font-semibold uppercase tracking-wide text-slate-400">
                    Withdrawal history
                  </h2>
                  {myWithdrawalsQuery.isLoading ? (
                    <p className="text-xs text-slate-400">
                      Loading withdrawals…
                    </p>
                  ) : !myWithdrawalsQuery.data ||
                    myWithdrawalsQuery.data.length === 0 ? (
                    <p className="text-xs text-slate-400">
                      No withdrawals yet.
                    </p>
                  ) : (
                    <>
                      {/* Mobile: Card layout */}
                      <div className="block sm:hidden space-y-2">
                        {myWithdrawalsQuery.data.map((w) => (
                          <div
                            key={w.id}
                            className="rounded-xl border border-slate-800 bg-slate-950/40 p-3 space-y-2"
                          >
                            <div className="flex items-center justify-between">
                              <span
                                className={cn(
                                  "rounded-full px-2 py-1 text-[9px] uppercase tracking-wide",
                                  w.status === "APPROVED" &&
                                    "bg-emerald-500/10 text-emerald-300 border border-emerald-500/40",
                                  w.status === "PENDING" &&
                                    "bg-amber-500/10 text-amber-300 border border-amber-500/40",
                                  w.status === "REJECTED" &&
                                    "bg-rose-500/10 text-rose-300 border border-rose-500/40"
                                )}
                              >
                                {w.status}
                              </span>
                              <span className="text-sky-300 font-medium text-xs">
                                {Number(w.netAmount).toFixed(2)} USDT
                              </span>
                            </div>
                            <div className="grid grid-cols-2 gap-2 text-[10px]">
                              <div>
                                <span className="text-slate-400">Source: </span>
                                <span className="text-slate-200">
                                  {w.source === "PROFIT" ? "PROFIT" : "TRADING"}
                                </span>
                              </div>
                              <div>
                                <span className="text-slate-400">Amount: </span>
                                <span className="text-slate-200">
                                  {Number(w.amount).toFixed(2)} USDT
                                </span>
                              </div>
                              <div>
                                <span className="text-slate-400">Fee: </span>
                                <span className="text-slate-200">
                                  {Number(w.fee).toFixed(2)} USDT
                                </span>
              </div>
              <div>
                                <span className="text-slate-400">Date: </span>
                                <span className="text-slate-200">
                                  {new Date(w.createdAt).toLocaleDateString()}
                                </span>
                              </div>
                            </div>
                            {w.walletAddress && (
                              <div className="pt-1 border-t border-slate-800">
                                <span className="text-[9px] text-slate-400">Wallet: </span>
                                <span className="text-[10px] text-slate-300 break-all">
                                  {w.walletAddress}
                                </span>
                              </div>
                            )}
                          </div>
                        ))}
                      </div>

                      {/* Desktop: Table layout */}
                      <div className="hidden sm:block overflow-x-auto rounded-xl border border-slate-800 bg-slate-950/40">
                        <table className="min-w-full text-[11px] md:text-xs">
                          <thead>
                            <tr className="border-b border-slate-800/80 bg-slate-900/70">
                              <th className="px-3 py-2 text-left font-normal text-slate-400">
                                Date
                              </th>
                              <th className="px-3 py-2 text-left font-normal text-slate-400">
                                Source
                              </th>
                              <th className="px-3 py-2 text-right font-normal text-slate-400">
                                Amount
                              </th>
                              <th className="px-3 py-2 text-right font-normal text-slate-400">
                                Fee
                              </th>
                              <th className="px-3 py-2 text-right font-normal text-slate-400">
                                Net
                              </th>
                              <th className="px-3 py-2 text-left font-normal text-slate-400">
                                Wallet
                              </th>
                              <th className="px-3 py-2 text-left font-normal text-slate-400">
                                Status
                              </th>
                            </tr>
                          </thead>
                          <tbody>
                            {myWithdrawalsQuery.data.map((w) => (
                              <tr
                                key={w.id}
                                className="border-b border-slate-900/60 last:border-none"
                              >
                                <td className="px-3 py-2">
                                  {new Date(
                                    w.createdAt
                                  ).toLocaleString()}
                                </td>
                                <td className="px-3 py-2">
                                  {w.source === "PROFIT"
                                    ? "PROFIT"
                                    : "TRADING"}
                                </td>
                                <td className="px-3 py-2 text-right">
                                  {Number(w.amount).toFixed(2)} USDT
                                </td>
                                <td className="px-3 py-2 text-right">
                                  {Number(w.fee).toFixed(2)} USDT
                                </td>
                                <td className="px-3 py-2 text-right">
                                  {Number(w.netAmount).toFixed(2)} USDT
                                </td>
                                <td className="px-3 py-2 max-w-[180px] truncate">
                                  {w.walletAddress || "-"}
                                </td>
                                <td className="px-3 py-2">
                                  <span
                                    className={cn(
                                      "rounded-full px-2 py-[2px] text-[10px] uppercase tracking-wide",
                                      w.status === "APPROVED" &&
                                        "bg-emerald-500/10 text-emerald-300 border border-emerald-500/40",
                                      w.status === "PENDING" &&
                                        "bg-amber-500/10 text-amber-300 border border-amber-500/40",
                                      w.status === "REJECTED" &&
                                        "bg-rose-500/10 text-rose-300 border border-rose-500/40"
                                    )}
                                  >
                                    {w.status}
                                  </span>
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    </>
                  )}
                </section>
              </div>
            )}

            {/* --------------- REFERRAL TAB --------------- */}
            {activeTab === "referral" && (
              <div className="space-y-5">
                <section className="space-y-3">
                  <h2 className="text-xs font-semibold uppercase tracking-wide text-slate-400">
                    Your referral link
                  </h2>

                    <div className="grid gap-3 grid-cols-1 sm:grid-cols-2">
                      <div className="space-y-1">
                        <label className="text-xs text-slate-300">
                          Referral code
                        </label>
                        <div className="rounded-md border border-slate-700 bg-slate-900 px-3 py-2 text-sm">
                          {referralCode || "Not assigned yet"}
                        </div>
                      </div>
                      <div className="space-y-1">
                        <label className="text-xs text-slate-300">
                          Total referral earnings
                        </label>
                        <div className="rounded-md border border-slate-700 bg-slate-900 px-3 py-2 text-sm text-emerald-300">
                          {totalReferralEarnings} USDT
                        </div>
                      </div>
                    </div>

                  <div className="space-y-1">
                    <label className="text-xs text-slate-300">
                      Referral link
                    </label>
                    <div className="flex flex-col gap-2 sm:flex-row sm:items-center">
                      <div className="flex-1 rounded-md border border-slate-700 bg-slate-900 px-3 py-2 text-xs break-all text-slate-100">
                        {referralLink ||
                          "Link will appear once you have a referral code."}
                      </div>
                      <Button
                        size="sm"
                        variant="outline"
                        className="text-xs border-slate-700 bg-slate-900/80 text-slate-200 hover:bg-slate-800 hover:text-white hover:border-slate-600 disabled:opacity-50 disabled:cursor-not-allowed whitespace-nowrap"
                        onClick={handleCopyReferral}
                        disabled={!referralLink}
                      >
                        Copy
                      </Button>
                    </div>
                    {copyMessage && (
                      <p className="text-[11px] text-emerald-300">
                        {copyMessage}
                      </p>
                    )}
                    <p className="text-[11px] text-slate-500">
                      Share this link with investors. You will earn 5% of
                      their first deposit, credited to your referral wallet.
                    </p>
                  </div>
                </section>

                <section className="space-y-2">
                  <h2 className="text-xs font-semibold uppercase tracking-wide text-slate-400">
                    Invited users
                  </h2>
                  {referralsQuery.isLoading ? (
                    <p className="text-xs text-slate-400">
                      Loading referrals…
                    </p>
                  ) : referralsQuery.isError ? (
                    <p className="text-xs text-red-400">
                      Error loading referrals. Please try again.
                    </p>
                  ) : !referralsQuery.data ||
                    referralsQuery.data.length === 0 ? (
                    <p className="text-xs text-slate-400">
                      No referred users yet.
                    </p>
                  ) : (
                    <div className="overflow-x-auto rounded-xl border border-slate-800 bg-slate-950/40 -mx-1 sm:mx-0">
                      <table className="min-w-full text-[10px] sm:text-[11px] md:text-xs">
                        <thead>
                          <tr className="border-b border-slate-800/80 bg-slate-900/70">
                            <th className="px-2 sm:px-3 py-2 text-left font-normal text-slate-400">
                              Date
                            </th>
                            <th className="px-2 sm:px-3 py-2 text-left font-normal text-slate-400">
                              User
                            </th>
                            <th className="px-2 sm:px-3 py-2 text-right font-normal text-slate-400">
                              First deposit
                            </th>
                          </tr>
                        </thead>
                        <tbody>
                          {referralsQuery.data.map((r) => (
                            <tr
                              key={r.id}
                              className="border-b border-slate-900/60 last:border-none"
                            >
                              <td className="px-2 sm:px-3 py-2">
                                {new Date(
                                  r.createdAt
                                ).toLocaleString()}
                              </td>
                              <td className="px-2 sm:px-3 py-2">
                                {r.referredEmail}
                              </td>
                              <td className="px-2 sm:px-3 py-2 text-right">
                                {r.firstDepositAmount
                                  ? `${Number(
                                      r.firstDepositAmount
                                    ).toFixed(2)} USDT`
                                  : "Not deposited yet"}
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  )}
                </section>
              </div>
            )}

            {/* --------------- WALLET TRANSACTIONS TAB (actions) --------------- */}
            {activeTab === "wallet" && (
              <div className="space-y-5">
                <section className="space-y-2">
                  <h2 className="text-xs font-semibold uppercase tracking-wide text-slate-400">
                    Wallet balances
                  </h2>
                  <div className="grid gap-3 grid-cols-1 sm:grid-cols-2 md:grid-cols-3 text-xs">
                    <div className="rounded-xl border border-slate-700 bg-slate-900/70 px-3 py-2">
                      <p className="text-slate-400">Trading wallet</p>
                      <p className="mt-1 text-sm font-semibold text-sky-300">
                        {Number(user?.tradingBalance || 0).toFixed(2)} USDT
                      </p>
                    </div>
                    <div className="rounded-xl border border-slate-700 bg-slate-900/70 px-3 py-2">
                      <p className="text-slate-400">Profit wallet</p>
                      <p className="mt-1 text-sm font-semibold text-sky-300">
                        {Number(user?.profitBalance || 0).toFixed(2)} USDT
                      </p>
                    </div>
                    <div className="rounded-xl border border-slate-700 bg-slate-900/70 px-3 py-2 sm:col-span-2 md:col-span-1">
                      <p className="text-slate-400">Referral wallet</p>
                      <p className="mt-1 text-sm font-semibold text-sky-300">
                        {Number(user?.referralBalance || 0).toFixed(2)} USDT
                      </p>
                    </div>
                  </div>
                </section>

                {walletError && (
                  <div className="rounded-md border border-red-500/40 bg-red-500/10 px-3 py-2 text-xs text-red-300">
                    {walletError}
                  </div>
                )}
                {walletMsg && (
                  <div className="rounded-md border border-emerald-500/40 bg-emerald-500/10 px-3 py-2 text-xs text-emerald-300">
                    {walletMsg}
                  </div>
                )}

                <section className="grid gap-4 grid-cols-1 md:grid-cols-2">
                  {/* Reinvest profit → Trading */}
                  <form
                    onSubmit={handleReinvest}
                    className="space-y-3 rounded-2xl border border-slate-800 bg-slate-950/60 px-3 py-3 sm:px-4"
                  >
                    <h3 className="text-xs font-semibold text-slate-200">
                      Reinvest profit to Trading
                    </h3>
                    <p className="text-[11px] text-slate-500">
                      Move funds from your Profit wallet back into your Trading wallet to
                      compound future daily profits.
                    </p>

                    <div className="space-y-1">
                      <label className="text-xs text-slate-300">Amount (USDT)</label>
                      <input
                        type="number"
                        min={0}
                        step="0.01"
                        value={reinvestAmount}
                        onChange={(e) => setReinvestAmount(e.target.value)}
                        className="w-full rounded-md border border-slate-700 bg-slate-900/80 px-3 py-2 text-sm text-white outline-none focus:border-sky-500"
                        placeholder="Enter amount"
                      />
                      <button
                        type="button"
                        className="mt-1 text-[11px] text-sky-400 hover:text-sky-300"
                        onClick={() =>
                          setReinvestAmount(
                            Number(user?.profitBalance || 0).toFixed(2)
                          )
                        }
                      >
                        Use max ({Number(user?.profitBalance || 0).toFixed(2)} USDT)
                      </button>
                    </div>

                    <div className="flex justify-end">
                      <Button
                        type="submit"
                        className="w-full sm:w-auto h-8 rounded-full bg-sky-500 hover:bg-sky-400 text-xs font-semibold"
                        disabled={walletTransferMutation.isPending}
                      >
                        {walletTransferMutation.isPending
                          ? "Processing…"
                          : "Reinvest to Trading"}
                      </Button>
                    </div>
                  </form>

                  {/* Referral → Profit */}
                  <form
                    onSubmit={handleRefToProfit}
                    className="space-y-3 rounded-2xl border border-slate-800 bg-slate-950/60 px-3 py-3 sm:px-4"
                  >
                    <h3 className="text-xs font-semibold text-slate-200">
                      Move Referral rewards to Profit
                    </h3>
                    <p className="text-[11px] text-slate-500">
                      Transfer your referral earnings into your Profit wallet, so they
                      start receiving daily profit.
                    </p>

                    <div className="space-y-1">
                      <label className="text-xs text-slate-300">Amount (USDT)</label>
                      <input
                        type="number"
                        min={0}
                        step="0.01"
                        value={refToProfitAmount}
                        onChange={(e) => setRefToProfitAmount(e.target.value)}
                        className="w-full rounded-md border border-slate-700 bg-slate-900/80 px-3 py-2 text-sm text-white outline-none focus:border-sky-500"
                        placeholder="Enter amount"
                      />
                      <button
                        type="button"
                        className="mt-1 text-[11px] text-sky-400 hover:text-sky-300"
                        onClick={() =>
                          setRefToProfitAmount(
                            Number(user?.referralBalance || 0).toFixed(2)
                          )
                        }
                      >
                        Use max ({Number(user?.referralBalance || 0).toFixed(2)} USDT)
                      </button>
                    </div>

                    <div className="flex justify-end">
                      <Button
                        type="submit"
                        className="w-full sm:w-auto h-8 rounded-full bg-sky-500 hover:bg-sky-400 text-xs font-semibold"
                        disabled={walletTransferMutation.isPending}
                      >
                        {walletTransferMutation.isPending
                          ? "Processing…"
                          : "Transfer to Profit"}
                      </Button>
                    </div>
                  </form>
                </section>
              </div>
            )}

            {/* --------------- TRANSACTIONS HISTORY TAB --------------- */}
            {activeTab === "history" && (
              <div className="space-y-3">
              <div>
                  <h2 className="text-xs font-semibold uppercase tracking-wide text-slate-400">
                    Transactions History
                  </h2>
                  <p className="text-[11px] text-slate-500">
                    Internal wallet transfers and daily profit generations.
                  </p>
                </div>

                {walletTransfersQuery.isLoading || profitLogsQuery.isLoading ? (
                  <p className="text-xs text-slate-400">Loading transactions…</p>
                ) : (() => {
                    // Merge wallet transfers and profit logs
                    const transfers = walletTransfersQuery.data || [];
                    const profits = profitLogsQuery.data || [];
                    
                    // Create unified transaction list
                    type Transaction = {
                      id: string;
                      type: "transfer" | "profit";
                      date: Date;
                      dateString: string;
                      amount: number;
                      description: string;
                      badge: string;
                    };
                    
                    const transactions: Transaction[] = [
                      ...transfers.map((t) => ({
                        id: `transfer-${t.id}`,
                        type: "transfer" as const,
                        date: new Date(t.createdAt),
                        dateString: t.createdAt,
                        amount: Number(t.amount),
                        description: t.description || `${formatWalletLabel(t.fromWallet || "TRADING")} → ${formatWalletLabel(t.toWallet || "TRADING")}`,
                        badge: `${(t.fromWallet || "UNKNOWN").toLowerCase()} → ${(t.toWallet || "UNKNOWN").toLowerCase()}`,
                      })),
                      ...profits.map((p) => ({
                        id: `profit-${p.id}`,
                        type: "profit" as const,
                        date: new Date(p.createdAt),
                        dateString: p.createdAt,
                        amount: Number(p.amount),
                        description: p.note || `Daily profit generation (${p.percentage}%)`,
                        badge: "daily profit",
                      })),
                    ];
                    
                    // Sort by date descending (newest first)
                    transactions.sort((a, b) => b.date.getTime() - a.date.getTime());
                    
                    if (transactions.length === 0) {
                      return <p className="text-xs text-slate-400">No transactions yet.</p>;
                    }
                    
                    return (
                      <>
                        {/* Mobile: Card layout */}
                        <div className="block sm:hidden space-y-2">
                          {transactions.map((tx) => (
                            <div
                              key={tx.id}
                              className="rounded-xl border border-slate-800 bg-slate-950/40 p-3 space-y-2"
                            >
                              <div className="flex items-center justify-between">
                                <span className={cn(
                                  "inline-flex items-center rounded-full border px-2 py-1 text-[9px] uppercase tracking-wide",
                                  tx.type === "profit"
                                    ? "border-emerald-700 bg-emerald-900/30 text-emerald-300"
                                    : "border-slate-700 bg-slate-900/80 text-slate-200"
                                )}>
                                  {tx.badge}
                                </span>
                                <span className={cn(
                                  "font-medium text-xs",
                                  tx.type === "profit" ? "text-emerald-400" : "text-sky-300"
                                )}>
                                  +{tx.amount.toFixed(2)} USDT
                                </span>
                              </div>
                              <div className="text-[10px] text-slate-400">
                                {new Date(tx.dateString).toLocaleString()}
                              </div>
                              <div className="text-[10px] text-slate-300">
                                {tx.description}
                              </div>
                            </div>
                          ))}
                        </div>

                        {/* Desktop: Table layout */}
                        <div className="hidden sm:block overflow-x-auto rounded-2xl border border-slate-800 bg-slate-950/40">
                          <table className="min-w-full text-[11px] md:text-xs">
                            <thead>
                              <tr className="border-b border-slate-800/80 bg-slate-900/70">
                                <th className="px-3 py-2 text-left font-normal text-slate-400">Date</th>
                                <th className="px-3 py-2 text-left font-normal text-slate-400">Type</th>
                                <th className="px-3 py-2 text-right font-normal text-slate-400">Amount</th>
                                <th className="px-3 py-2 text-left font-normal text-slate-400">Description</th>
                              </tr>
                            </thead>
                            <tbody>
                              {transactions.map((tx) => (
                                <tr
                                  key={tx.id}
                                  className="border-b border-slate-900/70 last:border-none"
                                >
                                  <td className="px-3 py-2 align-middle text-slate-300 whitespace-nowrap">
                                    {new Date(tx.dateString).toLocaleString()}
                                  </td>
                                  <td className="px-3 py-2 align-middle whitespace-nowrap">
                                    <span className={cn(
                                      "inline-flex items-center rounded-full border px-2 py-[3px] text-[10px] uppercase tracking-wide",
                                      tx.type === "profit"
                                        ? "border-emerald-700 bg-emerald-900/30 text-emerald-300"
                                        : "border-slate-700 bg-slate-900/80 text-slate-200"
                                    )}>
                                      {tx.badge}
                                    </span>
                                  </td>
                                  <td className="px-3 py-2 align-middle text-right whitespace-nowrap">
                                    <span className={cn(
                                      "font-medium",
                                      tx.type === "profit" ? "text-emerald-400" : "text-sky-300"
                                    )}>
                                      +{tx.amount.toFixed(2)} USDT
                                    </span>
                                  </td>
                                  <td className="px-3 py-2 align-middle text-left text-[11px] text-slate-400">
                                    {tx.description}
                                  </td>
                                </tr>
                              ))}
                            </tbody>
                          </table>
                        </div>
                      </>
                    );
                  })()}
              </div>
          )}
        </CardContent>
      </Card>
      </section>
    </main>
  );
}
