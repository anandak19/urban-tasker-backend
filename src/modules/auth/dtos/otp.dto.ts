import { AUTH_MESSAGES } from '@shared/constants/messages/auth-messages.constant';
import { IsNotEmpty, IsString, Length } from 'class-validator';

export class OtpDto {
  @IsNotEmpty({ message: AUTH_MESSAGES.OTP_REQUIRED })
  @IsString({ message: AUTH_MESSAGES.OTP_STRING })
  @Length(4, 4, { message: AUTH_MESSAGES.OTP_LENGTH })
  otp: string;
}
