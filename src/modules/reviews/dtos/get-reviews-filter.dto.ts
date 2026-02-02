import { OmitType } from '@nestjs/mapped-types';
import { GetDocsDto } from '@shared/dtos/get-docs.dto';

export class GetReviewsFilterDto extends OmitType(GetDocsDto, ['search']) {}
