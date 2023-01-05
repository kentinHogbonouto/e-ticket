import { Role } from "../../api/v1/roles/interfaces/role.model";

export interface BaseModel {
  id: string;
  username: string;
  firstName: string;
  lastName: string;
  email: string;
  password?: string;
  role: Role;
  resetToken?: string;
  resetTokenExpiration?: Date;
  resetPasswordRequestId?: string;
}
