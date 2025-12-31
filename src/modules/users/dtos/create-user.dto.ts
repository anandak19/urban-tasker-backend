import { TrimStringTransform } from '@core/transformers/trim-string.transformer';
import { Transform } from 'class-transformer';
import { IsEmail, IsNotEmpty, IsPhoneNumber, IsString } from 'class-validator';

export class CreateUserDto {
  @IsNotEmpty({ message: 'First name is required' })
  @IsString()
  @Transform(TrimStringTransform)
  firstName: string;

  @IsNotEmpty()
  @IsString()
  @Transform(TrimStringTransform)
  lastName: string;

  @IsNotEmpty()
  @IsEmail()
  @Transform(TrimStringTransform)
  email: string;

  @IsPhoneNumber('IN')
  @IsNotEmpty()
  @Transform(TrimStringTransform)
  phone: string;

  @IsString()
  @IsNotEmpty()
  password: string;
}
