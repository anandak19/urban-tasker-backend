import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { Token, TokenSchema } from './schemas/token.schema';
import { TOKEN_TOKENS } from './token-tokens';
import { RefreshTokenService } from './services/refresh-token.service';
import { TokenRepository } from './repositories/token.repository';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Token.name, schema: TokenSchema }]),
  ],
  providers: [
    {
      provide: TOKEN_TOKENS.REFERESH_TOKEN_SERVICE,
      useClass: RefreshTokenService,
    },
    {
      provide: TOKEN_TOKENS.REFERESH_TOKEN_REPOSITORY,
      useClass: TokenRepository,
    },
  ],
  exports: [TOKEN_TOKENS.REFERESH_TOKEN_SERVICE],
})
export class TokenModule {}
