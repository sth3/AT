export interface BasicUserModel {
  id: number;
  username: string;
  firstName: string;
  lastName: string;
  role: UserRole;
}


export interface UserModel extends BasicUserModel{
  registrationDate: Date;
  lastLoginDate: Date;
  token: string;
}

export enum UserRole {
  ADMIN = 'ADMIN',
  TECHNOLOG = 'TECHNOLOG',
  OPERATOR = 'OPERATOR',
}
