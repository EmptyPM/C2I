"use client";

import { useState } from "react";
import Image from "next/image";
import QRCode from "react-qr-code";
import { useQuery } from "@tanstack/react-query";
import { api } from "@/lib/api-client";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";

const fetchDepositAddress = async (): Promise<{ address: string }> => {
  const res = await api.get('/settings/deposit-address');
  return res.data;
};

export function Trc20DepositPanel() {
  const [copied, setCopied] = useState(false);

  const { data: addressData, isLoading } = useQuery({
    queryKey: ['depositAddress'],
    queryFn: fetchDepositAddress,
  });

  const depositAddress = addressData?.address || 'TRX2r4BUhMd22W8DtwNEajhRcgPJWBK4s7';

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(depositAddress);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error("Failed to copy address", err);
    }
  };

  return (
    <Card className="glass-card bg-slate-900/80 border-slate-800">
      {/* Top row: logo + title */}
      <CardHeader className="pb-3 flex flex-col gap-2 md:flex-row md:items-center md:justify-between">
        <div className="flex items-center gap-3">
          <div className="h-9 w-9 rounded-full bg-emerald-500/15 flex items-center justify-center">
            <Image
              src="/trc20-usdt.png"
              alt="TRC20-USDT"
              width={22}
              height={22}
            />
          </div>
          <div>
            <CardTitle className="text-sm font-semibold text-slate-100">
              TRC20-USDT Deposit Address
            </CardTitle>
            <p className="text-xs text-slate-400">
              Use this address for client deposits on Tron (TRC20) network only.
            </p>
          </div>
        </div>
      </CardHeader>

      {/* Middle: QR + address */}
      <CardContent className="space-y-4">
        {isLoading ? (
          <div className="flex flex-col items-center gap-4 md:flex-row md:items-center md:gap-8">
            <Skeleton className="h-[164px] w-[164px] rounded-2xl bg-slate-800/50" />
            <div className="flex-1 space-y-2 w-full">
              <Skeleton className="h-4 w-16 bg-slate-800/50" />
              <Skeleton className="h-10 w-full bg-slate-800/50 rounded-lg" />
            </div>
          </div>
        ) : (
          <div className="flex flex-col items-center gap-4 md:flex-row md:items-center md:gap-8">
            {/* QR */}
            <div className="rounded-2xl border border-slate-700/60 bg-slate-900/80 px-4 py-4 shadow-[0_18px_45px_rgba(15,23,42,0.85)]">
              <QRCode
                value={depositAddress}
                size={132}
                bgColor="transparent"
                fgColor="#ffffff"
              />
            </div>

            {/* Address */}
            <div className="flex-1 space-y-2">
              <p className="text-xs font-semibold text-slate-300">Address</p>
              <div className="flex flex-col gap-2 sm:flex-row sm:items-center">
                <div className="flex-1 rounded-lg bg-slate-900 border border-slate-700 px-3 py-2 text-xs text-slate-100 break-all">
                  {depositAddress}
                </div>
                <button
                  type="button"
                  onClick={handleCopy}
                  className="mt-1 sm:mt-0 h-8 px-4 rounded-full border border-slate-700 bg-slate-900/80 text-slate-200 hover:bg-slate-800 hover:text-white hover:border-slate-600 whitespace-nowrap text-xs font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-slate-500 disabled:opacity-50 disabled:pointer-events-none"
                >
                  {copied ? "Copied" : "Copy"}
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Bottom: instructions */}
        <div className="rounded-xl bg-slate-900/70 border border-slate-800 px-3 py-3 text-[11px] leading-relaxed text-slate-300 space-y-1.5">
          <p className="font-semibold text-slate-100 text-xs">
            Deposit instructions (TRC20-USDT)
          </p>
          <p>
            1. Copy the address above or scan the QR code and choose Tron
            (TRC20) network to deposit USDT.
          </p>
          <p>
            2. Please do not recharge other non-Tron (TRC20)-USDT assets. The
            funds will arrive in your account in about 2 to 5 minutes after
            recharging.
          </p>
          <p>
            3. If it does not arrive for a long time, please refresh the page
            or contact customer service.
          </p>
        </div>
      </CardContent>
    </Card>
  );
}


