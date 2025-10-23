import { Injectable } from '@nestjs/common';
import { TokenService } from '../token/token.service';
import { IPayload } from '@modules/auth/interfaces/auth.interface';
import express from 'express';
import { CookieService } from '@core/lib/cookie/cookie.service';
import { IAuthService } from '@modules/auth/interfaces/auth-service.interface';
import { IAuthResponse } from '@modules/auth/interfaces/response.interface';

@Injectable()
export class AuthService implements IAuthService {
  constructor(
    private _tokenService: TokenService,
    private _cookieService: CookieService,
  ) {}

  refreshAuth(res: express.Response, refreshToken: string): IAuthResponse {
    const payload: IPayload =
      this._tokenService['_jwtService'].verify(refreshToken);
    const tokens = this._tokenService.getTokens({
      id: payload.id,
      email: payload.email,
    });

    this._cookieService.setCookie(
      res,
      'refresh_token',
      tokens.refreshToken,
      60 * 60 * 24 * 7,
    );

    return {
      message: 'Token refreshed',
      accessToken: tokens.accessToken,
    };
  }
}
