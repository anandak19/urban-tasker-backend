import { type IBasicResponseData } from '@shared/interfaces/base-response.interface';
import { type IBasicUserData } from './singup.interface';

export type IBasicUserResponse = IBasicResponseData<IBasicUserData, 'userData'>;

export type ITimeLeftResponse = { timeLeft: number };

export type ISignupResponse = {
  message: string;
  accessToken: string;
};

export type IAuthResponse = {
  message: string;
  accessToken: string;
};
