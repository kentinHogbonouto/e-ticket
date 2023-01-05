import { FindAllDto } from "../../../../../../interfaces/models/query.interface";

export interface IFindAllUsersDto extends FindAllDto {}

export interface ICreateUsersDto {
  lastName: string;
  firstName: string;
  email: string;
  password: string;
  roleId: string;
}

export interface IUpdateUsersDto {
  id: string;
  lastName?: string;
  firstName?: string;
  email?: string;
  password?: string;
}

export interface IUpdateUsersRoleDto {
  id: string;
  roleId: string;
}

export interface IUpdateUsersPasswordDto {
  id: string;
  password: string;
  oldPassword: string;
}

export interface IResetUsersPasswordDto {
  id: string;
  password: string;
  resetPasswordRequestId: string | undefined | null;
}