import { validationResult } from "express-validator";
import { Request, Response, NextFunction } from "express";

import RoleService from "../services/role.service";

import GeneralHelpers from "../../../../helpers/general.helper";
import ApiResponses from "../../../../helpers/api-responses.helper";

import { QuerySort } from "../../../../interfaces/models/query.enum";
import { ResponseError } from "../../../../interfaces/error.interface";
import { IFindAllRolesDto } from "../interfaces/dto/services/role.dto";

import EnvironmentConfigs from "../../../../configs/environments";

export default class RoleController {
  constructor(private roleService: RoleService) {}

  public async findAll(req: Request, res: Response, next: NextFunction) {
    try {
      let { page, size, sort } = req.query;

      const params: IFindAllRolesDto = {
        page: Number(page) || 1,
        sort: (sort as QuerySort) || QuerySort.DESC,
        size: Number(size) || EnvironmentConfigs.getPaginationItemsPerPage(),
      };
      const { roles, totalElements } = await this.roleService.findAll(params);

      const response = GeneralHelpers.getPage(
        roles,
        params.page as number,
        params.size as number,
        totalElements
      );

      res
        .status(200)
        .json(ApiResponses.success(response, "Roles successfully found."));
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

      const role = await this.roleService.findOne(id, true);

      res
        .status(200)
        .json(ApiResponses.success({ role }, "Role successfully found."));
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

      const { name } = req.body;

      const role = await this.roleService.create(name);

      res
        .status(200)
        .json(ApiResponses.success({ role }, "Role succesfully created."));
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
      const { name } = req.body;

      const role = await this.roleService.update(id, name);

      res
        .status(200)
        .json(ApiResponses.success({ role }, "Role successfully updated."));
    } catch (err: any) {
      if (!err.status) {
        err.status = 500;
      }
      next(err);
    }
  }

  public async delete(req: Request, res: Response, next: NextFunction) {
    try {
      const { id } = req.body;

      const role = await this.roleService.delete(id);

      res
        .status(200)
        .json(ApiResponses.success({ role }, "Role successfully deleted."));
    } catch (err: any) {
      if (!err.status) {
        err.status = 500;
      }
      next(err);
    }
  }
}
