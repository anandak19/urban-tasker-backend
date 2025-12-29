import { AuthProvider } from '@shared/constants/enums/auth-providers.enum';
import { ImageSource } from '@shared/constants/enums/image-source.enum';
import { Gender, UserRoles } from '@shared/constants/enums/user.enum';
import { Types } from 'mongoose';

export interface IGeoLocation {
  type: 'Point';
  coordinates: [number, number]; // [longitude, latitude]
}
export interface IHomeAddress {
  address: string;
  city: string;
  location: IGeoLocation;
}

export interface IPersonalDetails {
  firstName: string;
  lastName: string;
  phone: string;
  gender: Gender;
}

export interface IChangePassoword {
  oldPassword: string;
  newPassword: string;
}
export interface IUserData extends Omit<IPersonalDetails, 'gender'> {
  id: string;
  email: string;
  userRole: UserRoles;
  isTaskerApplied: boolean;

  gender?: Gender;
  profileImageUrl?: string;
  isSuspended: boolean;
  suspendedReason: string;
  homeAddress?: IHomeAddress;
}

export interface IProfileImage {
  value: string;
  source: ImageSource;
}

// add other properties here
export interface IUser extends ICreateUser {
  userRole: UserRoles;
  profileImageUrl?: string;
}

// some data are optional becouse for google users
export interface ICreateUser {
  firstName: string;
  lastName: string;
  email: string;
  provider: AuthProvider;
  profileImage?: IProfileImage;
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
