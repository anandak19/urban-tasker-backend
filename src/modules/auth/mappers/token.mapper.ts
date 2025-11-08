import { IToken } from '../interfaces/token.interface';
import { TokenDocument } from '../schemas/token.schema';

export class TokenMapper {
  static toResponse(tokenDoc: TokenDocument): IToken {
    return {
      id: tokenDoc._id.toString(),
      userId: tokenDoc.userId.toString(),
      token: tokenDoc.token,
      expiresAt: tokenDoc.expiresAt,
      revoked: tokenDoc.revoked,
    };
  }
}
