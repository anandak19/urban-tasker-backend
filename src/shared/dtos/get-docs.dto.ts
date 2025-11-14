import { TrimStringTransform } from '@core/transformers/trim-string.transformer';
import { Transform, Type } from 'class-transformer';
import { IsOptional, Max, Min } from 'class-validator';

export class GetDocsDto {
  @IsOptional()
  @Type(() => Number)
  @Min(1)
  page?: number = 1;

  @IsOptional()
  @Type(() => Number)
  @Min(1)
  @Max(20)
  limit?: number = 10;

  @IsOptional()
  @Transform(TrimStringTransform)
  search?: string;
}
