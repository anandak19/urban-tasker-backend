import {
  Inject,
  Injectable,
  InternalServerErrorException,
} from '@nestjs/common';
import { ICreateUser } from '../interfaces/user.interface';
import { UserMapper } from '../mappers/user.mapper';
import type { IUserRepository } from '../interfaces/user-repository.interface';
import { HashService } from '@core/lib/hash/hash.service';
import { UserResponseDto } from '../dtos/user-response.dto';
import { IUserService } from '../interfaces/user-service.interface';

@Injectable()
export class UsersService implements IUserService {
  constructor(
    @Inject('IUserRepository')
    private readonly _userRepo: IUserRepository,
    private _hashService: HashService,
  ) {}

  async findByEmail(email: string): Promise<UserResponseDto | null> {
    const user = await this._userRepo.findByEmail(email);
    if (!user) {
      return null;
    }
    return UserMapper.toResponse(user);
  }

  // update this
  async findByPhone(phone: string) {
    return await this._userRepo.findOne({ phone }); //-- update this
  }

  async create(userData: ICreateUser): Promise<UserResponseDto> {
    const hashedPassword = await this._hashService.hashPassword(
      userData.password,
    );
    userData.password = hashedPassword;
    const savedUser = await this._userRepo.create(userData);
    if (!savedUser) {
      throw new InternalServerErrorException('Faild to register user');
    }
    return UserMapper.toResponse(savedUser);
  }
}
