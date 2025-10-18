import { ConfigModuleOptions } from '@nestjs/config';
import databaseConfig from './database/database.config';
import Joi from 'joi';

export const configOptions: ConfigModuleOptions = {
  isGlobal: true,
  load: [databaseConfig],
  validationSchema: Joi.object({
    MONGO_URI: Joi.string().required(),
    PORT: Joi.number().default(3000),
    JWT_SECRET: Joi.string().required(),
    REDIS_HOST: Joi.string().required(),
    REDIS_PORT: Joi.number().required(),
    REDIS_PASS: Joi.string().required(),
    REDIS_URI: Joi.string().required(),
    SMTP_HOST: Joi.string().required(),
    SMTP_PASS: Joi.string().required(),
    SMTP_PORT: Joi.number().required(),
    SMTP_FROM: Joi.string().required(),
  }),
};
