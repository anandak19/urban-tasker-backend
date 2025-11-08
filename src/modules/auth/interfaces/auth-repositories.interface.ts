import { type IBaseRepository } from '@shared/interfaces/base-repository.interface';
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
  revokeTokenById(id: string): Promise<TokenDocument | null>;
}
