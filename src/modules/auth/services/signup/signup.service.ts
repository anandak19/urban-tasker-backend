import { BasicUserDto } from '@modules/auth/dtos/basicUserData.dto';
import {
  BadRequestException,
  ConflictException,
  GoneException,
  Inject,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
  Scope,
} from '@nestjs/common';
import { IBasicUserData } from '@modules/auth/interfaces/singup.interface';
import { UuidService } from '@core/lib/uuid/uuid.service';
import { CookieService } from '@core/lib/cookie/cookie.service';
import { Response } from 'express';
import { OtpService } from '@core/lib/otp/otp.service';
import { EmailService } from '@core/lib/email/email.service';
import {
  AUTH_MESSAGES,
  SESSION_MESSAGES,
} from '@shared/constants/messages/auth-messages.constant';
import { type IUserService } from '@modules/users/interfaces/user-services.interface';
import {
  IBasicUserResponse,
  ITimeLeftResponse,
} from '@modules/auth/interfaces/response.interface';
import { IBaseResponse } from '@shared/interfaces/base-response.interface';
import { USER_TOKENS } from '@modules/users/user-tokens';
import { ISignupService } from '@modules/auth/interfaces/services.interface';
import { CacheService } from '@core/lib/cache/cache.service';
import { AuthProvider } from '@shared/constants/enums/auth-providers.enum';
import { generateOtpHtml } from '@shared/constants/email/email-templates';
import { LOGGER_SERVICE } from '@core/lib/logger/logger.service';
import type { ILoggerService } from '@core/lib/logger/logger.interface';
import { WALLET_TOKENS } from '@modules/wallet/wallet-tokens';
import type { IWalletService } from '@modules/wallet/interfaces/wallet-services.interface';

@Injectable({ scope: Scope.REQUEST })
export class SignupService implements ISignupService {
  private cache_duation = 1000 * 60 * 30;
  private signup_id_duation = 60 * 30; // 30min

  constructor(
    @Inject(USER_TOKENS.SERVICE) private _userService: IUserService,
    @Inject(LOGGER_SERVICE) private _logger: ILoggerService,

    @Inject(WALLET_TOKENS.WALLET_SERVICE)
    private _walletService: IWalletService,

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
  async saveBasicUserData(
    res: Response,
    basicUserDto: BasicUserDto,
  ): Promise<IBasicUserResponse> {
    try {
      // Create UUID and save to Redis
      const uuid = this._uuidService.generate();

      // save user data in cache
      await this._cacheService.set<IBasicUserData>(
        uuid,
        { ...basicUserDto, isVerified: false },
        this.cache_duation,
      );
      const userData = await this._cacheService.get<IBasicUserData>(uuid);
      if (!userData) {
        throw new BadRequestException(SESSION_MESSAGES.SIGNUP_EXPIRED);
      }

      // add the uuid to cookie
      this._cookieService.setCookie(
        res,
        'signupId',
        uuid,
        this.signup_id_duation,
      );

      // Generate OTP
      const otp = this._otpService.generateOtp();

      await this._emailService.sendEmail({
        recipient: basicUserDto.email,
        subject: 'Varify Your Email',
        html: generateOtpHtml(otp),
      });

      // Save OTP to Redis
      await this._otpService.storeOtp(uuid, otp);

      return { message: AUTH_MESSAGES.OTP_SENT, userData };
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
  async varifyOtp(signupId: string, otp: string): Promise<IBaseResponse> {
    const isOtpMatch = await this._otpService.varifyOtp(signupId, otp);
    if (!isOtpMatch) {
      throw new GoneException(AUTH_MESSAGES.OTP_EXPIRED);
    }

    await this._cacheService.updateField(signupId, 'isVerified', true);
    // TODO: call method to delete otp from cache here -

    return { message: AUTH_MESSAGES.OTP_VARIFY_SUCCESS };
  }

  /*
    Route to resend otp
  */
  async resendOtp(signupId: string): Promise<IBasicUserResponse> {
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
        html: generateOtpHtml(otp),
      });

      await this._otpService.storeOtp(signupId, otp);

      return { message: AUTH_MESSAGES.OTP_SENT, userData };
    } catch (err) {
      console.error('Error in otp send:', err);
      throw new InternalServerErrorException();
    }
  }

  async getOtpTimeLeft(signupId: string): Promise<ITimeLeftResponse> {
    const timeLeft = await this._otpService.getOtpTimeLeft(signupId);
    if (!timeLeft) {
      throw new NotFoundException(AUTH_MESSAGES.OTP_EXPIRED);
    }
    return { timeLeft };
  }

  // signup logic
  async signup(
    res: Response,
    signupId: string,
    password: string,
  ): Promise<IBaseResponse> {
    // get user data from cache
    this._logger.verbose('Reached signup servcie');
    const userData = await this._cacheService.get<IBasicUserData>(signupId);
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
    const savedUser = await this._userService.create({
      ...userData,
      password,
      provider: AuthProvider.LOCAL,
    });
    if (!savedUser) {
      throw new InternalServerErrorException(AUTH_MESSAGES.SIGNUP_FAILD);
    }

    // creae wallet
    await this._walletService.create(savedUser.id);
    /*
    TODO: 
    Call method to delete temp user data from cache
    Call method to remove singupId token from req.cookie 
    */

    return {
      message: AUTH_MESSAGES.SIGNUP_SUCCESS,
    };
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
