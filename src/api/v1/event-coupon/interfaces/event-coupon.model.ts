import { Event } from "../../events/interfaces/event.model";

export interface EventCoupon {
  formuleQuantity: Number;
  event: Event;
  availableSeats: Number;
}
