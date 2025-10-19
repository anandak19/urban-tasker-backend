import { UsersModule } from '@modules/users/users.module';
import {
  MiddlewareConsumer,
  Module,
  NestModule,
  RequestMethod,
} from '@nestjs/common';
import { SignupController } from './controllers/signup/signup.controller';
import { AuthService } from './services/auth.service';
import { SignupService } from './services/signup/signup.service';
import { UuidModule } from '@core/lib/uuid/uuid.module';
import { CookieModule } from '@core/lib/cookie/cookie.module';
import { OtpModule } from '@core/lib/otp/otp.module';
import { EmailModule } from '@core/lib/email/email.module';
import { SignupIdMiddleware } from '@core/middlewares/signup-id.middleware';

@Module({
  imports: [UsersModule, UuidModule, CookieModule, OtpModule, EmailModule],
  controllers: [SignupController],
  providers: [AuthService, SignupService],
})
export class AuthModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(SignupIdMiddleware)
      .forRoutes(
        { path: 'auth/signup/otp', method: RequestMethod.ALL },
        { path: 'auth/signup', method: RequestMethod.POST },
      );
  }
}
