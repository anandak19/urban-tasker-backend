import { type IRefreshTokenService } from '@modules/Token/interfaces/services.interface';
import { TOKEN_TOKENS } from '@modules/Token/token-tokens';
import { GetUsersDto } from '@modules/users/dtos/get-user.dto';
// import { type IRefreshTokenService } from '@modules/auth/interfaces/services.interface';
import { SuspendUserDto } from '@modules/users/dtos/suspend-user.dto';
import { UserResponseDto } from '@modules/users/dtos/user-response.dto';
import { IUserFilter } from '@modules/users/interfaces/user-query.interface';
import type { IUserRepository } from '@modules/users/interfaces/user-repositories.interface';
import type {
  IAdminUserService,
  IUserService,
} from '@modules/users/interfaces/user-services.interface';
import { IUserData } from '@modules/users/interfaces/user.interface';
import { USER_TOKENS } from '@modules/users/user-tokens';
import {
  Inject,
  Injectable,
  InternalServerErrorException,
} from '@nestjs/common';
import { UserRoles } from '@shared/constants/enums/user.enum';
import {
  GENERAL_ERRORS,
  USER_ERRORS,
} from '@shared/constants/messages/error-messaes.constants';
import { USER_SUCCESS_MESSAGES } from '@shared/constants/messages/user-messages.constant';
import { IFindAllQuery } from '@shared/interfaces/query.interface';
import { TObjectId } from '@shared/types/db-types';

@Injectable()
export class AdminUserService implements IAdminUserService {
  constructor(
    @Inject(USER_TOKENS.REPOSITORY) private _userRepo: IUserRepository,
    @Inject(TOKEN_TOKENS.REFERESH_TOKEN_SERVICE)
    private _refreshTokenService: IRefreshTokenService,

    @Inject(USER_TOKENS.SERVICE) private _userService: IUserService,
  ) {}

  async findAllUsers(userQuery: GetUsersDto) {
    console.log(userQuery);
    const pagination: IFindAllQuery = {
      page: userQuery?.page,
      limit: userQuery?.limit,
    };

    const filter: IUserFilter = {
      search: userQuery.search,
      role: userQuery.role ?? userQuery.role,
    };

    try {
      const users = await this._userRepo.findAllUsers(pagination, filter);

      if (!users) {
        throw new InternalServerErrorException(USER_ERRORS.USER_FETCH_ERROR);
      }

      console.log(users.documents);
      const allUsers = await Promise.all(
        users.documents.map((user) => this._userService.getUserResponse(user)),
      );
      console.log(allUsers);

      return {
        allUsers,
        metaData: users.meta,
        message: USER_SUCCESS_MESSAGES.GET_ALL_SUCCESS,
      };
    } catch (error) {
      console.log(error);
      throw new InternalServerErrorException(GENERAL_ERRORS.ERROR);
    }
  }

  async suspendUser(
    id: string,
    reasonData: SuspendUserDto,
  ): Promise<IUserData> {
    try {
      const updated = await this._userRepo.updateById(id, {
        isSuspended: true,
        suspendedReason: reasonData.suspendedReason,
      });

      if (!updated) {
        throw new InternalServerErrorException(USER_ERRORS.SUSPEND_FAIL);
      }

      const isBlackListed =
        await this._refreshTokenService.blackListAllUserTokens(updated._id);

      if (!isBlackListed) {
        throw new InternalServerErrorException(GENERAL_ERRORS.ERROR);
      }

      return this._userService.getUserResponse(updated);
    } catch (error) {
      console.log(error);
      throw new InternalServerErrorException(GENERAL_ERRORS.SERVER_ERROR);
    }
  }

  async unSuspendUser(id: string): Promise<IUserData> {
    try {
      const updated = await this._userRepo.updateById(id, {
        isSuspended: false,
        suspendedReason: '',
      });

      if (!updated) {
        throw new InternalServerErrorException(USER_ERRORS.UNSUSPEND_FAIL);
      }

      return this._userService.getUserResponse(updated);
    } catch (error) {
      console.log(error);
      throw new InternalServerErrorException(GENERAL_ERRORS.SERVER_ERROR);
    }
  }

  async changeUserRoleById(
    id: TObjectId,
    userRole: UserRoles,
  ): Promise<UserResponseDto> {
    try {
      const updated = await this._userRepo.updateById(id, { userRole });
      if (!updated) {
        throw new InternalServerErrorException(GENERAL_ERRORS.ERROR);
      }

      return this._userService.getUserResponse(updated);
    } catch {
      throw new InternalServerErrorException(GENERAL_ERRORS.ERROR);
    }
  }

  async getTotalUsersCount(): Promise<number> {
    return await this._userRepo.getTotalUsersCount();
  }

  async getTotalTaskersCount(): Promise<number> {
    return await this._userRepo.getTotalTaskersCount();
  }
}
