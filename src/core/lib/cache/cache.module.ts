import { Module } from '@nestjs/common';
import { createKeyv } from '@keyv/redis';
import { Cacheable } from 'cacheable';
import { CacheService } from './cache.service';

@Module({
  providers: [
    {
      provide: 'CACHE_INSTANCE',
      useFactory: () => {
        const secondary = createKeyv('redis://default:secret@redis:6379');
        return new Cacheable({ secondary, ttl: '4h' });
      },
    },
    CacheService,
  ],
  exports: ['CACHE_INSTANCE', CacheService],
})
export class CacheModule {}
