import { model, Schema, Document } from "mongoose";

import { EventCoupon } from "../interfaces/event-coupon.model";

const CouponSchema = new Schema(
  {
    formuleQuantity: {
      type: Number,
      required: true,
    },
    availableSeats: {
      type: Number,
      required: false,
    },
    event: {
      type: Schema.Types.ObjectId,
      select: true,
      required: true,
      ref: "Event"
    },
  },
  {
    timestamps: true,
    toJSON: {
      virtuals: true,
      versionKey: false,
      transform: function (doc: any, ret: any) {
        delete ret._id;
      },
    },
  }
);

export default model<EventCoupon & Document>("Coupon", CouponSchema);
