import {
  ForbiddenException,
  Inject,
  Injectable,
  InternalServerErrorException,
  Scope,
} from '@nestjs/common';
import {
  IGoogleUserAuthData,
  IPayload,
} from '@modules/auth/interfaces/auth.interface';
import { type Request, type Response } from 'express';
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
import { type IUserService } from '@modules/users/interfaces/user-services.interface';
import {
  COOKIE_KEYS,
  COOKIE_TIME,
} from '@shared/constants/keys/cookie-keys.constant';
import { AUTH_MESSAGES } from '@shared/constants/messages/auth-messages.constant';
import { UserResponseDto } from '@modules/users/dtos/user-response.dto';
import { UserRoles } from '@shared/constants/enums/user.enum';
import { LOGGER_SERVICE } from '@core/lib/logger/logger.service';
import { type ILoggerService } from '@core/lib/logger/logger.interface';
import {
  ICreateUser,
  IUserData,
} from '@modules/users/interfaces/user.interface';
import { AuthProvider } from '@shared/constants/enums/auth-providers.enum';
let instance = 1;
@Injectable({ scope: Scope.DEFAULT })
export class AuthService implements IAuthService {
  constructor(
    @Inject(AUTH_TOKENS.TOKEN_SERVICE) private _tokenService: ITokenService,
    @Inject(USER_TOKENS.SERVICE) private _userService: IUserService,
    @Inject(LOGGER_SERVICE) private _logger: ILoggerService,
    private _cookieService: CookieService,
  ) {
    console.log('AuthService inint instance: ', instance++);
  }

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

  logout(res: Response): IBaseResponse {
    this._cookieService.clearCookie(res);
    return { message: 'Logout succsfully' };
  }

  // google login
  async validateGoogleAuthUser(
    userDetails: IGoogleUserAuthData,
  ): Promise<UserResponseDto> {
    console.log('google user details', userDetails);

    const existingUser = await this._userService.findByEmail(userDetails.email);
    if (existingUser) return existingUser;
    const newUserData: ICreateUser = {
      email: userDetails.email,
      firstName: userDetails.firstName,
      lastName: userDetails.lastName,
      provider: AuthProvider.GOOGLE,
    };

    const savedUser = await this._userService.create(newUserData);
    if (!savedUser) {
      this._logger.error('AuthServce: Faild to save google user to db');
      throw new InternalServerErrorException(AUTH_MESSAGES.LOGIN_FAILD);
    }

    return savedUser;
  }

  async loginGoogleUser(
    res: Response,
    userData: IUserData,
  ): Promise<IAuthResponse> {
    const payload: IPayload = {
      email: userData.email,
      userRole: userData.userRole,
      id: userData.id,
    };

    const accessToken = await this._setTokenInCookie(res, payload);

    return { message: AUTH_MESSAGES.LOGIN_SUCCESS, accessToken };
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

  isAdmin(req: Request): IBaseResponse {
    const payload = req.user as IPayload;
    try {
      console.log(payload.userRole);

      if (!payload || payload.userRole !== UserRoles.ADMIN) {
        throw new ForbiddenException('Access Denied');
      }
      return { message: 'Admin logged in' };
    } catch (error) {
      console.log(error);
      throw new ForbiddenException('Access Denied');
    }
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
