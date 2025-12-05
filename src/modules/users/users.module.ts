import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { UserRepository } from './repositories/user.repository';
import { User, UserSchema } from './schemas/user.schema';
import { UsersService } from './services/user/users.service';
import { IsEmailUnique } from '@core/validators/is-email-unique.validator';
import { HashModule } from '@core/lib/hash/hash.module';
import { USER_TOKENS } from './user-tokens';
import { AdminUserService } from './services/admin-user/admin-user.service';
import { AdminUserController } from './controllers/admin/admin-user.controller';
import { LoggerModule } from '@core/lib/logger/logger.module';
import { TokenModule } from '@modules/Token/token.module';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: User.name, schema: UserSchema }]),
    HashModule,
    LoggerModule,
    TokenModule,
  ],
  controllers: [AdminUserController],
  providers: [
    IsEmailUnique,
    { provide: USER_TOKENS.SERVICE, useClass: UsersService },
    { provide: USER_TOKENS.REPOSITORY, useClass: UserRepository },
    { provide: USER_TOKENS.ADMIN_USER_SERVICE, useClass: AdminUserService },
  ],
  exports: [USER_TOKENS.SERVICE, USER_TOKENS.ADMIN_USER_SERVICE],
})
export class UsersModule {}
