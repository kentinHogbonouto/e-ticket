import { FilterQuery } from "mongoose";

import EventModel from "../models/event.model";

import {
  CreateEventDto,
  UpdateEventDto,
} from "../interfaces/dto/repositories/event.dto";
import { IFindAllEventDto } from "../interfaces/dto/services/event.dto";
import { Event } from "../interfaces/event.model";
import organizerModel from "../../organizer/models/organizer.model";

import { QuerySort } from "../../../../interfaces/models/query.enum";
import { Organizer } from "../../organizer/interfaces/organizer.model";

export default class EventRepository {
  public async countAll(): Promise<number> {
    return await this.count();
  }

  public async findAll(iFindAllEventDto: IFindAllEventDto): Promise<Event[]> {
    if (iFindAllEventDto.page && iFindAllEventDto.size) {
      return await EventModel.find()
        .skip((iFindAllEventDto.page - 1) * iFindAllEventDto.size)
        .limit(iFindAllEventDto.size)
        .sort({ createdAt: iFindAllEventDto.sort as QuerySort });
    }
    return await EventModel.find().sort({
      createdAt: iFindAllEventDto.sort as QuerySort,
    });
  }

  public async findById(id: string): Promise<Event | null> {
    return await EventModel.findById(id)
      .select("+organizer")
      .populate("organizer")
  }

  public async findByName(name: string): Promise<Event | null> {
    const query = { name };

    return await EventModel.findOne(query);
  }

  public async create(createEventDto: CreateEventDto): Promise<Event> {
    let event =  await EventModel.create({
      name: createEventDto.name,
      shortDescription: createEventDto.shortDescription,
      type: createEventDto.type,
      theme: createEventDto.theme,
      categorie: createEventDto.categorie,
      place: createEventDto.place,
      startDate: createEventDto.startDate,
      startTime: createEventDto.startTime,
      endDate: createEventDto.endDate,
      endTime: createEventDto.endTime,
      organizer: createEventDto.organizer,
      cover: createEventDto.cover
    });

    let organizer: any  = await organizerModel.findById(
      createEventDto.organizer
      ).select("+event");

      console.log("organizer: ", organizer);
      

    if (organizer) {
      organizer.event.push(event._id);
      await organizer.save();
    }

      return event
  }

  public async update(updateEventDto: UpdateEventDto): Promise<Event | null> {
    const event = await EventModel.findById(updateEventDto.id);
    if (!event) return null;

    if (updateEventDto.name) event.name = updateEventDto.name;
    if (updateEventDto.shortDescription)
      event.shortDescription = updateEventDto.shortDescription;
    if (updateEventDto.type) event.type = updateEventDto.type;
    if (updateEventDto.theme) event.theme = updateEventDto.theme;
    if (updateEventDto.place) event.place = updateEventDto.place;
    if (updateEventDto.categorie) event.categorie = updateEventDto.categorie;
    if (updateEventDto.startDate) event.startDate = updateEventDto.startDate;
    if (updateEventDto.endDate) event.endDate = updateEventDto.endDate;
    if (updateEventDto.startTime) event.startTime = updateEventDto.startTime;
    if (updateEventDto.endTime) event.endTime = updateEventDto.endTime;
    if (updateEventDto.cover) event.cover = updateEventDto.cover;

    return await event.save();
  }

  public async delete(id: string): Promise<Event | null> {
    const event = await EventModel.findById(id);
    if (!event) return null;

    return await event.remove();
  }

  private async count(query?: FilterQuery<Event>): Promise<number> {
    if (query) {
      return await EventModel.countDocuments(query);
    }
    return await EventModel.countDocuments();
  }
}
