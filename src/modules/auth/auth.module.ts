import { Module } from '@nestjs/common';
import { AuthService } from './services/auth.service';
import { UsersModule } from '../users/users.module';
import { SignupService } from './services/signup/signup.service';
import { SignupController } from './controllers/signup/signup.controller';

@Module({
  imports: [UsersModule],
  controllers: [SignupController],
  providers: [AuthService, SignupService],
})
export class AuthModule {}
