import crypto from "crypto";

import { FilterQuery } from "mongoose";

import OrganizerModel from "../models/organizer.model";

import PasswordHelpers from "../../../../helpers/password.helper";

import {
  CreateOrganizerDto,
  UpdateOrganizerDto,
} from "../interfaces/dto/repositories/organizer.dto";
import { Organizer } from "../interfaces/organizer.model";
import { QuerySort } from "../../../../interfaces/models/query.enum";
import { IFindAllOrganizerDto } from "../interfaces/dto/services/organizer.dto";
import EnvironmentConfigs from "../../../../configs/environments";

export default class OrganizerRepository {
  public async countAll(): Promise<number> {
    return await this.count();
  }

  public async findAll({
    size,
    page,
    sort,
  }: IFindAllOrganizerDto): Promise<Organizer[]> {
    if (page && size) {
      return await OrganizerModel.find()
        .skip((page - 1) * size)
        .limit(size)
        .select("+role")
        .populate("role")
        .sort({ createdAt: sort as QuerySort });
    }
    return await OrganizerModel.find()
      .select("+role")
      .populate("role")
      .sort({ createdAt: sort as QuerySort });
  }

  public async findByEmail(
    email: string,
    selectPassword: boolean
  ): Promise<Organizer | null> {
    const query = { email };
    if (selectPassword) {
      return await OrganizerModel.findOne(query).select("+password +email");
    }
    return await OrganizerModel.findOne(query);
  }

  public async findByResetPasswordRequestId(
    requestId: string
  ): Promise<Organizer | null> {
    const query = { resetPasswordRequestId: requestId };
    return await this.findOne(query);
  }

  public async findByResetToken(token: string): Promise<Organizer | null> {
    const query = { resetToken: token };
    return await OrganizerModel.findOne(query).select(
      "resetToken resetTokenExpiration resetPasswordRequestId email"
    );
  }

  public async getOrganizerById(id: string): Promise<Organizer | null> {
    return await OrganizerModel.findById(id).select("+role").populate("role");
  }

  public async createOrganizer(
    createOrganizerDto: CreateOrganizerDto
  ): Promise<Organizer> {
    const hashedPassword = await PasswordHelpers.hashPassword(
      createOrganizerDto.password
    );

    return await OrganizerModel.create({
      lastName: createOrganizerDto.lastName,
      firstName: createOrganizerDto.firstName,
      companyName: createOrganizerDto.companyName,
      companyAddress: createOrganizerDto.companyAddress,
      companyArea: createOrganizerDto.companyArea,
      companyNumber: createOrganizerDto.companyNumber,
      email: createOrganizerDto.email,
      password: hashedPassword,
      role: createOrganizerDto.role,
    });
  }

  public async updateOrganizer(
    updateOrganizerDto: UpdateOrganizerDto
  ): Promise<Organizer | null> {
    const organizer = await OrganizerModel.findById(updateOrganizerDto.id);
    if (!organizer) return null;

    if (updateOrganizerDto.lastName)
      organizer.lastName = updateOrganizerDto.lastName;

    if (updateOrganizerDto.firstName)
      organizer.firstName = updateOrganizerDto.firstName;
    
    if (updateOrganizerDto.email) organizer.email = updateOrganizerDto.email;
    
    if (updateOrganizerDto.companyName)
      organizer.companyName = updateOrganizerDto.companyName;
    
    if (updateOrganizerDto.companyAddress)
      organizer.companyAddress = updateOrganizerDto.companyAddress;
    
    if (updateOrganizerDto.companyArea)
      organizer.companyArea = updateOrganizerDto.companyArea;
    
    if (updateOrganizerDto.companyNumber)
      organizer.companyNumber = updateOrganizerDto.companyNumber;
    
    if (updateOrganizerDto.password) {
      organizer.password = await PasswordHelpers.hashPassword(
        updateOrganizerDto.password
      );
    }

    return await organizer.save();
  }

  public async generateResetPasswordToken(
    id: string
  ): Promise<Organizer | null> {
    const organizer = await OrganizerModel.findById(id);
    if (!organizer) return null;

    organizer.resetToken = crypto.randomBytes(60).toString("hex");
    organizer.resetTokenExpiration = new Date(
      Date.now() + EnvironmentConfigs.getResetPasswordTokenDuration()
    );
    return await organizer.save();
  }

  public async cleanResetPasswordToken(id: string): Promise<Organizer | null> {
    const admin = await OrganizerModel.findById(id);
    if (!admin) return null;

    admin.resetToken = undefined;
    admin.resetTokenExpiration = undefined;
    return await admin.save();
  }

  private async findOne(
    query: FilterQuery<Organizer>
  ): Promise<Organizer | null> {
    return await OrganizerModel.findOne(query).select("password");
  }

  private async count(query?: FilterQuery<Organizer>): Promise<number> {
    if (query) {
      return await OrganizerModel.countDocuments(query);
    }
    return await OrganizerModel.countDocuments();
  }
}
