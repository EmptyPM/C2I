import { Module } from '@nestjs/common';
import { DepositsService } from './deposits.service';
import { DepositsController } from './deposits.controller';
import { AdminDepositsController } from './admin-deposits.controller';
import { RolesGuard } from '../common/guards/roles.guard';

@Module({
  providers: [DepositsService, RolesGuard],
  controllers: [DepositsController, AdminDepositsController],
})
export class DepositsModule {}
