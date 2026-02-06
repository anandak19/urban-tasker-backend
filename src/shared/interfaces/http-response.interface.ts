export interface HttpResponse {
  statusCode: number;
  success: boolean;
  message: string;
  timestamp: string;
}

export interface IErrorResponse extends HttpResponse {
  path: string;
}

// use this insted of IBasicResponseData
export interface ISuccessResponse<T> extends HttpResponse {
  data?: T;
}
