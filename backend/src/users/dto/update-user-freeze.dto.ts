import { IsBoolean } from 'class-validator';

export class UpdateUserFreezeDto {
  @IsBoolean()
  isFrozen: boolean;
}






