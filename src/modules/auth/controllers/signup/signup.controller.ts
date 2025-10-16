import { BasicUserDto } from '@modules/auth/dtos/basicUserData.dto';
import { SignupService } from '@modules/auth/services/signup/signup.service';
import { Body, Controller, Get, Post } from '@nestjs/common';

@Controller('auth/signup')
export class SignupController {
  constructor(private _singupService: SignupService) {}

  @Post()
  async signupUser() {
    // singup controller logic
    const email = 'arun.kumar@example.com';
    const data = await this._singupService.signup(email);
    console.log(data);
    return data;
  }

  @Post('varify-user-data')
  async validateBasicUserData(@Body() basicUserDto: BasicUserDto) {
    return await this._singupService.varifiUserData(basicUserDto);
  }

  @Post('varify-otp')
  varifyOtp() {
    // otp varification controller
  }

  @Get('resend-otp')
  resendOtp() {
    // otp resend controller
  }
}
