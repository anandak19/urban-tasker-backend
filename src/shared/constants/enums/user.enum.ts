export enum Gender {
  MALE = 'male',
  FEMALE = 'female',
  OTHER = 'other',
}

export enum UserRoles {
  USER = 'user',
  TASKER = 'tasker',
  ADMIN = 'admin',
}

export type NonUserRoles = Exclude<UserRoles, UserRoles.USER>;
