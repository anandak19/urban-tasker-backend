import { BasicUserDto } from '@modules/auth/dtos/basicUserData.dto';
import { UserRepository } from '@modules/users/repositories/user.repository';
import { Injectable } from '@nestjs/common';
import { IBasicUserData } from '@modules/auth/interfaces/singup.interface';
import { UuidService } from '@core/lib/uuid/uuid.service';
import { CacheService } from '@core/lib/cache/cache.service';
import { CookieService } from '@core/lib/cookie/cookie.service';
import { Response } from 'express';
import { OtpService } from '@core/lib/otp/otp.service';
import { EmailService } from '@core/lib/email/email.service';

@Injectable()
export class SignupService {
  constructor(
    private userRepo: UserRepository,
    private _cookieService: CookieService,
    private _uuidService: UuidService,
    private _cacheService: CacheService,
    private _otpService: OtpService,
    private _emailService: EmailService,
  ) {}

  async saveBasicUserData(res: Response, basicUserDto: BasicUserDto) {
    try {
      // Create UUID and save to Redis
      const uuid = this._uuidService.generate();
      // save user data in cache
      await this._cacheService.set(
        uuid,
        { ...basicUserDto, isVerified: false },
        1000 * 60 * 30,
      );

      // add the uuid to cookie
      this._cookieService.setCookie(res, 'signupId', uuid, 60 * 30); // in cookie upto 30min

      // Generate OTP
      const otp = this._otpService.generateOtp();

      await this._emailService.sendEmail({
        recipient: basicUserDto.email,
        subject: 'Varify Your Email',
        html: this._otpService.generateOtpHtml(otp),
      });

      // Save OTP to Redis
      await this._otpService.storeOtp(uuid, otp);

      return { message: 'OTP sent successfully' };
    } catch (err) {
      console.error('Error in saveBasicUserData:', err);
      return { message: 'Somthing went wrong' };
    }
  }

  /*
    . SETP 2: OTP Verification (POST /auth/signup/varify)
  - Client sends:  otp.  (cookie: id of redis)
  - Server: Fetch OTP from Redis → Validate match/expiration 
    If valid, mark "user data" in Redis as verified: true then Delete OTP key from redis.
    if not valid, send error message
    */
  varifyOtp(otp: string) {
    // from cache get the otp
    console.log(otp);

    // if no, otp found --invlid or expired, send error
    // if valid send the success message
  }

  // signup logic
  async signup(uuid: string) {
    // return await this.userRepo.create(userData);
    return await this._cacheService.get<IBasicUserData>(uuid);
  }

  // --STEPPER SINGUP PROCESS
  /*
  . STEP 1: Basic Info Submission (POST /auth/signup/basic) +
  - Client sends: firstName, lastName, email, phone. +
  - Server: Validate input → Store in Redis (key based on redis id) → Generate/send OTP → Store OTP in Redis with TTL.
    both basic user and otp and stored separatly
  - return the message: otp send to email along with redis id in cookie

  . SETP 2: OTP Verification (POST /auth/signup/varify)
  - Client sends:  otp.  (cookie: id of redis)
  - Server: Fetch OTP from Redis → Validate match/expiration 
    If valid, mark "user data" in Redis as verified: true then Delete OTP key from redis.
    if not valid, send error message

  . STEP 3: Password Submission (POST /auth/signup)
  - Client sends: password. (cookie: id of redis)
    Server: Check if verified in Redis -> by geting the user data from redis using id in cookie
  - If varifid, Validate password strength
  - If strength is good, Fetch full user data from Redis
  - Then Hash password → Create user in DB → Delete Redis keys.
  
  SIGNUP IS NOW COMPLETED
  NEXT MAKE THE USER LOGIN AFTER SINGUP
  . create a REFRESH TOKEN and ACCESS TOKEN
  . add token in cookie as http only
  . return the token and singup success message

  */
}
