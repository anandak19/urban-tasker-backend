import { BadRequestException, Injectable, PipeTransform } from '@nestjs/common';
import { GENERAL_ERRORS } from '@shared/constants/messages/error-messaes.constants';
import { isValidObjectId } from 'mongoose';

@Injectable()
export class ValidateIdPipe implements PipeTransform {
  transform(value: string) {
    if (!value || !isValidObjectId(value)) {
      throw new BadRequestException(GENERAL_ERRORS.INVALID_ID);
    }
    return value;
  }
}
