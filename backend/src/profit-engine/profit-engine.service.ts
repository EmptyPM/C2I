import { Injectable } from '@nestjs/common';
import { Cron } from '@nestjs/schedule';
import { PrismaService } from '../prisma/prisma.service';
import { Decimal } from '@prisma/client/runtime/library';

/**
 * Profit Engine Service
 * 
 * Profit Calculation Rules:
 * 1. Profit calculation runs at 00:00 AM (midnight) Tuesday-Saturday
 * 2. Calculates profit for the previous day (Mon-Fri only)
 * 3. Deposits approved TODAY do NOT earn profit TODAY
 * 4. Deposits start generating profit from the NEXT day
 * 5. No profit is generated on weekends (Saturday & Sunday)
 * 
 * Example:
 * - User deposits on Monday at 2 PM → Approved Monday at 3 PM
 * - Profit calculation runs Tuesday at 00:00 AM for Monday
 * - User is skipped (no profit for Monday)
 * - User starts earning profit from Tuesday onwards
 */
@Injectable()
export class ProfitEngineService {
  constructor(private prisma: PrismaService) {}

  private getDailyPercentage(tradingBalance: Decimal): number {
    const balance = parseFloat(tradingBalance.toString());

    if (balance < 10) {
      return 0; // No profit for balances below minimum
    } else if (balance >= 10 && balance <= 99) {
      return 3;
    } else if (balance >= 100 && balance <= 999) {
      return 5;
    } else {
      // 1000 and above
      return 7;
    }
  }

  async runDailyProfit(
    forDate?: Date,
    triggeredBy: 'CRON' | 'ADMIN' = 'CRON',
  ): Promise<{
    processedUsers: number;
    totalProfit: string;
    date: string;
    skipped: string | null;
  }> {
    const date = forDate ? new Date(forDate) : new Date();
    // Normalize to YYYY-MM-DD 00:00:00
    const runDate = new Date(
      date.getFullYear(),
      date.getMonth(),
      date.getDate(),
    );

    const dayOfWeek = runDate.getDay(); // 0 = Sunday, 6 = Saturday

    // Skip weekends
    if (dayOfWeek === 0 || dayOfWeek === 6) {
      return {
        processedUsers: 0,
        totalProfit: '0',
        date: runDate.toISOString(),
        skipped: 'WEEKEND',
      };
    }

    // Check if a ProfitRun already exists for this runDate
    const existing = await this.prisma.profitRun.findUnique({
      where: { runDate },
    });

    if (existing) {
      return {
        processedUsers: existing.processedUsers,
        totalProfit: existing.totalProfit.toString(),
        date: runDate.toISOString(),
        skipped: 'ALREADY_RAN',
      };
    }

    // Calculate the start of today (runDate is already normalized to 00:00:00)
    const startOfToday = new Date(runDate);
    const endOfToday = new Date(runDate);
    endOfToday.setHours(23, 59, 59, 999);

    // Fetch eligible users (ACTIVE, not frozen, tradingBalance >= 10)
    const users = await this.prisma.user.findMany({
      where: {
        status: 'ACTIVE',
        isFrozen: false,
        tradingBalance: {
          gte: new Decimal(10),
        },
      },
      select: {
        id: true,
        tradingBalance: true,
        profitBalance: true,
        deposits: {
          where: {
            status: 'APPROVED',
            approvedAt: {
              not: null,
            },
          },
          select: {
            approvedAt: true,
          },
          orderBy: {
            approvedAt: 'desc',
          },
          take: 1,
        },
      },
    });

    let processedUsers = 0;
    let totalProfit = new Decimal(0);
    const profitEntries: Array<{
      userId: number;
      profit: Decimal;
      percentage: number;
    }> = [];

    // Calculate profit for each user
    for (const user of users) {
      // IMPORTANT RULE: Deposits approved on runDate do NOT earn profit for runDate
      // Profit generation begins the NEXT day after deposit approval
      // 
      // Example: Deposit approved Monday → No profit Monday → Profit starts Tuesday
      if (user.deposits.length > 0 && user.deposits[0].approvedAt) {
        const lastApprovedDate = new Date(user.deposits[0].approvedAt);
        
        // If the last deposit was approved on the same day as runDate, skip
        // This ensures deposits only start earning profit from the next day
        if (lastApprovedDate >= startOfToday && lastApprovedDate <= endOfToday) {
          continue; // Skip - profit starts tomorrow
        }
      }

      const percentage = this.getDailyPercentage(user.tradingBalance);

      if (percentage === 0) {
        continue; // Skip users below minimum balance
      }

      // Calculate profit: tradingBalance * (percentage / 100)
      const profit = new Decimal(user.tradingBalance)
        .mul(new Decimal(percentage))
        .div(new Decimal(100));

      if (profit.gt(0)) {
        profitEntries.push({
          userId: user.id,
          profit,
          percentage,
        });
        totalProfit = totalProfit.add(profit);
      }
    }

    // Process in a transaction
    if (profitEntries.length > 0) {
      await this.prisma.$transaction(async (tx) => {
        for (const entry of profitEntries) {
          await tx.user.update({
            where: { id: entry.userId },
            data: {
              profitBalance: {
                increment: entry.profit,
              },
            },
          });

          await tx.profitLog.create({
            data: {
              userId: entry.userId,
              amount: entry.profit,
              percentage: entry.percentage,
              note: 'Daily profit',
            },
          });
        }

        // Create ProfitRun record
        await tx.profitRun.create({
          data: {
            runDate,
            triggeredBy,
            processedUsers: profitEntries.length,
            totalProfit,
          },
        });
      });

      processedUsers = profitEntries.length;
    } else {
      // Even if no users processed, create a ProfitRun record
      await this.prisma.profitRun.create({
        data: {
          runDate,
          triggeredBy,
          processedUsers: 0,
          totalProfit: new Decimal(0),
        },
      });
    }

    return {
      processedUsers,
      totalProfit: totalProfit.toString(),
      date: runDate.toISOString(),
      skipped: null,
    };
  }

  /**
   * Daily profit calculation cron job
   * Runs at 00:00 (midnight) Tuesday-Saturday
   * This calculates profit for Mon-Fri (previous day)
   * 
   * Important: Deposits approved today do NOT earn profit today.
   * Profit generation starts the next day.
   */
  @Cron('0 0 0 * * 2-6') // 00:00 Tue-Sat (calculates for Mon-Fri)
  async handleDailyCron() {
    // Calculate for yesterday (the day that just ended)
    const yesterday = new Date();
    yesterday.setDate(yesterday.getDate() - 1);
    await this.runDailyProfit(yesterday, 'CRON');
  }
}
