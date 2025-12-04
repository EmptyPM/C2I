import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { ScheduleModule } from '@nestjs/schedule';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { PrismaModule } from './prisma/prisma.module';
import { AuthModule } from './auth/auth.module';
import { UsersModule } from './users/users.module';
import { DepositsModule } from './deposits/deposits.module';
import { ProfitEngineModule } from './profit-engine/profit-engine.module';
import { WithdrawalsModule } from './withdrawals/withdrawals.module';
import { ReferralsModule } from './referrals/referrals.module';
import { MailModule } from './mail/mail.module';
import { WalletModule } from './wallet/wallet.module';
import { ForexModule } from './forex/forex.module';
import { SettingsModule } from './settings/settings.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env',
    }),
    ScheduleModule.forRoot(),
    PrismaModule,
    AuthModule,
    UsersModule,
    DepositsModule,
    ProfitEngineModule,
    WithdrawalsModule,
    ReferralsModule,
    MailModule,
    WalletModule,
    ForexModule,
    SettingsModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
