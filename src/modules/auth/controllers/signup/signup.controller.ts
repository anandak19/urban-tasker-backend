import { Cookies } from '@core/decorators/cookies.decorator';
import { BasicUserDto } from '@modules/auth/dtos/basicUserData.dto';
import { OtpDto } from '@modules/auth/dtos/otp.dto';
import { SignupService } from '@modules/auth/services/signup/signup.service';
import {
  BadRequestException,
  Body,
  Controller,
  Get,
  Post,
  Res,
} from '@nestjs/common';
import express from 'express';

@Controller('auth/signup')
export class SignupController {
  constructor(private _singupService: SignupService) {}

  // STEP 1
  @Post('basic')
  async validateBasicUserData(
    @Res({ passthrough: true }) res: express.Response,
    @Body() basicUserDto: BasicUserDto,
  ) {
    return await this._singupService.saveBasicUserData(res, basicUserDto);
  }

  // STEP 2
  @Post('otp')
  async varifyOtp(
    @Cookies('signupId') signupId: string,
    @Body() otpDto: OtpDto,
  ) {
    // otp varification controller
    if (!signupId) {
      throw new BadRequestException(
        'Signup session expired. Please restart signup.',
      );
    }
    return await this._singupService.varifyOtp(signupId, otpDto.otp);
  }

  // STEP 2.1
  @Get('otp')
  async resendOtp(@Cookies('signupId') signupId: string) {
    if (!signupId) {
      throw new BadRequestException(
        'Signup session expired. Please restart signup.',
      );
    }
    // otp resend controller
    return await this._singupService.resendOtp(signupId);
  }

  // STEP 3
  @Post()
  async validatePassword() {
    // singup controller logic
    const email = 'arun.kumar@example.com';
    const data = await this._singupService.signup(email);
    console.log(data);
    return data;
  }
}
