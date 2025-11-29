import {
  FileTypeValidator,
  MaxFileSizeValidator,
  ParseFilePipe,
} from '@nestjs/common';

import { GENERAL_ERRORS } from '@shared/constants/messages/error-messaes.constants';

const imageValidators = [
  new MaxFileSizeValidator({
    maxSize: 1024 * 1024,
    message: GENERAL_ERRORS.IMAGE_LARGE,
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
