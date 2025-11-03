import { Injectable, Scope } from '@nestjs/common';
import { COOKIE_KEYS } from '@shared/constants/keys/cookie-keys.constant';
import { type Response } from 'express';

@Injectable({ scope: Scope.REQUEST })
export class CookieService {
  // set a cookie with default 1 hr. accept time in sec
  setCookie(
    res: Response,
    key: string,
    value: string,
    maxAgeSeconds: number = 3600,
  ) {
    res.cookie(key, value, {
      httpOnly: true,
      secure: false,
      maxAge: maxAgeSeconds * 1000,
    });
  }

  clearCookie(res: Response) {
    res.clearCookie(COOKIE_KEYS.REFERESH_KEY, {
      httpOnly: true,
      secure: false,
    });
  }
}
