import { ParseArrayTransformer } from '@core/transformers/parse-array.transformer';
import { TrimStringTransform } from '@core/transformers/trim-string.transformer';
import { Transform } from 'class-transformer';
import {
  ArrayMaxSize,
  ArrayMinSize,
  IsArray,
  IsNotEmpty,
  IsString,
} from 'class-validator';

export class CreateTaskerApplicationDto {
  @Transform(TrimStringTransform)
  @IsNotEmpty()
  firstName: string;

  @Transform(TrimStringTransform)
  @IsNotEmpty()
  lastName: string;

  @Transform(TrimStringTransform)
  @IsNotEmpty()
  hourlyRate: number;

  @Transform(TrimStringTransform)
  @IsNotEmpty()
  city: string;

  @IsArray()
  @Transform(ParseArrayTransformer)
  @ArrayMinSize(1)
  @ArrayMaxSize(10)
  workCategories: string[];

  @IsString()
  @IsNotEmpty()
  idProofType: string;
}
