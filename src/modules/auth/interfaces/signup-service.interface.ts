import { Response } from 'express';
import { type BasicUserDto } from '../dtos/basicUserData.dto';
import {
  type ITimeLeftResponse,
  type IBasicUserResponse,
  ISignupResponse,
} from './response.interface';
import { type IBaseResponse } from '@shared/interfaces/base-response.interface';

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
  ): Promise<ISignupResponse>;
}
