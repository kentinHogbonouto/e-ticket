import { Schema, model, Document } from "mongoose";

import { Media } from "../interfaces/media.model";
import { MediaType } from "../interfaces/media.enum";

const MediaSchema = new Schema(
  {
    originalName: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      required: false,
    },
    bucket: {
      type: String,
      required: true,
      select: false,
    },
    key: {
      type: String,
      required: true,
      select: false,
    },
    url: {
      type: String,
      required: true,
    },
    type: {
      type: String,
      enum: MediaType,
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

export default model<Media & Document>("Media", MediaSchema);
