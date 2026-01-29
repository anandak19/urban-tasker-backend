import { CreateReviewDto } from './create-review.dto';

export class ReviewResponseDto extends CreateReviewDto {
  userName: string;
  createdAt: Date;
  id: string;
}
