import { AppConfig } from '@config/app.config';
import { Cookies } from '@core/decorators/cookies.decorator';
import { AuthGuard } from '@core/guards/auth/auth.guard';
import { GoogleAuthGuard } from '@core/guards/google-auth/google-auth.guard';
import { LocalAuthGuard } from '@core/guards/local-auth/local-auth.guard';
import type { ILoggerService } from '@core/lib/logger/logger.interface';
import { LOGGER_SERVICE } from '@core/lib/logger/logger.service';
import { AUTH_TOKENS } from '@modules/auth/auth-tokens';
import { type IAuthController } from '@modules/auth/interfaces/controllers.interface';
import { type IAuthService } from '@modules/auth/interfaces/services.interface';
import { UserResponseDto } from '@modules/users/dtos/user-response.dto';
import {
  Controller,
  ForbiddenException,
  Get,
  Inject,
  Post,
  Req,
  Request,
  Res,
  UseGuards,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { COOKIE_KEYS } from '@shared/constants/keys/cookie-keys.constant';
import { AUTH_MESSAGES } from '@shared/constants/messages/auth-messages.constant';
import type { IBaseResponse } from '@shared/interfaces/base-response.interface';
import { type Request as TRequest, type Response } from 'express';

/*
TODO/
update refresh api

update frontend
*/

@Controller('auth')
export class AuthController implements IAuthController {
  constructor(
    @Inject(AUTH_TOKENS.AUTH_SERVICE) private _authService: IAuthService,
    @Inject(LOGGER_SERVICE) private _logger: ILoggerService,
    private configService: ConfigService<AppConfig>,
  ) {}

  @UseGuards(LocalAuthGuard)
  @Post('login')
  userLogin(
    @Req() req: TRequest & { user: UserResponseDto },
    @Res({ passthrough: true }) res: Response,
  ): Promise<IBaseResponse> {
    return this._authService.userLogin(res, req.user);
  }

  @Post('logout')
  logout(
    @Res({ passthrough: true }) res: Response,
    @Cookies(COOKIE_KEYS.REFERESH_KEY) refreshToken: string,
  ): Promise<IBaseResponse> {
    return this._authService.logout(res, refreshToken);
  }

  /*
  Google Auth endpoints
  */
  @Get('google/login')
  @UseGuards(GoogleAuthGuard)
  googleLogin() {}

  @Get('google/redirect')
  @UseGuards(GoogleAuthGuard)
  async googleRedirect(
    @Req() req: TRequest & { user: UserResponseDto },
    @Res() res: Response,
  ) {
    await this._authService.loginGoogleUser(res, req.user);
    res.redirect(
      this.configService.get<string>('APP_HOME_URL', { infer: true })!,
    );
  }

  /*  
  To refresh the access token and refresh token
  */
  @Post('refresh')
  refreshToken(
    @Res({ passthrough: true }) res: Response,
    @Cookies(COOKIE_KEYS.REFERESH_KEY) refreshToken: string,
  ): Promise<IBaseResponse> {
    this._logger.verbose('Refresh Token Called');
    // if there is no token in cookie
    if (!refreshToken) {
      this._logger.warn('No refresh token in request');
      throw new ForbiddenException(AUTH_MESSAGES.DO_LOGIN);
    }

    return this._authService.refreshToken(res, refreshToken);
  }

  // moke api
  @UseGuards(AuthGuard)
  @Get('protected')
  getProtected(@Request() req: TRequest) {
    return { message: 'protected data', user: req.user };
  }

  // to get login user
  @UseGuards(AuthGuard)
  @Get('login-user')
  isLogin(@Request() req: TRequest) {
    return { message: 'Login User Fetched successfully', user: req.user };
  }

  // to check if the admin login or not
  @UseGuards(AuthGuard)
  @Get('admin/is-login')
  isAdminLogin(@Request() req: TRequest) {
    return { message: 'Admin is loggedin', admin: req.user };
  }
}
