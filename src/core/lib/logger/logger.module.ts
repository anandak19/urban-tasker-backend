import { Module } from '@nestjs/common';
import { loggerProvider } from './logger.service';

@Module({
  providers: [loggerProvider],
  exports: [loggerProvider],
})
export class LoggerModule {}
