import { Inject, Injectable } from '@nestjs/common';
import { IPayload } from '@modules/auth/interfaces/auth.interface';
import { type Response } from 'express';
import { CookieService } from '@core/lib/cookie/cookie.service';
import { IAuthResponse } from '@modules/auth/interfaces/response.interface';
import { AUTH_TOKENS } from '@modules/auth/auth-tokens';
import {
  type IAuthService,
  type ITokenService,
} from '@modules/auth/interfaces/services.interface';
import { LoginDTo } from '@modules/auth/dtos/login.dto';
import { IBaseResponse } from '@shared/interfaces/base-response.interface';
import { USER_TOKENS } from '@modules/users/user-tokens';
import { type IUserService } from '@modules/users/interfaces/user-service.interface';
import {
  COOKIE_KEYS,
  COOKIE_TIME,
} from '@shared/constants/keys/cookie-keys.constant';
import { AUTH_MESSAGES } from '@shared/constants/messages/auth-messages.constant';

@Injectable()
export class AuthService implements IAuthService {
  constructor(
    @Inject(AUTH_TOKENS.TOKEN_SERVICE) private _tokenService: ITokenService,
    @Inject(USER_TOKENS.SERVICE) private _userService: IUserService,
    private _cookieService: CookieService,
  ) {}

  //closed
  async userLogin(res: Response, loginDto: LoginDTo): Promise<IAuthResponse> {
    const userData = await this._userService.authenticateUser(
      loginDto.email,
      loginDto.password,
    );

    const payload = {
      id: userData.id,
      email: userData.email,
      userRole: userData.userRole,
    };

    return this._setTokenInCookie(res, payload);
  }

  async adminLogin(res: Response, loginDto: LoginDTo): Promise<IAuthResponse> {
    const userData = await this._userService.authenticateAdmin(
      loginDto.email,
      loginDto.password,
    );
    const payload = {
      id: userData.id,
      email: userData.email,
      userRole: userData.userRole,
    };
    return this._setTokenInCookie(res, payload);
  }

  logout(): Promise<IBaseResponse> {
    throw new Error('Method not implemented.');
  }

  refreshToken(res: Response, refreshToken: string): IAuthResponse {
    const payload: IPayload = this._tokenService.verifyToken(refreshToken);

    const tokens = this._tokenService.getTokens({
      id: payload.id,
      email: payload.email,
    });

    this._cookieService.setCookie(
      res,
      COOKIE_KEYS.REFERESH_KEY,
      tokens.refreshToken,
      COOKIE_TIME.REFRESH_TIME,
    );

    return {
      message: 'Token refreshed',
      accessToken: tokens.accessToken,
    };
  }

  // Private helper methods
  private _setTokenInCookie(res: Response, payload: IPayload): IAuthResponse {
    const tokens = this._tokenService.getTokens(payload);

    this._cookieService.setCookie(
      res,
      COOKIE_KEYS.REFERESH_KEY,
      tokens.refreshToken,
      COOKIE_TIME.REFRESH_TIME,
    );

    return {
      message: AUTH_MESSAGES.LOGIN_SUCCESS,
      accessToken: tokens.accessToken,
    };
  }
}
