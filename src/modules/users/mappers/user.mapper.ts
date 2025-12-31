import { BasicUserResponseDto } from '../dtos/basic-user-response.dto';
import { UserResponseDto } from '../dtos/user-response.dto';
import { UserDocument } from '../schemas/user.schema';

export class UserMapper {
  // convert mongoose doc --> response dto(plain object)
  static toResponse(userDoc: UserDocument): UserResponseDto {
    return {
      id: userDoc._id.toString(),
      firstName: userDoc.firstName,
      lastName: userDoc.lastName,
      email: userDoc.email,
      phone: userDoc.phone ?? '',
      userRole: userDoc.userRole,
      isTaskerApplied: userDoc.isTaskerApplied,
      isSuspended: userDoc.isSuspended,
      suspendedReason: userDoc.suspendedReason,
      profileImageUrl: userDoc?.profileImage?.value ?? '',
      gender: userDoc.gender,
      homeAddress: userDoc.homeAddress,
    };
  }

  static toBasicResponse(userDoc: UserDocument): BasicUserResponseDto {
    return {
      id: userDoc._id.toString(),
      firstName: userDoc.firstName,
      lastName: userDoc.lastName,
      email: userDoc.email,
      userRole: userDoc.userRole,
      profileImageUrl: userDoc?.profileImage?.value,
    };
  }
}
