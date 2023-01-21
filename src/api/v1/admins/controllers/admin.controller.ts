import { Response, Request, NextFunction } from "express";
import { Request as JWTRequest } from "express-jwt";
import { validationResult } from "express-validator";

import AdminService from "../services/admin.service";

import ApiResponses from "../../../../helpers/api-responses.helper";

import {
  IUpdateAdminDto,
  IUpdateAdminPasswordDto,
} from "../interfaces/dto/services/admin.dto";
import { ResponseError } from "../../../../interfaces/error.interface";

export default class AdminController {
  constructor(private adminService: AdminService) {}

  public async getAdminByResetToken(
    req: Request,
    res: Response,
    next: NextFunction
  ) {
    try {
      const { token } = req.params;

      const admin = await this.adminService.findByResetToken(token);

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

  public async getConnectedAdmin(
    req: JWTRequest,
    res: Response,
    next: NextFunction
  ) {
    try {
      const sub: any = req.auth?.sub;

      const admin = await this.adminService.findOne(sub);

      res
        .status(200)
        .json(ApiResponses.success({ admin }, "Connected admin found."));
    } catch (err: any) {
      if (!err.status) {
        err.status = 500;
      }
      next(err);
    }
  }

  public async updateConnectedAdmin(
    req: JWTRequest,
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

      const sub: any = req.auth?.sub;
      const { username } = req.body;
      const { email } = req.body;

      const iUpdateAdminDto: IUpdateAdminDto = { id: sub, username, email };
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

  public async updateConnectedPassword(
    req: JWTRequest,
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

      const sub: any = req.auth?.sub;
      const { oldPassword, password } = req.body;

      const iUpdateAdminPasswordDto: IUpdateAdminPasswordDto = {
        id: sub,
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
