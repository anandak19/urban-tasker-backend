import { IsNotEmpty } from 'class-validator';

export class SuspendUserDto {
  @IsNotEmpty()
  suspendedReason: string;
}
