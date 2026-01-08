import { Module } from '@nestjs/common';
import { BookingsController } from './controllers/user/bookings.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { Booking, BookingSchema } from './schemas/booking.schema';
import { BOOKING_TOKEN } from './bookings.token';
import { BookingRepository } from './repositories/booking.repository';
import { CategoriesModule } from '@modules/categories/categories.module';
import { BookingService } from './services/booking.service';
import { S3Module } from '@core/lib/s3/s3.module';
import { TaskerBookingsController } from './controllers/tasker/tasker-bookings.controller';
import { TaskerBookingService } from './services/tasker-booking/tasker-booking.service';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Booking.name, schema: BookingSchema }]),
    CategoriesModule,
    S3Module,
  ],
  controllers: [BookingsController, TaskerBookingsController],
  providers: [
    { provide: BOOKING_TOKEN.BOOKING_SERVICE, useClass: BookingService },
    { provide: BOOKING_TOKEN.BOOKING_REPOSITORY, useClass: BookingRepository },
    {
      provide: BOOKING_TOKEN.TASKERS_BOOKING_SERVICE,
      useClass: TaskerBookingService,
    },
  ],
  exports: [
    BOOKING_TOKEN.BOOKING_SERVICE,
    BOOKING_TOKEN.TASKERS_BOOKING_SERVICE,
  ],
})
export class BookingsModule {}
