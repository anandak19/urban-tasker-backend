import { Cookies } from '@core/decorators/cookies.decorator';
import type { ILoggerService } from '@core/lib/logger/logger.interface';
import { LOGGER_SERVICE } from '@core/lib/logger/logger.service';
import { AUTH_TOKENS } from '@modules/auth/auth-tokens';
import { BasicUserDto } from '@modules/auth/dtos/basicUserData.dto';
import { OtpDto } from '@modules/auth/dtos/otp.dto';
import { PasswordDto } from '@modules/auth/dtos/password.dto';
import { ISignupController } from '@modules/auth/interfaces/controllers.interface';
import {
  ITimeLeftResponse,
  type IBasicUserResponse,
} from '@modules/auth/interfaces/response.interface';
import { type ISignupService } from '@modules/auth/interfaces/services.interface';
import { Body, Controller, Get, Inject, Post, Res } from '@nestjs/common';
import { IBaseResponse } from '@shared/interfaces/base-response.interface';
import express from 'express';

@Controller('auth/signup')
export class SignupController implements ISignupController {
  constructor(
    @Inject(AUTH_TOKENS.SIGNUP_SERVICE) private _signupService: ISignupService,
    @Inject(LOGGER_SERVICE) private _logger: ILoggerService,
  ) {}

  // STEP 3
  @Post()
  async signup(
    @Res({ passthrough: true }) res: express.Response,
    @Cookies('signupId') signupId: string,
    @Body() passwordDto: PasswordDto,
  ): Promise<IBaseResponse> {
    // singup controller logic
    this._logger.verbose('Signup control reached');
    return await this._signupService.signup(
      res,
      signupId,
      passwordDto.password,
    );
  }

  // STEP 2
  @Post('otp')
  async varifyOtp(
    @Cookies('signupId') signupId: string,
    @Body() otpDto: OtpDto,
  ): Promise<IBaseResponse> {
    return await this._signupService.varifyOtp(signupId, otpDto.otp);
  }

  // STEP 2.1 Resend OTP
  @Get('otp')
  async resendOtp(
    @Cookies('signupId') signupId: string,
  ): Promise<IBasicUserResponse> {
    // otp resend controller
    return await this._signupService.resendOtp(signupId);
  }

  // STEP 2.2 GET OTP expire time in seconds
  @Get('otp-status')
  async getOtpTimeLeft(
    @Cookies('signupId') signupId: string,
  ): Promise<ITimeLeftResponse> {
    return await this._signupService.getOtpTimeLeft(signupId);
  }

  // STEP 1: Validate and save basic user data
  @Post('basic')
  async saveBasicUserData(
    @Res({ passthrough: true }) res: express.Response,
    @Body() basicUserDto: BasicUserDto,
  ): Promise<IBasicUserResponse> {
    return await this._signupService.saveBasicUserData(res, basicUserDto);
  }
}
