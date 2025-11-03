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
  IPaginationQuery,
  PaginatedResult,
} from '@shared/interfaces/query.interface';
import { IUserFilter } from '../interfaces/user-query.interface';

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
    pagination?: IPaginationQuery,
    filter?: IUserFilter,
  ): Promise<PaginatedResult<UserDocument>> {
    console.log(filter);
    // prepare filter query here
    const filterQuery = { ...filter, userRole: { $ne: 'admin' } };

    return this.findAll(pagination, filterQuery);
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
      if (isDuplicateKeyError(error)) {
        throw new ConflictException(AUTH_MESSAGES.EMAIL_TAKEN); // create one for phone number taken
      }
      throw error;
    }
  }
}
