import { BasicUserDto } from '@modules/auth/dtos/basicUserData.dto';
import {
  BadRequestException,
  ConflictException,
  GoneException,
  Injectable,
  InternalServerErrorException,
} from '@nestjs/common';
import { IBasicUserData } from '@modules/auth/interfaces/singup.interface';
import { UuidService } from '@core/lib/uuid/uuid.service';
import { CacheService } from '@core/lib/cache/cache.service';
import { CookieService } from '@core/lib/cookie/cookie.service';
import { Response } from 'express';
import { OtpService } from '@core/lib/otp/otp.service';
import { EmailService } from '@core/lib/email/email.service';
import { UsersService } from '@modules/users/services/users.service';
import {
  AUTH_MESSAGES,
  SESSION_MESSAGES,
} from '@shared/constants/messages/auth-messages.constant';

@Injectable()
export class SignupService {
  constructor(
    private _userService: UsersService,
    private _cookieService: CookieService,
    private _uuidService: UuidService,
    private _cacheService: CacheService,
    private _otpService: OtpService,
    private _emailService: EmailService,
  ) {}

  /*
  . STEP 1: Basic Info Submission (POST /auth/signup/basic) +
  - Client sends: firstName, lastName, email, phone. +
  - Server: Validate input → Store in Redis (key based on redis id) → Generate/send OTP → Store OTP in Redis with TTL.
    both basic user and otp and stored separatly
  - return the message: otp send to email along with redis id in cookie
  */
  async saveBasicUserData(res: Response, basicUserDto: BasicUserDto) {
    try {
      // Create UUID and save to Redis
      const uuid = this._uuidService.generate();
      // save user data in cache
      const userData: IBasicUserData = (await this._cacheService.set(
        uuid,
        { ...basicUserDto, isVerified: false },
        1000 * 60 * 30,
      )) as IBasicUserData;

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

      return { message: 'OTP sent successfully', userData };
    } catch (err) {
      console.error('Error in saveBasicUserData:', err);
      throw new InternalServerErrorException();
    }
  }

  /*
  . SETP 2: OTP Verification (POST /auth/signup/varify)
  - Client sends:  otp.  (cookie: id of redis)
  - Server: Fetch OTP from Redis → Validate match/expiration 
    If valid, mark "user data" in Redis as verified: true then Delete OTP key from redis.
    if not valid, send error message
  */
  async varifyOtp(signupId: string, otp: string) {
    const isOtpCorrect = await this._otpService.varifyOtp(signupId, otp);
    if (!isOtpCorrect) {
      throw new GoneException(AUTH_MESSAGES.OTP_EXPIRED);
    }

    await this._cacheService.updateField(signupId, 'isVerified', true);

    return { message: 'OTP Varified successfully' };
  }

  /*
    Route to resend otp
  */
  async resendOtp(signupId: string) {
    const userData: BasicUserDto | undefined =
      await this._cacheService.get<BasicUserDto>(signupId);

    if (!userData) {
      throw new BadRequestException(SESSION_MESSAGES.SIGNUP_EXPIRED);
    }

    const otp = this._otpService.generateOtp();
    try {
      await this._emailService.sendEmail({
        recipient: userData.email,
        subject: 'Varify Your Email',
        html: this._otpService.generateOtpHtml(otp),
      });

      await this._otpService.storeOtp(signupId, otp);

      return { message: 'OTP sent successfully', userData };
    } catch (err) {
      console.error('Error in otp send:', err);
      throw new InternalServerErrorException();
    }
  }

  // signup logic
  async signup(signupId: string, password: string) {
    // get user data from cache
    const userData = (await this._cacheService.get<IBasicUserData>(
      signupId,
    )) as IBasicUserData;
    if (!userData) {
      throw new BadRequestException(SESSION_MESSAGES.SIGNUP_EXPIRED);
    } else if (!userData.isVerified) {
      throw new BadRequestException(AUTH_MESSAGES.NOT_VERIFIED);
    }

    // check if the user with email exists
    const userExists = await this._userService.findByEmail(userData.email);
    if (userExists) {
      throw new ConflictException(AUTH_MESSAGES.EMAIL_TAKEN);
    }
    // save user to db
    const savedUser = this._userService.create({ ...userData, password });
    // toekn process
    return { message: 'User singup success, now login', savedUser };
  }

  getOtpStatus(signupId: string) {
    console.log(signupId);
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
