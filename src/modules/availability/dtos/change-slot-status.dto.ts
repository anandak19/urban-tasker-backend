import { IsBoolean } from 'class-validator';

export class ChangeSlotStatusDto {
  @IsBoolean()
  isActive: boolean;
}
