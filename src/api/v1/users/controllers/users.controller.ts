import { Response, Request, NextFunction } from "express";
import { Request as JWTRequest } from "express-jwt";
import { validationResult } from "express-validator";

import UsersService from "../services/users.service";

import ApiResponses from "../../../../helpers/api-responses.helper";

import {
  IUpdateUsersDto,
  IUpdateUsersPasswordDto,
} from "../interfaces/dto/services/users.dto";
import { ResponseError } from "../../../../interfaces/error.interface";

export default class UsersController {
  constructor(private usersService: UsersService) {}

  public async getUsersByResetToken(
    req: Request,
    res: Response,
    next: NextFunction
  ) {
    try {
      const { token } = req.params;

      const users = await this.usersService.findByResetToken(token);

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

  public async getConnectedUsers(
    req: JWTRequest,
    res: Response,
    next: NextFunction
  ) {
    try {
      const sub: any = req.auth;

      const users = await this.usersService.findOne(sub);

      res
        .status(200)
        .json(ApiResponses.success({ users }, "Connected Users found."));
    } catch (err: any) {
      if (!err.status) {
        err.status = 500;
      }
      next(err);
    }
  }

  public async updateConnected(
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

      const sub: any = req.auth;
      const { email } = req.body;

      const iUpdateUsersDto: IUpdateUsersDto = { id: sub.userId, email };
      const users = await this.usersService.update(iUpdateUsersDto);

      res
        .status(201)
        .json(ApiResponses.success({ users }, "Users successfully updated."));
    } catch (err: any) {
      if (!err.status) {
        err.status = 500;
      }
      next(err);
    }
  }

  public async updateUsersConnectedPassword(
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

      const iUpdateUsersPasswordDto: IUpdateUsersPasswordDto = {
        id: sub,
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
