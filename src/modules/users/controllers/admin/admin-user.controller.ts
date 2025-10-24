import { Controller, Get, Patch } from '@nestjs/common';

@Controller('admin/user')
export class AdminUserController {
  @Get()
  findAll() {
    //call service to get all users
  }

  @Get(':id')
  findOne() {
    //call service to get one user data
  }

  @Patch(':id')
  suspendUser() {
    // call service to suspend a user
  }
}
