import { Inject, Injectable, Logger } from '@nestjs/common';
import { Cacheable } from 'cacheable';
import Keyv from 'keyv';

@Injectable()
export class CacheService {
  private readonly logger = new Logger(CacheService.name);
  private readonly keyv: Keyv<unknown>;

  constructor(@Inject('CACHE_INSTANCE') private readonly cache: Cacheable) {
    this.keyv = this.cache.secondary as Keyv<unknown>;
  }

  async get<T>(key: string): Promise<T | undefined> {
    return await this.cache.get<T>(key); // Returns clean value (or undefined)
  }

  async set<T>(key: string, value: T, ttl?: number | string): Promise<void> {
    await this.cache.set(key, value, ttl);
  }

  async delete(key: string): Promise<void> {
    await this.cache.delete(key);
  }

  async getReminingTime(key: string): Promise<number | undefined> {
    const raw = await this.keyv.get(key, { raw: true });
    console.log(raw);
    let remainingTtl: number | null = null;
    if (raw && raw?.expires) {
      const now = Date.now();
      remainingTtl = Math.max(0, raw.expires - now);
      const remainingSeconds = Math.floor(remainingTtl / 1000);
      console.log('In cache servcie:', remainingSeconds);
      return remainingSeconds;
    } else {
      return 0;
    }
  }

  /*
    Method to delete data from redis
  */
  // async del(key: string): Promise<void> {
  //   try {
  //     await this.keyv.del(key);
  //     this.logger.debug(`Deleted cache for key: ${key}`);
  //   } catch (error) {
  //     this.logger.error(`Failed to delete cache for key: ${key}`, error);
  //   }
  // }

  /*
    Method to update a object data field in redis
  */
  async updateField<T>(
    key: string,
    field: string,
    value: unknown,
  ): Promise<void> {
    try {
      const data = await this.get<T>(key);
      if (
        data &&
        typeof data === 'object' &&
        data !== null &&
        !Array.isArray(data)
      ) {
        data[field] = value;
        const remainingTtl = await this.getReminingTime(key);
        await this.set(
          key,
          data,
          remainingTtl ? remainingTtl * 1000 : undefined,
        );
        this.logger.debug(`Updated field '${field}' in cache for key: ${key}`);
      } else {
        this.logger.warn(`No valid object found in cache for key: ${key}`);
      }
    } catch (error) {
      this.logger.error(
        `Failed to update field in cache for key: ${key}`,
        error,
      );
    }
  }

  async has(key: string): Promise<boolean> {
    try {
      const data = await this.get(key);
      return data !== undefined;
    } catch (error) {
      this.logger.error(`Failed to check existence for key: ${key}`, error);
      return false;
    }
  }

  async clear(): Promise<void> {
    try {
      await this.keyv.clear();
      this.logger.log('Cleared entire cache');
    } catch (error) {
      this.logger.error('Failed to clear cache', error);
    }
  }
}
