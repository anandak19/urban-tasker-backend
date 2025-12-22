import { Module } from '@nestjs/common';
import { BookingsController } from './controllers/user/bookings.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { Booking, BookingSchema } from './schemas/booking.schema';
import { BOOKING_TOKEN } from './bookings.token';
import { BookingRepository } from './repositories/booking.repository';
import { CategoriesModule } from '@modules/categories/categories.module';
import { BookingService } from './services/booking.service';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Booking.name, schema: BookingSchema }]),
    CategoriesModule,
  ],
  controllers: [BookingsController],
  providers: [
    { provide: BOOKING_TOKEN.BOOKING_SERVICE, useClass: BookingService },
    { provide: BOOKING_TOKEN.BOOKING_REPOSITORY, useClass: BookingRepository },
  ],
  exports: [BOOKING_TOKEN.BOOKING_SERVICE],
})
export class BookingsModule {}
