import { Role } from "../../../../roles/interfaces/role.model";
import { PhoneNumber } from "../../../../../../interfaces/models/phone-number.interface";

export interface UpdateOrganizerDto {
  id: string;
  lastName?: string;
  firstName?: string;
  companyName?: string;
  companyAddress?: string;
  companyNumber?: PhoneNumber;
  companyArea?: string;
  email?: string;
  category?: string;
  password?: string;
  resetPasswordRequestId?: string | undefined | null;
  role?: Role;
}

export interface CreateOrganizerDto {
  lastName: string;
  firstName: string;
  companyName: string;
  companyAddress: string;
  companyNumber: PhoneNumber;
  companyArea: string;
  email: string;
  password: string;
  role: Role;
}
