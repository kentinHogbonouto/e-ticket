import { FindAllDto } from "../../../../../../interfaces/models/query.interface";

export interface IFindAllEventCouponDto extends FindAllDto {}

export interface IFindEventCouponDto {
  formuleQuantity: Number;
  availableSeats?: Number;
}

export interface ICreateEventCouponDto {
  formuleQuantity: Number;
  event: string;
}

export interface IUpdateEventCouponDto {
  id: string;
  availableSeats: Number;
}
