import { Role } from "../../roles/interfaces/role.model";

export interface Organizer {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  role: Role;
  resetToken?: string;
  resetTokenExpiration?: Date;
  resetPasswordRequestId?: string;
  event?: string[];
}
