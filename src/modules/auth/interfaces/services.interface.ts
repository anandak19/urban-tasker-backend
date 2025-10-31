import { IBaseResponse } from '@shared/interfaces/base-response.interface';
import { type Response } from 'express';
import { BasicUserDto } from '../dtos/basicUserData.dto';
import {
  IAuthResponse,
  IBasicUserResponse,
  ITimeLeftResponse,
} from './response.interface';
import { IPayload, ITokens } from './auth.interface';
import { LoginDTo } from '../dtos/login.dto';

/**
 * Methods needed for signup process
 * Directly used in controllers
 */
export interface ISignupService {
  /**
   * Sigup step 1: To save basic user data to cache after validations and send otp
   * @param {Response} res - response object
   * @param {BasicUserDto} basicUserDto - basic user data
   * @returns {Promise<IBasicUserResponse>} - contains saved user data and message
   */
  saveBasicUserData(
    res: Response,
    basicUserDto: BasicUserDto,
  ): Promise<IBasicUserResponse>;

  /**
   * Singup step 2: To varify OTP
   * @param {string} singupId - uuid of the basic user data in cache
   * @param {string} otp - OTP enterd by user
   * @returns {IBaseResponse} - message
   */
  varifyOtp(singupId: string, otp: string): Promise<IBaseResponse>;

  /**
   * To resend OTP
   * @param {string} singupId - uuid of the basic user data in cache
   * @returns {IBasicUserResponse} - user data and message
   */
  resendOtp(singupId: string): Promise<IBasicUserResponse>;

  /**
   * To get the time in seconds left for OTP expiration
   * @param {string} singupId - uuid of the basic user data in cache
   * @returns {ITimeLeftResponse} - time left and message
   */
  getOtpTimeLeft(singupId: string): Promise<ITimeLeftResponse>;

  /**
   * Singup step 3: To validate new password and create new in database (complete signup)
   * @param {Response} res - response object
   * @param {string} singupId - uuid of the basic user data in cache
   * @param {string} password - new password enterd by user
   * @returns {IBaseResponse} - message
   */
  signup(
    res: Response,
    singupId: string,
    password: string,
  ): Promise<IBaseResponse>;
}

/**
 * Methods related to jwt tokens
 * Used in another service methods
 */
export interface ITokenService {
  /**
   * To get access token and refresh tokens
   * @param {IPayload} payload - payload to include in token
   * @returns {Promise<ITokens> | ITokens} - access Token and refresh Token
   */
  getAuthTokens(payload: IPayload): Promise<ITokens> | ITokens;

  /**
   * To varify a single token
   * @param {string} token - token to check
   * @returns {IPayload} - payload data stored in token
   */
  verifyToken(token: string): Promise<IPayload>;

  /**
   * To get a reset token, used in password reset link
   * @param {IPayload} payload - payload to include in token
   * @returns {string} - jwt token (reset token)
   */
  getResetToken(payload: IPayload): Promise<string>;
}

/**
 * Methods needed for authentications after signup
 * Directly used in controllers
 */
export interface IAuthService {
  /**
   * Method for login of user & tasker
   * @param {Response} res - response object
   * @param {LoginDto} loginDto - email and password
   * @returns {Promise<IAuthResponse>} - message and access token
   */
  userLogin(res: Response, loginDto: LoginDTo): Promise<IAuthResponse>;

  /**
   * Method for login of admin
   * @param {Response} res - response object
   * @param {LoginDto} loginDto - email and password
   * @returns {Promise<IAuthResponse>} - message and access token
   */
  adminLogin(res: Response, loginDto: LoginDTo): Promise<IAuthResponse>;

  /**
   * Method to refresh access token and refresh tokens
   * @param {Response} res - response object
   * @param {string} refreshToken - refresh token
   * @returns {Promise<IAuthResponse>} - message and access token (updated)
   */
  refreshToken(res: Response, refreshToken: string): Promise<IAuthResponse>;

  logout(): Promise<IBaseResponse>;
}

export interface IPasswordService {
  /**
   * To varify email and send reset token to email
   * @param {string} email - email id send by user to get rest link
   * @returns {Promise<IBaseResponse>} - message
   */
  forgotPassword(email: string): Promise<IBaseResponse>;

  /**
   * To
   * @param {string} newPassword - new password submitted by user
   * @returns {Promise<IBaseResponse>} - message
   */
  resetPassword(token: string, newPassword: string): Promise<IBaseResponse>;
}
