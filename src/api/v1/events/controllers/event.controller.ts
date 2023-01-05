import { Response, Request, NextFunction } from "express";
import { validationResult } from "express-validator";
import { Request as JWTRequest } from "express-jwt";

import EventService from "../services/event.service";

import {
  IFindAllEventDto,
  IUpdateEventDto,
  ICreateEventDto,
} from "../interfaces/dto/services/event.dto";

import { QuerySort } from "../../../../interfaces/models/query.enum";

import EnvironmentConfigs from "../../../../configs/environments";

import GeneralHelpers from "../../../../helpers/general.helper";

import ApiResponses from "../../../../helpers/api-responses.helper";

import { ResponseError } from "../../../../interfaces/error.interface";

export default class EventController {
  constructor(private eventService: EventService) {}

  public async findAll(req: JWTRequest, res: Response, next: NextFunction) {
    try {

      let { page, size, sort } = req.query;

      const params: IFindAllEventDto = {
        page: Number(page) || 1,
        sort: (sort as QuerySort) || QuerySort.DESC,
        size: Number(size) || EnvironmentConfigs.getPaginationItemsPerPage(),
      };

      const { events, totalElements } = await this.eventService.findAll(params);

      const response = GeneralHelpers.getPage(
        events,
        params.page as number,
        params.size as number,
        totalElements
      );

      res
        .status(200)
        .json(ApiResponses.success(response, "Events successfully found."));
    } catch (err: any) {
      if (!err.status) {
        console.log(err);
        err.status = 500;
      }
      next(err);
    }
  }

  public async findOne(req: Request, res: Response, next: NextFunction) {
    try {
      let { id } = req.params;

      const event = await this.eventService.findOne(id);

      res
        .status(200)
        .json(ApiResponses.success({ event }, "Event successfully found."));
    } catch (err: any) {
      if (!err.status) {
        err.status = 500;
      }
      next(err);
    }
  }

  public async create(req: JWTRequest, res: Response, next: NextFunction) {
    try {
      const errors = validationResult(req);

      if (!errors.isEmpty()) {
        const error: ResponseError = new Error("Validation failed.");
        error.status = 422;
        error.data = errors.array();
        throw error;
      }

      let sub: any = req.auth

      const {
        name,
        shortDescription,
        type,
        theme,
        categorie,
        place,
        startDate,
        startTime,
        endDate,
        endTime,
      } = req.body;

      const iCreateEventDto: ICreateEventDto = {
        name,
        shortDescription,
        type,
        theme,
        categorie,
        place,
        startDate,
        startTime,
        endDate,
        endTime,
        organizerId: sub.userId
      };

      const event = await this.eventService.create(iCreateEventDto);
      res
        .status(201)
        .json(ApiResponses.success({ event }, "Event successfully created."));
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

      const {
        name,
        shortDescription,
        type,
        theme,
        categorie,
        place,
        startDate,
        startTime,
        endDate,
        endTime,
      } = req.body;

      const iUpdateEventDto: IUpdateEventDto = {
        id,
        name,
        shortDescription,
        type,
        theme,
        categorie,
        place,
        startDate,
        startTime,
        endDate,
        endTime,
      };

      const event = await this.eventService.update(iUpdateEventDto);
      res
        .status(201)
        .json(ApiResponses.success({ event }, "Course successfully updated."));
    } catch (err: any) {
      if (!err.status) {
        err.status = 500;
      }
      next(err);
    }
  }

  public async delete(req: Request, res: Response, next: NextFunction) {
    try {
      const errors = validationResult(req);

      if (!errors.isEmpty()) {
        const error: ResponseError = new Error("Validation failed.");
        error.status = 422;
        error.data = errors.array();
        throw error;
      }

      const { id } = req.params;

      const event = await this.eventService.delete(id);

      res
        .status(201)
        .json(ApiResponses.success({ event }, "Event successfully deleted."));
    } catch (err: any) {
      if (!err.status) {
        err.status = 500;
      }
      next(err);
    }
  }
}
