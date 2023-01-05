export default class ApiResponses {
  static successMessage(message: string, success: boolean) {
    return {
      message,
      success,
    };
  }

  static success(data: Array<any> | Object, message: string) {
    return {
      data,
      ...this.successMessage(message, true),
    };
  }

  static error(message: string, data: any) {
    return {
      data,
      ...this.successMessage(message || "Some error occurred", false),
    };
  }
}
