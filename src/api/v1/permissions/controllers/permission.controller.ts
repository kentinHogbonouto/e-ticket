import { validationResult } from "express-validator";
import { Request, Response, NextFunction } from "express";

import ApiResponses from "../../../../helpers/api-responses.helper";

import PermissionService from "../services/permission.service";

import GeneralHelpers from "../../../../helpers/general.helper";

import { QuerySort } from "../../../../interfaces/models/query.enum";
import { ResponseError } from "../../../../interfaces/error.interface";
import { IFindAllPermissionsDto } from "../interfaces/dto/services/permission.interface";

import EnvironmentConfigs from "../../../../configs/environments";

export default class PermissionController {
  constructor(private permissionService: PermissionService) {}

  public async findAll(req: Request, res: Response, next: NextFunction) {
    try {
      let { page, size, sort } = req.query;

      const params: IFindAllPermissionsDto = {
        page: Number(page) || 1,
        sort: (sort as QuerySort) || QuerySort.DESC,
        size: Number(size) || EnvironmentConfigs.getPaginationItemsPerPage(),
      };
      const { permissions, totalElements } =
        await this.permissionService.findAll(params);

      const response = GeneralHelpers.getPage(
        permissions,
        params.page as number,
        params.size as number,
        totalElements
      );

      res
        .status(200)
        .json(
          ApiResponses.success(response, "Permissions successfully found.")
        );
    } catch (err: any) {
      if (!err.status) {
        err.status = 500;
      }
      next(err);
    }
  }

  public async findOne(req: Request, res: Response, next: NextFunction) {
    try {
      const { id } = req.body;

      const permission = await this.permissionService.findOne(id);

      res
        .status(200)
        .json(
          ApiResponses.success(permission, "Permission successfully found.")
        );
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

      const permission = await this.permissionService.create(name);

      res
        .status(201)
        .json(
          ApiResponses.success(permission, "Permission successfully created.")
        );
    } catch (err: any) {
      if (!err.status) {
        err.status = 500;
      }
      next(err);
    }
  }

  // public async update(req: Request, res: Response, next: NextFunction) {
  //   try {
  //     const errors = validationResult(req);
  //     if (!errors.isEmpty()) {
  //       const error: ResponseError = new Error("Validation failed.");
  //       error.status = 422;
  //       error.data = errors.array();
  //       throw error;
  //     }

  //     const { id } = req.params;
  //     const { name } = req.body;

  //     const permission = await this.permissionService.update(id, name);

  //     res
  //       .status(201)
  //       .json(
  //         ApiResponses.success(permission, "Permission successfully created.")
  //       );
  //   } catch (err: any) {
  //     if (!err.status) {
  //       err.status = 500;
  //     }
  //     next(err);
  //   }
  // }

  public async delete(req: Request, res: Response, next: NextFunction) {
    try {
      const errors = validationResult(req);

      if (!errors.isEmpty) {
        const error: ResponseError = new Error("Validation failed.");
        error.status = 422;
        error.data = errors.array();
        throw error;
      }

      const { id } = req.params;

      await this.permissionService.delete(id);

      res
        .status(200)
        .json(
          ApiResponses.successMessage("Permission successfully delete", true)
        );
    } catch (err: any) {
      if (!err.status) {
        err.status = 500;
      }
      next(err);
    }
  }
}
