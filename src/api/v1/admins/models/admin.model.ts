import { Schema, model, Document } from "mongoose";

import { Admin } from "../interfaces/admin.model";

const AdminSchema = new Schema(
  {
    username: {
      type: String,
      unique: true,
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

export default model<Admin & Document>("Admin", AdminSchema);
