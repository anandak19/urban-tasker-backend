import { IBaseRepository } from '@shared/interfaces/base-repository.interface';
import { UserDocument } from '../schemas/user.schema';
import { ICreateUser } from './user.interface';
import {
  IPaginationQuery,
  PaginatedResult,
} from '@shared/interfaces/query.interface';
import { IUserFilter } from './user-query.interface';

export interface IUserRepository
  extends IBaseRepository<UserDocument, ICreateUser> {
  /**
   * To find user by email
   * @param {string} email - email of user
   * @returns {Promise<UserDocument | null>} - if user is found return user data
   * else return null
   */
  findByEmail(email: string): Promise<UserDocument | null>;

  /**
   * To find all users - paginated
   * @param {IPaginationQuery} pagination;
   * @param {IUserFilter} filter - filter object. example , { email: 'ana@gmail.com' }
   */
  findAllUsers(
    pagination?: IPaginationQuery,
    filter?: IUserFilter,
  ): Promise<PaginatedResult<UserDocument>>;
}
