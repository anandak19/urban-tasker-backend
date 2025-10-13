import { Body, Controller, Get, Post } from '@nestjs/common';
import { SignupService } from '../../services/signup/signup.service';
import { BasicUserDto } from '../../dtos/basicUserData.dto';

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
