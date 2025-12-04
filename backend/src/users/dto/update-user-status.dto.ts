import { IsIn } from 'class-validator';

export class UpdateUserStatusDto {
  @IsIn(['ACTIVE', 'BANNED'])
  status: 'ACTIVE' | 'BANNED';
}






