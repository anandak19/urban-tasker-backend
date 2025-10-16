import { CacheService } from '@core/lib/cache/cache.service';
import { IBasicUserData } from '@modules/auth/interfaces/singup.interface';
import { Injectable } from '@nestjs/common';

@Injectable()
export class AuthRedisService {
  constructor(private _cacheService: CacheService) {}

  private _getKey(email: string) {
    return `user:temp:${email.toLowerCase()}`;
  }

  async setUserTempData(
    email: string,
    userData: IBasicUserData,
    ttl = 30,
  ): Promise<void> {
    const key = this._getKey(email);
    await this._cacheService.set(
      key,
      { ...userData, isVarified: false },
      ttl * 60000,
    );

    console.log(`Set key: ${key}`);

    console.log(await this.getUserTempData<IBasicUserData>(email));
  }

  async getUserTempData<T>(email: string) {
    const key = this._getKey(email);
    console.log(`Get key: ${key}`);
    const data = await this._cacheService.get<T>(key);
    // console.log(`Data got ${data}`);
    return data;
  }
}
