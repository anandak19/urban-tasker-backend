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

@Module({
  imports: [
    UsersModule,
    UuidModule,
    CookieModule,
    OtpModule,
    EmailModule,
    CacheModule,
    PassportModule,
    JwtModule.register({
      secret: process.env.JWT_SECRET || 'secret',
      signOptions: { expiresIn: '15m' },
    }),
  ],
  controllers: [SignupController, AuthController],
  providers: [
    { provide: 'ISignupService', useClass: SignupService },
    { provide: 'IAuthService', useClass: AuthService },
    TokenService,
  ],
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
