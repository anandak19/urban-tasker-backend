import { IsString } from 'class-validator';

export class VerifyStartCodeDto {
  @IsString()
  code: string;
}
