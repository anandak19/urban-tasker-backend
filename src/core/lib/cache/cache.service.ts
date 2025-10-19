import { Cache, CACHE_MANAGER } from '@nestjs/cache-manager';
import { Inject, Injectable } from '@nestjs/common';

@Injectable()
export class CacheService {
  constructor(@Inject(CACHE_MANAGER) private _cacheManager: Cache) {}

  /*
    Method to sets data to redis
    ttl time: 1000 * 60 ~ 1min
  */
  async set(key: string, value: object | string, ttl?: number) {
    return await this._cacheManager.set(key, value, ttl);
  }

  /*
    Method to get data from redis
  */
  async get<T>(key: string) {
    const data = await this._cacheManager.get<T>(key);
    console.log('Inside the get of cache', data);
    return data ?? undefined;
  }

  /*
    Method to delete data from redis
  */
  del(key: string) {
    return this._cacheManager.del(key);
  }

  /*
    Method to update a object data field in redis
  */
  async updateField(key: string, field: string, value: unknown, ttl?: number) {
    const data = (await this.get<unknown>(key)) ?? {};

    if (typeof data !== 'object' || data === null) {
      throw new Error('Cache entry is not an object and cannot be updated');
    }

    const obj = data as Record<string, unknown>;

    obj[field] = value;

    return await this.set(key, obj, ttl);
  }
}
