import { Module } from '@nestjs/common';
import { loggerProvider } from './logger.service';

// use this as injection token
export const LOGGER_SERVICE = 'LOGGER_SERVICE';

@Module({
  providers: [loggerProvider],
  exports: [loggerProvider],
})
export class LoggerModule {}
