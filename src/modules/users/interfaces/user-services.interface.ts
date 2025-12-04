import { SuspendUserDto } from '../dtos/suspend-user.dto';
import { UserResponseDto } from '../dtos/user-response.dto';
import { ICreateUser, IUserData } from './user.interface';
import { GetDocsDto } from '@shared/dtos/get-docs.dto';

export interface IUserService {
  findByEmail(email: string): Promise<UserResponseDto | null>;
  authenticateUser(email: string, password: string): Promise<UserResponseDto>;
  authenticateAdmin(email: string, password: string): Promise<UserResponseDto>;
  create(userData: ICreateUser): Promise<UserResponseDto | null>;

  /**
   * To find and update user password by id
   * @param id - id of the user to update
   * @param plainPassword - new plain password
   * @returns updated user data
   */
  updateUserPassword(
    id: string,
    plainPassword: string,
  ): Promise<UserResponseDto>;
}

export interface IAdminUserService {
  findAllUsers(userQuery: GetDocsDto);

  findOne(id: string): Promise<IUserData>;

  suspendUser(id: string, reasonData: SuspendUserDto): Promise<IUserData>;

  unSuspendUser(id: string): Promise<IUserData>;
}
