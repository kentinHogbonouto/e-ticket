import { Role } from "../../../../roles/interfaces/role.model";

export interface CreateUsersDto {
  lastName: string;
  firstName: string;
  email: string;
  password: string;
  role: string;
}

export interface UpdateUsersDto {
  id: string;
  lastName?: string;
  firstName?: string;
  email?: string;
  password?: string;
  resetPasswordRequestId?: string | undefined | null;
  role?: Role;
}


