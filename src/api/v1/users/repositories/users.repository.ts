import crypto from "crypto";

import { FilterQuery } from "mongoose";

import UsersModel from "../models/users.model";

import PasswordHelpers from "../../../../helpers/password.helper";

import { CreateUsersDto, UpdateUsersDto } from "../interfaces/dto/repositories/users.dto";
import { Users } from "../interfaces/users.model";
import { QuerySort } from "../../../../interfaces/models/query.enum";
import { IFindAllUsersDto } from "../interfaces/dto/services/users.dto";

import EnvironmentConfigs from "../../../../configs/environments";

export default class UsersRepository {
  public async countAll(): Promise<number> {
    return await this.count();
  }

  public async findAll({
    size,
    page,
    sort,
  }: IFindAllUsersDto): Promise<Users[]> {
    if (page && size) {
      return await UsersModel.find()
        .skip((page - 1) * size)
        .limit(size)
        .select("+role")
        .populate("role")
        .sort({ createdAt: sort as QuerySort });
    }
    return await UsersModel.find()
      .select("+role")
      .populate("role")
      .sort({ createdAt: sort as QuerySort });
  }

  public async findByEmail(email: string): Promise<Users | null> {
    const query = { email };
    return await this.findOne(query);
  }

  public async findByResetPasswordRequestId(
    requestId: string
  ): Promise<Users | null> {
    const query = { resetPasswordRequestId: requestId };
    return await this.findOne(query);
  }

  public async findByResetToken(token: string): Promise<Users | null> {
    const query = { resetToken: token };
    return await UsersModel.findOne(query).select(
      "resetToken resetTokenExpiration resetPasswordRequestId email"
    );
  }

  public async findById(id: string): Promise<Users | null> {
    return await UsersModel.findById(id).select("+role").populate("role");
  }

  public async create(createUsersDto: CreateUsersDto): Promise<Users> {
    const hashedPassword = await PasswordHelpers.hashPassword(
      createUsersDto.password
    );

    return await UsersModel.create({
      lastName: createUsersDto.lastName,
      firstName: createUsersDto.firstName,
      email: createUsersDto.email,
      password: hashedPassword,
      role: createUsersDto.role,
    });
  }

  public async update(
    updateUsersDto: UpdateUsersDto
  ): Promise<Users | null> {
    const Users = await UsersModel.findById(updateUsersDto.id);
    if (!Users) return null;

    if (updateUsersDto.email) Users.email = updateUsersDto.email;
    if (updateUsersDto.password) {
      Users.password = await PasswordHelpers.hashPassword(
        updateUsersDto.password
      );
    }

    return await Users.save();
  }

  public async generateResetPasswordToken(id: string): Promise<Users | null> {
    const Users = await UsersModel.findById(id);
    if (!Users) return null;

    Users.resetToken = crypto.randomBytes(60).toString("hex");
    Users.resetTokenExpiration = new Date(
      Date.now() + EnvironmentConfigs.getResetPasswordTokenDuration()
    );
    return await Users.save();
  }

  public async cleanResetPasswordToken(id: string): Promise<Users | null> {
    const Users = await UsersModel.findById(id);
    if (!Users) return null;

    Users.resetToken = undefined;
    Users.resetTokenExpiration = undefined;
    return await Users.save();
  }

  private async findOne(query: FilterQuery<Users>): Promise<Users | null> {
    return await UsersModel.findOne(query);
  }

  public async delete(id: string): Promise<Users | null> {
    const institution = await UsersModel.findById(id);
    if (!institution) return null;

    return await institution.remove();
  }

  private async count(query?: FilterQuery<Users>): Promise<number> {
    if (query) {
      return await UsersModel.countDocuments(query);
    }
    return await UsersModel.countDocuments();
  }
}
