import { UserRoles } from '@shared/constants/enums/user.enum';
import { Types } from 'mongoose';

// add other properties here
export interface IUser extends ICreateUser {
  userRole: UserRoles;
}

export interface ICreateUser {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  password: string;
}

/*
  gender: string;
  dob: string;
*/

export interface IUserEntity extends IUser {
  _id: Types.ObjectId;
}
