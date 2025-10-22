import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { UserRepository } from '../repositories/user.repository';
import { IUser } from '../interfaces/user.interface';
import { UserMapper } from '../mappers/user.mapper';

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
    const savedUser = await this._userRepo.create(userData);
    if (!savedUser) {
      throw new InternalServerErrorException('Faild to register user');
    }
    return UserMapper.toResponse(savedUser);
  }
}
