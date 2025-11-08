import type { Request, Response } from 'express';
import type {
  IBasicUserResponse,
  ITimeLeftResponse,
} from './response.interface';
import type { IBaseResponse } from '@shared/interfaces/base-response.interface';
import { BasicUserDto } from '../dtos/basicUserData.dto';
import { OtpDto } from '../dtos/otp.dto';
import { PasswordDto } from '../dtos/password.dto';
import { ForgotPasswordDto } from '../dtos/forgot-password.dto';
import { ResetPasswordDto } from '../dtos/reset-password.dto';

export interface IAuthController {
  /**
   * Login method after local guard
   * @param res
   */
  userLogin(req: Request, res: Response): Promise<IBaseResponse>;

  refreshToken(res: Response, refreshToken: string): Promise<IBaseResponse>;
  logout(res: Response, refreshToken: string): Promise<IBaseResponse>;
}

export interface ISignupController {
  /**
   * STEP 1: Validate and save basic user data
   */
  saveBasicUserData(
    res: Response,
    basicUserDto: BasicUserDto,
  ): Promise<IBasicUserResponse>;

  /**
   * STEP 2: Verify OTP
   */
  varifyOtp(signupId: string, otp: OtpDto): Promise<IBaseResponse>;

  /**
   * STEP 2.1: Resend OTP
   */
  resendOtp(signupId: string): Promise<IBasicUserResponse>;

  /**
   * STEP 2.2: Get OTP expiration time (in seconds)
   */
  getOtpTimeLeft(signupId: string): Promise<ITimeLeftResponse>;

  /**
   * STEP 3: Complete signup with password
   */
  signup(
    res: Response,
    signupId: string,
    password: PasswordDto,
  ): Promise<IBaseResponse>;
}

export interface IPasswordController {
  forgotPassword(forgotDto: ForgotPasswordDto): Promise<IBaseResponse>;
  resetPassword(resetDto: ResetPasswordDto): Promise<IBaseResponse>;
}
