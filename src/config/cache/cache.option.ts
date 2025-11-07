import { AppConfig } from '@config/app.config';
import { CacheModuleAsyncOptions } from '@nestjs/cache-manager';
import { ConfigService } from '@nestjs/config';
import { redisStore } from 'cache-manager-redis-yet';
import { RedisClientOptions } from 'redis'; // createClient

export const cacheManagerOptions: CacheModuleAsyncOptions<RedisClientOptions> =
  {
    inject: [ConfigService],
    useFactory: (configService: ConfigService<AppConfig>) => ({
      store: redisStore,
      url: configService.get<string>('REDIS_URI'),
    }),
  };
