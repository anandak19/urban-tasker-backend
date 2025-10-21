import { Injectable, Scope } from '@nestjs/common';
import { CacheService } from '../cache/cache.service';

@Injectable({ scope: Scope.REQUEST })
export class OtpService {
  constructor(private readonly _cacheService: CacheService) {}
  // generate otp
  generateOtp(): string {
    return Math.floor(100000 + Math.random() * 900000)
      .toString()
      .substring(0, 4);
  }

  // save otp in session 60sec
  async storeOtp(
    uuid: string,
    otp: string,
    ttl = 1000 * 60 * 2,
  ): Promise<void> {
    await this._cacheService.set(`otp:${uuid}`, otp, ttl);
  }

  // generate otp html
  generateOtpHtml(otp: string): string {
    return `
      <div style="font-family:Arial,sans-serif;">
        <h3>Email Verification</h3>
         <p>Your one-time password (OTP) is:</p>
         <div style="background:#f4f4f4;padding:10px 20px;width:'fit-content';border-radius:6px;font-size:18px;">
          <b>${otp}</b>
         </div>
         <p>This OTP will expire in 120 seconds.</p>
      </div>
    `;
  }

  async getOtpTimeLeft(uuid: string) {
    return await this._cacheService.getReminingTime(`otp:${uuid}`);
  }

  // varify otp
  async varifyOtp(uuid: string, otp: string): Promise<boolean> {
    const storedOtp = await this._cacheService.get(`otp:${uuid}`);
    return storedOtp === otp;
  }
}
