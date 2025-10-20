import { Cookies } from '@core/decorators/cookies.decorator';
import { BasicUserDto } from '@modules/auth/dtos/basicUserData.dto';
import { OtpDto } from '@modules/auth/dtos/otp.dto';
import { PasswordDto } from '@modules/auth/dtos/password.dto';
import { SignupService } from '@modules/auth/services/signup/signup.service';
import { Body, Controller, Get, Post, Res } from '@nestjs/common';
import express from 'express';

@Controller('auth/signup')
export class SignupController {
  constructor(private _singupService: SignupService) {}

  // STEP 3
  @Post()
  async signupUser(
    @Cookies('signupId') signupId: string,
    @Body() passwordDto: PasswordDto,
  ) {
    // singup controller logic
    const data = await this._singupService.signup(
      signupId,
      passwordDto.password,
    );
    console.log(data);
    return data;
  }

  // STEP 2
  @Post('otp')
  async varifyOtp(
    @Cookies('signupId') signupId: string,
    @Body() otpDto: OtpDto,
  ) {
    return await this._singupService.varifyOtp(signupId, otpDto.otp);
  }

  // STEP 2.1
  @Get('otp')
  async resendOtp(@Cookies('signupId') signupId: string) {
    // otp resend controller
    return await this._singupService.resendOtp(signupId);
  }

  // STEP 2.2
  @Get('otp-status')
  getOtpStatus(@Cookies('signupId') signupId: string) {
    console.log(signupId);
  }

  // STEP 1: Validate and save basic user data
  @Post('basic')
  async validateBasicUserData(
    @Res({ passthrough: true }) res: express.Response,
    @Body() basicUserDto: BasicUserDto,
  ) {
    return await this._singupService.saveBasicUserData(res, basicUserDto);
  }
}
