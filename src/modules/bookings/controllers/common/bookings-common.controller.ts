import { BOOKING_TOKEN } from '@modules/bookings/bookings.token';
import type { IBookingService } from '@modules/bookings/interfaces/bookings-services.interface';
import { Controller, Get, Inject } from '@nestjs/common';

@Controller('common/bookings')
export class BookingsCommonController {
  constructor(
    @Inject(BOOKING_TOKEN.BOOKING_SERVICE)
    private _bookingService: IBookingService,
  ) {}

  @Get('analytics/popular-categories')
  getMostBookedCategories() {
    return this._bookingService.getMostBookedCategories();
  }
}
