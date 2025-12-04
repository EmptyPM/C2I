import {
  Controller,
  Post,
  Body,
  UseGuards,
  BadRequestException,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { ProfitEngineService } from './profit-engine.service';
import { RolesGuard } from '../common/guards/roles.guard';
import { Roles } from '../common/decorators/roles.decorator';

class RunForDateDto {
  date: string;
}

@Controller('admin/profits')
@UseGuards(AuthGuard('jwt'), RolesGuard)
@Roles('ADMIN')
export class ProfitEngineController {
  constructor(private readonly profitEngineService: ProfitEngineService) {}

  @Post('run-today')
  async runToday() {
    return this.profitEngineService.runDailyProfit(undefined, 'ADMIN');
  }

  @Post('run-for-date')
  async runForDate(@Body() body: RunForDateDto) {
    const date = new Date(body.date);
    if (isNaN(date.getTime())) {
      throw new BadRequestException(
        'Invalid date format. Please use ISO format.',
      );
    }
    return this.profitEngineService.runDailyProfit(date, 'ADMIN');
  }
}
