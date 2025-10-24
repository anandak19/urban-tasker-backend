import { IPayload, ITokens } from '@modules/auth/interfaces/auth.interface';
import { ITokenService } from '@modules/auth/interfaces/services.interface';
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { AUTH_MESSAGES } from '@shared/constants/messages/auth-messages.constant';

@Injectable()
export class TokenService implements ITokenService {
  constructor(private _jwtService: JwtService) {}
  verifyToken(token: string): IPayload {
    try {
      return this._jwtService.verify<IPayload>(token);
    } catch (_error) {
      throw new UnauthorizedException(AUTH_MESSAGES.UNAUTH_USER);
    }
  }

  getTokens(payload: IPayload): ITokens {
    const accessToken = this._jwtService.sign(payload, {
      expiresIn: '15m',
    });
    const refreshToken = this._jwtService.sign(payload, {
      expiresIn: '7d',
    });
    return { accessToken, refreshToken };
  }
}
