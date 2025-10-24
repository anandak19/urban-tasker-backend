import { IBaseRepository } from '@shared/interfaces/base-repository.interface';
import { UserDocument } from '../schemas/user.schema';
import { ICreateUser } from './user.interface';

export interface IUserRepository
  extends IBaseRepository<UserDocument, ICreateUser> {
  findByEmail(email: string): Promise<UserDocument | null>;
}
