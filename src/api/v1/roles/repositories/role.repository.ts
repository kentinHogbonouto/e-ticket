import { FilterQuery } from "mongoose";

import RoleModel from "../models/role.model";

import {
  FindRoleDto,
  UpdateRoleDto,
  FindAllRolesDto,
} from "../interfaces/dto/repositories/role.dto";
import { Role } from "../interfaces/role.model";
import { QuerySort } from "../../../../interfaces/models/query.enum";

export default class RoleRepository {
  public async countAll(): Promise<number> {
    return await this.count();
  }

  public async findAll({ size, page, sort }: FindAllRolesDto): Promise<Role[]> {
    if (page && size) {
      return await RoleModel.find()
        .skip((page - 1) * size)
        .limit(size)
        .select("+permissions")
        .populate("permissions")
        .sort({ createdAt: sort as QuerySort });
    }
    return await RoleModel.find()
      .select("+permissions")
      .populate("permissions")
      .sort({ createdAt: sort as QuerySort });
  }

  public async findById(findRoleDto: FindRoleDto): Promise<Role | null> {
    if (findRoleDto.populatePermissions) {
      return await RoleModel.findById(findRoleDto.id)
        .select("+permissions")
        .populate("permissions");
    }
    if (findRoleDto.deepPopulatePermissions) {
      return await RoleModel.findById(findRoleDto.id)
        .select("+permissions")
        .populate({
          path: "permissions",
          populate: { path: "roles", model: "Role" },
        });
    }
    return await RoleModel.findById(findRoleDto.id);
  }

  public async create(name: string): Promise<Role> {
    return await RoleModel.create({
      name,
    });
  }

  public async update(updateRoleDto: UpdateRoleDto): Promise<Role | null> {
    const role = await RoleModel.findById(updateRoleDto.id);
    if (!role) return null;

    role.name = updateRoleDto.name;
    return await role.save();
  }

  public async delete(findRoleDto: FindRoleDto): Promise<Role | null> {
    const role = await RoleModel.findById(findRoleDto.id);
    if (!role) return null;

    return await role.remove();
  }

  public async addPermissions(
    id: string,
    permissionsIds: string[]
  ): Promise<Role | null> {
    const role = await RoleModel.findById(id).select("+permissions");
    if (!role) return null;

    permissionsIds.forEach((permissionId: any) => {
      const index = role.permissions.findIndex((permission: any) => {
        return permission.toString() === permissionId.toString();
      });
      if (index === -1) {
        role.permissions.push(permissionId);
      }
    });
    return role.save();
  }

  public async removePermissions(
    id: string,
    permissionsIds: string[]
  ): Promise<Role | null> {
    const role: any = await RoleModel.findById(id).select("+permissions");
    if (!role) return null;

    permissionsIds.forEach((permissionId: any) => {
      role.permissions.pull(permissionId);
    });
    return role.save();
  }

  public async addAdmins(
    id: string,
    adminsIds: string[]
  ): Promise<Role | null> {
    const role = await RoleModel.findById(id).select("+admins");
    if (!role) return null;

    adminsIds.forEach((adminId: any) => {
      const index = role.admins.findIndex((admin: any) => {
        return admin.toString() === adminId.toString();
      });
      if (index === -1) {
        role.admins.push(adminId);
      }
    });
    return await role.save();
  }

  public async removeAdmins(
    id: string,
    adminsIds: string[]
  ): Promise<Role | null> {
    const role: any = await RoleModel.findById(id).select("+admins");
    if (!role) return null;

    adminsIds.forEach((adminId: any) => {
      role.admins.pull(adminId);
    });
    return await role.save();
  }
  
  public async addOrganizer(
    id: string,
    organizerIds: string[]
  ): Promise<Role | null> {
    const role = await RoleModel.findById(id).select("+organizer");
    if (!role) return null;

    organizerIds.forEach((organizerId: any) => {
      const index = role.organizer.findIndex((organizer: any) => {
        return organizer.toString() === organizerId.toString();
      });
      if (index === -1) {
        role.organizer.push(organizerId);
      }
    });
    return await role.save();
  }

  public async removeOrganizer(
    id: string,
    organizerIds: string[]
  ): Promise<Role | null> {
    const role: any = await RoleModel.findById(id).select("+organizer");
    if (!role) return null;

    organizerIds.forEach((organizerId: any) => {
      role.organizer.pull(organizerId);
    });
    return await role.save();
  }

  private async count(query?: FilterQuery<Role>): Promise<number> {
    if (query) {
      return await RoleModel.countDocuments(query);
    }
    return await RoleModel.countDocuments();
  }
  
}
