import { UserResponseDto } from '../dtos/user-response.dto';
import { ICreateUser } from './user.interface';

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
