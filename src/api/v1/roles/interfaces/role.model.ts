import { Admin } from "../../admins/interfaces/admin.model";
import { Organizer } from "../../organizer/interfaces/organizer.model";
import { Permission } from "../../permissions/interfaces/permission.model";

export interface Role {
  id: string;
  name: string;
  permissions: Array<Permission>;
  admins: Array<Admin>;
  organizer: Array<Organizer>;
}