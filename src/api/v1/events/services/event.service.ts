import createHttpError from "http-errors";

import EventRepository from "../repositories/event.repository";

import EventTypesService from "../../event-types/services/event-types.service";

import { CreateEventDto, UpdateEventDto } from "../interfaces/dto/repositories/event.dto";
import { IFindAllEventDto, ICreateEventDto, IUpdateEventDto } from "../interfaces/dto/services/event.dto";
import { Event } from "../interfaces/event.model";

import { EventValidationMessage } from "../validations/event.validations";

export default class EventService {
  constructor(private eventRepository: EventRepository, private eventTypesService: EventTypesService) {}

  /**
   * @function findAll
   * @description: Get event list
   * @param iFindAllEventDto: list sort by asc, number of page and document size
   * @return Promise<{events: Events[]; totalElements: number;}>
   */
   public async findAll(
    iFindAllEventDto: IFindAllEventDto
  ): Promise<{ events: Event[]; totalElements: number }> {
    let events: Event[] = [];

    let totalElements = await this.eventRepository.countAll();

    if (iFindAllEventDto.size === -1) {
      events = await this.eventRepository.findAll({
        sort: iFindAllEventDto.sort,
      });
    } else {
      events = await this.eventRepository.findAll({
        sort: iFindAllEventDto.sort,
        page: iFindAllEventDto.page,
        size: iFindAllEventDto.size,
      });
    }

    return { events, totalElements };
  }

  /**
   * @function findOne
   * @description: Get a event by id
   * @param id: The event id.
   * @return Promise<Events>
   */
  public async findOne(id: string): Promise<Event> {
    let event = await this.eventRepository.findById(id);

    if (!event) {
      throw new createHttpError.NotFound(EventValidationMessage.NOT_FOUND);
    }

    return event;
  }

  /**
   * @function create
   * @description: Create event
   * @param iCreateEventDto: An object of type CreateEventDto containing the event information.
   * @return Promise<Events>
   */
  public async create(iCreateEventDto: ICreateEventDto): Promise<Event> {
    const existingEventWithName = await this.eventRepository.findByName(
      iCreateEventDto.name
    );

    if (existingEventWithName) {
      throw new createHttpError.Forbidden(
        EventValidationMessage.EVENTS_ALREADY_EXIST
      );
    }

    const createEventDto: CreateEventDto = {
      name: iCreateEventDto.name,
      shortDescription: iCreateEventDto.shortDescription,
      type: iCreateEventDto.type,
      theme: iCreateEventDto.theme,
      place: iCreateEventDto.place,
      categorie: iCreateEventDto.categorie,
      startDate: iCreateEventDto.startDate,
      startTime: iCreateEventDto.startTime,
      endDate: iCreateEventDto.endDate,
      endTime: iCreateEventDto.endTime,
      organizer: iCreateEventDto.organizerId,
      cover: iCreateEventDto.cover,
    };

    let event = await this.eventRepository.create(createEventDto);

    return event;
  }

  /**
   * @function update
   * @description: Update event
   * @param iUpdateEventDto: An object of type IUpdateEventDto containing the event information
   * @return Promise<Events>
   */
  public async update(iUpdateEventDto: IUpdateEventDto): Promise<Event> {
    let event: any = await this.getEventById(iUpdateEventDto.id);

    const updateEventDto: UpdateEventDto = {
      id: iUpdateEventDto.id,
      name: iUpdateEventDto.name,
      shortDescription: iUpdateEventDto.shortDescription,
      theme: iUpdateEventDto.theme,
      categorie: iUpdateEventDto.categorie,
      place: iUpdateEventDto.place,
      startDate: iUpdateEventDto.startDate,
      startTime: iUpdateEventDto.startTime,
      endDate: iUpdateEventDto.endDate,
      endTime: iUpdateEventDto.endTime,
      cover: iUpdateEventDto.cover
    };

    if (iUpdateEventDto.name) {
      const existingEventWithName =
        await this.eventRepository.findByName(iUpdateEventDto.name);
      if (existingEventWithName) {
        throw new createHttpError.Forbidden(
          EventValidationMessage.EVENTS_ALREADY_EXIST
        );
      }
      updateEventDto.name = iUpdateEventDto.name;
    }

    event = await this.eventRepository.update(updateEventDto);
    return event;
  }

  /**
   * @function delete
   * @description: Delete event
   * @param id: event id
   * @return Promise<Events>
   */
  public async delete(id: string): Promise<void>{
    let event: any = await this.eventRepository.delete(id);

    if(!event){
      throw new createHttpError.NotFound(EventValidationMessage.NOT_FOUND)
    }

    return;
  }

  /**
   * @function getEventById
   * @description
   * @param id
   * @return Promise<Events>
   */
   private async getEventById(id: any): Promise<Event> {
    const event = await this.eventRepository.findById(id);
    if (!event) {
      throw new createHttpError.NotFound(EventValidationMessage.NOT_FOUND);
    }
    return event;
  }

}
