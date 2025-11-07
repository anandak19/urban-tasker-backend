import * as Joi from 'joi';

export interface AppConfig {
  PORT: number;
  MONGO_URI: string;

  JWT_SECRET: string;

  REDIS_HOST: string;
  REDIS_PORT: number;
  REDIS_PASS: string;
  REDIS_URI: string;

  SMTP_HOST: string;
  SMTP_PASS: string;
  SMTP_PORT: number;
  SMTP_FROM: string;

  GOOGLE_CLIENT_ID: string;
  GOOGLE_CLIENT_SECRET: string;
  GOOGLE_CALLBACK_URL: string;
}

// joi validation schema
export const appConfigSchema = Joi.object<AppConfig, true>({
  PORT: Joi.number().default(3000),
  MONGO_URI: Joi.string().required(),

  JWT_SECRET: Joi.string().required(),

  REDIS_HOST: Joi.string().required(),
  REDIS_PORT: Joi.number().required(),
  REDIS_PASS: Joi.string().required(),
  REDIS_URI: Joi.string().required(),

  SMTP_HOST: Joi.string().required(),
  SMTP_PASS: Joi.string().required(),
  SMTP_PORT: Joi.number().required(),
  SMTP_FROM: Joi.string().required(),

  GOOGLE_CLIENT_ID: Joi.string().required(),
  GOOGLE_CLIENT_SECRET: Joi.string().required(),
  GOOGLE_CALLBACK_URL: Joi.string().required(),
});
