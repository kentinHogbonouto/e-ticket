import { FindAllDto } from "../../../../../../interfaces/models/query.interface";

export interface FindAllPermissionsDto extends FindAllDto {}

export interface FindPermissionDto {
  id: string;
  populatePermissions?: boolean;
}

export interface UpdatePermissionDto {
  id: string;
  name?: string;
}

export interface CreatePermissionDto {
  id: string;
  name?: string;
}
