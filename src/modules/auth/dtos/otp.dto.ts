import { IsNotEmpty } from 'class-validator';

export class PasswordDto {
  @IsNotEmpty()
  otp: string;
}
