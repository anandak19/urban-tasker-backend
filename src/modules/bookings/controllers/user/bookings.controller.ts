import { AuthGuard } from '@core/guards/auth/auth.guard';
import { BOOKING_TOKEN } from '@modules/bookings/bookings.token';
import { GetBookingsDto } from '@modules/bookings/dtos/booking-listing-query.dto';
import { CreateBookingDto } from '@modules/bookings/dtos/create-booking-dto';
import type { IBookingService } from '@modules/bookings/interfaces/bookings-services.interface';
import {
  Body,
  Controller,
  Get,
  Inject,
  Param,
  Patch,
  Post,
  Query,
  Req,
  UseGuards,
} from '@nestjs/common';
import { type IAuthenticatedReqeust } from '@shared/interfaces/request.interface';

@Controller('bookings')
@UseGuards(AuthGuard)
export class BookingsController {
  constructor(
    @Inject(BOOKING_TOKEN.BOOKING_SERVICE)
    private _bookingService: IBookingService,
  ) {}

  @Get()
  getAllbookings(
    @Req() req: IAuthenticatedReqeust,
    @Query() dto: GetBookingsDto,
  ) {
    return this._bookingService.getAllBookings(req.user.id, dto);
  }

  @Get(':taskId')
  findOneBooking(@Param('taskId') id: string) {
    return this._bookingService.getBookingDetails(id);
  }

  @Post()
  bookTasker(@Req() req: IAuthenticatedReqeust, @Body() dto: CreateBookingDto) {
    return this._bookingService.createBooking(req.user.id, dto);
  }

  //get work start code
  @Get(':taskId/start-code')
  getWorkStartCode(@Param('taskId') id: string) {
    return this._bookingService.getWorkStartCode(id);
  }

  @Get(':taskId/status')
  getTaskPaymentStatus(@Param('taskId') id: string) {
    return this._bookingService.getTaskPaymentStatus(id);
  }

  //cancel booking
  @Patch(':taskId/cancel')
  cancelBooking(@Param('taskId') id: string) {
    // method to cancel the task : id
    return this._bookingService.cancelBooking(id);
  }
}
