import EnvironmentConfigs from "../configs/environments";
import multer from "multer"

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

  /**
   * @function uploadFile
   * @description upload file
   * @return any
   */
  public static uploadFile(mimetype: string): any {
    const storage = multer.diskStorage({
      destination: (req: any, file: any, callback: any) => {
        callback(null, '../assets/image');
      },
      filename: (req: any, file: any, callback: any) => {
        callback(null, file.fieldname);
      }
    });
  }
}
