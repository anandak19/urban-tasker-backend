import { UsersModule } from '@modules/users/users.module';
import {
  MiddlewareConsumer,
  Module,
  NestModule,
  RequestMethod,
} from '@nestjs/common';
import { SignupController } from './controllers/signup/signup.controller';
import { SignupService } from './services/signup/signup.service';
import { UuidModule } from '@core/lib/uuid/uuid.module';
import { CookieModule } from '@core/lib/cookie/cookie.module';
import { OtpModule } from '@core/lib/otp/otp.module';
import { EmailModule } from '@core/lib/email/email.module';
import { SignupIdMiddleware } from '@core/middlewares/signup-id.middleware';
import { CacheModule } from '@core/lib/cache/cache.module';
import { PassportModule } from '@nestjs/passport';
import { JwtModule } from '@nestjs/jwt';
import { AuthService } from './services/auth/auth.service';
import { TokenService } from './services/token/token.service';
import { AuthController } from './controllers/auth/auth.controller';
import { AUTH_TOKENS } from './auth-tokens';
import { PasswordService } from './services/password/password.service';
import { PasswordController } from './controllers/password/password.controller';
import { LoggerModule } from '@core/lib/logger/logger.module';
import { GoogleStrategy } from './strategies/google.strategy';
import { LocalStrategy } from './strategies/local.strategy';
import { RefreshTokenService } from './services/token/refresh-token.service';
import { TokenRepository } from './repositories/token.repository';
import { MongooseModule } from '@nestjs/mongoose';
import { Token, TokenSchema } from './schemas/token.schema';
console.log('Loaded AuthModule');

@Module({
  imports: [
    UsersModule,
    UuidModule,
    CookieModule,
    OtpModule,
    EmailModule,
    CacheModule,
    LoggerModule,
    JwtModule.register({
      secret: process.env.JWT_SECRET || 'secret',
      signOptions: { expiresIn: '15m' },
    }),
    PassportModule.register({ session: false }),
    MongooseModule.forFeature([{ name: Token.name, schema: TokenSchema }]),
  ],
  controllers: [SignupController, AuthController, PasswordController],
  providers: [
    { provide: AUTH_TOKENS.SIGNUP_SERVICE, useClass: SignupService },
    { provide: AUTH_TOKENS.AUTH_SERVICE, useClass: AuthService },
    { provide: AUTH_TOKENS.TOKEN_SERVICE, useClass: TokenService },
    { provide: AUTH_TOKENS.PASSWORD_SERVICE, useClass: PasswordService },
    {
      provide: AUTH_TOKENS.REFERESH_TOKEN_SERVICE,
      useClass: RefreshTokenService,
    },
    {
      provide: AUTH_TOKENS.REFERESH_TOKEN_REPOSITORY,
      useClass: TokenRepository,
    },
    GoogleStrategy,
    LocalStrategy,
  ],
  exports: [AUTH_TOKENS.AUTH_SERVICE, AUTH_TOKENS.TOKEN_SERVICE],
})
export class AuthModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    // Check if the cookie has signup sessionId
    consumer
      .apply(SignupIdMiddleware)
      .forRoutes(
        { path: 'auth/signup/otp', method: RequestMethod.ALL },
        { path: 'auth/signup', method: RequestMethod.POST },
      );
  }
}
