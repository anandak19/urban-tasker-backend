import { BaseRepository } from '@shared/repository/base.repository';
import { Token, TokenDocument } from '../schemas/token.schema';
import { ICreateToken } from '../interfaces/token.interface';
import { ITokenRepository } from '../interfaces/auth-repositories.interface';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';

export class TokenRepository
  extends BaseRepository<TokenDocument, ICreateToken>
  implements ITokenRepository
{
  constructor(
    @InjectModel(Token.name) private _tokenModel: Model<TokenDocument>,
  ) {
    super(_tokenModel);
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
