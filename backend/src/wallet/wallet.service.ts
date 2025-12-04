import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from "@nestjs/common";
import { PrismaService } from "../prisma/prisma.service";
import { Prisma } from "@prisma/client";
import { CreateTransferDto } from "./dto/create-transfer.dto";

@Injectable()
export class WalletService {
  constructor(private readonly prisma: PrismaService) {}

  async transfer(userId: number, dto: CreateTransferDto) {
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
    });

    if (!user) throw new NotFoundException("User not found");

    if (user.status !== "ACTIVE") {
      throw new BadRequestException("Account is not active");
    }
    if (user.isFrozen) {
      throw new BadRequestException("Account is frozen");
    }

    const amount = new Prisma.Decimal(dto.amount);
    if (amount.lte(0)) {
      throw new BadRequestException("Amount must be greater than 0");
    }

    // current balances
    const trading = new Prisma.Decimal(user.tradingBalance);
    const profit = new Prisma.Decimal(user.profitBalance);
    const referral = new Prisma.Decimal(user.referralBalance);

    let from: "REFERRAL" | "PROFIT";
    let to: "PROFIT" | "TRADING";

    let newTrading = trading;
    let newProfit = profit;
    let newReferral = referral;

    if (dto.type === "REFERRAL_TO_PROFIT") {
      from = "REFERRAL";
      to = "PROFIT";

      if (referral.lt(amount)) {
        throw new BadRequestException("Insufficient referral balance");
      }

      newReferral = referral.sub(amount);
      newProfit = profit.add(amount);
    } else {
      // PROFIT_TO_TRADING
      from = "PROFIT";
      to = "TRADING";

      if (profit.lt(amount)) {
        throw new BadRequestException("Insufficient profit balance");
      }

      newProfit = profit.sub(amount);
      newTrading = trading.add(amount);
    }

    const [updatedUser, transfer] = await this.prisma.$transaction([
      this.prisma.user.update({
        where: { id: userId },
        data: {
          tradingBalance: newTrading,
          profitBalance: newProfit,
          referralBalance: newReferral,
        },
      }),

      this.prisma.walletTransfer.create({
        data: {
          userId,
          from,
          to,
          amount,
        },
      }),
    ]);

    return {
      user: {
        id: updatedUser.id,
        tradingBalance: updatedUser.tradingBalance,
        profitBalance: updatedUser.profitBalance,
        referralBalance: updatedUser.referralBalance,
      },
      transfer,
    };
  }

  async listMyTransfers(userId: number) {
    return this.prisma.walletTransfer.findMany({
      where: { userId },
      orderBy: { createdAt: "desc" },
      take: 50,
    });
  }

  async getTotalReinvested() {
    const result = await this.prisma.reinvestment.aggregate({
      _sum: {
        amount: true,
      },
      _count: {
        id: true,
      },
    });

    return {
      totalReinvested: result._sum.amount?.toString() || "0",
      totalCount: result._count.id || 0,
    };
  }
}
