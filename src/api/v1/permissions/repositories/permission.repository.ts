import { FilterQuery } from "mongoose";

import PermissionModel from "../models/permission.model";

import { Permission } from "../interfaces/permission.model";
import { QuerySort } from "../../../../interfaces/models/query.enum";
import {
  FindAllPermissionsDto,
  FindPermissionDto,
  UpdatePermissionDto,
} from "../interfaces/dto/repositories/permission.dto";

class PermissionRepository {
  public async countAll(): Promise<number> {
    return await this.count();
  }

  public async findAll(
    findAllPermissionsDto: FindAllPermissionsDto
  ): Promise<Permission[]> {
    if (findAllPermissionsDto.page && findAllPermissionsDto.size) {
      return await PermissionModel.find()
        .skip((findAllPermissionsDto.page - 1) * findAllPermissionsDto.size)
        .limit(findAllPermissionsDto.size)
        .select("+roles")
        .populate("roles")
        .sort({ createdAt: findAllPermissionsDto.sort as QuerySort });
    }
    return await PermissionModel.find()
      .select("+roles")
      .populate("roles")
      .sort({ createdAt: findAllPermissionsDto.sort as QuerySort });
  }

  public async findById({
    id,
    populatePermissions,
  }: FindPermissionDto): Promise<Permission | null> {
    if (populatePermissions) {
      return await PermissionModel.findById(id)
        .select("+roles")
        .populate("roles");
    }
    return await PermissionModel.findById(id);
  }

  public async create(name: string): Promise<Permission> {
    return await PermissionModel.create({
      name,
    });
  }

  // public async update({
  //   id,
  //   name,
  // }: UpdatePermissionDto): Promise<Permission | null> {
  //   const permission = await PermissionModel.findById(id);
  //   if (permission) return null;

  //   permission.name = name;
  //   return await permission.save();
  // }

  public async delete(id: string): Promise<Permission | null> {
    const permission = await PermissionModel.findById(id);

    if (!permission) return null;

    return await permission.remove();
  }

  private async findOne(
    query: FilterQuery<Permission>
  ): Promise<Permission | null> {
    return await PermissionModel.findOne(query);
  }

  private async count(query?: FilterQuery<Permission>): Promise<number> {
    if (query) {
      return await PermissionModel.countDocuments(query);
    }
    return await PermissionModel.countDocuments();
  }
}

export default PermissionRepository;
