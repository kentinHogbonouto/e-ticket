import bcrypt from "bcryptjs";

export default class PasswordHelpers {
  /**
   * @function hashPassword
   * @description Generate hash password.
   * @param password The password to hash.
   * @return Promise<string>
   */
  public static hashPassword(password: string): Promise<string> {
    return new Promise(function (resolve, reject) {
      resolve(bcrypt.hash(password, 15));
    });
  }

  /**
   * @function comparePasswords
   * @description Compare two passwords.
   * @param password The password to compare with the encrypted password.
   * @param encrypted The encrypted password.
   * @return Promise<boolean>
   */
  public static async comparePasswords(
    password = "",
    encrypted = ""
  ): Promise<boolean> {
    return new Promise(function (resolve, reject) {
      resolve(bcrypt.compare(password, encrypted));
    });
  }
}
