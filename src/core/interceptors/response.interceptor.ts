import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
} from '@nestjs/common';
import { Observable, map } from 'rxjs';
import { Response } from 'express';
import { ISuccessResponse } from '@shared/interfaces/http-response.interface';

@Injectable()
export class ResponseInterceptor<T>
  implements NestInterceptor<T, ISuccessResponse<T>>
{
  intercept(
    context: ExecutionContext,
    next: CallHandler<T>,
  ): Observable<ISuccessResponse<T>> {
    return next.handle().pipe(
      map((data: T): ISuccessResponse<T> => {
        const res = context.switchToHttp().getResponse<Response>();

        let message = 'Request successful';
        let responseData: T | undefined = data;

        if (
          typeof data === 'object' &&
          data !== null &&
          'message' in data &&
          typeof (data as Record<string, unknown>).message === 'string'
        ) {
          message = (data as Record<string, unknown>).message as string;

          const rest = Object.fromEntries(
            Object.entries(data as Record<string, unknown>).filter(
              ([key]) => key !== 'message',
            ),
          );
          responseData = Object.keys(rest).length ? (rest as T) : undefined;
        }

        const baseResponse = {
          statusCode: res.statusCode,
          success: true,
          message,
          timestamp: new Date().toISOString(),
        };

        // ✅ Only include data if it exists
        return responseData
          ? { ...baseResponse, data: responseData }
          : baseResponse;
      }),
    );
  }
}
