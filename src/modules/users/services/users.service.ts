import { Injectable } from '@nestjs/common';
import { UserRepository } from '../repositories/user.repository';

@Injectable()
export class UsersService {
  constructor(private _userRepo: UserRepository) {}

  async findByEmail(email: string) {
    return await this._userRepo.findOne({ email });
  }

  async findByPhone(phone: string) {
    return await this._userRepo.findOne({ phone });
  }
}
