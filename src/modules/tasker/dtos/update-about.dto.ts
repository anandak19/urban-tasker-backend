import { TrimStringTransform } from '@core/transformers/trim-string.transformer';
import { Transform } from 'class-transformer';
import { IsNotEmpty, IsString } from 'class-validator';

export class UpdateAboutDto {
  @IsNotEmpty()
  @IsString()
  @Transform(TrimStringTransform)
  about: string;
}
