import {
  GetObjectCommand,
  PutObjectCommand,
  PutObjectCommandInput,
  PutObjectCommandOutput,
  S3Client,
} from '@aws-sdk/client-s3';
import { AppConfig } from '@config/app.config';
import {
  Inject,
  Injectable,
  InternalServerErrorException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import type { Express } from 'express';
import { LOGGER_SERVICE } from '../logger/logger.service';
import { type ILoggerService } from '../logger/logger.interface';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';
import { GENERAL_ERRORS } from '@shared/constants/messages/error-messaes.constants';
import { IS3Service } from './s3.interface';

@Injectable()
export class S3Service implements IS3Service {
  private urlExpireTime = 3600; // 1h
  private s3: S3Client;
  private bucket: string;

  constructor(
    private _configService: ConfigService<AppConfig>,
    @Inject(LOGGER_SERVICE) private _logger: ILoggerService,
  ) {
    // s3 config/ move it to config file later
    this.s3 = new S3Client({
      region: _configService.get<string>('AWS_REGION', { infer: true })!,
      credentials: {
        accessKeyId: _configService.get<string>('AWS_ACCESS_KEY', {
          infer: true,
        })!,
        secretAccessKey: _configService.get<string>('AWS_SECRET_KEY', {
          infer: true,
        })!,
      },
    });
    // get bucket name
    this.bucket = _configService.get<string>('AWS_BUCKET_NAME', {
      infer: true,
    })!;
  }

  async getImageUrl(key: string): Promise<string> {
    // create get command
    const getCommand = new GetObjectCommand({
      Bucket: this.bucket,
      Key: key,
    });

    // create signed url
    const signedUrl = await getSignedUrl(this.s3, getCommand, {
      expiresIn: this.urlExpireTime,
    });

    return signedUrl;
  }

  async uploadCategoryImage(file: Express.Multer.File): Promise<string> {
    return await this._uploadFile(file, 'categories');
  }

  async uploadSubCategoryImage(file: Express.Multer.File): Promise<string> {
    return await this._uploadFile(file, 'subcategories');
  }

  async uploadIdProofImage(file: Express.Multer.File): Promise<string> {
    return await this._uploadFile(file, 'idproofs');
  }

  private async _uploadFile(
    file: Express.Multer.File,
    folder: string,
  ): Promise<string> {
    const key = `${folder}/${Date.now()}-${file.originalname}`;

    // create put object command input
    const uploadParams: PutObjectCommandInput = {
      Bucket: this.bucket,
      Key: key,
      Body: file.buffer,
      ContentType: file.mimetype,
    };
    const command = new PutObjectCommand(uploadParams);

    try {
      // save image to s3 bucket
      const res: PutObjectCommandOutput = await this.s3.send(command);
      this._logger.verbose('Image upload response');
      this._logger.log(res.$metadata);

      if (!res.$metadata || res.$metadata.httpStatusCode !== 200) {
        throw new InternalServerErrorException(GENERAL_ERRORS.SERVER_ERROR);
      }

      return key;
    } catch (error) {
      this._logger.error('Faild to upload image in s3');
      this._logger.error(error as object);

      throw new InternalServerErrorException(GENERAL_ERRORS.SERVER_ERROR);
    }
  }
}
