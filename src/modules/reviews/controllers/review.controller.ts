import {
  Body,
  Controller,
  Get,
  Inject,
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

  @Post()
  create(@Request() req: IAuthenticatedReqeust, @Body() dto: CreateReviewDto) {
    return this._reviewService.create(req.user.id, dto);
  }

  @Get()
  findAll(@Query() filter: GetReviewsFilterDto) {
    return this._reviewService.findAllReviews(filter);
  }
}
