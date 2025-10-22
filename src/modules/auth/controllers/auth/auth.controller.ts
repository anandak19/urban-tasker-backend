import { Cookies } from '@core/decorators/cookies.decorator';
import { AuthService } from '@modules/auth/services/auth/auth.service';
import { Controller, Get, Res, UnauthorizedException } from '@nestjs/common';
import express from 'express';

@Controller('auth')
export class AuthController {
  constructor(private _authService: AuthService) {}

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
