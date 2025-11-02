import { AUTH_MESSAGES } from '@shared/constants/messages/auth-messages.constant';
import { USER_REGEX } from '@shared/constants/regex/user-regex.constant';
import {
  IsNotEmpty,
  IsString,
  Matches,
  MaxLength,
  MinLength,
} from 'class-validator';

export class ResetPasswordDto {
  @IsNotEmpty({ message: AUTH_MESSAGES.PASSWORD_REQUIRED })
  @MinLength(5, { message: AUTH_MESSAGES.PASSWORD_MIN })
  @MaxLength(15, { message: AUTH_MESSAGES.PASSWORD_MAX })
  @Matches(USER_REGEX.PASSWORD, {
    message: AUTH_MESSAGES.PASSWORD_INVALID_FORMAT,
  })
  password: string;

  @IsNotEmpty()
  @IsString()
  resetToken: string;
}
