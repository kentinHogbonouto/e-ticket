import createHttpError from "http-errors";

import EventCouponRepository from "../repositories/event-coupon.repository";

import { ICreateEventCouponDto, IUpdateEventCouponDto } from "../interfaces/dto/services/event-coupon.dto";
import { CreateEventCouponDto, UpdateEventCouponDto } from "../interfaces/dto/repositories/event-coupon.dto";
import { IFindAllEventCouponDto } from "../interfaces/dto/services/event-coupon.dto";
import { EventCoupon } from "../interfaces/event-coupon.model";

import { EventCouponValidationMessage } from "../validations/event-coupon.validations";

export default class EventCouponService {
  constructor(private eventCouponRepository: EventCouponRepository) {}

  /**
   * @function findAll
   * @description: Get event coupon list
   * @param iFindAllEventCouponDto: list sort by asc, number of page and document size
   * @return Promise<{eventCoupon: EventCoupon[]; totalElements: number;}>
   */
   public async findAll(
    iFindAllEventCouponDto: IFindAllEventCouponDto
  ): Promise<{ eventCoupon: EventCoupon[]; totalElements: number }> {
    let eventCoupon: EventCoupon[] = [];

    let totalElements = await this.eventCouponRepository.countAll();

    if (iFindAllEventCouponDto.size === -1) {
      eventCoupon = await this.eventCouponRepository.findAll({
        sort: iFindAllEventCouponDto.sort,
      });
    } else {
      eventCoupon = await this.eventCouponRepository.findAll({
        sort: iFindAllEventCouponDto.sort,
        page: iFindAllEventCouponDto.page,
        size: iFindAllEventCouponDto.size,
      });
    }

    return { eventCoupon, totalElements };
  }

  /**
   * @function findOne
   * @description: Get a event coupon by id
   * @param id: The event coupon id.
   * @return Promise<EventCoupon>
   */
  public async findOne(id: string): Promise<EventCoupon> {
    let eventCoupon = await this.eventCouponRepository.findById(id);

    if (!eventCoupon) {
      throw new createHttpError.NotFound(EventCouponValidationMessage.NOT_FOUND);
    }

    return eventCoupon;
  }

  /**
   * @function create
   * @description: Create event coupon
   * @param iCreateEventCouponDto: An object of type CreateEventDto containing the event information.
   * @return Promise<EventCoupon>
   */
   public async create(iCreateEventCouponDto: ICreateEventCouponDto): Promise<EventCoupon> {

    const createEventCouponDto: CreateEventCouponDto = {
      formuleQuantity: iCreateEventCouponDto.formuleQuantity,
      event: iCreateEventCouponDto.event
    };

    let eventCoupon = await this.eventCouponRepository.create(createEventCouponDto);

    return eventCoupon;
  }

  /**
   * @function update
   * @description: Update event coupon
   * @param iUpdateEventCouponDto: An object of type IUpdateEventCouponDto containing the event information
   * @return Promise<Events>
   */
   public async update(iUpdateEventCouponDto: IUpdateEventCouponDto): Promise<EventCoupon> {
    let eventCoupon: any = await this.findOne(iUpdateEventCouponDto.id);

    const updateEventCouponDto: UpdateEventCouponDto = {
      id: iUpdateEventCouponDto.id,
      availableSeats: iUpdateEventCouponDto.availableSeats
    };

    eventCoupon = await this.eventCouponRepository.update(updateEventCouponDto);
    return eventCoupon;
  }

}
