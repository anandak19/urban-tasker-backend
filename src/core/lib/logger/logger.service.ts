import { Injectable, Logger } from '@nestjs/common';
import { ILoggerService } from './logger.interface';

@Injectable()
export class LoggerService implements ILoggerService {
  private readonly logger = new Logger('Logger');
  // methods
  log(message: string | object): void {
    this.logger.log(message);
  }
  error(message: string): void {
    this.logger.error(message);
  }
  warn(message: string): void {
    this.logger.warn(message);
  }
  verbose(message: string): void {
    this.logger.verbose(message);
  }
}

export const LOGGER_SERVICE = 'LOGGER_SERVICE';
export const loggerProvider = {
  provide: LOGGER_SERVICE,
  useClass: LoggerService,
};
