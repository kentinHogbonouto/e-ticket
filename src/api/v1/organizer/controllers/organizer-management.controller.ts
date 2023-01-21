import { Response, Request, NextFunction } from "express";
import { validationResult } from "express-validator";

import OrganizerService from "../services/organizer.service";

import GeneralHelpers from "../../../../helpers/general.helper";
import ApiResponses from "../../../../helpers/api-responses.helper";

import {
  ICreateOrganizerDto,
  IFindAllOrganizerDto,
  IUpdateOrganizerDto
} from "../interfaces/dto/services/organizer.dto";
import { QuerySort } from "../../../../interfaces/models/query.enum";
import { ResponseError } from "../../../../interfaces/error.interface";

import EnvironmentConfigs from "../../../../configs/environments";

export default class OrganizerManagementController {
  constructor(private organizerService: OrganizerService) {}

  public async getAllOrganizers(
    req: Request,
    res: Response,
    next: NextFunction
  ) {
    try {
      let { page, size, sort } = req.query;

      const params: IFindAllOrganizerDto = {
        page: Number(page) || 1,
        sort: (sort as QuerySort) || QuerySort.DESC,
        size: Number(size) || EnvironmentConfigs.getPaginationItemsPerPage(),
      };
      const { organizer, totalElements } = await this.organizerService.findAll(
        params
      );

      const response = GeneralHelpers.getPage(
        organizer,
        params.page as number,
        params.size as number,
        totalElements
      );

      res
        .status(200)
        .json(ApiResponses.success(response, "Organizer successfully found."));
    } catch (err: any) {
      if (!err.status) {
        err.status = 500;
      }
      next(err);
    }
  }

  public async getOrganizer(req: Request, res: Response, next: NextFunction) {
    try {
      const { id } = req.params;

      const organizer = await this.organizerService.findById(id);

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

  public async createOrganizer(
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

      const {
        email,
        lastName,
        firstName,
        password,
      } = req.body;

      const iCreateOrganizerDto: ICreateOrganizerDto = {
        lastName,
        firstName,
        email,
        password,
        roleId: "63c95f21b8bdfa73146ce0ce",
      };

      const organizer = await this.organizerService.create(
        iCreateOrganizerDto
      );

      res
        .status(201)
        .json(
          ApiResponses.success({ organizer }, "Organizer successfully created.")
        );
    } catch (err: any) {
      if (!err.status) {
        err.status = 500;
        console.log(err)
      }
      next(err);
    }
  }

  public async updateOrganizer(
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
      const { lastName, firstName, email } = req.body;

      
      const iUpdateOrganizerDto: IUpdateOrganizerDto = {
        id,
        lastName,
        firstName,
        email,
      };
      
      const organizer = await this.organizerService.update(
        iUpdateOrganizerDto
      );

      res
        .status(200)
        .json(ApiResponses.success({ organizer }, "Organizer successfully updated."));
    } catch (err: any) {
      if (!err.status) {
        err.status = 500;
      }
      next(err);
    }
  }

}
