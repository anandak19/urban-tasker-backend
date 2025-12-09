import { IsBoolean } from 'class-validator';

export class ChangeSlotStatusDto {
  @IsBoolean()
  isDisabled: boolean;
}
