import { FindAllDto } from "../../../../../../interfaces/models/query.interface";

export interface IFindAllEventTypesDto extends FindAllDto {}

export interface IFindEventTypesDto {
  name: string;
}

export interface ICreateEventTypesDto {
  name: string;
}

export interface IUpdateEventTypesDto {
  id: string
  name: string;
}
