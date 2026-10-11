import {
  ExecutionContext,
  HttpException,
  HttpStatus,
  Injectable,
} from '@nestjs/common';
import { ThrottlerGuard, ThrottlerLimitDetail } from '@nestjs/throttler';
import { THROTTLER_ERRORS } from '@shared/constants/messages/error-messaes.constants';

@Injectable()
export class AppThrottlerGuard extends ThrottlerGuard {
  protected throwThrottlingException(
    context: ExecutionContext,
    throttlerLimitDetail: ThrottlerLimitDetail,
  ): Promise<void> {
    // LOG
    throw new HttpException(
      THROTTLER_ERRORS.TOO_MANY_REQUESTS,
      HttpStatus.TOO_MANY_REQUESTS,
    );
  }
}
