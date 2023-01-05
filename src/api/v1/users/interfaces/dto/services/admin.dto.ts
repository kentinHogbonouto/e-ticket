import { FindAllDto } from "../../../../../../interfaces/models/query.interface";

export interface IFindAllAdminsDto extends FindAllDto {}

export interface ICreateAdminDto {
  username: string;
  email: string;
  password: string;
  roleId: string;
}

export interface IUpdateAdminDto {
  id: string;
  username?: string;
  email?: string;
}

export interface IUpdateAdminRoleDto {
  id: string;
  roleId: string;
}

export interface IUpdateAdminPasswordDto {
  id: string;
  password: string;
  oldPassword: string;
}

export interface IResetAdminPasswordDto {
  id: string;
  password: string;
  resetPasswordRequestId: string | undefined | null;
}