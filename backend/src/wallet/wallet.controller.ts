import {
  Body,
  Controller,
  Get,
  Post,
  UseGuards,
} from "@nestjs/common";
import { WalletService } from "./wallet.service";
import { AuthGuard } from "@nestjs/passport";
import { RolesGuard } from "../common/guards/roles.guard";
import { Roles } from "../common/decorators/roles.decorator";
import { CurrentUser } from "../common/decorators/current-user.decorator";
import { CreateTransferDto } from "./dto/create-transfer.dto";

@Controller("wallet")
@UseGuards(AuthGuard("jwt"))
export class WalletController {
  constructor(private readonly walletService: WalletService) {}

  @Post("transfer")
  transfer(
    @CurrentUser() user: any,
    @Body() dto: CreateTransferDto,
  ) {
    return this.walletService.transfer(user.userId, dto);
  }

  @Get("transfers")
  myTransfers(@CurrentUser() user: any) {
    return this.walletService.listMyTransfers(user.userId);
  }

  @Get("admin/stats/total-reinvested")
  @UseGuards(RolesGuard)
  @Roles("ADMIN")
  getTotalReinvested() {
    return this.walletService.getTotalReinvested();
  }
}
