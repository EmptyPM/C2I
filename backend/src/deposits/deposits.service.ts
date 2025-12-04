import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateDepositDto } from './dto/create-deposit.dto';
import { Decimal } from '@prisma/client/runtime/library';

@Injectable()
export class DepositsService {
  constructor(private prisma: PrismaService) {}

  async createDeposit(userId: number, dto: CreateDepositDto) {
    // Check user status and freeze status
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
      select: {
        id: true,
        status: true,
        isFrozen: true,
      },
    });

    if (!user) {
      throw new NotFoundException(`User with ID ${userId} not found`);
    }

    if (user.status !== 'ACTIVE') {
      throw new BadRequestException('Account is not active');
    }

    if (user.isFrozen) {
      throw new BadRequestException('Account is frozen');
    }

    return this.prisma.deposit.create({
      data: {
        userId,
        amount: new Decimal(dto.amount),
        txHash: dto.txHash,
        status: 'PENDING',
      },
    });
  }

  async getUserDeposits(userId: number) {
    return this.prisma.deposit.findMany({
      where: {
        userId,
      },
      orderBy: {
        createdAt: 'desc',
      },
    });
  }

  async getAllDeposits() {
    return this.prisma.deposit.findMany({
      include: {
        user: {
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

  async getPendingDeposits() {
    return this.prisma.deposit.findMany({
      where: {
        status: 'PENDING',
      },
      include: {
        user: {
          select: {
            id: true,
            email: true,
          },
        },
      },
      orderBy: {
        createdAt: 'asc',
      },
    });
  }

  async approveDeposit(depositId: number) {
    const deposit = await this.prisma.deposit.findUnique({
      where: { id: depositId },
    });

    if (!deposit) {
      throw new NotFoundException(`Deposit with ID ${depositId} not found`);
    }

    if (deposit.status !== 'PENDING') {
      throw new BadRequestException(
        `Deposit with ID ${depositId} is not pending`,
      );
    }

    // Load user with referredById to check for referral bonus eligibility
    const user = await this.prisma.user.findUnique({
      where: { id: deposit.userId },
      select: {
        id: true,
        referredById: true,
      },
    });

    if (!user) {
      throw new NotFoundException(`User with ID ${deposit.userId} not found`);
    }

    // Check if this is the user's first approved deposit
    let isFirstApprovedDeposit = false;
    if (user.referredById) {
      const otherApprovedDeposits = await this.prisma.deposit.count({
        where: {
          userId: deposit.userId,
          status: 'APPROVED',
          id: {
            not: depositId,
          },
        },
      });

      isFirstApprovedDeposit = otherApprovedDeposits === 0;
    }

    return this.prisma.$transaction(async (tx) => {
      // Update deposit status
      const updatedDeposit = await tx.deposit.update({
        where: { id: depositId },
        data: {
          status: 'APPROVED',
          approvedAt: new Date(),
        },
      });

      // Get current balance
      const currentBalance = await tx.user.findUnique({
        where: { id: deposit.userId },
        select: { tradingBalance: true },
      });

      if (!currentBalance) {
        throw new NotFoundException(`User with ID ${deposit.userId} not found`);
      }

      // Update user's tradingBalance
      await tx.user.update({
        where: { id: deposit.userId },
        data: {
          tradingBalance: new Decimal(currentBalance.tradingBalance).plus(
            deposit.amount,
          ),
        },
      });

      // Award referral bonus if eligible
      if (user.referredById && isFirstApprovedDeposit) {
        const bonusAmount = new Decimal(deposit.amount).mul(new Decimal(0.05));

        // Get referrer's current referralBalance
        const referrer = await tx.user.findUnique({
          where: { id: user.referredById },
          select: { referralBalance: true },
        });

        if (referrer) {
          // Update referrer's referralBalance
          await tx.user.update({
            where: { id: user.referredById },
            data: {
              referralBalance: new Decimal(referrer.referralBalance).plus(
                bonusAmount,
              ),
            },
          });

          // Create ReferralBonus record
          await tx.referralBonus.create({
            data: {
              userId: user.referredById, // referrer (receiver)
              fromUserId: user.id, // referred user (source)
              amount: bonusAmount,
            },
          });
        }
      }

      return updatedDeposit;
    });
  }

  async rejectDeposit(depositId: number) {
    const deposit = await this.prisma.deposit.findUnique({
      where: { id: depositId },
    });

    if (!deposit) {
      throw new NotFoundException(`Deposit with ID ${depositId} not found`);
    }

    if (deposit.status !== 'PENDING') {
      throw new BadRequestException(
        `Deposit with ID ${depositId} is not pending`,
      );
    }

    return this.prisma.deposit.update({
      where: { id: depositId },
      data: {
        status: 'REJECTED',
      },
    });
  }

  async getTotalInvested() {
    const result = await this.prisma.deposit.aggregate({
      where: {
        status: 'APPROVED',
      },
      _sum: {
        amount: true,
      },
    });

    return {
      totalInvested: result._sum.amount?.toString() || '0',
    };
  }
}
