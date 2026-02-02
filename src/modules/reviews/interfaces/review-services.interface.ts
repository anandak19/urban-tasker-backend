import { PaginatedResult } from '@shared/interfaces/query.interface';
import { GetReviewsFilterDto } from '../dtos/get-reviews-filter.dto';
import { ReviewResponseDto } from '../dtos/review-response.dto';
import { CreateReviewDto } from '../dtos/create-review.dto';
import { IBaseResponse } from '@shared/interfaces/base-response.interface';

export interface IReviewService {
  findAllReviews(
    taskerId: string,
    filter: GetReviewsFilterDto,
  ): Promise<PaginatedResult<ReviewResponseDto>>;

  create(userId: string, dto: CreateReviewDto): Promise<IBaseResponse>;

  // method to view all revies of logged in user
  findMyReviews(
    userId: string,
    filter: GetReviewsFilterDto,
  ): Promise<PaginatedResult<ReviewResponseDto>>;
}
