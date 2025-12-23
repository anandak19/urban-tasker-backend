import {
  IsDateString,
  IsEnum,
  IsString,
  ValidateNested,
} from 'class-validator';
import { Type } from 'class-transformer';
import { LocationDto } from './location.dto';
import { TaskSize } from '@shared/constants/enums/task.enum';

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

  @IsString()
  time: string;

  @IsString()
  city: string;

  @IsString()
  address: string;

  // Location (nested)
  @ValidateNested()
  @Type(() => LocationDto)
  location: LocationDto;

  // Tasker
  @IsString()
  taskerId: string;
}
