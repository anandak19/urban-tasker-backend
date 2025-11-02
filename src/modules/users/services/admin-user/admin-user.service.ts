import { UserQueryDto } from '@modules/users/dtos/user-query.dto';
import type { IUserRepository } from '@modules/users/interfaces/user-repositories.interface';
import { IAdminUserService } from '@modules/users/interfaces/user-services.interface';
import { UserMapper } from '@modules/users/mappers/user.mapper';
import { USER_TOKENS } from '@modules/users/user-tokens';
import {
  Inject,
  Injectable,
  InternalServerErrorException,
} from '@nestjs/common';
import { IPaginationQuery } from '@shared/interfaces/query.interface';

@Injectable()
export class AdminUserService implements IAdminUserService {
  constructor(
    @Inject(USER_TOKENS.REPOSITORY) private _userRepo: IUserRepository,
  ) {}

  async findAllUsers(userQuery: UserQueryDto) {
    const pagination: IPaginationQuery = {
      page: userQuery?.page,
      limit: userQuery?.limit,
    };

    try {
      const users = await this._userRepo.findAllUsers(pagination);

      if (!users) {
        throw new InternalServerErrorException('Faild to fetch users');
      }

      console.log(users.data);
      const allUsers = users.data.map((user) => UserMapper.toResponse(user));
      return {
        allUsers,
        metaData: users.meta,
        message: 'All users fetched',
      };
    } catch (error) {
      console.log(error);
      throw new InternalServerErrorException('Somthing went wrong');
    }
  }
}
