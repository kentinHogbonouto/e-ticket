import createHttpError from "http-errors";

import RoleRepository from "../repositories/role.repository";

import { Role } from "../interfaces/role.model";
import { FindAllRolesDto } from "../interfaces/dto/repositories/role.dto";

import { RoleValidationMessages } from "../validations/role.validation";

export default class RoleService {
  constructor(private roleRepository: RoleRepository) {}

  /**
   * @function findAll
   * @description Get the list of the roles
   * @param findAllRolesDto:  list sorted by asc, number of page and size of document
   * @return Promise<{ roles: Role[]; totalElements: number; }>
   */
  public async findAll(
    findAllRolesDto: FindAllRolesDto
  ): Promise<{ roles: Role[]; totalElements: number }> {
    let roles: Role[] = [];

    let totalElements = await this.roleRepository.countAll();

    if (findAllRolesDto.size === -1) {
      roles = await this.roleRepository.findAll({ sort: findAllRolesDto.sort });
    } else {
      roles = await this.roleRepository.findAll({
        size: findAllRolesDto.size,
        sort: findAllRolesDto.sort,
        page: findAllRolesDto.page,
      });
    }

    return { roles, totalElements };
  }

  /**
   * @function findOne
   * @description A function that return a specific role
   * @param id The id of the role.
   * @return Promise<Role>
   */
  public async findOne(
    id: string,
    populatePermissions: boolean
  ): Promise<Role> {
    let role = await this.roleRepository.findById({
      id,
      populatePermissions,
    });
    if (!role) {
      throw new createHttpError.NotFound(RoleValidationMessages.NOT_FOUND);
    }

    return role;
  }

  /**
   * @function create: A function that create a role
   * @description Create role
   * @param name The role name
   * @return Promise<Role>
   */
  public async create(name: string): Promise<Role> {
    return await this.roleRepository.create(name);
  }

  /**
   * @function update: A function that update a role
   * @description Update role
   * @param name The role name
   * @param id The id of the role.
   * @return Promise<Role>
   */
  public async update(id: string, name: string): Promise<Role> {
    let role = await this.roleRepository.update({
      id,
      name,
    });
    if (!role) {
      throw new createHttpError.NotFound(RoleValidationMessages.NOT_FOUND);
    }

    return role;
  }

  /**
   * @function addAdmins: A function that add admins to a role.
   * @description Update role
   * @param id The id of the role.
   * @param adminsIds An array containing the id of admins to add.
   * @return Promise<Role>
   */
  public async addAdmins(id: string, adminsIds: string[]): Promise<Role> {
    let role = await this.roleRepository.addAdmins(id, adminsIds);
    if (!role) {
      throw new createHttpError.NotFound(RoleValidationMessages.NOT_FOUND);
    }

    return role;
  }

  /**
   * @function removeAdmins: A function that removes admins from a role.
   * @description Update role
   * @param id The id of the role.
   * @param adminsIds An array containing the id of admins to remove.
   * @return Promise<Role>
   */
  public async removeAdmins(id: string, adminsIds: string[]): Promise<Role> {
    let role = await this.roleRepository.removeAdmins(id, adminsIds);
    if (!role) {
      throw new createHttpError.NotFound(RoleValidationMessages.NOT_FOUND);
    }

    return role;
  }
  /**
   * @function addOrganizer: A function that add admins to a role.
   * @description add organizer to role
   * @param id The id of the role.
   * @param organizerIds An array containing the id of organizer to add.
   * @return Promise<Role>
   */
  public async addOrganizer(id: string, organizerIds: string[]): Promise<Role> {
    let role = await this.roleRepository.addOrganizer(id, organizerIds);
    if (!role) {
      throw new createHttpError.NotFound(RoleValidationMessages.NOT_FOUND);
    }

    return role;
  }

  /**
   * @function removeOrganizer: A function that removes organizer from a role.
   * @description remove organizer from role
   * @param id The id of the role.
   * @param adminsIds An array containing the id of organizer to remove.
   * @return Promise<Role>
   */
  public async removeOrganizer(id: string, adminsIds: string[]): Promise<Role> {
    let role = await this.roleRepository.removeOrganizer(id, adminsIds);
    if (!role) {
      throw new createHttpError.NotFound(RoleValidationMessages.NOT_FOUND);
    }

    return role;
  }

  /**
   * @function delete: A function that delete a role
   * @description Delete role
   * @param id The id of the role.
   * @return Promise<void>
   */
  public async delete(id: string): Promise<void> {
    let role = await this.roleRepository.delete({ id });
    if (!role) {
      throw new createHttpError.NotFound(RoleValidationMessages.NOT_FOUND);
    }
    return;
  }
}
