import { TObjectId } from '@shared/types/db-types';
import { IToken } from './token.interface';

export interface IRefreshTokenService {
  /**
   * Save Refresh token to db
   * @param token
   */
  saveRefreshToken(token: string, userId: string): Promise<IToken>;

  /**
   * Get refresh token
   *
   */
  getRefreshToken(token: string): Promise<IToken | null>;

  /**
   * To set revoke as true (blacklisting token/ logout)
   * @param token
   */
  revokeRefreshToken(token: string): Promise<void>;

  /**
   * To revoke all user tokens in db
   * @param userId
   */
  blackListAllUserTokens(userId: TObjectId): Promise<boolean>;

  /**
   * To varify referesh token status (expiry, userId and revoked flag)
   * @param token
   * @param userId
   */
  varifyRefreshTokenStatus(token: string, userId: string): Promise<void>;
}
