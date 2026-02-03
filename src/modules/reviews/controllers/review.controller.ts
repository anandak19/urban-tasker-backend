import {
  Body,
  Controller,
  Get,
  Inject,
  Param,
  Post,
  Query,
  Request,
  UseGuards,
} from '@nestjs/common';
import { REVIEW_TOKEN } from '../reviews.tokens';
import type { IReviewService } from '../interfaces/review-services.interface';
import type { IAuthenticatedReqeust } from '@shared/interfaces/request.interface';
import { AuthGuard } from '@core/guards/auth/auth.guard';
import { CreateReviewDto } from '../dtos/create-review.dto';
import { GetReviewsFilterDto } from '../dtos/get-reviews-filter.dto';

@UseGuards(AuthGuard)
@Controller('reviews')
export class ReviewController {
  constructor(
    @Inject(REVIEW_TOKEN.REVIEW_SERVICE) private _reviewService: IReviewService,
  ) {}

  /**
   * Create a review by user
   */
  @Post()
  create(@Request() req: IAuthenticatedReqeust, @Body() dto: CreateReviewDto) {
    return this._reviewService.create(req.user.id, dto);
  }

  /**
   * Find all reviews of selected tasker
   */
  @Get('tasker/:taskerId')
  findAll(
    @Param('taskerId') taskerId: string,
    @Query() filter: GetReviewsFilterDto,
  ) {
    return this._reviewService.findAllReviews(taskerId, filter);
  }

  /**
   * Find avarage rating of selected tasker
   */
  @Get('tasker/:taskerId/average')
  findAvarageRating(@Param('taskerId') taskerId: string) {
    return this._reviewService.findAvarageRating(taskerId);
  }
}
