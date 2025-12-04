import { IsNumber, IsString, IsNotEmpty, Min } from 'class-validator';
import { Type } from 'class-transformer';

export class CreateDepositDto {
  @IsNumber()
  @Type(() => Number)
  @Min(10)
  amount: number;

  @IsString()
  @IsNotEmpty()
  txHash: string;
}







