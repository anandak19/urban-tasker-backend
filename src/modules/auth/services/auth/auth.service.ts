import {
  ForbiddenException,
  Inject,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
  Scope,
} from '@nestjs/common';
import {
  IGoogleUserAuthData,
  IPayload,
} from '@modules/auth/interfaces/auth.interface';
import { type Request, type Response } from 'express';
import { CookieService } from '@core/lib/cookie/cookie.service';
import { AUTH_TOKENS } from '@modules/auth/auth-tokens';
import type {
  IAuthService,
  ITokenService,
} from '@modules/auth/interfaces/services.interface';
import { IBaseResponse } from '@shared/interfaces/base-response.interface';
import { USER_TOKENS } from '@modules/users/user-tokens';
import type { IUserService } from '@modules/users/interfaces/user-services.interface';
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
import {
  GENERAL_ERRORS,
  USER_ERRORS,
} from '@shared/constants/messages/error-messaes.constants';
import { type IRefreshTokenService } from '@modules/Token/interfaces/services.interface';
import { TOKEN_TOKENS } from '@modules/Token/token-tokens';
import { ILoginResponse } from '@modules/auth/interfaces/response.interface';
import { ImageSource } from '@shared/constants/enums/image-source.enum';
import { WALLET_TOKENS } from '@modules/wallet/wallet-tokens';
import type { IWalletService } from '@modules/wallet/interfaces/wallet-services.interface';

@Injectable({ scope: Scope.DEFAULT })
export class AuthService implements IAuthService {
  constructor(
    @Inject(AUTH_TOKENS.TOKEN_SERVICE) private _tokenService: ITokenService,

    @Inject(USER_TOKENS.SERVICE) private _userService: IUserService,

    @Inject(LOGGER_SERVICE) private _logger: ILoggerService,

    @Inject(TOKEN_TOKENS.REFERESH_TOKEN_SERVICE)
    private _refreshTokenService: IRefreshTokenService,

    @Inject(WALLET_TOKENS.WALLET_SERVICE)
    private _walletService: IWalletService,

    private _cookieService: CookieService,
  ) {}

  // validate local user
  async validateLocalUser(
    email: string,
    password: string,
  ): Promise<UserResponseDto> {
    return await this._userService.authenticateUser(email, password);
  }

  // local user login
  async userLogin(res: Response, userData: IUserData): Promise<ILoginResponse> {
    const payload = this._getPaylod(userData);
    const refreshToken = await this._setTokensInCookie(res, payload);
    // save refresh token in db
    const savedRefreshToken = await this._refreshTokenService.saveRefreshToken(
      refreshToken,
      userData.id,
    );

    if (!savedRefreshToken) {
      throw new InternalServerErrorException(GENERAL_ERRORS.SERVER_ERROR);
    }

    // return data contains user role
    return { message: AUTH_MESSAGES.LOGIN_SUCCESS, user: payload };
  }

  async logout(res: Response, refreshToken: string): Promise<IBaseResponse> {
    this._cookieService.clearCookie(res);
    await this._refreshTokenService.revokeRefreshToken(refreshToken);
    return { message: 'Logout succsfully' };
  }

  // google login
  async validateGoogleAuthUser(
    userDetails: IGoogleUserAuthData,
  ): Promise<UserResponseDto> {
    const existingUser = await this._userService.findByEmail(userDetails.email);

    // NOTE: Fix this. Find way to show error message for login with google
    // if (existingUser?.isSuspended) {
    //   throw new BadRequestException(
    //     `Account is suspended for the reason: ${existingUser.suspendedReason}`,
    //   );
    // }

    if (existingUser) return existingUser;
    const newUserData: ICreateUser = {
      email: userDetails.email,
      firstName: userDetails.firstName,
      lastName: userDetails.lastName,
      provider: AuthProvider.GOOGLE,
      profileImage: {
        source: ImageSource.EXTERNAL,
        value: userDetails.googleProfilePic,
      },
    };

    const savedUser = await this._userService.create(newUserData);
    if (!savedUser) {
      this._logger.error('AuthServce: Faild to save google user to db');
      throw new InternalServerErrorException(AUTH_MESSAGES.LOGIN_FAILD);
    }

    // creae wallet
    await this._walletService.create(savedUser.email);
    console.log('Save success');

    return savedUser;
  }

  async loginGoogleUser(
    res: Response,
    userData: IUserData,
  ): Promise<IBaseResponse> {
    const payload: IPayload = this._getPaylod(userData);

    const refreshToken = await this._setTokensInCookie(res, payload);

    console.log(refreshToken);
    const savedRefreshToken = await this._refreshTokenService.saveRefreshToken(
      refreshToken,
      userData.id,
    );

    if (!savedRefreshToken) {
      throw new InternalServerErrorException(GENERAL_ERRORS.SERVER_ERROR);
    }

    return { message: AUTH_MESSAGES.LOGIN_SUCCESS };
  }

  /*
  To refresh tokens
  */
  async refreshToken(
    res: Response,
    refreshToken: string,
  ): Promise<IBaseResponse> {
    const payload = await this._tokenService.verifyToken(refreshToken);

    // to check, expiration and revoked status and userId same or not
    await this._refreshTokenService.varifyRefreshTokenStatus(
      refreshToken,
      payload.id,
    );

    const user = await this._userService.findOne(payload.id);

    if (!user) {
      throw new NotFoundException(USER_ERRORS.USER_NOT_FOUND);
    }

    const newPayload: IPayload = this._getPaylod(user);

    const accessToken = await this._tokenService.getNewAccessToken(newPayload);

    this._cookieService.setCookie(
      res,
      COOKIE_KEYS.ACCESS_KEY,
      accessToken,
      COOKIE_TIME.ACCESS_TIME,
    );

    return {
      message: 'Token refreshed',
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
  private async _setTokensInCookie(
    res: Response,
    payload: IPayload,
  ): Promise<string> {
    const tokens = await this._tokenService.getAuthTokens(payload);

    // access token
    this._cookieService.setCookie(
      res,
      COOKIE_KEYS.ACCESS_KEY,
      tokens.accessToken,
      COOKIE_TIME.ACCESS_TIME,
    );

    // refresh token
    this._cookieService.setCookie(
      res,
      COOKIE_KEYS.REFERESH_KEY,
      tokens.refreshToken,
      COOKIE_TIME.REFRESH_TIME,
    );

    return tokens.refreshToken;
  }

  // authenticateSocket(client: C )

  private _getPaylod(user: IUserData | UserResponseDto): IPayload {
    return {
      id: user.id,
      email: user.email,
      userRole: user.userRole,
      firstName: user.firstName,
    };
  }
}
