export interface UserModel {
  id: number;
  username: string;
  firstName: string;
  lastName: string;
  role: UserRole;
  registrationDate: Date;
  lastLoginDate: Date;
}

export enum UserRole {
  ADMIN = 'ADMIN',
  TECHNOLOG = 'TECHNOLOG',
  OPERATOR = 'OPERATOR',
}
