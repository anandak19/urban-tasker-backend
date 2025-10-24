import { IsEmail, IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class sendEmailDto {
  @IsEmail()
  recipient: string;

  @IsNotEmpty()
  @IsString()
  subject: string;

  @IsNotEmpty()
  @IsString()
  html: string;

  @IsOptional()
  @IsString()
  text?: string;
}
