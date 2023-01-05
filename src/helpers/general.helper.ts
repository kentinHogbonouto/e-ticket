import fs from "fs";
import path from "path";

import jwt from "jsonwebtoken";
import { parsePhoneNumber } from "libphonenumber-js";

import { Pagination } from "../interfaces/pagination.interface";
import { PhoneNumber } from "../interfaces/models/phone-number.interface";
import { Time } from "../interfaces/models/time.interface";
import { TokenPayload } from "../interfaces/token-payload.interface";

import EnvironmentConfigs from "../configs/environments";

export default class GeneralHelpers {
  /**
   * @function getPage
   * @description Get pagination data.
   * @param data The data
   * @param currentPage The current page
   * @param perPage The number of elements to return per page
   * @param totalElements The total elements in the model
   * @return Pagination
   */
  public static getPage(
    data: any[],
    currentPage: number,
    perPage: number,
    totalElements: number
  ): Pagination {
    perPage = perPage === -1 ? totalElements : perPage;

    const page: Pagination = {
      items: data,
      perPage,
      totalElements,
      currentPage,
      hasPreviousPage: currentPage > 1,
      previousPage: currentPage - 1,
      hasNextPage: perPage * currentPage < totalElements,
      nextPage: currentPage + 1,
      totalPages: Math.abs(Math.ceil(totalElements / perPage)),
    };

    return page;
  }

  /**
   * @function getPhoneNumber
   * @description Get phone number data.
   * @param phoneNumber The phoneNumber from which to extract data
   * @return PhoneNumber
   */
  public static getPhoneNumber(phoneNumber: string): PhoneNumber {
    const parsedPhoneNumber = parsePhoneNumber(phoneNumber);

    return {
      phone: parsedPhoneNumber.nationalNumber,
      isoCode: parsedPhoneNumber.countryCallingCode,
      value: parsedPhoneNumber.number,
      countryCode: parsedPhoneNumber.country,
    };
  }

  /**
   * @function getTime
   * @description Get time data.
   * @param time The time from which to extract data
   * @return Time
   */
  public static getTime(time: Time): Time {
    const hour = time.hour < 10 ? `0${time.hour}` : time.hour;
    const minute = time.minute < 10 ? `0${time.minute}` : time.minute;

    return {
      hour: time.hour,
      minute: time.minute,
      value: `${hour}:${minute}`,
    };
  }

  /**
   * @function generateOrganizerToken
   * @description Generate JWt Token for organizer.
   * @param payload The token payload
   * @return string
   */
  public static generateOrganizerToken(payload: TokenPayload): string {
    const secret = fs.readFileSync(
      path.join(__dirname, "..", "configs", "certs", "organizers", "private.pem")
    );

    return jwt.sign(payload, secret, {
      algorithm: EnvironmentConfigs.getJwtTokenAlgorithm(),
      expiresIn: EnvironmentConfigs.getJwtTokenDuration(),
    } as any);
  }

  /**
   * @function generateAdminToken
   * @description Generate JWt Token for admins.
   * @param payload The token payload
   * @return string
   */
  public static generateAdminToken(payload: TokenPayload): string {
    const secret = fs.readFileSync(
      path.join(__dirname, "..", "configs", "certs", "admins", "private.pem")
    );

    return jwt.sign(payload, secret, {
      algorithm: EnvironmentConfigs.getJwtTokenAlgorithm(),
      expiresIn: EnvironmentConfigs.getJwtTokenDuration(),
    } as any);
  }
}
