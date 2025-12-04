import {
  Controller,
  Get,
  Patch,
  Param,
  ParseIntPipe,
  UseGuards,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { WithdrawalsService } from './withdrawals.service';
import { RolesGuard } from '../common/guards/roles.guard';
import { Roles } from '../common/decorators/roles.decorator';

@Controller('admin/withdrawals')
@UseGuards(AuthGuard('jwt'), RolesGuard)
@Roles('ADMIN')
export class AdminWithdrawalsController {
  constructor(private readonly withdrawalsService: WithdrawalsService) {}

  @Get('stats/total-withdrawals')
  async getTotalWithdrawals() {
    return this.withdrawalsService.getTotalWithdrawals();
  }

  @Get()
  async getAllWithdrawals() {
    return this.withdrawalsService.getAllWithdrawals();
  }

  @Get('pending')
  async getPendingWithdrawals() {
    return this.withdrawalsService.getPendingWithdrawals();
  }

  @Patch(':id/approve')
  async approveWithdrawal(@Param('id', ParseIntPipe) id: number) {
    return this.withdrawalsService.approveWithdrawal(id);
  }

  @Patch(':id/reject')
  async rejectWithdrawal(@Param('id', ParseIntPipe) id: number) {
    return this.withdrawalsService.rejectWithdrawal(id);
  }
}







