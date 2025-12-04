import { Module } from '@nestjs/common';
import { UsersService } from './users.service';
import { UsersController } from './users.controller';
import { AdminController } from './admin/admin.controller';
import { AdminUsersController } from './admin-users.controller';
import { RolesGuard } from '../common/guards/roles.guard';

@Module({
  providers: [UsersService, RolesGuard],
  controllers: [UsersController, AdminController, AdminUsersController],
  exports: [UsersService],
})
export class UsersModule {}
