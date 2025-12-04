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
    };
  }
}
