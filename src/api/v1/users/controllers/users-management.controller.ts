import { Response, Request, NextFunction } from "express";
import { validationResult } from "express-validator";

import UsersService from "../services/users.service";

import GeneralHelpers from "../../../../helpers/general.helper";
import ApiResponses from "../../../../helpers/api-responses.helper";

import {
  IFindAllUsersDto,
  ICreateUsersDto,
  IUpdateUsersDto,
  IUpdateUsersRoleDto,
  IUpdateUsersPasswordDto,
} from "../interfaces/dto/services/users.dto";
import { QuerySort } from "../../../../interfaces/models/query.enum";
import { ResponseError } from "../../../../interfaces/error.interface";

import EnvironmentConfigs from "../../../../configs/environments";

export default class UsersManagementController {
  constructor(private usersService: UsersService) {}

  public async findAll(req: Request, res: Response, next: NextFunction) {
    try {
      let { page, size, sort } = req.query;

      const params: IFindAllUsersDto = {
        page: Number(page) || 1,
        sort: (sort as QuerySort) || QuerySort.DESC,
        size: Number(size) || EnvironmentConfigs.getPaginationItemsPerPage(),
      };
      const { users, totalElements } = await this.usersService.findAll(params);

      const response = GeneralHelpers.getPage(
        users,
        params.page as number,
        params.size as number,
        totalElements
      );

      res
        .status(200)
        .json(ApiResponses.success(response, "Userss successfully found."));
    } catch (err: any) {
      if (!err.status) {
        err.status = 500;
      }
      next(err);
    }
  }

  public async findOne(req: Request, res: Response, next: NextFunction) {
    try {
      const { id } = req.params;

      const users = await this.usersService.findOne(id);

      res
        .status(200)
        .json(ApiResponses.success({ users }, "Users successfully found."));
    } catch (err: any) {
      if (!err.status) {
        err.status = 500;
      }
      next(err);
    }
  }

  public async create(req: Request, res: Response, next: NextFunction) {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        const error: ResponseError = new Error("Validation failed.");
        error.status = 422;
        error.data = errors.array();
        throw error;
      }

      const { email, password, lastName, firstName } = req.body;

      const roleId = "djhxfnbdskjmotue";

      const iCreateUsersDto: ICreateUsersDto = {
        lastName,
        firstName,
        email,
        password,
        roleId,
      };

      const users = await this.usersService.create(iCreateUsersDto);

      res
        .status(201)
        .json(ApiResponses.success({ users }, "Users successfully created."));
    } catch (err: any) {
      if (!err.status) {
        err.status = 500;
      }
      next(err);
    }
  }

  public async update(req: Request, res: Response, next: NextFunction) {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        const error: ResponseError = new Error("Validation failed.");
        error.status = 422;
        error.data = errors.array();
        throw error;
      }

      const { id } = req.params;
      const { email } = req.body;

      const iUpdateUsersDto: IUpdateUsersDto = { id, email };
      const Users = await this.usersService.update(iUpdateUsersDto);

      res
        .status(201)
        .json(ApiResponses.success({ Users }, "Users successfully updated."));
    } catch (err: any) {
      if (!err.status) {
        err.status = 500;
      }
      next(err);
    }
  }

  public async updateRole(
    req: Request,
    res: Response,
    next: NextFunction
  ) {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        const error: ResponseError = new Error("Validation failed.");
        error.status = 422;
        error.data = errors.array();
        throw error;
      }

      const { id } = req.params;
      const { roleId } = req.body;

      const iUpdateUsersRoleDto: IUpdateUsersRoleDto = { id, roleId };
      const users = await this.usersService.updateRole(
        iUpdateUsersRoleDto
      );

      res
        .status(201)
        .json(
          ApiResponses.success({ users }, "Users role successfully updated.")
        );
    } catch (err: any) {
      if (!err.status) {
        err.status = 500;
      }
      next(err);
    }
  }

  public async updatePassword(req: Request, res: Response, next: NextFunction) {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        const error: ResponseError = new Error("Validation failed.");
        error.status = 422;
        error.data = errors.array();
        throw error;
      }

      const { id } = req.params;
      const { oldPassword, password } = req.body;

      const iUpdateUsersPasswordDto: IUpdateUsersPasswordDto = {
        id,
        oldPassword,
        password,
      };
      await this.usersService.updatePassword(iUpdateUsersPasswordDto);

      res
        .status(200)
        .json(
          ApiResponses.successMessage(
            "Users password successfully updated.",
            true
          )
        );
    } catch (err: any) {
      if (!err.status) {
        err.status = 500;
      }
      next(err);
    }
  }
}
