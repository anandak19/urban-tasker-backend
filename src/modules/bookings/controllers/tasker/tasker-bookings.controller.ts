import { BOOKING_TOKEN } from '@modules/bookings/bookings.token';
import { GetBookingsDto } from '@modules/bookings/dtos/booking-listing-query.dto';
import type { ITaskerBookingService } from '@modules/bookings/interfaces/bookings-services.interface';
import { Controller, Get, Inject, Query, Req } from '@nestjs/common';
import type { IAuthenticatedReqeust } from '@shared/interfaces/request.interface';

@Controller('tasker/bookings')
export class TaskerBookingsController {
  /**
   * TODOS
   * 2. View one task/booking details by its id: :id
   * 3. Accept one task/booking by its id: :id/accept
   * 4. Reject one task/booking by its id: :id/reject
   */

  constructor(
    @Inject(BOOKING_TOKEN.TASKERS_BOOKING_SERVICE)
    private _taskerBookingService: ITaskerBookingService,
  ) {}

  // ~ NOT TESTED
  // List all tasks of tasker they gets booked for (filter by: pagination, status)
  @Get()
  getAllTasks(@Req() req: IAuthenticatedReqeust, @Query() dto: GetBookingsDto) {
    return this._taskerBookingService.getAllTaskersBookings(req.user.id, dto);
  }
}
