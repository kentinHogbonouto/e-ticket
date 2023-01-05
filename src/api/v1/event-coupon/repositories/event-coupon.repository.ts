import { FilterQuery } from "mongoose";

import EventCouponModel from "../models/event-coupon.model";

import {
  CreateEventCouponDto,
  UpdateEventCouponDto,
} from "../interfaces/dto/repositories/event-coupon.dto";
import { IFindAllEventCouponDto } from "../interfaces/dto/services/event-coupon.dto";
import { EventCoupon } from "../interfaces/event-coupon.model";

import { QuerySort } from "../../../../interfaces/models/query.enum";

export default class EventCouponRepository {
  public async countAll(): Promise<number> {
    return await this.count();
  }

  public async findAll(
    iFindAllEventCouponDto: IFindAllEventCouponDto
  ): Promise<EventCoupon[]> {
    if (iFindAllEventCouponDto.page && iFindAllEventCouponDto.size) {
      return await EventCouponModel.find()
        .skip((iFindAllEventCouponDto.page - 1) * iFindAllEventCouponDto.size)
        .limit(iFindAllEventCouponDto.size)
        .sort({ createdAt: iFindAllEventCouponDto.sort as QuerySort });
    }
    return await EventCouponModel.find().sort({
      createdAt: iFindAllEventCouponDto.sort as QuerySort,
    });
  }

  public async findById(id: string): Promise<EventCoupon | null> {
    return await EventCouponModel.findById(id)
      .select("+event")
      .populate({ path: "event", select: "+organizer", populate: "organizer" });
  }

  public async create(
    createEventCouponDto: CreateEventCouponDto
  ): Promise<EventCoupon> {
    return await EventCouponModel.create({
      formuleQuantity: createEventCouponDto.formuleQuantity,
      event: createEventCouponDto.event,
    });
  }

  public async delete(id: string): Promise<EventCoupon | null> {
    const eventCoupon = await EventCouponModel.findById(id);
    if (!eventCoupon) return null;

    return await eventCoupon.remove();
  }

  public async update(
    updateEventCouponDto: UpdateEventCouponDto
  ): Promise<EventCoupon | null> {
    const eventCoupon = await EventCouponModel.findById(
      updateEventCouponDto.id
    );
    if (!eventCoupon) return null;

    if (updateEventCouponDto.availableSeats)
      eventCoupon.availableSeats = updateEventCouponDto.availableSeats;

    return await eventCoupon.save();
  }

  private async count(query?: FilterQuery<EventCoupon>): Promise<number> {
    if (query) {
      return await EventCouponModel.countDocuments(query);
    }
    return await EventCouponModel.countDocuments();
  }
  
}
