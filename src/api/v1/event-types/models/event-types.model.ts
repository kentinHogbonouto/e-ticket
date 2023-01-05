import { model, Schema, Document } from "mongoose";

import { EventTypes } from "../interfaces/event-types.model";

const EventTypesSchema = new Schema(
  {
    name: {
      type: String,
      required: true,
    }
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

export default model<EventTypes & Document>("eventTypes", EventTypesSchema);
