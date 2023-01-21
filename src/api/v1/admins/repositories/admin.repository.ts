import crypto from "crypto";

import { FilterQuery } from "mongoose";

import AdminModel from "../models/admin.model";

import PasswordHelpers from "../../../../helpers/password.helper";

import {
  CreateAdminDto,
  UpdateAdminDto,
} from "../interfaces/dto/repositories/admin.dto";
import { Admin } from "../interfaces/admin.model";
import { QuerySort } from "../../../../interfaces/models/query.enum";
import { IFindAllAdminsDto } from "../interfaces/dto/services/admin.dto";

import EnvironmentConfigs from "../../../../configs/environments";

export default class AdminRepository {
  public async countAll(): Promise<number> {
    return await this.count();
  }

  public async findAll({
    size,
    page,
    sort,
  }: IFindAllAdminsDto): Promise<Admin[]> {
    if (page && size) {
      return await AdminModel.find()
        .skip((page - 1) * size)
        .limit(size)
        .select("+role")
        .populate("role")
        .sort({ createdAt: sort as QuerySort });
    }
    return await AdminModel.find()
      .select("+role")
      .populate("role")
      .sort({ createdAt: sort as QuerySort });
  }

  public async findByUsername(
    username: string,
    selectPassword: boolean
  ): Promise<Admin | null> {
    const query = { username };
    if (selectPassword) {
      return await AdminModel.findOne(query).select("password");
    }
    return await AdminModel.findOne(query);
  }

  public async findByEmail(email: string): Promise<Admin | null> {
    const query = { email };
    return await this.findOne(query);
  }

  public async findByResetPasswordRequestId(
    requestId: string
  ): Promise<Admin | null> {
    const query = { resetPasswordRequestId: requestId };
    return await this.findOne(query);
  }

  public async findByResetToken(token: string): Promise<Admin | null> {
    const query = { resetToken: token };
    return await AdminModel.findOne(query).select(
      "resetToken resetTokenExpiration resetPasswordRequestId email"
    );
  }

  public async findById(id: string): Promise<Admin | null> {
    return await AdminModel.findById(id).select("+role").populate("role");
  }

  public async create(createAdminDto: CreateAdminDto): Promise<Admin> {
    const hashedPassword = await PasswordHelpers.hashPassword(
      createAdminDto.password
    );

    return await AdminModel.create({
      username: createAdminDto.username,
      email: createAdminDto.email,
      password: hashedPassword,
      role: createAdminDto.role,
    });
  }

  public async update(
    updateAdminDto: UpdateAdminDto
  ): Promise<Admin | null> {
    const admin = await AdminModel.findById(updateAdminDto.id);
    if (!admin) return null;

    if (updateAdminDto.email) admin.email = updateAdminDto.email;
    if (updateAdminDto.username) admin.username = updateAdminDto.username;
    if (updateAdminDto.role) admin.role = updateAdminDto.role;
    if (updateAdminDto.password) {
      admin.password = await PasswordHelpers.hashPassword(
        updateAdminDto.password
      );
    }

    return await admin.save();
  }

  public async generateResetPasswordToken(id: string): Promise<Admin | null> {
    const admin = await AdminModel.findById(id);
    if (!admin) return null;

    admin.resetToken = crypto.randomBytes(60).toString("hex");
    admin.resetTokenExpiration = new Date(
      Date.now() + EnvironmentConfigs.getResetPasswordTokenDuration()
    );
    return await admin.save();
  }

  public async cleanResetPasswordToken(id: string): Promise<Admin | null> {
    const admin = await AdminModel.findById(id);
    if (!admin) return null;

    admin.resetToken = undefined;
    admin.resetTokenExpiration = undefined;
    return await admin.save();
  }

  private async findOne(query: FilterQuery<Admin>): Promise<Admin | null> {
    return await AdminModel.findOne(query);
  }

  private async count(query?: FilterQuery<Admin>): Promise<number> {
    if (query) {
      return await AdminModel.countDocuments(query);
    }
    return await AdminModel.countDocuments();
  }
}
