import { Types } from 'mongoose';

export interface IUser {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  gender: string;
  dob: string;
  password: string;
}

export interface IUserEntity extends IUser {
  _id: Types.ObjectId;
}
