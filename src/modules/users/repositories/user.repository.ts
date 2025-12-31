import { ConflictException, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User, UserDocument } from '../schemas/user.schema';
import { ICreateUser } from '../interfaces/user.interface';
import { isDuplicateKeyError } from '@shared/utility/db/mongo-error.util';
import { AUTH_MESSAGES } from '@shared/constants/messages/auth-messages.constant';
import { IUserRepository } from '../interfaces/user-repositories.interface';
import { BaseRepository } from '@shared/repository/base.repository';
import {
  IFindAllQuery,
  PaginatedResult,
} from '@shared/interfaces/query.interface';
import { IUserFilter } from '../interfaces/user-query.interface';
import { IFindAllOptions } from '@shared/interfaces/repository.interface';

@Injectable()
export class UserRepository
  extends BaseRepository<UserDocument, ICreateUser>
  implements IUserRepository
{
  constructor(
    @InjectModel(User.name) private readonly _userModel: Model<UserDocument>,
  ) {
    super(_userModel);
  }

  // find all users
  findAllUsers(
    pagination?: IFindAllQuery,
    filter?: IUserFilter,
  ): Promise<PaginatedResult<UserDocument>> {
    console.log('Filer below');
    console.log(filter);
    // prepare filter query here
    const filterQuery = {
      ...filter,
      userRole: { $ne: 'admin' },
    };

    // prepare options
    const options: IFindAllOptions = {
      page: pagination?.page,
      limit: pagination?.limit,
    };

    return this.findAll(options, filterQuery);
  }

  // find user by email
  async findByEmail(email: string): Promise<UserDocument | null> {
    return await this.findOne({ email });
  }

  // create new user itno db
  async create(data: ICreateUser): Promise<UserDocument> {
    try {
      return await this._userModel.create(data);
    } catch (error) {
      console.log(error);
      if (isDuplicateKeyError(error)) {
        throw new ConflictException(AUTH_MESSAGES.EMAIL_TAKEN); // create one for phone number taken
      }
      throw error;
    }
  }
}
