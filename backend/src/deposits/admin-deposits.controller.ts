import {
  Controller,
  Get,
  Patch,
  Param,
  ParseIntPipe,
  UseGuards,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { DepositsService } from './deposits.service';
import { RolesGuard } from '../common/guards/roles.guard';
import { Roles } from '../common/decorators/roles.decorator';

@Controller('admin/deposits')
@UseGuards(AuthGuard('jwt'), RolesGuard)
@Roles('ADMIN')
export class AdminDepositsController {
  constructor(private readonly depositsService: DepositsService) {}

  @Get('stats/total-invested')
  async getTotalInvested() {
    return this.depositsService.getTotalInvested();
  }

  @Get()
  async getAllDeposits() {
    return this.depositsService.getAllDeposits();
  }

  @Get('pending')
  async getPendingDeposits() {
    return this.depositsService.getPendingDeposits();
  }

  @Patch(':id/approve')
  async approveDeposit(@Param('id', ParseIntPipe) id: number) {
    return this.depositsService.approveDeposit(id);
  }

  @Patch(':id/reject')
  async rejectDeposit(@Param('id', ParseIntPipe) id: number) {
    return this.depositsService.rejectDeposit(id);
  }
}







