import {
  BadRequestException,
  ForbiddenException,
  Inject,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { ICreateUser } from '../interfaces/user.interface';
import { UserMapper } from '../mappers/user.mapper';
import type { IUserRepository } from '../interfaces/user-repository.interface';
import { HashService } from '@core/lib/hash/hash.service';
import { UserResponseDto } from '../dtos/user-response.dto';
import { IUserService } from '../interfaces/user-service.interface';
import { USER_TOKENS } from '../user-tokens';
import { AUTH_MESSAGES } from '@shared/constants/messages/auth-messages.constant';
import { UserRoles } from '@shared/constants/enums/user.enum';

@Injectable()
export class UsersService implements IUserService {
  constructor(
    @Inject(USER_TOKENS.REPOSITORY)
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

  async authenticateUser(
    email: string,
    password: string,
  ): Promise<UserResponseDto> {
    return await this._authenticate(email, password);
  }

  async authenticateAdmin(
    email: string,
    password: string,
  ): Promise<UserResponseDto> {
    const userData = await this._authenticate(email, password);
    if (userData.userRole !== UserRoles.ADMIN) {
      throw new ForbiddenException(AUTH_MESSAGES.ADMIN_ONLY);
    }
    return userData;
  }

  async create(userData: ICreateUser): Promise<UserResponseDto> {
    const hashedPassword = await this._hashService.hashPassword(
      userData.password,
    );
    userData.password = hashedPassword;
    const savedUser = await this._userRepo.create(userData);
    if (!savedUser) {
      throw new InternalServerErrorException(AUTH_MESSAGES.SIGNUP_FAILD);
    }
    return UserMapper.toResponse(savedUser);
  }

  // private methods
  private async _authenticate(email: string, password: string) {
    const user = await this._userRepo.findByEmail(email);

    if (!user) {
      throw new NotFoundException(AUTH_MESSAGES.EMAIL_NOT_FOUND);
    }

    const isPasswordMatch = await this._hashService.comparePassword(
      password,
      user.password,
    );

    if (!isPasswordMatch) {
      throw new BadRequestException(AUTH_MESSAGES.PASSWORD_INCORRECT);
    }

    return UserMapper.toResponse(user);
  }
}
