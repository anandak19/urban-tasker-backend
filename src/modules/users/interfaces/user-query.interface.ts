import { UserRoles } from '@shared/constants/enums/user.enum';

export interface IUserFilter {
  // search can be firstname or lastName
  search?: string;
  role?: UserRoles;
}
