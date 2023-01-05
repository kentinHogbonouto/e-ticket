import { Role } from "../../roles/interfaces/role.model";

export interface Permission {
  name: string;
  roles: Array<Role>;
}
