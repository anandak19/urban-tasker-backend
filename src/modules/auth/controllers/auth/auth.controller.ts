import { Cookies } from '@core/decorators/cookies.decorator';
import { AuthGuard } from '@core/guards/auth/auth.guard';
import { AUTH_TOKENS } from '@modules/auth/auth-tokens';
import { LoginDTo } from '@modules/auth/dtos/login.dto';
import { type IAuthController } from '@modules/auth/interfaces/controllers.interface';
import { type IAuthResponse } from '@modules/auth/interfaces/response.interface';
import { type IAuthService } from '@modules/auth/interfaces/services.interface';
import {
  Body,
  Controller,
  ForbiddenException,
  Get,
  Inject,
  Logger,
  Post,
  Request,
  Res,
  UseGuards,
} from '@nestjs/common';
import { COOKIE_KEYS } from '@shared/constants/keys/cookie-keys.constant';
import { IBaseResponse } from '@shared/interfaces/base-response.interface';
import { type Request as TRequest, type Response } from 'express';

@Controller('auth')
export class AuthController implements IAuthController {
  private readonly _logger = new Logger(AuthController.name);

  constructor(
    @Inject(AUTH_TOKENS.AUTH_SERVICE) private _authService: IAuthService,
  ) {}

  @Post('login')
  userLogin(
    @Res({ passthrough: true }) res: Response,
    @Body() loginDto: LoginDTo,
  ): Promise<IAuthResponse> {
    return this._authService.userLogin(res, loginDto);
  }

  @Post('admin/login')
  adminLogin(
    @Res({ passthrough: true }) res: Response,
    @Body() loginDto: LoginDTo,
  ): Promise<IAuthResponse> {
    return this._authService.adminLogin(res, loginDto);
  }

  logout(): Promise<IBaseResponse> {
    return this._authService.logout();
  }

  /*
  To refresh the access token and refresh token
  */
  @Post('refresh')
  refreshToken(
    @Res({ passthrough: true }) res: Response,
    @Cookies(COOKIE_KEYS.REFERESH_KEY) refreshToken: string,
  ): Promise<IAuthResponse> {
    this._logger.verbose('Refresh Token Called');
    // if there is no token in cookie
    if (!refreshToken) {
      throw new ForbiddenException('Please login to continue');
    }

    return this._authService.refreshToken(res, refreshToken);
  }

  @UseGuards(AuthGuard)
  @Get('protected')
  getProtected(@Request() req: TRequest) {
    return { message: 'protected data', user: req.user };
  }

  // to check is the user login or not
  @UseGuards(AuthGuard)
  @Get('is-login')
  isLogin(@Request() req: TRequest) {
    return { message: 'User is login', user: req.user };
  }
}
