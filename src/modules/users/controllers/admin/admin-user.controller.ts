import type { IAdminUserService } from '@modules/users/interfaces/user-services.interface';
import { USER_TOKENS } from '@modules/users/user-tokens';
import { Controller, Get, Inject, Logger, Patch, Query } from '@nestjs/common';
import { GetDocsDto } from '@shared/dtos/get-docs.dto';

@Controller('admin/user')
export class AdminUserController {
  private _logger = new Logger(AdminUserController.name);
  constructor(
    @Inject(USER_TOKENS.ADMIN_USER_SERVICE)
    private _adminUserService: IAdminUserService,
  ) {}

  @Get()
  findAll(@Query() getDocsDto: GetDocsDto) {
    //call service to get all users
    this._logger.verbose('Reached control');
    // eslint-disable-next-line @typescript-eslint/no-unsafe-return
    return this._adminUserService.findAllUsers(getDocsDto);
  }

  // @Get(':id')
  // findOne() {
  //   //call service to get one user data
  // }

  @Patch(':id')
  suspendUser() {
    // call service to suspend a user
  }
}
