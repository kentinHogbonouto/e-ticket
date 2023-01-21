import { Response, Request, NextFunction } from "express";
import { Request as JWTRequest } from "express-jwt";
import jwtDecode from "jwt-decode";
import { validationResult } from "express-validator";

import OrganizerService from "../services/organizer.service";

import ApiResponses from "../../../../helpers/api-responses.helper";
import {
  IUpdateOrganizerDto,
  IUpdateOrganizerPasswordDto,
} from "../interfaces/dto/services/organizer.dto";
import { ResponseError } from "../../../../interfaces/error.interface";

export default class OrganizerController {
  constructor(private organizerService: OrganizerService) {}

  public async getOrganizerByResetToken(
    req: Request,
    res: Response,
    next: NextFunction
  ) {
    try {
      const { token } = req.params;

      const organizer = await this.organizerService.findByResetToken(token);

      res
        .status(200)
        .json(
          ApiResponses.success({ organizer }, "Organizer successfully found.")
        );
    } catch (err: any) {
      if (!err.status) {
        err.status = 500;
      }
      next(err);
    }
  }

  public async getConnectedOrganizer(
    req: JWTRequest,
    res: Response,
    next: NextFunction
  ) {
    try {
      /**
       * TO DO
       * Improve the ways to get a user id by token method
       */
      const sub: any = req.headers.authorization;
      const decodeUserToken: any = jwtDecode(sub);
      const getUserId: string = decodeUserToken.userId;

      const organizer = await this.organizerService.findById(getUserId);

      res
        .status(200)
        .json(
          ApiResponses.success({ organizer }, "Connected organizer found.")
        );
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

      const getConnectedUserId: any = req.auth;

      const { email, firstName, lastName } = req.body;
      const iUpdateOrganizerDto: IUpdateOrganizerDto = {
        id: getConnectedUserId.userId,
        email,
        lastName,
        firstName,
      };
      const organizer = await this.organizerService.update(
        iUpdateOrganizerDto
      );

      res
        .status(200)
        .json(
          ApiResponses.success({ organizer }, "Organizer successfully updated.")
        );
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

      const sub: any = req.auth?.sub

      console.log(sub);

      const { oldPassword, password } = req.body;

      const iUpdateOrganizerPasswordDto: IUpdateOrganizerPasswordDto = {
        id: sub.userId,
        oldPassword,
        password,
      };

      await this.organizerService.updatePassword(
        iUpdateOrganizerPasswordDto
      );

      res
        .status(200)
        .json(
          ApiResponses.successMessage(
            "Organizer password successfully updated.",
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
