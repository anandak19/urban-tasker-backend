import { IsNotEmpty, IsString } from 'class-validator';

export class DeleteSlotDto {
  @IsString()
  @IsNotEmpty()
  start!: string;

  @IsString()
  @IsNotEmpty()
  end!: string;
}
