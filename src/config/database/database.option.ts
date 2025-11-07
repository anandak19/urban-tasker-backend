import { AppConfig } from '@config/app.config';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { MongooseModuleAsyncOptions } from '@nestjs/mongoose';

export const mongooseOption: MongooseModuleAsyncOptions = {
  imports: [ConfigModule],
  inject: [ConfigService],
  useFactory: (configService: ConfigService<AppConfig>) => ({
    uri: configService.get('MONGO_URI', { infer: true })!,
  }),
};
