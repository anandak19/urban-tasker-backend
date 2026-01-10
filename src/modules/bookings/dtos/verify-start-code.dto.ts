import { IsEmpty } from 'class-validator';

export class VerifyStartCodeDto {
  @IsEmpty()
  code: string;
}
