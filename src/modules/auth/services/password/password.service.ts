import { CacheService } from '@core/lib/cache/cache.service';
import { EmailService } from '@core/lib/email/email.service';
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
  Logger,
  NotFoundException,
} from '@nestjs/common';
import { AUTH_MESSAGES } from '@shared/constants/messages/auth-messages.constant';
import { USER_ERRORS } from '@shared/constants/messages/error-messaes.constants';
import { IBaseResponse } from '@shared/interfaces/base-response.interface';

@Injectable()
export class PasswordService implements IPasswordService {
  private _logger = new Logger(PasswordService.name);
  private _resetUrl = 'http://localhost:4200/reset-password';

  constructor(
    @Inject(AUTH_TOKENS.TOKEN_SERVICE) private _tokenService: ITokenService,
    @Inject(USER_TOKENS.SERVICE) private _userService: IUserService,
    private _emailService: EmailService,
    private _cacheService: CacheService,
  ) {}

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
    const resetUrl = `${this._resetUrl}?token=${resetToken}`;
    // call method to send reset link to users email.
    const html = this._generateResetPasswordHtml(resetUrl);

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
    };
  }

  private _generateResetPasswordHtml(resetLink: string): string {
    return `
    <div style="font-family: Arial, sans-serif; color: #333; line-height: 1.6;">
      <h3 style="color: #2c3e50;">Reset Your Password</h3>
      <p>Hello,</p>
      <p>We received a request to reset your password. You can set a new one by clicking the button below:</p>
      
      <div style="margin: 20px 0;">
        <a href="${resetLink}" 
           style="
             background-color: #007bff;
             color: #fff;
             text-decoration: none;
             padding: 10px 20px;
             border-radius: 6px;
             display: inline-block;
             font-weight: bold;
           ">
          Reset Password
        </a>
      </div>

      <p>This link will expire in <b>30 minutes</b>. If you didn’t request a password reset, you can safely ignore this email.</p>

      <p>Thanks,<br>The Support Team</p>

      <hr style="border: none; border-top: 1px solid #ddd; margin-top: 30px;">
      <p style="font-size: 12px; color: #777;">If the button doesn’t work, copy and paste the following link into your browser:</p>
      <p style="font-size: 12px; color: #007bff; word-break: break-all;">${resetLink}</p>
    </div>
  `;
  }
}
