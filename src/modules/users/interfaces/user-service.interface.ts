import { UserResponseDto } from '../dtos/user-response.dto';
import { ICreateUser } from './user.interface';

export interface IUserService {
  findByEmail(email: string): Promise<UserResponseDto | null>;
  create(userData: ICreateUser): Promise<UserResponseDto | null>;
}
