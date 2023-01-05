import { FindAllDto } from "../../../../../../interfaces/models/query.interface";

export interface IFindAllEventDto extends FindAllDto {}

export interface IFindEventDto {
  name: string;
  shortDescription: string;
  type: string;
  theme: string;
  categorie: string;
  place: string;
  startDate: Date;
  startTime: Date;
  endDate: Date;
  endTime: Date;
}

export interface ICreateEventDto {
  name: string;
  shortDescription?: string;
  type: string;
  theme: string;
  categorie: string;
  place: string;
  startDate: Date;
  startTime: Date;
  endDate: Date;
  endTime: Date;
  organizerId: string;
}

export interface IUpdateEventDto {
  id: string;
  name: string;
  shortDescription?: string;
  type: string;
  theme: string;
  categorie: string;
  place: string;
  startDate: Date;
  startTime: Date;
  endDate: Date;
  endTime: Date;
}
