import { FindAllDto } from "../../../../../../interfaces/models/query.interface";

export interface FindAllRolesDto extends FindAllDto {}

export interface FindRoleDto {
  id: string;
  populatePermissions?: boolean;
  deepPopulatePermissions?: boolean;
}

export interface UpdateRoleDto {
  id: string;
  name: string;
}
