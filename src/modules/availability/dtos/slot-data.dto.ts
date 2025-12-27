import { timeStringToMinutes } from '@core/transformers/trim-string.transformer';
import { Transform } from 'class-transformer';
import { IsInt, Max, Min } from 'class-validator';

export class SlotDataDto {
  @IsInt()
  @Min(1)
  @Max(7)
  day: number;

  @Transform(timeStringToMinutes)
  @IsInt()
  @Min(0)
  @Max(1410)
  start!: number;

  @Transform(timeStringToMinutes)
  @IsInt()
  @Min(30)
  @Max(1440)
  end!: number;
}
