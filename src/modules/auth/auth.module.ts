import { UsersModule } from '@modules/users/users.module';
import { Module } from '@nestjs/common';
import { SignupController } from './controllers/signup/signup.controller';
import { AuthService } from './services/auth.service';
import { SignupService } from './services/signup/signup.service';
import { AuthRedisService } from './services/auth-redis/auth-redis.service';

@Module({
  imports: [UsersModule],
  controllers: [SignupController],
  providers: [AuthService, SignupService, AuthRedisService],
})
export class AuthModule {}
