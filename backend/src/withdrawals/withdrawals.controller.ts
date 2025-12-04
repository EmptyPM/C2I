import { Controller, Post, Get, Body, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { WithdrawalsService } from './withdrawals.service';
import { CreateWithdrawalDto } from './dto/create-withdrawal.dto';
import { CurrentUser } from '../common/decorators/current-user.decorator';

@Controller('withdrawals')
export class WithdrawalsController {
  constructor(private readonly withdrawalsService: WithdrawalsService) {}

  @Post()
  @UseGuards(AuthGuard('jwt'))
  async createWithdrawal(
    @Body() dto: CreateWithdrawalDto,
    @CurrentUser() user: { userId: number; email: string; role: string },
  ) {
    return this.withdrawalsService.createWithdrawal(user.userId, dto);
  }

  @Get('my')
  @UseGuards(AuthGuard('jwt'))
  async getMyWithdrawals(
    @CurrentUser() user: { userId: number; email: string; role: string },
  ) {
    return this.withdrawalsService.getUserWithdrawals(user.userId);
  }
}
