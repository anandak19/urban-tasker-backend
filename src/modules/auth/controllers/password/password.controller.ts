import type { ILoggerService } from '@core/lib/logger/logger.interface';
import { LOGGER_SERVICE } from '@core/lib/logger/logger.service';
import { AUTH_TOKENS } from '@modules/auth/auth-tokens';
import { ForgotPasswordDto } from '@modules/auth/dtos/forgot-password.dto';
import { ResetPasswordDto } from '@modules/auth/dtos/reset-password.dto';
import { IPasswordController } from '@modules/auth/interfaces/controllers.interface';
import type { IPasswordService } from '@modules/auth/interfaces/services.interface';
import { Body, Controller, Inject, Post } from '@nestjs/common';
import { IBaseResponse } from '@shared/interfaces/base-response.interface';

@Controller('password')
export class PasswordController implements IPasswordController {
  constructor(
    @Inject(LOGGER_SERVICE)
    private _logger: ILoggerService,

    @Inject(AUTH_TOKENS.PASSWORD_SERVICE)
    private _passwordService: IPasswordService,
  ) {}
  // varify email and send reset link
  @Post('forgot')
  async forgotPassword(
    @Body() forgotDto: ForgotPasswordDto,
  ): Promise<IBaseResponse> {
    return await this._passwordService.forgotPassword(forgotDto.email);
  }

  @Post('reset')
  async resetPassword(
    @Body() resetDto: ResetPasswordDto,
  ): Promise<IBaseResponse> {
    return await this._passwordService.resetPassword(
      resetDto.resetToken,
      resetDto.password,
    );
  }
}
