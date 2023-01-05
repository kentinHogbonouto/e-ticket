import { Organizer } from "../../../../organizer/interfaces/organizer.model";

export interface CreateEventDto {
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
  organizer: string;
}

export interface UpdateEventDto {
  id: string;
  name?: string;
  shortDescription?: string;
  type?: string;
  theme?: string;
  categorie?: string;
  place?: string;
  startDate?: Date;
  startTime?: Date;
  endDate?: Date;
  endTime?: Date;
}
