import {
  ForbiddenException,
  Inject,
  Injectable,
  InternalServerErrorException,
} from '@nestjs/common';
import { SESSION_MESSAGES } from '@shared/constants/messages/auth-messages.constant';
import { TObjectId } from '@shared/types/db-types';
import { Types } from 'mongoose';
import { type IRefreshTokenService } from '../interfaces/services.interface';
import { type ITokenRepository } from '../interfaces/auth-repositories.interface';
import { ICreateToken, IToken } from '../interfaces/token.interface';
import { TokenMapper } from '../mappers/token.mapper';
import { TOKEN_TOKENS } from '../token-tokens';

@Injectable()
export class RefreshTokenService implements IRefreshTokenService {
  private refreshTokenTime = 7 * 24 * 60 * 60 * 1000;

  constructor(
    @Inject(TOKEN_TOKENS.REFERESH_TOKEN_REPOSITORY)
    private _tokenRepo: ITokenRepository,
  ) {}

  async revokeRefreshToken(token: string): Promise<void> {
    console.log(token);
    const tokenData = await this.getRefreshToken(token);

    if (tokenData && tokenData.id) {
      await this._tokenRepo.revokeTokenById(tokenData.id);
    }
  }

  async blackListAllUserTokens(userId: TObjectId): Promise<boolean> {
    return this._tokenRepo.revokeTokenByUserId(userId);
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
