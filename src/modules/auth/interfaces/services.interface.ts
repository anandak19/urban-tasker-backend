import { IBaseResponse } from '@shared/interfaces/base-response.interface';
import { type Response } from 'express';
import { BasicUserDto } from '../dtos/basicUserData.dto';
import {
  IAuthResponse,
  IBasicUserResponse,
  ITimeLeftResponse,
} from './response.interface';
import { IPayload, ITokens } from './auth.interface';
import { LoginDTo } from '../dtos/login.dto';

export interface ISignupService {
  saveBasicUserData(
    res: Response,
    basicUserDto: BasicUserDto,
  ): Promise<IBasicUserResponse>;

  varifyOtp(singupId: string, otp: string): Promise<IBaseResponse>;

  resendOtp(singupId: string): Promise<IBasicUserResponse>;

  getOtpTimeLeft(singupId: string): Promise<ITimeLeftResponse>;

  signup(
    res: Response,
    singupId: string,
    password: string,
  ): Promise<IBaseResponse>;
}

export interface ITokenService {
  getAuthTokens(payload: IPayload): Promise<ITokens> | ITokens;

  verifyToken(token: string): Promise<IPayload>;

  getResetToken(payload: IPayload): Promise<string>;
}

export interface IAuthService {
  userLogin(res: Response, loginDto: LoginDTo): Promise<IAuthResponse>;

  adminLogin(res: Response, loginDto: LoginDTo): Promise<IAuthResponse>;

  refreshToken(res: Response, refreshToken: string): Promise<IAuthResponse>;

  logout(): Promise<IBaseResponse>;
}
