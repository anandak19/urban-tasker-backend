import { IBaseRepository } from '@shared/interfaces/base-repository.interface';
import { TObjectId } from '@shared/types/db-types';
import { TokenDocument } from '../schemas/token.schema';
import { ICreateToken } from './token.interface';

export interface ITokenRepository
  extends IBaseRepository<TokenDocument, ICreateToken> {
  /**
   * Get token by token passed by user
   * @param refreshToken
   */
  getToken(refreshToken: string): Promise<TokenDocument | null>;

  /**
   * Revoke a token/ blacklist / logout
   */
  revokeTokenByUserId(id: TObjectId): Promise<boolean>;

  revokeTokenById(id: string): Promise<TokenDocument | null>;
}
