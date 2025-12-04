import { CookieService } from '@core/lib/cookie/cookie.service';
import { AUTH_TOKENS } from '@modules/auth/auth-tokens';
import { type ITokenService } from '@modules/auth/interfaces/services.interface';
import { type IRefreshTokenService } from '@modules/Token/interfaces/services.interface';
import { TOKEN_TOKENS } from '@modules/Token/token-tokens';
import {
  CanActivate,
  ExecutionContext,
  ForbiddenException,
  Inject,
  Injectable,
} from '@nestjs/common';
import { COOKIE_KEYS } from '@shared/constants/keys/cookie-keys.constant';
import { AUTH_MESSAGES } from '@shared/constants/messages/auth-messages.constant';
import type { Request, Response } from 'express';

@Injectable()
export class TokenRevocationGuardGuard implements CanActivate {
  constructor(
    @Inject(TOKEN_TOKENS.REFERESH_TOKEN_SERVICE)
    private _refreshTokenService: IRefreshTokenService,

    @Inject(AUTH_TOKENS.TOKEN_SERVICE) private _tokenService: ITokenService,

    private _cookieService: CookieService,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest<Request>();
    const response = context.switchToHttp().getResponse<Response>();
    const refreshToken = request.cookies?.[COOKIE_KEYS.REFERESH_KEY] as string;

    if (!refreshToken) {
      throw new ForbiddenException(AUTH_MESSAGES.DO_LOGIN);
    }

    try {
      await this._tokenService.verifyToken(refreshToken);
      const refreshTokenData =
        await this._refreshTokenService.getRefreshToken(refreshToken);

      if (refreshTokenData?.revoked) {
        this._cookieService.clearCookie(response);
        throw new ForbiddenException(AUTH_MESSAGES.DO_LOGIN);
      }
    } catch {
      throw new ForbiddenException(AUTH_MESSAGES.DO_LOGIN);
    }

    return true;
  }
}
