import { TrimStringTransform } from '@core/transformers/trim-string.transformer';
import { CATEGORY_ERROR_MESSAGES } from '@shared/constants/messages/category-messages.constants';
import { Transform } from 'class-transformer';
import { IsNotEmpty } from 'class-validator';

export class CreateCategoryDto {
  @Transform(TrimStringTransform)
  @IsNotEmpty({ message: CATEGORY_ERROR_MESSAGES.NAME_REQUIRED })
  readonly name: string;
}
