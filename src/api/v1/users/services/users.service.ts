import createHttpError from "http-errors";

import UsersRepository from "../repositories/users.repository";

import PasswordHelpers from "../../../../helpers/password.helper";

import RoleService from "../../roles/services/role.service";

import { Users } from "../interfaces/users.model";
import {
  ICreateUsersDto,
  IFindAllUsersDto,
  IUpdateUsersDto,
  IUpdateUsersRoleDto,
  IUpdateUsersPasswordDto,
  IResetUsersPasswordDto,
} from "../interfaces/dto/services/users.dto";
import {
  CreateUsersDto,
  UpdateUsersDto,
} from "../interfaces/dto/repositories/users.dto";

import { ValidationMessages } from "../../../../validations/validation";
import { UsersValidationMessages } from "../validations/users.validation";
import { RoleValidationMessages } from "../../roles/validations/role.validation";

export default class UsersService {
  constructor(
    private usersRepository: UsersRepository,
    private roleService: RoleService
  ) {}

  /**
   * @function findByResetToken
   * @description Get Users by his reset password token.
   * @param token
   * @return Promise<Users | null>
   */
  public async findByResetToken(token: string): Promise<Users | null> {
    let users = await this.usersRepository.findByResetToken(token);
    if (!users) {
      throw new createHttpError.NotFound(UsersValidationMessages.NOT_FOUND);
    }
    if (
      users.resetTokenExpiration &&
      new Date(users.resetTokenExpiration).getTime() <= Date.now()
    ) {
      throw new createHttpError.Forbidden(ValidationMessages.TOKEN_EXPIRED);
    }

    users = await this.usersRepository.findByEmail(users.email);

    return users;
  }

  /**
   * @function findAll
   * @description Get the list of all Userss
   * @param iFindAllUserssDto An object of type IFindAllUserssDto containing the query filters
   * @return Promise<{ Userss: Users[]; totalElements: number }>
   */
  public async findAll(
    iFindAllUserssDto: IFindAllUsersDto
  ): Promise<{ users: Users[]; totalElements: number }> {
    let users: Users[] = [];

    let totalElements = await this.usersRepository.countAll();

    if (iFindAllUserssDto.size === -1) {
      users = await this.usersRepository.findAll({
        sort: iFindAllUserssDto.sort,
      });
    } else {
      users = await this.usersRepository.findAll({
        size: iFindAllUserssDto.size,
        sort: iFindAllUserssDto.sort,
        page: iFindAllUserssDto.page,
      });
    }

    return { users, totalElements };
  }

  /**
   * @function findOne
   * @description Get Users by id
   * @param id The id of the Users
   * @return Promise<Users>
   */
  public async findOne(id: string): Promise<Users> {
    return await this.findById(id);
  }

  /**
   * @function findByEmail
   * @description Get Users by email
   * @param email The email of the Users
   * @return Promise<Users | null>
   */
  public async findByEmail(email: string): Promise<Users | null> {
    return await this.usersRepository.findByEmail(email);
  }

  /**
   * @function findByResetPasswordRequestId
   * @description Get Users by reset password request id
   * @param requestId The request id
   * @return Promise<Users | null>
   */
  public async findByResetPasswordRequestId(
    requestId: string
  ): Promise<Users | null> {
    return await this.usersRepository.findByResetPasswordRequestId(requestId);
  }

  /**
   * @function createUsers
   * @description Create an Users
   * @param iCreateUsersDto An object of type ICreateUsersDto containing the Users account informations
   * @return Promise<Users>
   */
  public async create(iCreateUsersDto: ICreateUsersDto): Promise<Users> {
    const exitingUsersWithUsername = await this.usersRepository.findByEmail(
      iCreateUsersDto.email
    );
    if (exitingUsersWithUsername) {
      throw new createHttpError.Forbidden(
        ValidationMessages.USERNAME_ALREADY_IN_USE
      );
    }

    const existingUsersWithEmail = await this.usersRepository.findByEmail(
      iCreateUsersDto.email
    );
    if (existingUsersWithEmail) {
      throw new createHttpError.Forbidden(
        ValidationMessages.EMAIL_ALREADY_IN_USE
      );
    }

    const createUsersDto: CreateUsersDto = {
      lastName: iCreateUsersDto.lastName,
      firstName: iCreateUsersDto.firstName,
      email: iCreateUsersDto.email,
      password: iCreateUsersDto.password,
      role: iCreateUsersDto.roleId,
    };

    let users = await this.usersRepository.create(createUsersDto);

    return this.findById(users.id);
  }

  /**
   * @function updateUsers
   * @description Update an Users
   * @param iUpdateUsersDto An object of type IUpdateUsersDto containing the Users account informations
   * @return Promise<Users>
   */
  public async update(iUpdateUsersDto: IUpdateUsersDto): Promise<Users> {
    let users: any = await this.findById(iUpdateUsersDto.id);

    const updateUsersDto: UpdateUsersDto = {
      id: iUpdateUsersDto.id,
    };

    if (iUpdateUsersDto.email) {
      const exitingUsersWithUsername = await this.usersRepository.findByEmail(
        iUpdateUsersDto.email
      );
      if (exitingUsersWithUsername) {
        throw new createHttpError.Forbidden(
          ValidationMessages.USERNAME_ALREADY_IN_USE
        );
      }
      updateUsersDto.email = iUpdateUsersDto.email;
    }

    if (iUpdateUsersDto.email) {
      const existingUsersWithEmail = await this.usersRepository.findByEmail(
        iUpdateUsersDto.email
      );
      if (existingUsersWithEmail) {
        throw new createHttpError.Forbidden(
          ValidationMessages.EMAIL_ALREADY_IN_USE
        );
      }
      updateUsersDto.email = iUpdateUsersDto.email;
    }

    users = await this.usersRepository.update(updateUsersDto);
    return users;
  }

  /**
   * @function updateUsersRole
   * @description Update an Users role
   * @param iUpdateUsersRoleDto An object of type IUpdateUsersRoleDto containing the Users role
   * @return Promise<Users>
   */
  public async updateRole(
    iUpdateUsersRoleDto: IUpdateUsersRoleDto
  ): Promise<Users> {
    let users: any = await this.findById(iUpdateUsersRoleDto.id);

    if (!iUpdateUsersRoleDto.roleId) {
      throw new createHttpError.Forbidden(
        RoleValidationMessages.ROLE_ID_NOT_PROVIDED
      );
    }

    const role = await this.roleService.findOne(
      iUpdateUsersRoleDto.roleId,
      false
    );

    const updateUsersDto: UpdateUsersDto = {
      id: iUpdateUsersRoleDto.id,
      role,
    };
    users = await this.usersRepository.update(updateUsersDto);
    return users;
  }

  /**
   * @function updateUsersPassword
   * @description Update an Users password
   * @param iUpdateUsersPasswordDto An object of type IUpdateTeacherPasswordDto containing the Users password
   * @return Promise<void>
   */
  public async updatePassword(
    iUpdateUsersPasswordDto: IUpdateUsersPasswordDto
  ): Promise<void> {
    let users: any = await this.findById(iUpdateUsersPasswordDto.id);

    if (!iUpdateUsersPasswordDto.password) {
      throw new createHttpError.Forbidden(
        ValidationMessages.PASSWORD_MUST_BE_PROVIDED
      );
    }

    const isEqual = await PasswordHelpers.comparePasswords(
      iUpdateUsersPasswordDto.oldPassword,
      users.password
    );
    if (!isEqual) {
      throw new createHttpError.Forbidden(
        ValidationMessages.INCORRECT_OLD_PASSWORD
      );
    }

    const updateUsersDto: UpdateUsersDto = {
      id: iUpdateUsersPasswordDto.id,
      password: iUpdateUsersPasswordDto.password,
    };
    await this.usersRepository.update(updateUsersDto);

    return;
  }

  /**
   * TODO
   * @function resetUsersPassword
   * @description
   * @param iResetUsersPasswordDto
   * @return void
   */
  public async resetPassword(
    iResetUsersPasswordDto: IResetUsersPasswordDto
  ): Promise<void> {
    const updateUsersDto: UpdateUsersDto = {
      id: iResetUsersPasswordDto.id,
      password: iResetUsersPasswordDto.password,
      resetPasswordRequestId: iResetUsersPasswordDto.resetPasswordRequestId,
    };
    await this.usersRepository.update(updateUsersDto);

    return;
  }

  /**
   * TODO
   * @function generateResetPasswordToken
   * @description
   * @param id
   * @return Promise<Users | null>
   */
  public async generateResetPasswordToken(id: string): Promise<Users | null> {
    return await this.usersRepository.generateResetPasswordToken(id);
  }

  /**
   * TODO
   * @function findById
   * @description GET user by id
   * @param id
   * @return  Promise<Users>
   */
  private async findById(id: string): Promise<Users> {
    const users = await this.usersRepository.findById(id);
    if (!users) {
      throw new createHttpError.NotFound(UsersValidationMessages.NOT_FOUND);
    }
    return users;
  }
}
