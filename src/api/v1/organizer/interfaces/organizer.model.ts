import { Role } from "../../roles/interfaces/role.model";
import { PhoneNumber } from "../../../../interfaces/models/phone-number.interface";

export interface Organizer {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  password?: string;
  companyName: string;
  companyAddress: string;
  companyNumber: PhoneNumber;
  companyArea: string;
  role: Role;
  resetToken?: string;
  resetTokenExpiration?: Date;
  resetPasswordRequestId?: string;
}
