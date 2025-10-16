import { CacheModuleAsyncOptions } from '@nestjs/cache-manager';
import { ConfigService } from '@nestjs/config';
import { redisStore } from 'cache-manager-redis-yet';
import { RedisClientOptions } from 'redis';

export const cacheManagerOptions: CacheModuleAsyncOptions<RedisClientOptions> =
  {
    inject: [ConfigService],
    useFactory: (configService: ConfigService) => ({
      store: redisStore,
      socket: {
        host: configService.get<string>('REDIS_HOST'),
        port: +configService.get<number>('REDIS_PORT')!,
      },
      password: configService.get<string>('REDIS_PASS'),
    }),
  };
