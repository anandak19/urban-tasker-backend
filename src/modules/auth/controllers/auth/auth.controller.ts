import { Cookies } from '@core/decorators/cookies.decorator';
import { AUTH_TOKENS } from '@modules/auth/auth-tokens';
import { LoginDTo } from '@modules/auth/dtos/login.dto';
import { type IAuthController } from '@modules/auth/interfaces/controllers.interface';
import { type IAuthResponse } from '@modules/auth/interfaces/response.interface';
import { type IAuthService } from '@modules/auth/interfaces/services.interface';
import {
  Body,
  Controller,
  Get,
  Inject,
  Post,
  Res,
  UnauthorizedException,
} from '@nestjs/common';
import { IBaseResponse } from '@shared/interfaces/base-response.interface';
import { type Response } from 'express';

@Controller('auth')
export class AuthController implements IAuthController {
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

  @Get('refresh')
  refreshToken(
    @Res({ passthrough: true }) res: Response,
    @Cookies('refresh_token') refreshToken: string,
  ): IAuthResponse {
    console.log(refreshToken);
    if (!refreshToken) {
      throw new UnauthorizedException('Pleas login to continue');
    }

    return this._authService.refreshToken(res, refreshToken);
  }
}
