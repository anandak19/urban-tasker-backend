import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { UserRepository } from './repositories/user.repository';
import { User, UserSchema } from './schemas/user.schema';
import { UsersService } from './services/users.service';
import { IsEmailUnique } from '@core/validators/is-email-unique.validator';
import { HashModule } from '@core/lib/hash/hash.module';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: User.name, schema: UserSchema }]),
    HashModule,
  ],
  controllers: [],
  providers: [UsersService, UserRepository, IsEmailUnique],
  exports: [UserRepository, UsersService],
})
export class UsersModule {}
