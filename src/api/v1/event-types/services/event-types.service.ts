import createHttpError from "http-errors";

import EventTypesRepository from "../repositories/event-types.repository";

import { CreateEventTypesDto, UpdateEventTypesDto } from "../interfaces/dto/repositories/event-types.dto";
import { IFindAllEventTypesDto, IFindEventTypesDto, ICreateEventTypesDto, IUpdateEventTypesDto } from "../interfaces/dto/services/event-types.dto";
import { EventTypes } from "../interfaces/event-types.model";

import { EventTypesValidationMessage } from "../validations/event-types.validations";

export default class EventTypesService {
  constructor(private eventTypesRepository: EventTypesRepository) {}

  /**
   * @function findAll
   * @description: Get event type list
   * @param iFindAllEventTypesDto: list sort by asc, number of page and document size
   * @return Promise<{eventsTypes: EventTypes[]; totalElements: number;}>
   */
   public async findAll(
    iFindAllEventTypesDto: IFindAllEventTypesDto
  ): Promise<{ eventsTypes: EventTypes[]; totalElements: number }> {
    let eventsTypes: EventTypes[] = [];

    let totalElements = await this.eventTypesRepository.countAll();

    if (iFindAllEventTypesDto.size === -1) {
      eventsTypes = await this.eventTypesRepository.findAll({
        sort: iFindAllEventTypesDto.sort,
      });
    } else {
      eventsTypes = await this.eventTypesRepository.findAll({
        sort: iFindAllEventTypesDto.sort,
        page: iFindAllEventTypesDto.page,
        size: iFindAllEventTypesDto.size,
      });
    }

    return { eventsTypes, totalElements };
  }

  /**
   * @function findOne
   * @description: Get a event type by id
   * @param id: The event type id.
   * @return Promise<Events>
   */
  public async findOne(id: string): Promise<EventTypes> {
    let eventTypes = await this.eventTypesRepository.findById(id);

    if (!eventTypes) {
      throw new createHttpError.NotFound(EventTypesValidationMessage.NOT_FOUND);
    }

    return eventTypes;
  }

  /**
   * @function create
   * @description: Create event type
   * @param iCreateEventTypesDto: An object of type CreateEventTypesDto containing the event information.
   * @return Promise<EventTypes>
   */
  public async create(iCreateEventTypesDto: ICreateEventTypesDto): Promise<EventTypes> {
    const existingEventWithName = await this.eventTypesRepository.findByName(
      iCreateEventTypesDto.name
    );

    if (existingEventWithName) {
      throw new createHttpError.Forbidden(
        EventTypesValidationMessage.EVENTS_ALREADY_EXIST
      );
    }

    const createEventTypesDto: CreateEventTypesDto = {
      name: iCreateEventTypesDto.name,
    };

    let eventTypes = await this.eventTypesRepository.create(createEventTypesDto);

    return eventTypes;
  }

  /**
   * @function update
   * @description: Update event type
   * @param iUpdateEventTypesDto: An object of type IUpdateEventTypesDto containing the event type information
   * @return Promise<EventTypes>
   */
  public async update(iUpdateEventTypesDto: IUpdateEventTypesDto): Promise<EventTypes> {
    let event: any = await this.getEventTypeById(iUpdateEventTypesDto.id);

    const updateEventTypesDto: UpdateEventTypesDto = {
      id: iUpdateEventTypesDto.id,
      name: iUpdateEventTypesDto.name
    };

    if (iUpdateEventTypesDto.name) {
      const existingEventWithName =
        await this.eventTypesRepository.findByName(iUpdateEventTypesDto.name);
      if (existingEventWithName) {
        throw new createHttpError.Forbidden(
          EventTypesValidationMessage.EVENTS_ALREADY_EXIST
        );
      }
      updateEventTypesDto.name = iUpdateEventTypesDto.name;
    }

    event = await this.eventTypesRepository.update(updateEventTypesDto);
    return event;
  }

  /**
   * @function delete
   * @description: Delete event type
   * @param id: event type id
   * @return Promise<Events>
   */
  public async delete(id: string): Promise<void>{
    let eventTypes: any = await this.eventTypesRepository.delete(id);

    if(!eventTypes){
      throw new createHttpError.NotFound(EventTypesValidationMessage.NOT_FOUND)
    }

    return;
  }

  /**
   * TODO
   * @function getEventTypeById
   * @description
   * @param id
   * @return Promise<EventTypes>
   */
   private async getEventTypeById(id: any): Promise<EventTypes> {
    const eventTypes = await this.eventTypesRepository.findById(id);
    if (!eventTypes) {
      throw new createHttpError.NotFound(EventTypesValidationMessage.NOT_FOUND);
    }
    return eventTypes;
  }

}
