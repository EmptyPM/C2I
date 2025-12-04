import { IsIn, IsNumber, Min } from "class-validator";
import { Type } from "class-transformer";

export class CreateTransferDto {
  @IsIn(["REFERRAL_TO_PROFIT", "PROFIT_TO_TRADING"])
  type: "REFERRAL_TO_PROFIT" | "PROFIT_TO_TRADING";

  @Type(() => Number)
  @IsNumber()
  @Min(1)
  amount: number;
}






