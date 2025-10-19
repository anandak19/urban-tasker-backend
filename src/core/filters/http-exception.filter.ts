import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { Request, Response } from 'express';

interface IHttpExceptionResponse {
  statusCode?: number;
  message?: string | string[];
  error?: string;
}

@Catch()
export class AllExceptionsFilter implements ExceptionFilter {
  catch(exception: unknown, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();

    //default val
    let status = HttpStatus.INTERNAL_SERVER_ERROR;
    let message = 'Internal Server Error';

    if (exception instanceof HttpException) {
      status = exception.getStatus();
      const res = exception.getResponse();

      // message
      if (typeof res === 'string') {
        message = res;
      } else if (this._isHttpExceptionResponse(res)) {
        const extracted = res.message;
        // if the messsage is array of messages
        if (Array.isArray(extracted)) {
          message = extracted[0];
        } else if (typeof extracted === 'string') {
          message = extracted;
        }
      }
    }

    response.status(status).json({
      statusCode: status,
      success: false,
      message,
      path: request.originalUrl,
      timeStamp: new Date().toISOString(),
    });
  }

  private _isHttpExceptionResponse(
    value: unknown,
  ): value is IHttpExceptionResponse {
    return (
      typeof value === 'object' &&
      value !== null &&
      ('message' in value || 'error' in value)
    );
  }
}
