import {
  IsDateString,
  IsEnum,
  IsInt,
  IsString,
  Max,
  Min,
  ValidateNested,
} from 'class-validator';
import { Transform, Type } from 'class-transformer';
import { LocationDto } from './location.dto';
import { TaskSize } from '@shared/constants/enums/task.enum';
import { timeStringToMinutes } from '@core/transformers/trim-string.transformer';

export class CreateBookingDto {
  // About task
  @IsString()
  categoryId: string;

  @IsString()
  subcategoryId: string;

  @IsString()
  description: string;

  @IsEnum(TaskSize)
  taskSize: TaskSize;

  // Time & place
  @IsDateString()
  date: string;

  @Transform(timeStringToMinutes) // convert hh:mm to minutes
  @IsInt()
  @Min(0)
  @Max(1410)
  time: number;

  @IsString()
  city: string;

  // Location (nested)
  @ValidateNested()
  @Type(() => LocationDto)
  location: LocationDto;

  // Tasker
  @IsString()
  taskerId: string;
}
