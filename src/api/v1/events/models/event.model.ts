import { model, Schema, Document } from "mongoose";

import { Event } from "../interfaces/event.model";

const EventSchema = new Schema(
  {
    name: {
      type: String,
      required: true,
    },
    shortDescription: {
      type: String,
      required: false,
    },
    type: {
      type: String,
      required: true,
    },
    theme: {
      type: String,
      required: true,
    },
    categorie: {
      type: String,
      required: true,
    },
    place: {
      type: String,
      required: true,
    },
    startDate: {
      type: String,
      required: true,
    },
    startTime: {
      type: String /**DO TO cast to right type later */,
      required: true,
    },
    endDate: {
      type: String /**DO TO cast to right type later */,
      required: true,
    },
    endTime: {
      type: String /**DO TO cast to right type later */,
      required: true,
    },
    cover: {
      type: String /**DO TO cast to right type later */,
      required: false,
    },
    organizer: {
      type: Schema.Types.ObjectId,
      ref: "Organizer",
      select: true,
      required: true,
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

export default model<Event & Document>("Event", EventSchema);
