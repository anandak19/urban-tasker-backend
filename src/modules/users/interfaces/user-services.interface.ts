import { TObjectId } from '@shared/types/db-types';
import { SuspendUserDto } from '../dtos/suspend-user.dto';
import { UserResponseDto } from '../dtos/user-response.dto';
import {
  IChangePassoword,
  ICreateUser,
  IPersonalDetails,
  IProfileImage,
  IUserData,
} from './user.interface';
import { GetDocsDto } from '@shared/dtos/get-docs.dto';
import { UserRoles } from '@shared/constants/enums/user.enum';
import { UserDocument } from '../schemas/user.schema';
import { BasicUserResponseDto } from '../dtos/basic-user-response.dto';
import { IBaseResponse } from '@shared/interfaces/base-response.interface';
import { HomeAddressDto } from '../dtos/home-address.dto';

export interface IUserService {
  findByEmail(email: string): Promise<UserResponseDto | null>;
  authenticateUser(email: string, password: string): Promise<UserResponseDto>;
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

  /**
   * Populate with image url and convert the type
   * @param user
   */
  getUserResponse(user: UserDocument): Promise<UserResponseDto>;

  /**
   * Returns basic user data
   * @param id
   */
  getBasicUserData(id: string): Promise<BasicUserResponseDto>;

  findOne(id: string): Promise<UserResponseDto>;

  getUserImage(userImage: IProfileImage): Promise<IProfileImage>;
}

export interface IUserProfileService {
  /**
   * TODOS
   * 1. To fetch the logged in users profile data
   * 2. To edit/save updated user profile data
   * 3. To add/change the user profile picture
   * 4. To change the password (new password and old password will be in body)
   * 5. To add home address with location
   */

  updatePersonalData(
    userId: string,
    payload: IPersonalDetails,
  ): Promise<IBaseResponse>;

  changePassword(
    userId: string,
    payload: IChangePassoword,
  ): Promise<IBaseResponse>;

  updateHomeLocation(
    userId: string,
    payload: HomeAddressDto,
  ): Promise<IBaseResponse>;

  updateProfilePicture(
    userId: string,
    file: Express.Multer.File,
  ): Promise<IBaseResponse>;
}

export interface IAdminUserService {
  findAllUsers(userQuery: GetDocsDto); // add return type here

  suspendUser(id: string, reasonData: SuspendUserDto): Promise<IUserData>;

  unSuspendUser(id: string): Promise<IUserData>;

  changeUserRoleById(id: TObjectId, userRole: UserRoles): Promise<IUserData>;

  getTotalUsersCount(): Promise<number>;

  getTotalTaskersCount(): Promise<number>;
}
