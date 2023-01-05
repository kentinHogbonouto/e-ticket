import { FilterQuery } from "mongoose";

import EventTypesModel from "../models/event-types.model";

import { CreateEventTypesDto, UpdateEventTypesDto } from "../interfaces/dto/repositories/event-types.dto";
import { IFindAllEventTypesDto } from "../interfaces/dto/services/event-types.dto";
import { EventTypes } from "../interfaces/event-types.model";

import { QuerySort } from "../../../../interfaces/models/query.enum";

export default class EventTypesRepository {
  public async countAll(): Promise<number> {
      return await this.count();
    }
  
  public async findAll(iFindAllEventTypesDto: IFindAllEventTypesDto): Promise<EventTypes[]> {
    if (iFindAllEventTypesDto.page && iFindAllEventTypesDto.size) {
      return await EventTypesModel.find()
        .skip((iFindAllEventTypesDto.page - 1) * iFindAllEventTypesDto.size)
        .limit(iFindAllEventTypesDto.size)
        .sort({ createdAt: iFindAllEventTypesDto.sort as QuerySort });
    }
    return await EventTypesModel.find()
      .sort({ createdAt: iFindAllEventTypesDto.sort as QuerySort });
  }

  public async findById(id: string): Promise<EventTypes | null> {
    return await EventTypesModel.findById(id)
  }

  public async findByName(name: string): Promise<EventTypes | null> {
    const query = { name };

    return await EventTypesModel.findOne(query)
  }

  public async create(createEventTypesDto: CreateEventTypesDto): Promise<EventTypes> {
    return await EventTypesModel.create({
      name: createEventTypesDto.name
    });
  }

  public async update(
    updateEventTypesDto: UpdateEventTypesDto
  ): Promise<EventTypes | null> {
    const eventTypes = await EventTypesModel.findById(updateEventTypesDto.id);
    if (!eventTypes) return null;

    if (updateEventTypesDto.name) eventTypes.name = updateEventTypesDto.name;

    return await eventTypes.save();
  }

  public async delete(id: string): Promise<EventTypes | null> {
    const event = await EventTypesModel.findById(id);
    if (!event) return null;

    return await event.remove();
  }

  private async count(query?: FilterQuery<EventTypes>): Promise<number> {
    if (query) {
      return await EventTypesModel.countDocuments(query);
    }
    return await EventTypesModel.countDocuments();
  }
}
