import { PickType } from '@nestjs/mapped-types';
import { UserResponseDto } from './user-response.dto';

export class BasicUserResponseDto extends PickType(UserResponseDto, [
  'id',
  'email',
  'userRole',
  'firstName',
  'lastName',
  'profileImageUrl',
] as const) {}
