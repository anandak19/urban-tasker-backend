import { Transform } from 'class-transformer';
import { CreateCategoryDto } from './create-category.dto';
import { TrimStringTransform } from '@core/transformers/trim-string.transformer';
import { IsNotEmpty } from 'class-validator';
import { SUBCATEGORY_ERROR_MESSAGES } from '@shared/constants/messages/category-messages.constants';
import { PickType } from '@nestjs/mapped-types';

export class CreateSubCategoryDto extends PickType(CreateCategoryDto, [
  'name',
] as const) {
  @Transform(TrimStringTransform)
  @IsNotEmpty({ message: SUBCATEGORY_ERROR_MESSAGES.DESCRIPTION_REQUIRED })
  description: string;
}
