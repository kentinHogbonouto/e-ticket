import { Schema, model, Document } from "mongoose";

import { Organizer } from "../interfaces/organizer.model";

import PhoneNumberSchema from "./phone-number.schema";

const OrganizerSchema = new Schema(
  {
    lastName: {
      type: String,
      unique: false,
      required: true,
    },
    firstName: {
      type: String,
      unique: false,
      required: true,
    },
    email: {
      type: String,
      unique: true,
      required: true,
    },
    password: {
      type: String,
      required: true,
      select: false,
    },
    resetToken: {
      type: String,
      select: false,
    },
    event: {
      type: [Schema.Types.ObjectId],
      ref: "Event",
      required: false,
      select: false,
    },
    resetTokenExpiration: {
      type: Date,
      select: false,
    },
    resetPasswordRequestId: {
      type: String,
      select: false,
    },
    role: {
      type: Schema.Types.ObjectId,
      ref: "Role",
      select: false,
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

export default model<Organizer & Document>("Organizer", OrganizerSchema);
