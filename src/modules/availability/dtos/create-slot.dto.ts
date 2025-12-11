import { IsString } from 'class-validator';

export class CreateSlotDto {
  @IsString()
  start!: string;

  @IsString()
  end!: string;
}
