import {
  BadRequestException,
  ForbiddenException,
  HttpException,
  Inject,
  Injectable,
  InternalServerErrorException,
  Logger,
  NotFoundException,
} from '@nestjs/common';
import { ICreateUser } from '../../interfaces/user.interface';
import { UserMapper } from '../../mappers/user.mapper';
import type { IUserRepository } from '../../interfaces/user-repositories.interface';
import { HashService } from '@core/lib/hash/hash.service';
import { UserResponseDto } from '../../dtos/user-response.dto';
import { IUserService } from '../../interfaces/user-services.interface';
import { USER_TOKENS } from '../../user-tokens';
import { AUTH_MESSAGES } from '@shared/constants/messages/auth-messages.constant';
import { UserRoles } from '@shared/constants/enums/user.enum';
import { USER_ERRORS } from '@shared/constants/messages/error-messaes.constants';
import { AuthProvider } from '@shared/constants/enums/auth-providers.enum';

@Injectable()
export class UsersService implements IUserService {
  private _logger = new Logger(UsersService.name);

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

  // remove this later
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
    try {
      // local create
      if (userData.provider === AuthProvider.LOCAL && userData.password) {
        const hashedPassword = await this._hashService.hashPassword(
          userData.password,
        );
        userData.password = hashedPassword;
      }

      const savedUser = await this._userRepo.create(userData);

      if (!savedUser) {
        throw new InternalServerErrorException(AUTH_MESSAGES.SIGNUP_FAILD);
      }

      return UserMapper.toResponse(savedUser);
    } catch (error) {
      if (error instanceof HttpException) throw error;

      throw new InternalServerErrorException(AUTH_MESSAGES.SIGNUP_FAILD);
    }
  }

  // update user password by id
  async updateUserPassword(
    id: string,
    plainPassword: string,
  ): Promise<UserResponseDto> {
    // hash password
    try {
      const hashedPassword =
        await this._hashService.hashPassword(plainPassword);
      // call the method to update user data of repo
      const savedUser = await this._userRepo.updateById(id, {
        password: hashedPassword,
      });

      if (!savedUser) {
        throw new InternalServerErrorException(
          USER_ERRORS.UPDATE_PASSWORD_FAIL,
        );
      }

      return UserMapper.toResponse(savedUser);
    } catch (error) {
      this._logger.error(USER_ERRORS.UPDATE_PASSWORD_FAIL);
      this._logger.log(error);
      throw new InternalServerErrorException(USER_ERRORS.UPDATE_PASSWORD_FAIL);
    }
  }

  // private methods
  private async _authenticate(email: string, password: string) {
    const user = await this._userRepo.findByEmail(email);

    if (!user) {
      throw new NotFoundException(AUTH_MESSAGES.EMAIL_NOT_FOUND);
    }

    try {
      const isPasswordMatch = await this._hashService.comparePassword(
        password,
        user.password,
      );

      if (!isPasswordMatch) {
        throw new BadRequestException(AUTH_MESSAGES.PASSWORD_INCORRECT);
      }

      return UserMapper.toResponse(user);
    } catch (error) {
      if (error instanceof HttpException) throw error;

      throw new InternalServerErrorException(AUTH_MESSAGES.LOGIN_FAILD);
    }
  }
}
