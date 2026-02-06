import { OmitType } from '@nestjs/mapped-types';
import { CreateUserDto } from './create-user.dto';
import { Gender, UserRoles } from '@shared/constants/enums/user.enum';
import { IHomeAddress } from '../interfaces/user.interface';

export class UserResponseDto extends OmitType(CreateUserDto, ['password']) {
  id: string;
  userRole: UserRoles;
  isTaskerApplied: boolean;
  isSuspended: boolean;
  suspendedReason: string;
  profileImageUrl: string;
  gender?: Gender;
  homeAddress?: IHomeAddress;
}
