import { Request, Response, NextFunction } from "express";
import { validationResult } from "express-validator";

import AuthService from "../services/auth.service";
import ApiResponses from "../../../../helpers/api-responses.helper";
import { ResponseError } from "../../../../interfaces/error.interface";

export default class AuthController {
  constructor(private authService: AuthService) {}

  public async login(req: Request, res: Response, next: NextFunction) {
    try {
      const { username, password } = req.body;

      const token: string = await this.authService.authenticate(
        username,
        password
      );

      res
        .status(200)
        .json(ApiResponses.success({ token }, "Succesfully authenticated."));
    } catch (err: any) {
      if (!err.status) {
        err.status = 500;
      }
      next(err);
    }
  }

  public async sendResetPasswordEmail(
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

      const { email } = req.body;

      await this.authService.sendResetPasswordEmail(email);

      res
        .status(200)
        .json(
          ApiResponses.successMessage(
            "Reset password email successfully sent.",
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

  public async resetPassword(req: Request, res: Response, next: NextFunction) {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        const error: ResponseError = new Error("Validation failed.");
        error.status = 422;
        error.data = errors.array();
        throw error;
      }

      const { requestId, password } = req.body;

      //await this.authService.resetPassword(requestId, password);

      res
        .status(201)
        .json(
          ApiResponses.successMessage("Password succesfully reseted.", true)
        );
    } catch (err: any) {
      if (!err.status) {
        err.status = 500;
      }
      next(err);
    }
  }
}
