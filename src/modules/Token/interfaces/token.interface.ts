import { Types } from 'mongoose';

export interface ICreateToken {
  userId: Types.ObjectId | string;
  token: string;
  expiresAt: Date;
}

export interface IToken extends ICreateToken {
  revoked: boolean;
  id?: string;
}
