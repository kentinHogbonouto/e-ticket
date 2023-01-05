import { Organizer } from "../../organizer/interfaces/organizer.model";
import { Events } from "../../events/interfaces/event.model";

export interface EventCoupon {
  formuleQuantity: Number;
  event: Events;
  availableSeats: Number;
}
