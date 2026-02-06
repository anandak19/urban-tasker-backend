import { Module } from '@nestjs/common';
import { S3Service } from './s3.service';
import { LoggerModule } from '../logger/logger.module';

export const S3_SERVICE = Symbol('S3_SERVICE');

@Module({
  imports: [LoggerModule],
  providers: [
    {
      provide: S3_SERVICE,
      useClass: S3Service,
    },
  ],
  exports: [S3_SERVICE],
})
export class S3Module {}
