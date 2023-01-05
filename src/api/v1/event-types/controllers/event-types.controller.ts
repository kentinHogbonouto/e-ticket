import { Response, Request, NextFunction } from "express";
import { validationResult } from "express-validator";

import EventTypesService from "../services/event-types.service";

import { IFindAllEventTypesDto, IFindEventTypesDto, ICreateEventTypesDto, IUpdateEventTypesDto } from "../interfaces/dto/services/event-types.dto";

import { QuerySort } from "../../../../interfaces/models/query.enum";

import EnvironmentConfigs from "../../../../configs/environments";

import GeneralHelpers from "../../../../helpers/general.helper";

import ApiResponses from "../../../../helpers/api-responses.helper";

import { ResponseError } from "../../../../interfaces/error.interface";

export default class EventTypesController {
  constructor(private eventTypesService: EventTypesService) {}

  public async findAll(req: Request, res: Response, next: NextFunction) {
    try {
      let { page, size, sort } = req.query;

      const params: IFindAllEventTypesDto = {
        page: Number(page) || 1,
        sort: (sort as QuerySort) || QuerySort.DESC,
        size: Number(size) || EnvironmentConfigs.getPaginationItemsPerPage(),
      };

      const { eventsTypes, totalElements } = await this.eventTypesService.findAll(
        params
      );

      const response = GeneralHelpers.getPage(
        eventsTypes,
        params.page as number,
        params.size as number,
        totalElements
      );

      res
        .status(200)
        .json(ApiResponses.success(response, "Events types successfully found."));
    } catch (err: any) {
      if (!err.status) {
        err.status = 500;
      }
      next(err);
    }
  }

  public async findOne(req: Request, res: Response, next: NextFunction) {
    try {
      let { id } = req.params;

      const eventsTypes = await this.eventTypesService.findOne(id);

      res
        .status(200)
        .json(ApiResponses.success({ eventsTypes }, "Event types successfully found."));
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

      const {
        name,
      } = req.body;

      const iCreateEventTypesDto: ICreateEventTypesDto = {
        name,
      }

      const eventsTypes = await this.eventTypesService.create(iCreateEventTypesDto)
      res
        .status(201)
        .json(ApiResponses.success({ eventsTypes }, "Event types successfully created."));
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

      const {id} = req.params;

      const {
        name
      } = req.body;

      const iUpdateEventTypesDto: IUpdateEventTypesDto = {
        id,
        name,
      }

      const eventTypes = await this.eventTypesService.update(iUpdateEventTypesDto)
      res
        .status(201)
        .json(ApiResponses.success({ eventTypes }, "Event type successfully updated."));
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

      const {id} = req.params;

      const eventTypes = await this.eventTypesService.delete(id);

      res
        .status(201)
        .json(ApiResponses.success({ eventTypes }, "Event types successfully deleted."));
    } catch (err: any) {
      if (!err.status) {
        err.status = 500;
      }
      next(err);
    }
  }
  
}
