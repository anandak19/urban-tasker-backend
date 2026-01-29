import { OmitType } from '@nestjs/mapped-types';
import { GetDocsDto } from '@shared/dtos/get-docs.dto';
import { IsString } from 'class-validator';

export class GetReviewsFilterDto extends OmitType(GetDocsDto, [
  'search',
] as const) {
  @IsString()
  taskerId: string;
}
