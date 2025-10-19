import { Injectable } from '@nestjs/common';
import { UserRepository } from '../repositories/user.repository';
import { IUser } from '../interfaces/user.interface';

@Injectable()
export class UsersService {
  constructor(private _userRepo: UserRepository) {}

  async findByEmail(email: string) {
    return await this._userRepo.findOne({ email });
  }

  async findByPhone(phone: string) {
    return await this._userRepo.findOne({ phone });
  }
  async create(userData: IUser) {
    return await this._userRepo.create(userData);
  }
}
