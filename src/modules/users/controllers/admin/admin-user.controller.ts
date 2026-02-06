import { AdminGuard } from '@core/guards/admin.guard';
import { AuthGuard } from '@core/guards/auth/auth.guard';
import { GetUsersDto } from '@modules/users/dtos/get-user.dto';
import { SuspendUserDto } from '@modules/users/dtos/suspend-user.dto';
import type {
  IAdminUserService,
  IUserService,
} from '@modules/users/interfaces/user-services.interface';
import { USER_TOKENS } from '@modules/users/user-tokens';
import {
  Body,
  Controller,
  Get,
  Inject,
  Logger,
  Param,
  Patch,
  Query,
  UseGuards,
} from '@nestjs/common';

@UseGuards(AuthGuard, AdminGuard)
@Controller('admin/user')
export class AdminUserController {
  private _logger = new Logger(AdminUserController.name);
  constructor(
    @Inject(USER_TOKENS.ADMIN_USER_SERVICE)
    private _adminUserService: IAdminUserService,

    @Inject(USER_TOKENS.SERVICE) private _userService: IUserService,
  ) {}

  @Get()
  findAll(@Query() dto: GetUsersDto) {
    //call service to get all users
    // eslint-disable-next-line @typescript-eslint/no-unsafe-return
    return this._adminUserService.findAllUsers(dto);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this._userService.findOne(id);
  }

  @Patch(':id/suspend')
  suspendUser(@Param('id') userId: string, @Body() dto: SuspendUserDto) {
    console.log(userId);
    console.log(dto);
    return this._adminUserService.suspendUser(userId, dto);
  }

  @Patch(':id/unsuspend')
  unsuspendUser(@Param('id') userId: string) {
    console.log(userId);
    return this._adminUserService.unSuspendUser(userId);
  }
}
