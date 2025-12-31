import {
  BadRequestException,
  HttpException,
  Inject,
  Injectable,
  InternalServerErrorException,
  Logger,
  NotFoundException,
} from '@nestjs/common';
import { ICreateUser, IProfileImage } from '../../interfaces/user.interface';
import { UserMapper } from '../../mappers/user.mapper';
import type { IUserRepository } from '../../interfaces/user-repositories.interface';
import { HashService } from '@core/lib/hash/hash.service';
import { UserResponseDto } from '../../dtos/user-response.dto';
import { IUserService } from '../../interfaces/user-services.interface';
import { USER_TOKENS } from '../../user-tokens';
import { AUTH_MESSAGES } from '@shared/constants/messages/auth-messages.constant';
import { USER_ERRORS } from '@shared/constants/messages/error-messaes.constants';
import { AuthProvider } from '@shared/constants/enums/auth-providers.enum';
import { ImageSource } from '@shared/constants/enums/image-source.enum';
import { UserDocument } from '@modules/users/schemas/user.schema';
import { BasicUserResponseDto } from '@modules/users/dtos/basic-user-response.dto';
import { LOGGER_SERVICE } from '@core/lib/logger/logger.service';
import type { ILoggerService } from '@core/lib/logger/logger.interface';
import { S3_SERVICE } from '@core/lib/s3/s3.module';
import type { IS3Service } from '@core/lib/s3/s3.interface';

@Injectable()
export class UsersService implements IUserService {
  private _logger = new Logger(UsersService.name);

  constructor(
    @Inject(USER_TOKENS.REPOSITORY)
    private readonly _userRepo: IUserRepository,
    private _hashService: HashService,

    @Inject(LOGGER_SERVICE) private _loggerServce: ILoggerService,

    @Inject(S3_SERVICE) private _s3Service: IS3Service,
  ) {}

  /**
   * Convert the user document to response type
   * @param user
   */
  async getUserResponse(user: UserDocument): Promise<UserResponseDto> {
    if (user.profileImage) {
      user.profileImage = await this._getUserImage(user.profileImage);
    }
    return UserMapper.toResponse(user);
  }

  /**
   * Convert the user document to base response type
   * @param user
   */
  async getBasicUserResponse(
    user: UserDocument,
  ): Promise<BasicUserResponseDto> {
    if (user.profileImage) {
      user.profileImage = await this._getUserImage(user.profileImage);
    }
    return UserMapper.toBasicResponse(user);
  }

  // do not use in controllers
  async findByEmail(email: string): Promise<UserResponseDto | null> {
    const user = await this._userRepo.findByEmail(email);
    if (!user) {
      return null;
    }

    return await this.getUserResponse(user);
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

  async create(userData: ICreateUser): Promise<UserResponseDto> {
    // local create

    this._loggerServce.verbose('Creating the user');
    if (userData.provider === AuthProvider.LOCAL && userData.password) {
      const hashedPassword = await this._hashService.hashPassword(
        userData.password,
      );
      userData.password = hashedPassword;
    }

    const savedUser = await this._userRepo.create(userData);
    this._loggerServce.verbose('Saved the user');
    console.log('savedUser');
    console.log(savedUser);

    if (!savedUser) {
      throw new InternalServerErrorException(AUTH_MESSAGES.SIGNUP_FAILD);
    }

    return await this.getUserResponse(savedUser);
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

      return await this.getUserResponse(savedUser);
    } catch (error) {
      this._logger.error(USER_ERRORS.UPDATE_PASSWORD_FAIL);
      this._logger.log(error);
      throw new InternalServerErrorException(USER_ERRORS.UPDATE_PASSWORD_FAIL);
    }
  }

  async findOne(id: string): Promise<UserResponseDto> {
    const user = await this._userRepo.findById(id);
    if (!user) {
      throw new NotFoundException(USER_ERRORS.USER_NOT_FOUND);
    }

    return await this.getUserResponse(user);
  }

  async getBasicUserData(id: string): Promise<BasicUserResponseDto> {
    const user = await this._userRepo.findById(id);
    if (!user) {
      throw new NotFoundException(USER_ERRORS.USER_NOT_FOUND);
    }

    const result = await this.getBasicUserResponse(user);
    console.log(result);
    return result;
  }

  // private methods
  private async _authenticate(email: string, password: string) {
    const user = await this._userRepo.findByEmail(email);

    if (!user) {
      throw new NotFoundException(AUTH_MESSAGES.EMAIL_NOT_FOUND);
    }

    if (user.isSuspended) {
      throw new BadRequestException(
        `Account is suspended for the reason: ${user.suspendedReason}`,
      );
    }

    try {
      const isPasswordMatch = await this._hashService.comparePassword(
        password,
        user.password,
      );

      if (!isPasswordMatch) {
        throw new BadRequestException(AUTH_MESSAGES.PASSWORD_INCORRECT);
      }

      return await this.getUserResponse(user);
    } catch (error) {
      if (error instanceof HttpException) throw error;

      throw new InternalServerErrorException(AUTH_MESSAGES.LOGIN_FAILD);
    }
  }

  private async _getUserImage(
    userImage: IProfileImage,
  ): Promise<IProfileImage> {
    if (userImage.source === ImageSource.S3) {
      userImage.value = await this._s3Service.getImageUrl(userImage.value);
    }
    return userImage;
  }
}
