import { AppConfig } from '@config/app.config';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { ThrottlerAsyncOptions } from '@nestjs/throttler';

export const throttlerOptions: ThrottlerAsyncOptions = {
  imports: [ConfigModule],
  inject: [ConfigService],
  useFactory: (config: ConfigService<AppConfig>) => ({
    throttlers: [
      {
        name: 'short',
        ttl: config.get('THROTTLE_SHORT_TTL', { infer: true })!,
        limit: config.get('THROTTLE_SHORT_LIMIT', { infer: true })!,
      },
      {
        name: 'medium',
        ttl: config.get('THROTTLE_MEDIUM_TTL', { infer: true })!,
        limit: config.get('THROTTLE_MEDIUM_LIMIT', { infer: true })!,
      },
      {
        name: 'long',
        ttl: config.get('THROTTLE_LONG_TTL', { infer: true })!,
        limit: config.get('THROTTLE_LONG_LIMIT', { infer: true })!,
      },
    ],
  }),
};
