import { Cookies } from '@core/decorators/cookies.decorator';
import { type IAuthService } from '@modules/auth/interfaces/auth-service.interface';
import {
  Controller,
  Get,
  Inject,
  Res,
  UnauthorizedException,
} from '@nestjs/common';
import express from 'express';

@Controller('auth')
export class AuthController {
  constructor(@Inject('IAuthService') private _authService: IAuthService) {}

  @Get('refresh')
  refreshUserToken(
    @Cookies('refresh_token') refreshToken: string,
    @Res({ passthrough: true }) res: express.Response,
  ) {
    console.log(refreshToken);
    if (!refreshToken) {
      throw new UnauthorizedException('Pleas login to continue');
    }

    return this._authService.refreshAuth(res, refreshToken);
  }
}
