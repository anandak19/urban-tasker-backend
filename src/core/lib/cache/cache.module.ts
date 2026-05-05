import { Module } from '@nestjs/common';
import { createKeyv } from '@keyv/redis';
import { Cacheable } from 'cacheable';
import { CacheService } from './cache.service';
import { ConfigService } from '@nestjs/config';
import { AppConfig } from '@config/app.config';

@Module({
  providers: [
    {
      provide: 'CACHE_INSTANCE',
      useFactory: (configService: ConfigService<AppConfig>) => {
        const redisString = configService.get<string>('REDIS_URI', {
          infer: true,
        })!;
        const redisUser = configService.get<string>('REDIS_USER', {
          infer: true,
        })!;
        const redisPassword = configService.get<string>('REDIS_PASS', {
          infer: true,
        })!;

        const redisUri = `redis://${redisUser}:${redisPassword}@${redisString}`;

        const secondary = createKeyv(redisUri);
        return new Cacheable({ secondary, ttl: '4h' });
      },
      inject: [ConfigService],
    },
    CacheService,
  ],
  exports: ['CACHE_INSTANCE', CacheService],
})
export class CacheModule {}
