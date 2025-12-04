'use client';

import { useState } from 'react';
import { useMutation } from '@tanstack/react-query';
import { api } from '@/lib/api-client';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

type RunProfitResult = {
  processedUsers: number;
  totalProfit: string;
  date: string;
};

const runTodayProfit = async (): Promise<RunProfitResult> => {
  const res = await api.post('/admin/profits/run-today');
  return res.data;
};

export default function AdminProfitsPage() {
  const [lastResult, setLastResult] = useState<RunProfitResult | null>(null);

  const mutation = useMutation({
    mutationFn: runTodayProfit,
    onSuccess: (data) => {
      setLastResult(data);
    },
  });

  return (
    <main className="space-y-6 w-full">
      <h1 className="text-xl md:text-2xl font-semibold tracking-tight">Profits</h1>

      {/* full width tables */}
      <section className="w-full">
        <Card className="glass-card">
        <CardHeader className="pb-2">
          <CardTitle className="text-slate-300">Profit Engine</CardTitle>
        </CardHeader>
        <CardContent className="pt-0 space-y-6">
          <div className="bg-blue-500/10 border border-blue-500/50 rounded-lg p-4">
            <p className="text-blue-200 text-sm">
              This will run daily profit distribution for all eligible users (Mon–Fri only). Use
              with caution.
            </p>
          </div>

          <div>
            <Button
              onClick={() => mutation.mutate()}
              disabled={mutation.isPending}
              className="h-9 rounded-full bg-sky-500 hover:bg-sky-400 text-xs font-semibold text-slate-950"
            >
              {mutation.isPending ? 'Running...' : "Run today's profit now"}
            </Button>
          </div>

          {mutation.error && (
            <div className="bg-red-500/10 border border-red-500/50 rounded-lg p-4">
              <p className="text-red-200 text-sm">
                Error: {mutation.error instanceof Error ? mutation.error.message : 'Something went wrong'}
              </p>
            </div>
          )}

          {lastResult && (
            <div className="bg-green-500/10 border border-green-500/50 rounded-lg p-4 space-y-3">
              <h3 className="text-green-200 font-semibold">Last Run Result</h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                <div>
                  <p className="text-slate-400 mb-1">Processed Users</p>
                  <p className="text-white font-semibold text-lg">{lastResult.processedUsers}</p>
                </div>
                <div>
                  <p className="text-slate-400 mb-1">Total Profit</p>
                  <p className="text-white font-semibold text-lg">
                    {parseFloat(lastResult.totalProfit).toFixed(2)} USDT
                  </p>
                </div>
                <div>
                  <p className="text-slate-400 mb-1">Date</p>
                  <p className="text-white font-semibold">
                    {new Date(lastResult.date).toLocaleString()}
                  </p>
                </div>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
      </section>
    </main>
  );
}


