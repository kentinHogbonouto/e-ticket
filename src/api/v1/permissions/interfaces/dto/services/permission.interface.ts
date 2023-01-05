import { FindAllDto } from "../../../../../../interfaces/models/query.interface";

export interface IFindAllPermissionsDto extends FindAllDto {}

export interface ICreatePermissionsDto {
  name: string
}

export interface IUpdatePermissionsDto {
  id: string;
  name?: string
}
