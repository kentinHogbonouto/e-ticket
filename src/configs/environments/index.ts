import dotenv from "dotenv";

dotenv.config();
export default class EnvironmentConfigs {
  static inProduction: boolean = process.env.NODE_ENV === "production";

  /**
   * @function getServerPort
   * @description Get server PORT.
   * @return number
   */
  static getServerPort(): number {
    return Number(process.env.PORT) || 3339;
  }

  /**
   * @function getDatabaseURL
   * @description Get the database URL.
   * @return string
   */
  static getDatabaseURL(): string {
    const MONGODB_USERNAME: string | undefined = EnvironmentConfigs.inProduction
      ? process.env.EVENT_MANAGER_MONGODB_USERNAME
      : process.env.EVENT_MANAGER_DEV_MONGODB_USERNAME;

    const MONGODB_PASSWORD: string | undefined = EnvironmentConfigs.inProduction
      ? process.env.EVENT_MANAGER_MONGODB_PASSWORD
      : process.env.EVENT_MANAGER_DEV_MONGODB_PASSWORD;

    const MONGODB_DATABASE_NAME: string | undefined =
      EnvironmentConfigs.inProduction
        ? process.env.EVENT_MANAGER_MONGODB_DATABASE_NAME
        : process.env.EVENT_MANAGER_DEV_MONGODB_DATABASE_NAME;

    const MONGODB_DATABASE_HOST: string | undefined =
      EnvironmentConfigs.inProduction
        ? process.env.EVENT_MANAGER_MONGODB_DATABASE_HOST
        : process.env.EVENT_MANAGER_DEV_MONGODB_DATABASE_HOST;

    return `mongodb+srv://${MONGODB_USERNAME}:${MONGODB_PASSWORD}@${MONGODB_DATABASE_HOST}/${MONGODB_DATABASE_NAME}`;
  }

  /**
   * @function getAppName
   * @description Get server app name.
   * @return string
   */
  static getAppName(): string {
    return process.env.EVENT_MANAGER_APP_NAME || "event manager server";
  }

  /**
   * @function getServerURL
   * @description Get server app name.
   * @return string
   */
  static getServerURL(): string {
    return EnvironmentConfigs.inProduction
      ? process.env.EVENT_MANAGER_SERVER_URL || ""
      : `http://localhost:${this.getServerPort()}`;
  }

  /**
   * @function serverStartedMessage
   * @description Get server started message.
   * @return string
   */
  static serverStartedMessage(): string {
    return `${this.getAppName()} server started on ${this.getServerURL()}`;
  }

  /**
   * @function getJwtTokenAlgorithm
   * @description Get Jwt algorithm used to generate the JWT token.
   * @return string[]
   */
  static getJwtTokenAlgorithm(): string[] {
    return (process.env.JWT_TOKEN_ALGORITHM as any) || [""];
  }

  /**
   * @function getJwtTokenDuration
   * @description Get Jwt duration.
   * @return string
   */
  static getJwtTokenDuration(): string {
    return process.env.JWT_TOKEN_DURATION || "24h";
  }

  /**
   * @function getAuthorizedFileMinetypes
   * @description Get authorized file minetypes.
   * @return string[]
   */
  static getAuthorizedFileMinetypes(): string[] {
    const minetypes = [
      "image/png",
      "image/jpg",
      "image/jpeg",
      "image/svg+xml",
      "application/octet-stream",
    ];
    return minetypes;
  }

  /**
   * @function getAuthorizedFileTypes
   * @description Get authorized file types.
   * @return string[]
   */
  static getAuthorizedFileTypes(): string[] {
    const types = ["IMAGE", "PDF", "VIDEO"];
    return types;
  }

  /**
   * @function getMaximumFileSize
   * @description Get maximum file size in MB.
   * @return number
   */
  static getMaximumFileSize(): number {
    return Number(process.env.MAX_FILE_SIZE_MB) || 5;
  }

  /**
   * @function getResetPasswordTokenDuration
   * @description Get the duration of reset password token in milliseconds. Default 1h
   * @return number
   */
  static getResetPasswordTokenDuration(): number {
    return (Number(process.env.RESET_PASSWORD_TOKEN_DURATION) || 3600) * 1000;
  }

  /**
   * @function getPaginationItemsPerPage
   * @description Get the number of items per that will be returned per page
   * @return number
   */
  static getPaginationItemsPerPage(): number {
    return Number(process.env.ITEMS_PER_PAGE) || 12;
  }

  /**
   * @function getPasswordMinLength
   * @description Get the minimum length required for passwords
   * @return number
   */
  static getPasswordMinLength(): number {
    return Number(process.env.PASSWORD_MIN_LENGTH) || 8;
  }

}
