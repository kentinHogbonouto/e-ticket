import { FindAllDto } from "../../../../../../interfaces/models/query.interface";

export interface IFindAllOrganizerDto extends FindAllDto {}

export interface ICreateOrganizerDto {
  lastName: string;
  firstName: string;
  companyName: string;
  companyAddress: string;
  companyNumber: string;
  companyArea: string;
  email: string;
  password: string;
  roleId: string;
}

export interface IUpdateOrganizerDto {
  id: string;
  lastName?: string;
  firstName?: string;
  companyName?: string;
  companyAddress?: string;
  companyNumber?: string;
  companyArea?: string;
  email?: string;
}

export interface IUpdateOrganizerRoleDto {
  id: string;
  roleId: string;
}

export interface IUpdateOrganizerPasswordDto {
  id: string;
  password: string;
  oldPassword: string;
}

export interface IResetOrganizerPasswordDto {
  id: string;
  password: string;
  resetPasswordRequestId: string | undefined | null;
}
