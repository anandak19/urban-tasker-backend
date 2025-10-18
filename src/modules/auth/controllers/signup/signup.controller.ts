import { BasicUserDto } from '@modules/auth/dtos/basicUserData.dto';
import { SignupService } from '@modules/auth/services/signup/signup.service';
import { Body, Controller, Get, Post, Res } from '@nestjs/common';
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

  // STEP 3
  @Post()
  async validatePassword() {
    // singup controller logic
    const email = 'arun.kumar@example.com';
    const data = await this._singupService.signup(email);
    console.log(data);
    return data;
  }

  // STEP 2
  @Post('varify-otp')
  varifyOtp() {
    // otp varification controller
  }

  // STEP 2.1
  @Get('resend-otp')
  resendOtp() {
    // otp resend controller
  }
}
