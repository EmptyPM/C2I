import { Controller, Get, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { ReferralsService } from './referrals.service';
import { CurrentUser } from '../common/decorators/current-user.decorator';

@Controller('referrals')
@UseGuards(AuthGuard('jwt'))
export class ReferralsController {
  constructor(private readonly referralsService: ReferralsService) {}

  @Get('summary')
  async getSummary(
    @CurrentUser() user: { userId: number; email: string; role: string },
  ) {
    return this.referralsService.getSummaryForUser(user.userId);
  }

  @Get('bonuses/my')
  async getMyBonuses(
    @CurrentUser() user: { userId: number; email: string; role: string },
  ) {
    return this.referralsService.getBonusesForUser(user.userId);
  }

  @Get('me')
  async getMyReferrals(
    @CurrentUser() user: { userId: number; email: string; role: string },
  ) {
    return this.referralsService.getReferredUsers(user.userId);
  }
}
