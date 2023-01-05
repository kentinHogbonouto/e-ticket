export interface ApiResponseMessage {
  message: string;
  success: boolean;
}

export interface ApiResponse extends ApiResponseMessage {
  data: any;
}
