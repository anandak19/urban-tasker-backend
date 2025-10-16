import { DynamicModule, Global, Module } from '@nestjs/common';
import { CacheService } from './cache.service';
import { CacheModule as NestJSCacheModule } from '@nestjs/cache-manager';
import { cacheManagerOptions } from '@config/cache/cache.option';

@Global()
@Module({})
export class CacheModule {
  static register(): DynamicModule {
    return {
      global: true,
      providers: [CacheService],
      imports: [NestJSCacheModule.registerAsync(cacheManagerOptions)],
      exports: [CacheService],
      module: CacheModule,
    };
  }
}
