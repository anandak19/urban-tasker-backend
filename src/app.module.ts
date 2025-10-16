import { ConfigModule } from '@nestjs/config';
import { AuthModule } from '@modules/auth/auth.module';
import { CategoriesModule } from '@modules/categories/categories.module';
import { TaskerApplicationsModule } from '@modules/tasker-applications/tasker-applications.module';
import { UsersModule } from '@modules/users/users.module';
import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { configOptions } from '@config/config.option';
import { mongooseOption } from '@config/database/database.option';
import { CacheModule } from '@core/lib/cache/cache.module';
import { AppController } from './app.controller';

@Module({
  imports: [
    ConfigModule.forRoot(configOptions),
    CacheModule.register(),
    AuthModule,
    MongooseModule.forRootAsync(mongooseOption),
    UsersModule,
    CategoriesModule,
    TaskerApplicationsModule,
  ],
  controllers: [AppController],
  providers: [],
})
export class AppModule {}
