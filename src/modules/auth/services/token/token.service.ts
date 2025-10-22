import { IPayload } from '@modules/auth/interfaces/auth.interface';
import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class TokenService {
  constructor(private _jwtService: JwtService) {}

  getTokens(payload: IPayload) {
    const accessToken = this._jwtService.sign(payload, {
      expiresIn: '15m',
    });
    const refreshToken = this._jwtService.sign(payload, {
      expiresIn: '7d',
    });
    return { accessToken, refreshToken };
  }
}
