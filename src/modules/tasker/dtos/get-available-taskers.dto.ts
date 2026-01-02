import {
  IsString,
  IsDateString,
  IsNumber,
  IsInt,
  Min,
  Max,
} from 'class-validator';
import { Transform, Type } from 'class-transformer';
import { PickType } from '@nestjs/mapped-types';
import { GetDocsDto } from '@shared/dtos/get-docs.dto';
import { timeStringToMinutes } from '@core/transformers/trim-string.transformer';

export class GetAvailableTaskersQueryDto extends PickType(GetDocsDto, [
  'page',
  'limit',
]) {
  @IsString()
  city: string;

  @IsDateString()
  date: string;

  @Transform(timeStringToMinutes)
  @IsInt()
  @Min(0)
  @Max(1410)
  time: number;

  @IsString()
  subcategoryId: string;

  @Type(() => Number)
  @IsNumber()
  latitude: number;

  @Type(() => Number)
  @IsNumber()
  longitude: number;
}
