import { IPayload } from '@modules/auth/interfaces/auth.interface';
import { type Request } from 'express';

export interface IAuthenticatedReqeust extends Request {
  user: IPayload;
}
