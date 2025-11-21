import {
  FileTypeValidator,
  MaxFileSizeValidator,
  ParseFilePipe,
} from '@nestjs/common';
import { CATEGORY_ERROR_MESSAGES } from '@shared/constants/messages/category-messages.constants';

const imageValidators = [
  new MaxFileSizeValidator({
    maxSize: 1024 * 1024,
    message: CATEGORY_ERROR_MESSAGES.IMAGE_LARGE,
  }),

  new FileTypeValidator({
    fileType: /(jpg|jpeg|png)$/,
  }),
];

export const ImageValidationPipe = new ParseFilePipe({
  validators: imageValidators,
});

export const OptionalImageValidationPipe = new ParseFilePipe({
  fileIsRequired: false,
  validators: imageValidators,
});
