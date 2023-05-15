import { Organizer } from "../../organizer/interfaces/organizer.model";

export interface Event {
  id: string;
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
  organizer: Organizer;
  cover: string | undefined;
}
