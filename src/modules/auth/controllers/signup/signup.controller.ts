import { BasicUserDto } from '@modules/auth/dtos/basicUserData.dto';
import { SignupService } from '@modules/auth/services/signup/signup.service';
import { Body, Controller, Get, Post } from '@nestjs/common';

@Controller('auth/signup')
export class SignupController {
  constructor(private singupService: SignupService) {}

  @Post()
  signupUser() {
    // singup controller logic
  }

  @Post('varify-user-data')
  validateBasicUserData(@Body() basicUserDto: BasicUserDto) {
    return basicUserDto;
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
