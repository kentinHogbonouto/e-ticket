import createHttpError from "http-errors";

import PermissionRepository from "../repositories/permission.repository";

import { Permission } from "../interfaces/permission.model";
import { IFindAllPermissionsDto } from "../interfaces/dto/services/permission.interface";

import { PermissionValidationMessage } from "../validations/permission.validations";

export default class PermissionService {
  constructor(private permissionRepository: PermissionRepository) {}

  /**
   * @function findAll
   * @description Get the list of all permissions
   * @param iFindAllPermissionsDto List sorted by asc, number of page and document size
   * @return Promise<{ permissions: Permission[]; totalElements: number; }>
   */
  public async findAll(
    iFindAllPermissionsDto: IFindAllPermissionsDto
  ): Promise<{ permissions: Permission[]; totalElements: number }> {
    let permissions: Permission[] = [];

    let totalElements = await this.permissionRepository.countAll();

    if (iFindAllPermissionsDto.size === -1) {
      permissions = await this.permissionRepository.findAll({
        sort: iFindAllPermissionsDto.sort,
      });
    } else {
      permissions = await this.permissionRepository.findAll({
        size: iFindAllPermissionsDto.size,
        page: iFindAllPermissionsDto.page,
        sort: iFindAllPermissionsDto.sort,
      });
    }

    return { permissions, totalElements };
  }

  /**
   * @function findOne
   * @description Get permission data by id
   * @param id The permission id
   * @return Promise<Permission>
   */
  public async findOne(id: string): Promise<Permission> {
    let permission = await this.permissionRepository.findById({
      id,
    });
    if (!permission) {
      throw new createHttpError.NotFound(PermissionValidationMessage.NOT_FOUND);
    }

    return permission;
  }

  /**
   * @function create
   * @description Create a permission
   * @param name The permission name
   * @return Promise<Permission>
   */
  public async create(name: string): Promise<Permission> {
    return await this.permissionRepository.create(name);
  }

  /**
   * @function create:
   * @description Update a permission
   * @param id The permission id
   * @param name The permission name
   * @return Promise<Permission>
   */
  // public async update(id: string, name: string): Promise<Permission> {
  //   let permission = await this.permissionRepository.update({
  //     id,
  //     name,
  //   });

  //   if (!permission) {
  //     throw new createHttpError.NotFound(PermissionValidationMessage.NOT_FOUND);
  //   }

  //   return permission;
  // }

  /**
   * @function delete
   * @description Function that delete a permission
   * @param id The permission id
   * @return Promise<Permission>
   */
  public async delete(id: string): Promise<void> {
    let permission = await this.permissionRepository.delete(id);

    if (!permission) {
      throw new createHttpError.NotFound(PermissionValidationMessage.NOT_FOUND);
    }

    return;
  }
}
