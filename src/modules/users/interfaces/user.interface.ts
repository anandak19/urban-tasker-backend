import { Types } from 'mongoose';

export interface IUser {
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
