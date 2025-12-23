import { ConfigModule } from '@nestjs/config';
import { AuthModule } from '@modules/auth/auth.module';
import { CategoriesModule } from '@modules/categories/categories.module';
import { TaskerApplicationsModule } from '@modules/tasker-applications/tasker-applications.module';
import { UsersModule } from '@modules/users/users.module';
import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { configOptions } from '@config/config.option';
import { mongooseOption } from '@config/database/database.option';
import { AppController } from './app.controller';
import { CacheModule } from '@core/lib/cache/cache.module';
import { PassportModule } from '@nestjs/passport';
import { LoggerMiddleware } from '@core/lib/logger/logger.middleware';
import { CookieModule } from '@core/lib/cookie/cookie.module';
import { TokenModule } from '@modules/Token/token.module';
import { AvailabilityModule } from './modules/availability/availability.module';
import { TaskerModule } from './modules/tasker/tasker.module';
import { BookingsModule } from './modules/bookings/bookings.module';

@Module({
  imports: [
    ConfigModule.forRoot(configOptions),
    CacheModule,
    AuthModule, // use default scope for providers
    CookieModule,
    TokenModule,
    MongooseModule.forRootAsync(mongooseOption),
    UsersModule,
    CategoriesModule,
    TaskerApplicationsModule,
    PassportModule.register({}),
    AvailabilityModule,
    TaskerModule,
    BookingsModule,
  ],
  controllers: [AppController],
  providers: [],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(LoggerMiddleware).forRoutes('*');
  }
}
