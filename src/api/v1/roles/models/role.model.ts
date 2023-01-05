import { Schema, model, Document } from "mongoose";

import SchemaOptionsConfigs from "./schemas/options.configs";

import { Role } from "../interfaces/role.model";

const RoleSchema = new Schema(
  {
    name: {
      type: String,
      required: true,
    },
    permissions: {
      type: [
        {
          type: Schema.Types.ObjectId,
          ref: "Permission",
        },
      ],
      select: false,
    },
    admins: {
      type: [
        {
          type: Schema.Types.ObjectId,
          ref: "Admin",
        },
      ],
      select: false,
    },
    organizer: {
      type: [
        {
          type: Schema.Types.ObjectId,
          ref: "Organizer",
        },
      ],
      select: false,
    }
  },
  SchemaOptionsConfigs
);

export default model<Role & Document>("Role", RoleSchema);
