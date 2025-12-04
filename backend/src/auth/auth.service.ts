import {
  Injectable,
  BadRequestException,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { PrismaService } from '../prisma/prisma.service';
import { MailService } from '../mail/mail.service';
import { User } from '@prisma/client';
import * as bcrypt from 'bcrypt';
import * as crypto from 'crypto';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';
import { ForgotPasswordDto } from './dto/forgot-password.dto';
import { ResetPasswordDto } from './dto/reset-password.dto';

@Injectable()
export class AuthService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
    private readonly mailService: MailService,
  ) {}

  async register(dto: RegisterDto) {
    // Check if passwords match
    if (dto.password !== dto.confirmPassword) {
      throw new BadRequestException('Passwords do not match');
    }

    // Check if user with this email already exists
    const existingUser = await this.prisma.user.findUnique({
      where: { email: dto.email },
    });

    if (existingUser) {
      throw new BadRequestException('User with this email already exists');
    }

    // If referralCode is provided, look up the referrer
    let referredById: number | undefined;
    if (dto.referralCode) {
      const referrer = await this.prisma.user.findUnique({
        where: { referralCode: dto.referralCode },
      });

      if (!referrer) {
        throw new BadRequestException('Invalid referral code');
      }

      referredById = referrer.id;
    }

    // Hash the password
    const passwordHash = await bcrypt.hash(dto.password, 10);

    // Generate a unique referralCode
    const referralCode = await this.generateUniqueReferralCode();

    // Create the user
    const user = await this.prisma.user.create({
      data: {
        email: dto.email,
        passwordHash,
        firstName: dto.firstName || null,
        lastName: dto.lastName || null,
        referralCode,
        referredById,
        role: 'USER',
        status: 'ACTIVE',
      },
    });

    // Generate JWT token
    const accessToken = await this.signToken(user);

    // Return response without passwordHash
    return {
      user: {
        id: user.id,
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName,
        referralCode: user.referralCode,
        role: user.role,
        status: user.status,
      },
      accessToken,
    };
  }

  async login(dto: LoginDto) {
    // Find user by email
    const user = await this.prisma.user.findUnique({
      where: { email: dto.email },
    });

    // If not found or password doesn't match, throw UnauthorizedException
    if (!user) {
      throw new UnauthorizedException('Invalid email or password');
    }

    // Check if account is banned
    if (user.status === 'BANNED') {
      throw new UnauthorizedException('Account is banned');
    }

    const isPasswordValid = await bcrypt.compare(dto.password, user.passwordHash);

    if (!isPasswordValid) {
      throw new UnauthorizedException('Invalid email or password');
    }

    // Generate JWT token
    const accessToken = await this.signToken(user);

    // Return response without passwordHash
    return {
      user: {
        id: user.id,
        email: user.email,
        referralCode: user.referralCode,
        role: user.role,
        status: user.status,
      },
      accessToken,
    };
  }

  private async signToken(user: User): Promise<string> {
    const payload = {
      sub: user.id,
      email: user.email,
      role: user.role,
    };

    return this.jwtService.signAsync(payload, {
      expiresIn: '7d',
      secret: this.configService.get<string>('JWT_SECRET'),
    });
  }

  async forgotPassword(dto: ForgotPasswordDto) {
    // Find user by email
    const user = await this.prisma.user.findUnique({
      where: { email: dto.email },
    });

    // If user not found, return generic message (don't reveal user existence)
    if (!user) {
      return {
        message: 'If this email exists, reset instructions were sent.',
      };
    }

    // Generate a random token
    const token = crypto.randomBytes(32).toString('hex');

    // Set expiration to 1 hour from now
    const expiresAt = new Date();
    expiresAt.setHours(expiresAt.getHours() + 1);

    // Create password reset token
    await this.prisma.passwordResetToken.create({
      data: {
        userId: user.id,
        token,
        expiresAt,
        used: false,
      },
    });

    // Send password reset email
    await this.mailService.sendPasswordResetEmail(user.email, token);

    // Return response without token
    return {
      message: 'If this email exists, reset instructions were sent.',
    };
  }

  async resetPassword(dto: ResetPasswordDto) {
    // Check if passwords match
    if (dto.newPassword !== dto.confirmPassword) {
      throw new BadRequestException('Passwords do not match');
    }

    // Find valid password reset token
    const resetToken = await this.prisma.passwordResetToken.findFirst({
      where: {
        token: dto.token,
        used: false,
        expiresAt: {
          gt: new Date(),
        },
      },
    });

    if (!resetToken) {
      throw new BadRequestException('Invalid or expired reset token');
    }

    // Find the associated user
    const user = await this.prisma.user.findUnique({
      where: { id: resetToken.userId },
    });

    if (!user) {
      throw new BadRequestException('User not found');
    }

    // Hash the new password
    const passwordHash = await bcrypt.hash(dto.newPassword, 10);

    // Update user password and mark token as used in a transaction
    await this.prisma.$transaction([
      this.prisma.user.update({
        where: { id: user.id },
        data: { passwordHash },
      }),
      this.prisma.passwordResetToken.update({
        where: { id: resetToken.id },
        data: { used: true },
      }),
    ]);

    return {
      message: 'Password has been reset successfully.',
    };
  }

  private async generateUniqueReferralCode(): Promise<string> {
    const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
    let referralCode: string = '';
    let isUnique = false;

    while (!isUnique) {
      // Generate random 8-character alphanumeric string
      referralCode = '';
      for (let i = 0; i < 8; i++) {
        referralCode += characters.charAt(
          Math.floor(Math.random() * characters.length),
        );
      }

      // Check if it's unique
      const existing = await this.prisma.user.findUnique({
        where: { referralCode },
      });

      if (!existing) {
        isUnique = true;
      }
    }

    return referralCode;
  }
}
