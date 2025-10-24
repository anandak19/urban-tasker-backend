import { EmailUnique } from '@core/decorators/email.decorator';
import { AUTH_MESSAGES } from '@shared/constants/messages/auth-messages.constant';
import { USER_REGEX } from '@shared/constants/regex/user-regex.constant';
import {
  IsNotEmpty,
  IsString,
  IsPhoneNumber,
  MaxLength,
  MinLength,
  Matches,
} from 'class-validator';

export class BasicUserDto {
  @IsNotEmpty({ message: AUTH_MESSAGES.FIRSTNAME_REQUIRED })
  @IsString({ message: AUTH_MESSAGES.FIRSTNAME_STRING })
  @MinLength(2, { message: AUTH_MESSAGES.FIRSTNAME_MIN })
  @MaxLength(30, { message: AUTH_MESSAGES.FIRSTNAME_MAX })
  @Matches(USER_REGEX.NAME, { message: AUTH_MESSAGES.FIRSTNAME_INVALID })
  readonly firstName: string;

  @IsNotEmpty({ message: AUTH_MESSAGES.LASTNAME_REQUIRED })
  @IsString({ message: AUTH_MESSAGES.LASTNAME_STRING })
  @MinLength(2, { message: AUTH_MESSAGES.LASTNAME_MIN })
  @MaxLength(30, { message: AUTH_MESSAGES.LASTNAME_MAX })
  @Matches(USER_REGEX.NAME, { message: AUTH_MESSAGES.LASTNAME_INVALID })
  readonly lastName: string;

  @IsNotEmpty({ message: AUTH_MESSAGES.EMAIL_REQUIRED })
  @MaxLength(60, { message: AUTH_MESSAGES.EMAIL_MAX })
  @Matches(USER_REGEX.EMAIL, { message: AUTH_MESSAGES.INVALID_EMAIL })
  @EmailUnique({ message: AUTH_MESSAGES.EMAIL_TAKEN })
  readonly email: string;

  @IsNotEmpty({ message: AUTH_MESSAGES.PHONE_REQUIRED })
  @IsPhoneNumber('IN', { message: AUTH_MESSAGES.INVALID_PHONE })
  @Matches(USER_REGEX.PHONE_IN, { message: AUTH_MESSAGES.INVALID_PHONE_FORMAT }) // for India
  readonly phone: string;
}
