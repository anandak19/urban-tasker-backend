import { IBaseRepository } from '@shared/interfaces/base-repository.interface';
import { ReviewDocument } from '../schemas/review.schema';
import { ICreateReview } from './review.interface';
import { PaginatedResult } from '@shared/interfaces/query.interface';
import { ReviewResponseDto } from '../dtos/review-response.dto';
import { IFindAllReviewsFilter } from './query-filters.interface';
import { RatingsAverageResponseDto } from '../dtos/ratings-average-response.dto';

export interface IReviewRepository
  extends IBaseRepository<ReviewDocument, ICreateReview> {
  findAllUserReviews(
    filter: IFindAllReviewsFilter,
  ): Promise<PaginatedResult<ReviewResponseDto>>;

  findAvarageRating(taskerId: string): Promise<RatingsAverageResponseDto>;
}
