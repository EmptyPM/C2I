import {
  Injectable,
  BadRequestException,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import * as bcrypt from 'bcrypt';
import { UpdateProfileDto } from './dto/update-profile.dto';
import { ChangePasswordDto } from './dto/change-password.dto';

@Injectable()
export class UsersService {
  constructor(private prisma: PrismaService) {}

  async getById(id: number) {
    const user = await this.prisma.user.findUnique({
      where: { id },
      select: {
        id: true,
        email: true,
        firstName: true,
        lastName: true,
        referralCode: true,
        role: true,
        status: true,
        tradingBalance: true,
        profitBalance: true,
        referralBalance: true,
        createdAt: true,
        updatedAt: true,
      },
    });

    return user;
  }

  async updateProfile(userId: number, dto: UpdateProfileDto) {
    const user = await this.prisma.user.update({
      where: { id: userId },
      data: {
        firstName: dto.firstName !== undefined ? dto.firstName : undefined,
        lastName: dto.lastName !== undefined ? dto.lastName : undefined,
      },
      select: {
        id: true,
        email: true,
        firstName: true,
        lastName: true,
        referralCode: true,
        role: true,
        status: true,
        tradingBalance: true,
        profitBalance: true,
        referralBalance: true,
        createdAt: true,
        updatedAt: true,
      },
    });

    return user;
  }

  async changePassword(userId: number, dto: ChangePasswordDto) {
    // Load user with passwordHash
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
      select: {
        id: true,
        passwordHash: true,
      },
    });

    if (!user) {
      throw new BadRequestException('User not found');
    }

    // Verify current password
    const isCurrentPasswordValid = await bcrypt.compare(
      dto.currentPassword,
      user.passwordHash,
    );

    if (!isCurrentPasswordValid) {
      throw new BadRequestException('Current password is incorrect');
    }

    // Check if new passwords match
    if (dto.newPassword !== dto.confirmPassword) {
      throw new BadRequestException('Passwords do not match');
    }

    // Hash new password
    const passwordHash = await bcrypt.hash(dto.newPassword, 10);

    // Update user password
    await this.prisma.user.update({
      where: { id: userId },
      data: { passwordHash },
    });

    return {
      message: 'Password updated successfully.',
    };
  }

  private getSafeUserSelect() {
    return {
      id: true,
      email: true,
      firstName: true,
      lastName: true,
      role: true,
      status: true,
      isFrozen: true,
      tradingBalance: true,
      profitBalance: true,
      referralBalance: true,
      createdAt: true,
    };
  }

  async findAllForAdmin() {
    const users = await this.prisma.user.findMany({
      select: this.getSafeUserSelect(),
      orderBy: {
        createdAt: 'desc',
      },
    });

    return users;
  }

  async updateStatus(id: number, status: 'ACTIVE' | 'BANNED') {
    const user = await this.prisma.user.findUnique({
      where: { id },
    });

    if (!user) {
      throw new NotFoundException('User not found');
    }

    const updatedUser = await this.prisma.user.update({
      where: { id },
      data: { status },
      select: this.getSafeUserSelect(),
    });

    return updatedUser;
  }

  async updateFreeze(id: number, isFrozen: boolean) {
    const user = await this.prisma.user.findUnique({
      where: { id },
    });

    if (!user) {
      throw new NotFoundException('User not found');
    }

    const updatedUser = await this.prisma.user.update({
      where: { id },
      data: { isFrozen },
      select: this.getSafeUserSelect(),
    });

    return updatedUser;
  }

  async updateRole(
    id: number,
    role: 'USER' | 'ADMIN',
    actingAdminId: number,
  ) {
    const user = await this.prisma.user.findUnique({
      where: { id },
    });

    if (!user) {
      throw new NotFoundException('User not found');
    }

    // Prevent admin from changing their own role to avoid locking themselves out
    if (actingAdminId === id && role !== 'ADMIN') {
      throw new BadRequestException(
        'You cannot change your own role from ADMIN to USER',
      );
    }

    const updatedUser = await this.prisma.user.update({
      where: { id },
      data: { role },
      select: this.getSafeUserSelect(),
    });

    return updatedUser;
  }

  async getTotalAvailableForWithdrawal() {
    const result = await this.prisma.user.aggregate({
      _sum: {
        profitBalance: true,
        referralBalance: true,
      },
    });

    const profitTotal = result._sum.profitBalance?.toString() || '0';
    const referralTotal = result._sum.referralBalance?.toString() || '0';
    const total = (parseFloat(profitTotal) + parseFloat(referralTotal)).toFixed(2);

    return {
      totalAvailable: total,
      profitBalance: profitTotal,
      referralBalance: referralTotal,
    };
  }

  async getProfitLogs(userId: number) {
    return this.prisma.profitLog.findMany({
      where: { userId },
      orderBy: { createdAt: 'desc' },
      select: {
        id: true,
        amount: true,
        percentage: true,
        note: true,
        createdAt: true,
      },
    });
  }
}
