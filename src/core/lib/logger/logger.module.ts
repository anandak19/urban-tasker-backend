import { Global, Module } from '@nestjs/common';
import { loggerProvider } from './logger.service';
import { LoggerMiddleware } from './logger.middleware';

@Global()
@Module({
  providers: [loggerProvider, LoggerMiddleware],
  exports: [loggerProvider, LoggerMiddleware],
})
export class LoggerModule {}
