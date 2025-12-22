import { AuthGuard } from '@core/guards/auth/auth.guard';
import { BOOKING_TOKEN } from '@modules/bookings/bookings.token';
import { CreateBookingDto } from '@modules/bookings/dtos/create-booking-dto';
import type { IBookingService } from '@modules/bookings/interfaces/bookings-services.interface';
import { Body, Controller, Inject, Post, Req, UseGuards } from '@nestjs/common';
import { type IAuthenticatedReqeust } from '@shared/interfaces/request.interface';

@Controller('bookings')
@UseGuards(AuthGuard)
export class BookingsController {
  constructor(
    @Inject(BOOKING_TOKEN.BOOKING_SERVICE)
    private _bookingService: IBookingService,
  ) {}

  @Post()
  bookTasker(@Req() req: IAuthenticatedReqeust, @Body() dto: CreateBookingDto) {
    //logic
    console.log('booking', dto);
    console.log('userid', req.user.id);

    return this._bookingService.createBooking(req.user.id, dto);
  }
}
