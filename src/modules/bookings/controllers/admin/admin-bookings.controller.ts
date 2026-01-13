import { AuthGuard } from '@core/guards/auth/auth.guard';
import { BOOKING_TOKEN } from '@modules/bookings/bookings.token';
import { GetBookingsDto } from '@modules/bookings/dtos/booking-listing-query.dto';
import type {
  IAdminBookingService,
  IBookingService,
} from '@modules/bookings/interfaces/bookings-services.interface';
import {
  Controller,
  Get,
  Inject,
  Param,
  Query,
  UseGuards,
} from '@nestjs/common';

@UseGuards(AuthGuard)
@Controller('admin/bookings')
export class AdminBookingsController {
  constructor(
    @Inject(BOOKING_TOKEN.BOOKING_SERVICE)
    private _bookingService: IBookingService,

    @Inject(BOOKING_TOKEN.ADMIN_BOOKING_SERVICE)
    private _adminBookingService: IAdminBookingService,
  ) {}

  @Get()
  getAllBookings(@Query() filter: GetBookingsDto) {
    return this._adminBookingService.getAllBookings(filter);
  }

  @Get(':taskId')
  getBookingDetails(@Param('taskId') taskId: string) {
    return this._bookingService.getBookingDetails(taskId);
  }
}
