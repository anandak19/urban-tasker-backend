import { Cache, CACHE_MANAGER } from '@nestjs/cache-manager';
import { Inject, Injectable } from '@nestjs/common';

@Injectable()
export class CacheService {
  constructor(@Inject(CACHE_MANAGER) private _cacheManager: Cache) {}

  // ttl 1000 * 60 = 1 min
  async set(key: string, value: object | string, ttl?: number) {
    return await this._cacheManager.set(key, value, ttl);
  }

  async get<T>(key: string) {
    const data = await this._cacheManager.get<T>(key);
    console.log('Inside the get of cache', data);
    return data ?? undefined;
  }

  del(key: string) {
    return this._cacheManager.del(key);
  }

  // delete field
  // getField
}
