import { IsNotEmpty } from 'class-validator';

export class ChangeIsActiveDto {
  @IsNotEmpty()
  isActive: boolean;
}
