import databaseConfig from '@config/database.config';
import { ConfigModule, ConfigService } from '@nestjs/config';
import Joi from 'joi';
import { AuthModule } from '@modules/auth/auth.module';
import { CategoriesModule } from '@modules/categories/categories.module';
import { TaskerApplicationsModule } from '@modules/tasker-applications/tasker-applications.module';
import { UsersModule } from '@modules/users/users.module';
import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      load: [databaseConfig],
      validationSchema: Joi.object({
        MONGO_URI: Joi.string().required(),
        PORT: Joi.number().default(3000),
      }),
    }),
    MongooseModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        uri: configService.get<string>('mongoUri'),
      }),
    }),
    AuthModule,
    UsersModule,
    CategoriesModule,
    TaskerApplicationsModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
