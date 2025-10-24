import { OmitType } from '@nestjs/mapped-types';
import { CreateUserDto } from './create-user.dto';
import { UserRoles } from '@shared/constants/enums/user.enum';

export class UserResponseDto extends OmitType(CreateUserDto, ['password']) {
  id: string;
  userRole: UserRoles;
  isTaskerApplied: boolean;
}
