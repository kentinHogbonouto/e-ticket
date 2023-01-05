import { Schema, model, Document } from "mongoose";

import SchemaOptionsConfigs from "./schemas/options.configs";

import { Permission } from "../interfaces/permission.model";

const PermissionSchema = new Schema(
  {
    name: {
      type: String,
      required: true,
    },
    roles: {
      type: [
        {
          type: Schema.Types.ObjectId,
          ref: "Role",
        },
      ],
      select: false,
    },
  },
  SchemaOptionsConfigs
);

PermissionSchema.methods.pullFromRoles = function () {
  for (let index = 0; index < this.roles.length; index++) {
    const role = this.roles[index];
    role.permissions.pull(this._id.toString());
    role.save();
  }
  return this.save();
};

export default model<Permission & Document>("Permission", PermissionSchema);
