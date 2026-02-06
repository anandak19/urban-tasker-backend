import { BaseRepository } from '@shared/repository/base.repository';
import { ICreateToken } from '../interfaces/token.interface';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { TObjectId } from '@shared/types/db-types';
import { Token, TokenDocument } from '../schemas/token.schema';
import { type ITokenRepository } from '../interfaces/auth-repositories.interface';

export class TokenRepository
  extends BaseRepository<TokenDocument, ICreateToken>
  implements ITokenRepository
{
  constructor(
    @InjectModel(Token.name) private _tokenModel: Model<TokenDocument>,
  ) {
    super(_tokenModel);
  }

  async revokeTokenByUserId(id: TObjectId): Promise<boolean> {
    console.log('Token update');
    const result = await this._tokenModel.updateMany(
      { userId: id },
      { $set: { revoked: true } },
    );
    return result.acknowledged;
  }

  async revokeTokenById(id: string): Promise<TokenDocument | null> {
    console.log('Token update');
    return await this._tokenModel.findByIdAndUpdate(
      id,
      { $set: { revoked: true } },
      { new: true },
    );
  }

  async getToken(refreshToken: string): Promise<TokenDocument | null> {
    return await this.findOne({ token: refreshToken });
  }
}
