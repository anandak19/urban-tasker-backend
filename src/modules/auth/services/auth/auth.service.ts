import { Inject, Injectable, Logger } from '@nestjs/common';
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
import { UserResponseDto } from '@modules/users/dtos/user-response.dto';

@Injectable()
export class AuthService implements IAuthService {
  private _logger = new Logger(AuthService.name);

  constructor(
    @Inject(AUTH_TOKENS.TOKEN_SERVICE) private _tokenService: ITokenService,
    @Inject(USER_TOKENS.SERVICE) private _userService: IUserService,
    private _cookieService: CookieService,
  ) {}

  async userLogin(res: Response, loginDto: LoginDTo): Promise<IAuthResponse> {
    const userData = await this._userService.authenticateUser(
      loginDto.email,
      loginDto.password,
    );
    const payload = this._getPaylod(userData);
    const accessToken = await this._setTokenInCookie(res, payload);

    return { message: AUTH_MESSAGES.LOGIN_SUCCESS, accessToken };
  }

  async adminLogin(res: Response, loginDto: LoginDTo): Promise<IAuthResponse> {
    const userData = await this._userService.authenticateAdmin(
      loginDto.email,
      loginDto.password,
    );
    const payload = this._getPaylod(userData);
    const accessToken = await this._setTokenInCookie(res, payload);

    return { message: AUTH_MESSAGES.LOGIN_SUCCESS, accessToken };
  }

  logout(): Promise<IBaseResponse> {
    throw new Error('Method not implemented.');
  }

  /*
  To refresh tokens
  args: response, refreshToken
  returns: message & accessToken And set new refreshToken in clint cookie
  */
  async refreshToken(
    res: Response,
    refreshToken: string,
  ): Promise<IAuthResponse> {
    const payload: IPayload =
      await this._tokenService.verifyToken(refreshToken);

    const tokens = await this._tokenService.getAuthTokens({
      id: payload.id,
      email: payload.email,
      userRole: payload.userRole,
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
  private async _setTokenInCookie(
    res: Response,
    payload: IPayload,
  ): Promise<string> {
    const tokens = await this._tokenService.getAuthTokens(payload);

    this._cookieService.setCookie(
      res,
      COOKIE_KEYS.REFERESH_KEY,
      tokens.refreshToken,
      COOKIE_TIME.REFRESH_TIME,
    );

    return tokens.accessToken;
  }

  private _getPaylod(user: UserResponseDto): IPayload {
    return {
      id: user.id,
      email: user.email,
      userRole: user.userRole,
    };
  }
}
