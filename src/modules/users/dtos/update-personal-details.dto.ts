import { PickType } from '@nestjs/mapped-types';
import { CreateUserDto } from './create-user.dto';
import { IsNotEmpty, IsString } from 'class-validator';
import { Gender } from '@shared/constants/enums/user.enum';

export class UpdatePersonalDetailsDto extends PickType(CreateUserDto, [
  'firstName',
  'lastName',
  'phone',
] as const) {
  @IsString()
  @IsNotEmpty()
  gender: Gender;
}
