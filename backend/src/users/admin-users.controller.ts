import {
  Controller,
  Get,
  Patch,
  Body,
  Param,
  ParseIntPipe,
  UseGuards,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { UsersService } from './users.service';
import { CurrentUser } from '../common/decorators/current-user.decorator';
import { RolesGuard } from '../common/guards/roles.guard';
import { Roles } from '../common/decorators/roles.decorator';
import { UpdateUserStatusDto } from './dto/update-user-status.dto';
import { UpdateUserFreezeDto } from './dto/update-user-freeze.dto';
import { UpdateUserRoleDto } from './dto/update-user-role.dto';

@Controller('admin/users')
@UseGuards(AuthGuard('jwt'), RolesGuard)
@Roles('ADMIN')
export class AdminUsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get('stats/available-for-withdrawal')
  async getAvailableForWithdrawal() {
    return this.usersService.getTotalAvailableForWithdrawal();
  }

  @Get()
  async getAllUsers() {
    return this.usersService.findAllForAdmin();
  }

  @Patch(':id/status')
  async updateStatus(
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: UpdateUserStatusDto,
  ) {
    return this.usersService.updateStatus(id, dto.status);
  }

  @Patch(':id/freeze')
  async updateFreeze(
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: UpdateUserFreezeDto,
  ) {
    return this.usersService.updateFreeze(id, dto.isFrozen);
  }

  @Patch(':id/role')
  async updateRole(
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: UpdateUserRoleDto,
    @CurrentUser() admin: any,
  ) {
    return this.usersService.updateRole(id, dto.role, admin.userId);
  }
}






