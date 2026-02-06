import { WinstonModule } from 'nest-winston';
import { transports, format } from 'winston';
import LokiTransport from 'winston-loki';
import type { TransformableInfo } from 'logform';
import 'winston-daily-rotate-file';

export const winstonLogger = WinstonModule.createLogger({
  levels: {
    error: 0,
    warn: 1,
    info: 2,
    verbose: 3,
    debug: 4,
  },
  level: 'info',
  format: format.combine(format.timestamp(), format.json()),
  transports: [
    new transports.Console(),

    // all level loggin on file
    new transports.DailyRotateFile({
      filename: `logs/%DATE%-combined.log`,
      format: format.combine(format.timestamp(), format.json()),
      datePattern: 'YYYY-MM-DD',
      zippedArchive: false,
      maxFiles: '30d',
    }),

    new LokiTransport({
      host: 'http://loki:3100',
      labels: (info: TransformableInfo) => ({
        app: 'backend',
        service: 'api',
        level: info.level,
      }),
      json: true,
    }),
  ],
});
