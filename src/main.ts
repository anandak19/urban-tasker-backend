import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { json } from 'express';
import { ValidationPipe } from '@nestjs/common';
import { useContainer } from 'class-validator';
import cookieParser from 'cookie-parser';
import { AllExceptionsFilter } from '@core/filters/http-exception.filter';
import { ResponseInterceptor } from '@core/interceptors/response.interceptor';

// import { winstonLogger } from '@config/logger/logger.config';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, {
    // logger: winstonLogger,
  });

  // app.useLogger(winstonLogger);

  app.enableCors({
    origin: [
      'http://localhost:4200',
      'https://urban-tasker-frontend.vercel.app',
    ],
    credentials: true,
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS',
    allowedHeaders: 'Content-Type,Authorization,Cookie',
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
  const PORT = Number(process.env.PORT ?? 3000);
  await app.listen(PORT);
}

bootstrap().catch((error) => {
  console.log('Application faild to start', error);
  process.exit(1);
});
// modular layered architecture
