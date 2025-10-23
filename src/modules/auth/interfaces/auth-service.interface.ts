import { type Response } from 'express';
import { IAuthResponse } from './response.interface';

export interface IAuthService {
  refreshAuth(res: Response, refreshToken: string): IAuthResponse;
}
