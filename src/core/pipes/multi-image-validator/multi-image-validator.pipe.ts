import {
  BadRequestException,
  FileTypeValidator,
  Injectable,
  MaxFileSizeValidator,
  ParseFilePipe,
  PipeTransform,
} from '@nestjs/common';
import { GENERAL_ERRORS } from '@shared/constants/messages/error-messaes.constants';

@Injectable()
export class MultiImageValidatorPipe implements PipeTransform {
  async transform(value: Express.Multer.File[] | undefined) {
    if (!value || !Array.isArray(value)) {
      throw new BadRequestException(GENERAL_ERRORS.IMAGE_REQUIRED);
    }

    const validatedFiles: Express.Multer.File[] = [];

    for (const file of value) {
      const validated = (await this.singleImagePipe.transform(
        file,
      )) as Express.Multer.File;
      validatedFiles.push(validated);
    }

    return validatedFiles;
  }

  private readonly singleImagePipe = new ParseFilePipe({
    validators: [
      new MaxFileSizeValidator({
        maxSize: 1024 * 1024,
        message: 'Image is too large',
      }),
      new FileTypeValidator({
        fileType: /(jpg|jpeg|png)$/i,
      }),
    ],
  });
}
