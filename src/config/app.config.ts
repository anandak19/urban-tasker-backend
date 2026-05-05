import * as Joi from 'joi';

// app config interface
export interface AppConfig {
  NODE_ENV: string;

  APP_HOME_URL: string;

  PORT: number;
  MONGO_URI: string;

  JWT_SECRET: string;

  REDIS_USER: string;
  REDIS_PASS: string;
  REDIS_URI: string;

  SMTP_HOST: string;
  SMTP_PASS: string;
  SMTP_PORT: number;
  SMTP_FROM: string;

  GOOGLE_CLIENT_ID: string;
  GOOGLE_CLIENT_SECRET: string;
  GOOGLE_CALLBACK_URL: string;

  AWS_REGION: string;
  AWS_BUCKET_NAME: string;

  RAZORPAY_API_KEY: string;
  RAZORPAY_KEY_SECREAT: string;
}

// joi validation schema
export const appConfigSchema = Joi.object<AppConfig, true>({
  NODE_ENV: Joi.string().required(),

  APP_HOME_URL: Joi.string().required(),

  PORT: Joi.number().default(3000),
  MONGO_URI: Joi.string().required(),

  JWT_SECRET: Joi.string().required(),

  REDIS_USER: Joi.string().required(),
  REDIS_PASS: Joi.string().required(),
  REDIS_URI: Joi.string().required(),

  SMTP_HOST: Joi.string().required(),
  SMTP_PASS: Joi.string().required(),
  SMTP_PORT: Joi.number().required(),
  SMTP_FROM: Joi.string().required(),

  GOOGLE_CLIENT_ID: Joi.string().required(),
  GOOGLE_CLIENT_SECRET: Joi.string().required(),
  GOOGLE_CALLBACK_URL: Joi.string().required(),

  AWS_REGION: Joi.string().required(),
  AWS_BUCKET_NAME: Joi.string().required(),

  RAZORPAY_API_KEY: Joi.string().required(),
  RAZORPAY_KEY_SECREAT: Joi.string().required(),
});
