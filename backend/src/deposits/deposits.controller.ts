import { Controller, Post, Get, Body, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { DepositsService } from './deposits.service';
import { CreateDepositDto } from './dto/create-deposit.dto';
import { CurrentUser } from '../common/decorators/current-user.decorator';

@Controller('deposits')
export class DepositsController {
  constructor(private readonly depositsService: DepositsService) {}

  @Post()
  @UseGuards(AuthGuard('jwt'))
  async createDeposit(
    @Body() dto: CreateDepositDto,
    @CurrentUser() user: { userId: number; email: string; role: string },
  ) {
    return this.depositsService.createDeposit(user.userId, dto);
  }

  @Get('my')
  @UseGuards(AuthGuard('jwt'))
  async getMyDeposits(
    @CurrentUser() user: { userId: number; email: string; role: string },
  ) {
    return this.depositsService.getUserDeposits(user.userId);
  }
}
