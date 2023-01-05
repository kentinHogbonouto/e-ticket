export interface CreateEventCouponDto {
  formuleQuantity: Number;
  event: string;
}

export interface UpdateEventCouponDto {
  id: string;
  availableSeats?: Number;
}
