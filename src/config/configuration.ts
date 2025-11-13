import { appConfigSchema } from './app.config';

export default () => {
  const config = {
    NODE_ENV: process.env.NODE_ENV,

    APP_HOME_URL: process.env.APP_HOME_URL,

    PORT: Number(process.env.PORT),
    MONGO_URI: process.env.MONGO_URI,

    JWT_SECRET: process.env.JWT_SECRET,

    REDIS_HOST: process.env.REDIS_HOST,
    REDIS_PORT: Number(process.env.REDIS_PORT),
    REDIS_PASS: process.env.REDIS_PASS,
    REDIS_URI: process.env.REDIS_URI,

    SMTP_HOST: process.env.SMTP_HOST,
    SMTP_PASS: process.env.SMTP_PASS,
    SMTP_PORT: Number(process.env.SMTP_PORT),
    SMTP_FROM: process.env.SMTP_FROM,

    GOOGLE_CLIENT_ID: process.env.GOOGLE_CLIENT_ID,
    GOOGLE_CLIENT_SECRET: process.env.GOOGLE_CLIENT_SECRET,
    GOOGLE_CALLBACK_URL: process.env.GOOGLE_CALLBACK_URL,

    AWS_ACCESS_KEY: process.env.AWS_ACCESS_KEY,
    AWS_SECRET_KEY: process.env.AWS_SECRET_KEY,
    AWS_REGION: process.env.AWS_REGION,
    AWS_BUCKET_NAME: process.env.AWS_BUCKET_NAME,
  };

  // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
  const { error, value } = appConfigSchema.validate(config, {
    abortEarly: false,
    stripUnknown: true,
  });

  if (error) {
    console.log(error);
    throw new Error(`Config validation error: ${error.message}`);
  }

  return value;
};
