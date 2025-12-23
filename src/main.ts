import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { json } from 'express';
import { ValidationPipe } from '@nestjs/common';
import { useContainer } from 'class-validator';
import cookieParser from 'cookie-parser';
import { AllExceptionsFilter } from '@core/filters/http-exception.filter';
import { ResponseInterceptor } from '@core/interceptors/response.interceptor';
import { WinstonModule } from 'nest-winston';
import { transports } from 'winston';

import * as fs from 'fs';
import { join } from 'path';

const logDir = join(process.cwd(), 'logs');
if (!fs.existsSync(logDir)) fs.mkdirSync(logDir);

async function bootstrap() {
  const app = await NestFactory.create(AppModule, {
    logger: WinstonModule.createLogger({
      transports: [
        new transports.Console(),
        new transports.File({
          filename: '/app/logs/app.log',
        }),
      ],
    }),
  });

  app.enableCors({
    origin: [
      'https://1tks06cq-4200.inc1.devtunnels.ms',
      'http://localhost:4200',
    ],
    credentials: true,
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS',
    allowedHeaders: 'Content-Type,Authorization',
  });
  app.use(json());
  app.use(cookieParser());
  app.setGlobalPrefix('api');
  useContainer(app.select(AppModule), { fallbackOnErrors: true });
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
    }),
  );

  app.useGlobalInterceptors(new ResponseInterceptor());
  app.useGlobalFilters(new AllExceptionsFilter());
  await app.listen(process.env.PORT ?? 3000);
}

bootstrap().catch((error) => {
  console.log('Application faild to start', error);
  process.exit(1);
});
// modular layered architecture
