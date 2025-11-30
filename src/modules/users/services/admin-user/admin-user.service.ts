import type { IUserRepository } from '@modules/users/interfaces/user-repositories.interface';
import { IAdminUserService } from '@modules/users/interfaces/user-services.interface';
import { IUserData } from '@modules/users/interfaces/user.interface';
import { UserMapper } from '@modules/users/mappers/user.mapper';
import { USER_TOKENS } from '@modules/users/user-tokens';
import {
  Inject,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import {
  GENERAL_ERRORS,
  USER_ERRORS,
} from '@shared/constants/messages/error-messaes.constants';
import { GetDocsDto } from '@shared/dtos/get-docs.dto';
import { IFindAllQuery } from '@shared/interfaces/query.interface';

@Injectable()
export class AdminUserService implements IAdminUserService {
  constructor(
    @Inject(USER_TOKENS.REPOSITORY) private _userRepo: IUserRepository,
  ) {}

  async findAllUsers(userQuery: GetDocsDto) {
    const pagination: IFindAllQuery = {
      page: userQuery?.page,
      limit: userQuery?.limit,
    };

    try {
      const users = await this._userRepo.findAllUsers(pagination);

      if (!users) {
        throw new InternalServerErrorException('Faild to fetch users');
      }

      console.log(users.documents);
      const allUsers = users.documents.map((user) =>
        UserMapper.toResponse(user),
      );
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

  async findOne(id: string): Promise<IUserData> {
    try {
      const user = await this._userRepo.findById(id);
      if (!user) {
        throw new NotFoundException(USER_ERRORS.USER_NOT_FOUND);
      }

      return UserMapper.toResponse(user);
    } catch {
      console.log('errror in finding oneuser');
      throw new InternalServerErrorException(GENERAL_ERRORS.SERVER_ERROR);
    }
  }
}
