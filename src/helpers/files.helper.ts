import EnvironmentConfigs from "../configs/environments";

export default class FilesHelpers {
  /**
   * @function getFileType
   * @description Get file type.
   * @return string
   */
  public static getFileType(mimetype: string): string {
    if (mimetype.split("/")[0] !== "application") {
      return mimetype.split("/")[0];
    } else if (mimetype.split("/")[0] === "application") {
      if (mimetype.split("/")[1] == "octet-stream") {
        return "image";
      }
      return mimetype.split("/")[1];
    }
    return "other";
  }

  /**
   * @function getUploadedFileType
   * @description Get uplaoded file type.
   * @return string | undefined
   */
  public static getUploadedFileType(mimetype: string): string | undefined {
    return EnvironmentConfigs.getAuthorizedFileTypes().find(
      (type) => type.toLowerCase() === this.getFileType(mimetype).toLowerCase()
    );
  }
}
