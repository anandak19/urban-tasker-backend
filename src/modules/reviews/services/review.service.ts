import {
  ConflictException,
  Inject,
  Injectable,
  InternalServerErrorException,
} from '@nestjs/common';
import { IReviewService } from '../interfaces/review-services.interface';
import { PaginatedResult } from '@shared/interfaces/query.interface';
import { CreateReviewDto } from '../dtos/create-review.dto';
import { GetReviewsFilterDto } from '../dtos/get-reviews-filter.dto';
import { ReviewResponseDto } from '../dtos/review-response.dto';
import { REVIEW_TOKEN } from '../reviews.tokens';
import type { IReviewRepository } from '../interfaces/review-repositories.interface';
import { ICreateReview } from '../interfaces/review.interface';
import { toObjectId } from '@shared/utility/db/to-objectid.util';
import { IBaseResponse } from '@shared/interfaces/base-response.interface';
import { SSM_TOKENS } from '@core/lib/ssm/ssm.token';
import type { ISecretsManagerService } from '@core/lib/ssm/interfaces/ssm-services.interface';
import type { IBookingService } from '@modules/bookings/interfaces/bookings-services.interface';
import { BOOKING_TOKEN } from '@modules/bookings/bookings.token';
import { IFindAllReviewsFilter } from '../interfaces/query-filters.interface';
import { RatingsAverageResponseDto } from '../dtos/ratings-average-response.dto';

@Injectable()
export class ReviewService implements IReviewService {
  constructor(
    @Inject(REVIEW_TOKEN.REVIEW_REPOSITORY)
    private _reviewRepo: IReviewRepository,

    @Inject(SSM_TOKENS.SECRETS_SERVICE)
    private _secretsService: ISecretsManagerService,

    @Inject(BOOKING_TOKEN.BOOKING_SERVICE)
    private _bookingService: IBookingService,
  ) {}

  async create(userId: string, dto: CreateReviewDto): Promise<IBaseResponse> {
    const taskData = await this._bookingService.getBookingDetails(dto.taskId);

    // find review made by this user for tasker with taskerId. if found return conflic error
    const existing = await this._reviewRepo.findOne({
      userId: toObjectId(userId),
      taskerId: toObjectId(taskData.taskerId),
    });

    if (existing) {
      throw new ConflictException('You already reviewed this tasker');
    }

    const newReview: ICreateReview = {
      taskerId: toObjectId(taskData.taskerId),
      userId: toObjectId(userId),
      rating: dto.rating,
      comment: dto.comment,
    };

    const saved = await this._reviewRepo.create(newReview);

    if (!saved) {
      throw new InternalServerErrorException('Faild to save review');
    }

    return { message: 'Review added' };
  }

  async findAllReviews(
    taskerId: string,
    filter: GetReviewsFilterDto,
  ): Promise<PaginatedResult<ReviewResponseDto>> {
    const findAllFilter: IFindAllReviewsFilter = { taskerId, ...filter };
    return await this._reviewRepo.findAllUserReviews(findAllFilter);
  }

  async findMyReviews(
    userId: string,
    filter: GetReviewsFilterDto,
  ): Promise<PaginatedResult<ReviewResponseDto>> {
    const findAllFilter: IFindAllReviewsFilter = {
      ...filter,
      taskerId: userId,
    };

    return await this._reviewRepo.findAllUserReviews(findAllFilter);
  }

  async findAvarageRating(
    taskerId: string,
  ): Promise<RatingsAverageResponseDto> {
    return await this._reviewRepo.findAvarageRating(taskerId);
  }
}
