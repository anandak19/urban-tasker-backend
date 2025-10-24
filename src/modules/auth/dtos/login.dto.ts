import { EmailExists } from '@core/decorators/email.decorator';
import { AUTH_MESSAGES } from '@shared/constants/messages/auth-messages.constant';
import { IsNotEmpty } from 'class-validator';

export class LoginDTo {
  @IsNotEmpty({ message: AUTH_MESSAGES.EMAIL_REQUIRED })
  @EmailExists({ message: AUTH_MESSAGES.EMAIL_NOT_FOUND })
  readonly email: string;

  @IsNotEmpty({ message: AUTH_MESSAGES.PASSWORD_REQUIRED })
  readonly password: string;
}
