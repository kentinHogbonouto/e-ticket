import { Response, Request, NextFunction } from "express";
import { Request as JWTRequest } from "express-jwt";
import { validationResult } from "express-validator";

import EventCouponService from "../services/event-coupon.service";

import { IFindAllEventCouponDto, ICreateEventCouponDto, IUpdateEventCouponDto } from "../interfaces/dto/services/event-coupon.dto";

import { QuerySort } from "../../../../interfaces/models/query.enum";

import EnvironmentConfigs from "../../../../configs/environments";

import GeneralHelpers from "../../../../helpers/general.helper";

import ApiResponses from "../../../../helpers/api-responses.helper";

import { ResponseError } from "../../../../interfaces/error.interface";

export default class EventCouponController {
  constructor(private eventCouponService: EventCouponService) {}

  public async findAll(req: Request, res: Response, next: NextFunction) {
    try {
      let { page, size, sort } = req.query;

      const params: IFindAllEventCouponDto = {
        page: Number(page) || 1,
        sort: (sort as QuerySort) || QuerySort.DESC,
        size: Number(size) || EnvironmentConfigs.getPaginationItemsPerPage(),
      };

      const { eventCoupon, totalElements } = await this.eventCouponService.findAll(
        params
      );

      const response = GeneralHelpers.getPage(
        eventCoupon,
        params.page as number,
        params.size as number,
        totalElements
      );

      res
        .status(200)
        .json(ApiResponses.success(response, "Event coupon successfully found."));
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

      const eventCoupon = await this.eventCouponService.findOne(id);

      res
        .status(200)
        .json(ApiResponses.success({ eventCoupon }, "Event coupon successfully found."));
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

      const {
        formuleQuantity,
        event
      } = req.body;

      const iCreateEventCouponDto: ICreateEventCouponDto = {
        formuleQuantity,
        event
      }

      const eventCoupon = await this.eventCouponService.create(iCreateEventCouponDto)

      res
        .status(201)
        .json(ApiResponses.success({ eventCoupon }, "Event coupon successfully created."));

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
        availableSeats
      } = req.body;

      const iUpdateEventCouponDto: IUpdateEventCouponDto = {
        id,
        availableSeats
      };

      const eventCoupon = await this.eventCouponService.update(iUpdateEventCouponDto);
      res
        .status(201)
        .json(ApiResponses.success({ eventCoupon }, "Event coupon successfully updated."));
    } catch (err: any) {
      if (!err.status) {
        err.status = 500;
      }
      next(err);
    }
  }
  
}
