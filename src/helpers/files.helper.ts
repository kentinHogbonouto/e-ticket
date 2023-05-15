import EnvironmentConfigs from "../configs/environments";
import multer from "multer"
import { join, extname } from "path";
const uploadPath = join(process.cwd(), "upload", "images");

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
  public static uploadFile(): any {
    const storage = multer.diskStorage({
      destination: function (req, file, cb) {
        cb(null, uploadPath);
      },
      filename: function (req, file, cb) {
        const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
        cb(null, file.fieldname + "-" + uniqueSuffix + extname(file.originalname));
      },
    });
    
    multer({
      storage,
      fileFilter: function (req, file, cb) {
        if (
          ["image/jpeg", "image/png", "image/jpg", "image/jpeg"].includes(
            file.mimetype
          )
        ) {
          cb(null, true);
        } else {
          cb(null, false);
        }
      },
    });
  }
}
