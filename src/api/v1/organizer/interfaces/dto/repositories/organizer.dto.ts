import { Role } from "../../../../roles/interfaces/role.model";

export interface UpdateOrganizerDto {
  id: string;
  lastName?: string;
  firstName?: string;
  email?: string;
  password?: string;
  resetPasswordRequestId?: string | undefined | null;
  role?: Role;
}

export interface CreateOrganizerDto {
  lastName: string;
  firstName: string;
  email: string;
  password: string;
  role: string;
}
