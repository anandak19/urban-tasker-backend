import { AUTH_MESSAGES } from '@shared/constants/messages/auth-messages.constant';
import { USER_REGEX } from '@shared/constants/regex/user-regex.constant';
import { IsNotEmpty, Matches, MaxLength } from 'class-validator';

export class ForgotPasswordDto {
  @IsNotEmpty({ message: AUTH_MESSAGES.EMAIL_REQUIRED })
  @MaxLength(60, { message: AUTH_MESSAGES.EMAIL_MAX })
  @Matches(USER_REGEX.EMAIL, { message: AUTH_MESSAGES.INVALID_EMAIL })
  readonly email: string;
}
