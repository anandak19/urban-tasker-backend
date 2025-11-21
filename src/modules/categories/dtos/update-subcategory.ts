import { PartialType } from '@nestjs/mapped-types';
import { CreateSubCategoryDto } from './create-subcategory.dto';

export class UpdateSubCategory extends PartialType(CreateSubCategoryDto) {}
