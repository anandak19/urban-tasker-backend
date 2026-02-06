import { AuthGuard } from '@core/guards/auth/auth.guard';
import { TaskerGuard } from '@core/guards/tasker-guard/tasker-guard.guard';
import { GetReviewsFilterDto } from '@modules/reviews/dtos/get-reviews-filter.dto';
import type { IReviewService } from '@modules/reviews/interfaces/review-services.interface';
import { REVIEW_TOKEN } from '@modules/reviews/reviews.tokens';
import {
  Controller,
  Get,
  Inject,
  Query,
  Request,
  UseGuards,
} from '@nestjs/common';
import type { IAuthenticatedReqeust } from '@shared/interfaces/request.interface';

@UseGuards(AuthGuard, TaskerGuard)
@Controller('tasker/reviews')
export class TaskerReviewController {
  constructor(
    @Inject(REVIEW_TOKEN.REVIEW_SERVICE) private _reviewService: IReviewService,
  ) {}

  /**
   * Find all reviews of logged in tasker
   */
  @Get('me')
  findMyReviews(
    @Request() req: IAuthenticatedReqeust,
    @Query() filter: GetReviewsFilterDto,
  ) {
    return this._reviewService.findMyReviews(req.user.id, filter);
  }

  /**
   * Find avarage rating of logged in tasker
   */
  @Get('average')
  findMyAvarageRating(@Request() req: IAuthenticatedReqeust) {
    return this._reviewService.findAvarageRating(req.user.id);
  }
}
