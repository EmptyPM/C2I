import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class SettingsService {
  constructor(private prisma: PrismaService) {}

  async getSettings() {
    // Get or create the single settings record
    let settings = await this.prisma.settings.findUnique({
      where: { id: 1 },
    });

    if (!settings) {
      settings = await this.prisma.settings.create({
        data: {
          id: 1,
          depositAddress: 'TRX2r4BUhMd22W8DtwNEajhRcgPJWBK4s7',
          qrCodeUrl: null,
        },
      });
    }

    return settings;
  }

  async updateDepositAddress(address: string) {
    return this.prisma.settings.upsert({
      where: { id: 1 },
      update: {
        depositAddress: address,
      },
      create: {
        id: 1,
        depositAddress: address,
        qrCodeUrl: null,
      },
    });
  }

  async getDepositAddress() {
    const settings = await this.getSettings();
    return {
      address: settings.depositAddress || 'TRX2r4BUhMd22W8DtwNEajhRcgPJWBK4s7',
    };
  }

  async updateLogo(logoUrl: string) {
    return this.prisma.settings.upsert({
      where: { id: 1 },
      update: {
        logoUrl: logoUrl,
      },
      create: {
        id: 1,
        depositAddress: 'TRX2r4BUhMd22W8DtwNEajhRcgPJWBK4s7',
        qrCodeUrl: null,
        logoUrl: logoUrl,
      },
    });
  }

  async getLogo() {
    const settings = await this.getSettings();
    return {
      logoUrl: settings.logoUrl || null,
    };
  }
}

