import {
  IsEmail,
  IsEnum,
  IsNotEmpty,
  IsPhoneNumber,
  IsString,
} from 'class-validator';
import { Gender } from 'src/common/enums/gender.enum';

export class CreateUserDto {
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

  @IsEnum(Gender)
  @IsNotEmpty()
  gender: string;

  @IsString()
  @IsNotEmpty()
  password: string;
}
