import { UserRoles } from '@shared/constants/enums/user.enum';

export interface IPayload {
  id: string;
  email: string;
  userRole: UserRoles;
}

export interface ITokens {
  accessToken: string;
  refreshToken: string;
}

export interface IGoogleUserAuthData {
  firstName: string;
  lastName: string;
  email: string;
  googleProfilePic: string;
}
