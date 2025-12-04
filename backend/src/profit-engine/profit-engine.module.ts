import { Module } from '@nestjs/common';
import { ProfitEngineService } from './profit-engine.service';
import { ProfitEngineController } from './profit-engine.controller';

@Module({
  providers: [ProfitEngineService],
  controllers: [ProfitEngineController]
})
export class ProfitEngineModule {}
