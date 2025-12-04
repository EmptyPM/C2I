import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateWithdrawalDto } from './dto/create-withdrawal.dto';
import { Prisma } from '@prisma/client';

@Injectable()
export class WithdrawalsService {
  constructor(private prisma: PrismaService) {}

  async createWithdrawal(userId: number, dto: CreateWithdrawalDto) {
    const user = await this.prisma.user.findUnique({ where: { id: userId } });

    if (!user) throw new NotFoundException('User not found');

    if (user.status !== 'ACTIVE') {
      throw new BadRequestException('Account is not active');
    }

    if (user.isFrozen) {
      throw new BadRequestException('Account is frozen');
    }

    const amount = new Prisma.Decimal(dto.amount);

    if (amount.lt(10)) {
      throw new BadRequestException('Minimum withdrawal is 10 USDT');
    }

    // only PROFIT supported
    const sourceBalance = new Prisma.Decimal(user.profitBalance);

    if (sourceBalance.lt(amount)) {
      throw new BadRequestException('Insufficient balance');
    }

    const fee = amount.mul(0.05);
    const netAmount = amount.sub(fee);

    const [withdrawal] = await this.prisma.$transaction([
      this.prisma.user.update({
        where: { id: userId },
        data: { profitBalance: sourceBalance.sub(amount) },
      }),

      this.prisma.withdrawal.create({
        data: {
          userId,
          amount,
          fee,
          netAmount,
          source: dto.source,
          walletAddress: dto.walletAddress,
          status: 'PENDING',
        },
      }),
    ]);

    return withdrawal;
  }

  async getUserWithdrawals(userId: number) {
    return this.prisma.withdrawal.findMany({
      where: {
        userId,
      },
      orderBy: {
        createdAt: 'desc',
      },
    });
  }

  async getAllWithdrawals() {
    return this.prisma.withdrawal.findMany({
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

  async getPendingWithdrawals() {
    return this.prisma.withdrawal.findMany({
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

  async approveWithdrawal(id: number) {
    const withdrawal = await this.prisma.withdrawal.findUnique({
      where: { id },
    });

    if (!withdrawal) {
      throw new NotFoundException(`Withdrawal with ID ${id} not found`);
    }

    if (withdrawal.status !== 'PENDING') {
      throw new BadRequestException(
        `Withdrawal with ID ${id} is not pending`,
      );
    }

    return this.prisma.withdrawal.update({
      where: { id },
      data: {
        status: 'APPROVED',
        processedAt: new Date(),
      },
    });
  }

  async rejectWithdrawal(id: number) {
    const withdrawal = await this.prisma.withdrawal.findUnique({
      where: { id },
    });

    if (!withdrawal) {
      throw new NotFoundException(`Withdrawal with ID ${id} not found`);
    }

    if (withdrawal.status !== 'PENDING') {
      throw new BadRequestException(
        `Withdrawal with ID ${id} is not pending`,
      );
    }

    return this.prisma.$transaction(async (tx) => {
      // Update withdrawal status
      const updatedWithdrawal = await tx.withdrawal.update({
        where: { id },
        data: {
          status: 'REJECTED',
          processedAt: new Date(),
        },
      });

      // Refund the full amount to the original balance
      if (withdrawal.source === 'PROFIT') {
        await tx.user.update({
          where: { id: withdrawal.userId },
          data: {
            profitBalance: {
              increment: withdrawal.amount,
            },
          },
        });
      } else {
        await tx.user.update({
          where: { id: withdrawal.userId },
          data: {
            referralBalance: {
              increment: withdrawal.amount,
            },
          },
        });
      }

      return updatedWithdrawal;
    });
  }

  async getTotalWithdrawals() {
    const result = await this.prisma.withdrawal.aggregate({
      _sum: {
        amount: true,
      },
      _count: {
        id: true,
      },
    });

    return {
      totalAmount: result._sum.amount?.toString() || '0',
      totalCount: result._count.id || 0,
    };
  }
}
