import { Module } from '@nestjs/common';
import { loggerProvider } from './logger.service';
import { LoggerMiddleware } from './logger.middleware';

@Module({
  providers: [loggerProvider, LoggerMiddleware],
  exports: [loggerProvider, LoggerMiddleware],
})
export class LoggerModule {}
