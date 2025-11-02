import { PaginationDto } from '@shared/dtos/pagination.dto';
import { IsOptional } from 'class-validator';

export class UserQueryDto extends PaginationDto {
  @IsOptional()
  search?: string;
}
