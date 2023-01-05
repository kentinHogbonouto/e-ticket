import createHttpError from "http-errors";

import PasswordHelpers from "../../../../helpers/password.helper";
import GeneralHelpers from "../../../../helpers/general.helper";

import AdminService from "../../admins/services/admin.service";
import OrganizerService from "../../organizer/services/organizer.service";


import { UserType } from "../../../../interfaces/token-payload.interface";

import { AuthValidationMessages } from "../validations/auth.validation";

export default class AuthService {
  constructor(
    private adminService: AdminService,
    private organizerService: OrganizerService
  ) {}

  public async authenticate(
    uername: string,
    password: string
  ): Promise<string> {
    let token = "";

    const organizer = await this.organizerService.findByEmail(uername);
    if (organizer) {
      if (!organizer.password) {
        throw new createHttpError.Forbidden(
          AuthValidationMessages.INCORRECT_PASSWORD
        );
      }
      const isEqual = await PasswordHelpers.comparePasswords(
        password,
        organizer.password
      );
      if (!isEqual) {
        throw new createHttpError.Forbidden(
          AuthValidationMessages.INCORRECT_PASSWORD
        );
      }

      token = GeneralHelpers.generateOrganizerToken({
        userId: organizer.id,
        userType: UserType.ORGANIZER
      });
    }

    const admin = await this.adminService.findByUsername(uername);
    if (admin) {
      if (!admin.password) {
        throw new createHttpError.Forbidden(
          AuthValidationMessages.INCORRECT_PASSWORD
        );
      }
      const isEqual = await PasswordHelpers.comparePasswords(
        password,
        admin.password
      );
      if (!isEqual) {
        throw new createHttpError.Forbidden(
          AuthValidationMessages.INCORRECT_PASSWORD
        );
      }

      token = GeneralHelpers.generateAdminToken({
        userId: admin.id,
        userType: UserType.ADMIN,
      });
    }
    if (!admin && !organizer) {
      throw new createHttpError.Forbidden(
        AuthValidationMessages.INCORRECT_USERNAME
      );
    }

    return token;
  }

  public async sendResetPasswordEmail(email: string): Promise<void> {
    let user: any   = await this.adminService.findByEmail(email);
    if (!user) {
      throw new createHttpError.Forbidden(
        AuthValidationMessages.INCORRECT_USERNAME
      );
    }

    user = await this.adminService.generateResetPasswordToken(user.id);
  }
}
