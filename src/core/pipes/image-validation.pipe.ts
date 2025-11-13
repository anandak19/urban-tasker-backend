import {
  FileTypeValidator,
  MaxFileSizeValidator,
  ParseFilePipe,
} from '@nestjs/common';
import { CATEGORY_ERROR_MESSAGES } from '@shared/constants/messages/category-messages.constants';

export const ImageValidationPipe = new ParseFilePipe({
  validators: [
    new MaxFileSizeValidator({
      maxSize: 1024 * 1024,
      message: CATEGORY_ERROR_MESSAGES.IMAGE_LARGE,
    }),

    new FileTypeValidator({
      fileType: /(jpg|jpeg|png)$/,
    }),
  ],
});
