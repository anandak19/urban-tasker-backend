import { Inject, Injectable, NestMiddleware } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';
import { LOGGER_SERVICE } from './logger.service';
import type { ILoggerService } from './logger.interface';
import { winstonLogger } from '@config/logger/logger.config';

@Injectable()
export class LoggerMiddleware implements NestMiddleware {
  constructor(@Inject(LOGGER_SERVICE) private _logger: ILoggerService) {}
  use(req: Request, res: Response, next: NextFunction) {
    console.log(`[${req.method}] ${req.originalUrl}`);

    const { method, originalUrl } = req;

    winstonLogger.log('HTTP Request', {
      method,
      url: originalUrl,
    });
    next();
  }
}
