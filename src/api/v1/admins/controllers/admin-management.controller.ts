import { Response, Request, NextFunction } from "express";
import { validationResult } from "express-validator";

import AdminService from "../services/admin.service";

import GeneralHelpers from "../../../../helpers/general.helper";
import ApiResponses from "../../../../helpers/api-responses.helper";

import {
  ICreateAdminDto,
  IFindAllAdminsDto,
  IUpdateAdminDto,
  IUpdateAdminPasswordDto,
  IUpdateAdminRoleDto,
} from "../interfaces/dto/services/admin.dto";
import { QuerySort } from "../../../../interfaces/models/query.enum";
import { ResponseError } from "../../../../interfaces/error.interface";

import EnvironmentConfigs from "../../../../configs/environments";

export default class AdminManagementController {
  constructor(private adminService: AdminService) {}

  public async findAll(req: Request, res: Response, next: NextFunction) {
    try {
      let { page, size, sort } = req.query;

      const params: IFindAllAdminsDto = {
        page: Number(page) || 1,
        sort: (sort as QuerySort) || QuerySort.DESC,
        size: Number(size) || EnvironmentConfigs.getPaginationItemsPerPage(),
      };
      const { admins, totalElements } = await this.adminService.findAll(params);

      const response = GeneralHelpers.getPage(
        admins,
        params.page as number,
        params.size as number,
        totalElements
      );

      res
        .status(200)
        .json(ApiResponses.success(response, "Admins successfully found."));
    } catch (err: any) {
      if (!err.status) {
        err.status = 500;
      }
      next(err);
    }
  }

  public async findById(req: Request, res: Response, next: NextFunction) {
    try {
      const { id } = req.params;

      const admin = await this.adminService.findOne(id);

      res
        .status(200)
        .json(ApiResponses.success({ admin }, "Admin successfully found."));
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

      const { email, username, password } = req.body;

      const iCreateAdminDto: ICreateAdminDto = {
        username,
        email,
        password,
        roleId: "63c95f17b8bdfa73146ce0cc",
      };

      const admin = await this.adminService.create(iCreateAdminDto);

      res
        .status(201)
        .json(ApiResponses.success({ admin }, "Admin successfully created."));
    } catch (err: any) {
      if (!err.status) {
        console.log(err);
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
      const { username } = req.body;
      const { email } = req.body;

      const iUpdateAdminDto: IUpdateAdminDto = { id, username, email };
      const admin = await this.adminService.update(iUpdateAdminDto);

      res
        .status(201)
        .json(ApiResponses.success({ admin }, "Admin successfully updated."));
    } catch (err: any) {
      if (!err.status) {
        err.status = 500;
      }
      next(err);
    }
  }

  public async updateRole(req: Request, res: Response, next: NextFunction) {
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

      const iUpdateAdminRoleDto: IUpdateAdminRoleDto = { id, roleId };
      const admin = await this.adminService.updateRole(iUpdateAdminRoleDto);

      res
        .status(201)
        .json(
          ApiResponses.success({ admin }, "Admin role successfully updated.")
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

      const iUpdateAdminPasswordDto: IUpdateAdminPasswordDto = {
        id,
        oldPassword,
        password,
      };
      await this.adminService.updatePassword(iUpdateAdminPasswordDto);

      res
        .status(200)
        .json(
          ApiResponses.successMessage(
            "Admin password successfully updated.",
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
