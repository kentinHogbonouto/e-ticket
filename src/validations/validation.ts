import { parsePhoneNumber } from "libphonenumber-js";

import EnvironmentConfigs from "../configs/environments";

export class ValidationMessages {
  public static FIELD_REQUIRED = "This field is required.";
  public static USERNAME_ALREADY_IN_USE = "Username already in use.";
  public static EMAIL_ALREADY_IN_USE = "Email address already in use.";
  public static INVALID_EMAIL_ADDRESS = "Invalid email address.";
  public static ORGANIZER_NOT_FOUND = "organizer not found.";
  public static PASSWORD_MUST_BE_PROVIDED = "Password must be provided.";
  public static INCORRECT_OLD_PASSWORD = "Incorrect old password.";
  public static MUST_BE_AN_ARRAY = "Must be an array.";
  public static TOKEN_EXPIRED = "Token expired.";

  public static lengthConstraintsFailed(constraints: any) {
    let error = "";

    if (!constraints) return error;

    if (constraints.min) {
      error = `Must contain at least ${constraints.min} ${
        constraints.min > 1 ? "characters" : "character"
      }`;
    }
    if (constraints.max) {
      error = `Must contain at must ${constraints.max} ${
        constraints.max > 1 ? "characters" : "character"
      }`;
    }

    return error;
  }

  public static isPasswordConfirmationMatch(confirm: string, password: string) {
    return new Promise((resolve, reject) => {      
      if (confirm !== password) {
        reject({
          message: "Passwords must match.",
          errorCode: 4,
        });
      }
      resolve(true);
    });
  }
}
