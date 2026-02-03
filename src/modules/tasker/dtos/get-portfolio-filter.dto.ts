import { OmitType } from '@nestjs/mapped-types';
import { GetDocsDto } from '@shared/dtos/get-docs.dto';

export class GetPortfolioFilterDto extends OmitType(GetDocsDto, ['search']) {}
