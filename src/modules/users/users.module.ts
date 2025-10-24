import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { UserRepository } from './repositories/user.repository';
import { User, UserSchema } from './schemas/user.schema';
import { UsersService } from './services/users.service';
import { IsEmailUnique } from '@core/validators/is-email-unique.validator';
import { HashModule } from '@core/lib/hash/hash.module';
import { USER_TOKENS } from './user-tokens';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: User.name, schema: UserSchema }]),
    HashModule,
  ],
  controllers: [],
  providers: [
    IsEmailUnique,
    { provide: USER_TOKENS.SERVICE, useClass: UsersService },
    { provide: USER_TOKENS.REPOSITORY, useClass: UserRepository },
  ],
  exports: [USER_TOKENS.SERVICE],
})
export class UsersModule {}
