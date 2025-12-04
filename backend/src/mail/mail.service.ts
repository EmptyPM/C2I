import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as nodemailer from 'nodemailer';

@Injectable()
export class MailService {
  private transporter: nodemailer.Transporter;

  constructor(private configService: ConfigService) {
    this.transporter = nodemailer.createTransport({
      host: this.configService.get('SMTP_HOST'),
      port: Number(this.configService.get('SMTP_PORT')) || 587,
      auth: {
        user: this.configService.get('SMTP_USER'),
        pass: this.configService.get('SMTP_PASS'),
      },
    });
  }

  async sendPasswordResetEmail(to: string, token: string) {
    const frontendUrl = this.configService.get('FRONTEND_URL') || 'http://localhost:3000';
    const resetLink = `${frontendUrl}/reset-password?token=${token}`;

    await this.transporter.sendMail({
      from: this.configService.get('MAIL_FROM') || 'no-reply@example.com',
      to,
      subject: 'Password Reset Instructions',
      text: `Click this link to reset your password: ${resetLink}`,
      html: `<p>Click this link to reset your password:</p><p><a href="${resetLink}">${resetLink}</a></p>`,
    });
  }
}
