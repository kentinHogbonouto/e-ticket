import { QuerySort } from "./query.enum";

export interface FindAllDto {
  sort?: QuerySort;
  page?: number;
  size?: number;
}
