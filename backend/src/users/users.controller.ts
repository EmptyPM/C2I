import {
  Controller,
  Get,
  Patch,
  Body,
  NotFoundException,
  UseGuards,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { UsersService } from './users.service';
import { CurrentUser } from '../common/decorators/current-user.decorator';
import { UpdateProfileDto } from './dto/update-profile.dto';
import { ChangePasswordDto } from './dto/change-password.dto';

@Controller('users')
export class UsersController {
  constructor(private usersService: UsersService) {}

  @UseGuards(AuthGuard('jwt'))
  @Get('me')
  async getMe(@CurrentUser() user: any) {
    const foundUser = await this.usersService.getById(user.userId);

    if (!foundUser) {
      throw new NotFoundException('User not found');
    }

    return foundUser;
  }

  @UseGuards(AuthGuard('jwt'))
  @Patch('me/profile')
  async updateProfile(
    @CurrentUser() user: any,
    @Body() dto: UpdateProfileDto,
  ) {
    return this.usersService.updateProfile(user.userId, dto);
  }

  @UseGuards(AuthGuard('jwt'))
  @Patch('me/change-password')
  async changePassword(
    @CurrentUser() user: any,
    @Body() dto: ChangePasswordDto,
  ) {
    return this.usersService.changePassword(user.userId, dto);
  }
}
