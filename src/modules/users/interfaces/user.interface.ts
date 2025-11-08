import { AuthProvider } from '@shared/constants/enums/auth-providers.enum';
import { UserRoles } from '@shared/constants/enums/user.enum';
import { Types } from 'mongoose';

export interface IUserData {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone?: string;
  userRole: UserRoles;
  isTaskerApplied: boolean;
}

// add other properties here
export interface IUser extends ICreateUser {
  userRole: UserRoles;
}

// some data are optional becouse for google users
export interface ICreateUser {
  firstName: string;
  lastName: string;
  email: string;
  provider: AuthProvider;
  phone?: string;
  password?: string;
}

/*
  gender: string;
  dob: string;
*/

export interface IUserEntity extends IUser {
  _id: Types.ObjectId;
}
