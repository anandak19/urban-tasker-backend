import { AUTH_TOKENS } from '@modules/auth/auth-tokens';
import type { ITokenRepository } from '@modules/auth/interfaces/auth-repositories.interface';
import { IRefreshTokenService } from '@modules/auth/interfaces/services.interface';
import { ICreateToken, IToken } from '@modules/auth/interfaces/token.interface';
import { TokenMapper } from '@modules/auth/mappers/token.mapper';
import {
  ForbiddenException,
  Inject,
  Injectable,
  InternalServerErrorException,
} from '@nestjs/common';
import { SESSION_MESSAGES } from '@shared/constants/messages/auth-messages.constant';
import { Types } from 'mongoose';

@Injectable()
export class RefreshTokenService implements IRefreshTokenService {
  private refreshTokenTime = 7 * 24 * 60 * 60 * 1000;

  constructor(
    @Inject(AUTH_TOKENS.REFERESH_TOKEN_REPOSITORY)
    private _tokenRepo: ITokenRepository,
  ) {}

  async revokeRefreshToken(token: string): Promise<void> {
    console.log(token);
    const tokenData = await this.getRefreshToken(token);

    if (tokenData && tokenData.id) {
      await this._tokenRepo.revokeTokenById(tokenData.id);
    }
  }

  async saveRefreshToken(token: string, userId: string): Promise<IToken> {
    const expiry = new Date(Date.now() + this.refreshTokenTime);

    const newToken: ICreateToken = {
      token,
      userId: new Types.ObjectId(userId),
      expiresAt: expiry,
    };
    const savedToken = await this._tokenRepo.create(newToken);
    if (!savedToken) {
      throw new InternalServerErrorException('Faild to save token');
    }

    return TokenMapper.toResponse(savedToken);
  }

  async getRefreshToken(token: string): Promise<IToken | null> {
    try {
      const tokenData = await this._tokenRepo.getToken(token);
      if (!tokenData) {
        return null;
      }
      return TokenMapper.toResponse(tokenData);
    } catch {
      throw new ForbiddenException(SESSION_MESSAGES.AUTH_EXPIRED);
    }
  }

  async varifyRefreshTokenStatus(token: string, userId: string): Promise<void> {
    // get refresh token from db
    const refreshToken = await this.getRefreshToken(token);

    // if no token OR revoked is true OR userId is not same as in clint passed userId, throw expired
    if (
      !refreshToken ||
      refreshToken.revoked ||
      refreshToken.userId !== userId
    ) {
      console.log('Refresh token was expird in db', refreshToken);
      throw new ForbiddenException(SESSION_MESSAGES.AUTH_EXPIRED);
    }
  }
}
