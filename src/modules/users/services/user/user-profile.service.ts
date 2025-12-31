import { HashService } from '@core/lib/hash/hash.service';
import type { IS3Service } from '@core/lib/s3/s3.interface';
import { S3_SERVICE } from '@core/lib/s3/s3.module';
import type { IRefreshTokenService } from '@modules/Token/interfaces/services.interface';
import { TOKEN_TOKENS } from '@modules/Token/token-tokens';
import { HomeAddressDto } from '@modules/users/dtos/home-address.dto';
import type { IUserRepository } from '@modules/users/interfaces/user-repositories.interface';
import type {
  IUserProfileService,
  IUserService,
} from '@modules/users/interfaces/user-services.interface';
import {
  IPersonalDetails,
  IChangePassoword,
  IHomeAddress,
  IProfileImage,
} from '@modules/users/interfaces/user.interface';
import { USER_TOKENS } from '@modules/users/user-tokens';
import {
  BadRequestException,
  Inject,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { ImageSource } from '@shared/constants/enums/image-source.enum';
import {
  GENERAL_ERRORS,
  USER_ERRORS,
} from '@shared/constants/messages/error-messaes.constants';
import {
  USER_ERROR_MESSAGES,
  USER_SUCCESS_MESSAGES,
} from '@shared/constants/messages/user-messages.constant';
import { IBaseResponse } from '@shared/interfaces/base-response.interface';
import { toObjectId } from '@shared/utility/db/to-objectid.util';

@Injectable()
export class UserProfileService implements IUserProfileService {
  constructor(
    @Inject(USER_TOKENS.SERVICE) private _userService: IUserService,

    @Inject(USER_TOKENS.REPOSITORY) private _userRepo: IUserRepository,

    @Inject(TOKEN_TOKENS.REFERESH_TOKEN_SERVICE)
    private _refreshTokenService: IRefreshTokenService,

    @Inject(S3_SERVICE) private _s3: IS3Service,

    private _hashService: HashService,
  ) {}

  // To add/change the user profile picture
  async updateProfilePicture(
    userId: string,
    file: Express.Multer.File,
  ): Promise<IBaseResponse> {
    const imageKey = await this._s3.uploadUserProfilePic(file);

    if (!imageKey) {
      throw new InternalServerErrorException('Faild  to save profile picture');
    }

    const payload: IProfileImage = {
      source: ImageSource.S3,
      value: imageKey,
    };

    const updatedUser = await this._userRepo.updateById(userId, {
      profileImage: payload,
    });

    if (!updatedUser) {
      throw new InternalServerErrorException('Faild to update profile picture');
    }

    return { message: 'Successfully updated profile pic' };
  }

  // To edit/save updated user profile data
  async updatePersonalData(
    userId: string,
    payload: IPersonalDetails,
  ): Promise<IBaseResponse> {
    const updated = await this._userRepo.updateById(userId, payload);
    if (!updated) {
      throw new InternalServerErrorException(
        USER_ERROR_MESSAGES.PERSONAL_DATA_UPDATE_ERROR,
      );
    }

    return { message: USER_SUCCESS_MESSAGES.PERSONAL_DATA_UPDATE_SUCCESS };
  }

  // To change the password
  async changePassword(
    userId: string,
    payload: IChangePassoword,
  ): Promise<IBaseResponse> {
    const user = await this._userRepo.findById(userId);

    if (!user) {
      throw new NotFoundException(USER_ERRORS.USER_NOT_FOUND);
    }

    const isPasswordMatch = await this._hashService.comparePassword(
      payload.oldPassword,
      user.password,
    );

    if (!isPasswordMatch) {
      throw new BadRequestException();
    }

    const updatedUser = await this._userService.updateUserPassword(
      userId,
      payload.newPassword,
    );

    if (!updatedUser) {
      throw new InternalServerErrorException(
        USER_ERROR_MESSAGES.PASSWORD_UPDATE_ERROR,
      );
    }

    const isBlackListed =
      await this._refreshTokenService.blackListAllUserTokens(
        toObjectId(updatedUser.id),
      );

    if (!isBlackListed) {
      throw new InternalServerErrorException(GENERAL_ERRORS.ERROR);
    }

    return { message: USER_SUCCESS_MESSAGES.PASSWORD_UPDATE_SUCCESS };
  }

  // To add home address with location
  async updateHomeLocation(
    userId: string,
    payload: HomeAddressDto,
  ): Promise<IBaseResponse> {
    const homeAddressData: IHomeAddress = {
      address: payload.address,
      city: payload.city,
      location: {
        type: 'Point',
        coordinates: [payload.longitude, payload.latitude],
      },
    };

    const updatedUser = await this._userRepo.updateById(userId, {
      homeAddress: homeAddressData,
    });

    if (!updatedUser) {
      throw new InternalServerErrorException(
        USER_ERROR_MESSAGES.HOME_ADDRESS_UPDATE_ERROR,
      );
    }

    return { message: USER_SUCCESS_MESSAGES.HOME_ADDRESS_UPDATE_SUCCESS };
  }
}
