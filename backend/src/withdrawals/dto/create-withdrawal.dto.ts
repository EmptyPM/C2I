import { IsNumber, IsString, IsIn, Min, IsNotEmpty } from 'class-validator';
import { Type } from 'class-transformer';

export class CreateWithdrawalDto {
  @Type(() => Number)
  @IsNumber()
  @Min(10)
  amount: number;

  @IsIn(['PROFIT'])
  source: 'PROFIT';

  @IsString()
  @IsNotEmpty()
  walletAddress: string;
}


