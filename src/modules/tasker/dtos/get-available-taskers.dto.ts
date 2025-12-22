import { IsString, IsDateString, IsNumber } from 'class-validator';
import { Type } from 'class-transformer';
import { PickType } from '@nestjs/mapped-types';
import { GetDocsDto } from '@shared/dtos/get-docs.dto';

export class GetAvailableTaskersQueryDto extends PickType(GetDocsDto, [
  'page',
  'limit',
]) {
  @IsString()
  city: string;

  @IsDateString()
  date: string;

  @IsString()
  time: string;

  @IsString()
  subcategoryId: string;

  @Type(() => Number)
  @IsNumber()
  latitude: number;

  @Type(() => Number)
  @IsNumber()
  longitude: number;
}
