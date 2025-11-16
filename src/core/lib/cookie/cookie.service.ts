import { type AppConfig } from '@config/app.config';
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { COOKIE_KEYS } from '@shared/constants/keys/cookie-keys.constant';
import { type Response } from 'express';

@Injectable()
export class CookieService {
  constructor(private configService: ConfigService<AppConfig>) {}
  // set a cookie with default 1 hr. accept time in sec
  setCookie(
    res: Response,
    key: string,
    value: string,
    maxAgeSeconds: number = 3600,
  ) {
    const isProd = this.configService.get('NODE_ENV') === 'production';

    res.cookie(key, value, {
      httpOnly: true,
      secure: isProd,
      sameSite: 'none',
      path: '/',
      maxAge: maxAgeSeconds * 1000,
    });
  }

  clearCookie(res: Response) {
    const isProd = this.configService.get('NODE_ENV') === 'production';

    res.clearCookie(COOKIE_KEYS.REFERESH_KEY, {
      httpOnly: true,
      secure: isProd,
      path: '/',
      sameSite: 'none',
    });

    res.clearCookie(COOKIE_KEYS.ACCESS_KEY, {
      httpOnly: true,
      secure: isProd,
      path: '/',
      sameSite: 'none',
    });
  }
}
