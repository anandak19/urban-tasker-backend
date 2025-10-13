import { IsEmail, IsNotEmpty, IsPhoneNumber, IsString } from 'class-validator';

export class BasicUserDto {
  @IsNotEmpty({ message: 'First name is required' })
  @IsString()
  firstName: string;

  @IsString()
  @IsNotEmpty()
  lastName: string;

  @IsEmail()
  @IsNotEmpty()
  email: string;

  @IsPhoneNumber('IN')
  @IsNotEmpty()
  phone: string;
}
