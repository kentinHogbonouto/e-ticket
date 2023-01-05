import { Schema, model, Document } from "mongoose";

import { Users } from "../interfaces/users.model";

const UsersSchema = new Schema(
  {
    lastName: {
      type: String,
      required: true,
    },
    firstName: {
      type: String,
      required: true,
    },
    email: {
      type: String,
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

export default model<Users & Document>("Users", UsersSchema);
