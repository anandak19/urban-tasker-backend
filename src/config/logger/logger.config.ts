import { WinstonModule } from 'nest-winston';
import { format, transports } from 'winston';
import DailyRotateFile from 'winston-daily-rotate-file';

export const fileLogger = WinstonModule.createLogger({
  transports: [
    // logging all level
    new DailyRotateFile({
      dirname: 'logs',
      filename: '/app/logs/app-%DATE%.log',
      datePattern: 'YYYY-MM-DD',
      level: 'info',
      maxSize: '20m', //
      maxFiles: '7d', //
      zippedArchive: true,
    }),

    //log error
    new DailyRotateFile({
      dirname: 'logs',
      filename: '/app/logs/error-%DATE%.log',
      datePattern: 'YYYY-MM-DD',
      level: 'error',
      maxSize: '10m', //
      maxFiles: '14d', //
    }),

    //cosole
    new transports.Console({
      format: format.combine(
        format.timestamp(),
        format.printf(
          ({ timestamp, level, message }) =>
            `${String(timestamp)} ${level}: ${String(message)}`,
        ),
      ),
    }),
  ],
});
