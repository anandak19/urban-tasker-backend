import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { Review, ReviewSchema } from './schemas/review.schema';
import { REVIEW_TOKEN } from './reviews.tokens';
import { ReviewService } from './services/review.service';
import { ReviewRepository } from './repositories/review.repository';
import { ReviewController } from './controllers/review.controller';
import { BookingsModule } from '@modules/bookings/bookings.module';

@Module({
  imports: [
    BookingsModule,
    MongooseModule.forFeature([{ name: Review.name, schema: ReviewSchema }]),
  ],
  controllers: [ReviewController],
  providers: [
    { provide: REVIEW_TOKEN.REVIEW_SERVICE, useClass: ReviewService },
    { provide: REVIEW_TOKEN.REVIEW_REPOSITORY, useClass: ReviewRepository },
  ],
  exports: [],
})
export class ReviewsModule {}
