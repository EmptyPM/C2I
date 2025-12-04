import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { Decimal } from '@prisma/client/runtime/library';

@Injectable()
export class ReferralsService {
  constructor(private prisma: PrismaService) {}

  async getSummaryForUser(userId: number) {
    // Load the user
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
      select: {
        referralCode: true,
        referralBalance: true,
      },
    });

    if (!user) {
      throw new NotFoundException(`User with ID ${userId} not found`);
    }

    // Get total bonuses count and amount for this user (as referrer)
    const bonusesAggregate = await this.prisma.referralBonus.aggregate({
      where: {
        userId: userId, // user is the referrer (receiver)
      },
      _count: {
        id: true,
      },
      _sum: {
        amount: true,
      },
    });

    const totalBonusesCount = bonusesAggregate._count.id;
    const totalBonusesAmount = bonusesAggregate._sum.amount || new Decimal(0);

    // Count referred users (users who have this user as their referrer)
    const referredUsersCount = await this.prisma.user.count({
      where: {
        referredById: userId,
      },
    });

    return {
      referralCode: user.referralCode,
      referralBalance: user.referralBalance.toString(),
      totalBonusesCount,
      totalBonusesAmount: totalBonusesAmount.toString(),
      referredUsersCount,
    };
  }

  async getBonusesForUser(userId: number) {
    return this.prisma.referralBonus.findMany({
      where: {
        userId: userId, // user is the referrer (receiver)
      },
      include: {
        fromUser: {
          select: {
            id: true,
            email: true,
          },
        },
      },
      orderBy: {
        createdAt: 'desc',
      },
    });
  }

  async getReferredUsers(userId: number) {
    // Get all users referred by this user
    const referredUsers = await this.prisma.user.findMany({
      where: {
        referredById: userId,
      },
      select: {
        id: true,
        email: true,
        createdAt: true,
      },
      orderBy: {
        createdAt: 'desc',
      },
    });

    // For each referred user, get their first deposit amount
    const result = await Promise.all(
      referredUsers.map(async (user) => {
        const firstDeposit = await this.prisma.deposit.findFirst({
          where: {
            userId: user.id,
            status: 'APPROVED',
          },
          orderBy: {
            createdAt: 'asc',
          },
          select: {
            amount: true,
          },
        });

        return {
          id: user.id,
          referredEmail: user.email,
          firstDepositAmount: firstDeposit
            ? Number(firstDeposit.amount)
            : null,
          createdAt: user.createdAt.toISOString(),
        };
      }),
    );

    return result;
  }
}
