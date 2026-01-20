import { AppConfig } from '@config/app.config';
import { CacheService } from '@core/lib/cache/cache.service';
import { EmailService } from '@core/lib/email/email.service';
import type { ILoggerService } from '@core/lib/logger/logger.interface';
import { LOGGER_SERVICE } from '@core/lib/logger/logger.service';
import { AUTH_TOKENS } from '@modules/auth/auth-tokens';
import { IPayload } from '@modules/auth/interfaces/auth.interface';
import type {
  IPasswordService,
  ITokenService,
} from '@modules/auth/interfaces/services.interface';
import { UserResponseDto } from '@modules/users/dtos/user-response.dto';
import type { IUserService } from '@modules/users/interfaces/user-services.interface';
import { USER_TOKENS } from '@modules/users/user-tokens';
import {
  BadRequestException,
  Inject,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { generateResetPasswordHtml } from '@shared/constants/email/email-templates';
import { AUTH_MESSAGES } from '@shared/constants/messages/auth-messages.constant';
import { USER_ERRORS } from '@shared/constants/messages/error-messaes.constants';
import { IBaseResponse } from '@shared/interfaces/base-response.interface';

@Injectable()
export class PasswordService implements IPasswordService {
  private _resetUrl: string;
  private _homeUrl: string;

  constructor(
    @Inject(AUTH_TOKENS.TOKEN_SERVICE) private _tokenService: ITokenService,
    @Inject(USER_TOKENS.SERVICE) private _userService: IUserService,
    @Inject(LOGGER_SERVICE) private _logger: ILoggerService,
    private _configService: ConfigService<AppConfig>,
    private _cacheService: CacheService,
    private _emailService: EmailService,
  ) {
    this._homeUrl = this._configService.get<string>('APP_HOME_URL', {
      infer: true,
    })!;
    this._resetUrl = `${this._homeUrl}/reset-password`;
  }

  // to varify email and send reset link to email
  async forgotPassword(email: string): Promise<IBaseResponse> {
    // find user with this email
    const userData = await this._userService.findByEmail(email);
    // if no user throw error
    if (!userData) {
      throw new NotFoundException(AUTH_MESSAGES.EMAIL_NOT_FOUND);
    }
    // call method to generate new reset link
    const resetTokenPaylod = this._getPaylod(userData);
    const resetToken = await this._tokenService.getResetToken(resetTokenPaylod);
    this._logger.verbose(this._resetUrl);
    const resetUrl = `${this._resetUrl}?token=${resetToken}`;
    // call method to send reset link to users email.
    const html = generateResetPasswordHtml(resetUrl);

    try {
      await this._emailService.sendEmail({
        recipient: userData.email,
        subject: 'Rest your password',
        html,
      });
      // save reset link in a cache, 30m
      await this._cacheService.set<string>(
        resetToken,
        resetToken,
        1000 * 60 * 30,
      );
      // return success message
      this._logger.log(resetUrl);
      return { message: 'Reset password link has send to your email' };
    } catch {
      throw new InternalServerErrorException(USER_ERRORS.UPDATE_PASSWORD_FAIL);
    }
  }

  // to reset password with new password
  async resetPassword(
    token: string,
    newPassword: string,
  ): Promise<IBaseResponse> {
    this._logger.log(token);
    // call the method to update users password
    const payload = await this._tokenService.verifyToken(token);
    if (!payload || !payload.id) {
      throw new BadRequestException(USER_ERRORS.UPDATE_PASSWORD_FAIL); // update message
    }
    // return message
    const updatedUser = await this._userService.updateUserPassword(
      payload.id,
      newPassword,
    );

    if (!updatedUser) {
      throw new InternalServerErrorException(USER_ERRORS.UPDATE_PASSWORD_FAIL);
    }

    return { message: 'Updated user password' };
  }

  private _getPaylod(user: UserResponseDto): IPayload {
    return {
      id: user.id,
      email: user.email,
      userRole: user.userRole,
      firstName: user.firstName,
    };
  }
}
