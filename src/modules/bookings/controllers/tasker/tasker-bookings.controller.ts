import { AuthGuard } from '@core/guards/auth/auth.guard';
import { BOOKING_TOKEN } from '@modules/bookings/bookings.token';
import { GetBookingsDto } from '@modules/bookings/dtos/booking-listing-query.dto';
import { VerifyStartCodeDto } from '@modules/bookings/dtos/verify-start-code.dto';
import type {
  IBookingService,
  ITaskerBookingService,
} from '@modules/bookings/interfaces/bookings-services.interface';
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
import type { IAuthenticatedReqeust } from '@shared/interfaces/request.interface';

@UseGuards(AuthGuard)
@Controller('tasker/bookings')
export class TaskerBookingsController {
  constructor(
    @Inject(BOOKING_TOKEN.TASKERS_BOOKING_SERVICE)
    private _taskerBookingService: ITaskerBookingService,

    @Inject(BOOKING_TOKEN.BOOKING_SERVICE)
    private _bookingService: IBookingService,
  ) {}

  // List all tasks of tasker they gets booked for (filter by: pagination, status)
  @Get()
  getAllTasks(@Req() req: IAuthenticatedReqeust, @Query() dto: GetBookingsDto) {
    console.log(dto);
    return this._taskerBookingService.getAllTaskersBookings(req.user.id, dto);
  }

  // View one task/booking details by its id: :id
  @Get(':taskId')
  getOneTaskDetails(@Param() taskId: string) {
    return this._bookingService.getBookingDetails(taskId);
  }

  // Accept one task/booking by its id: :id/accept
  @Patch(':taskId/accept')
  acceptTask(@Param('taskId') taskId: string) {
    return this._taskerBookingService.acceptTask(taskId);
  }

  // Reject one task/booking by its id: :id/reject
  @Patch(':taskId/reject')
  rejectTask(@Param('taskId') taskId: string) {
    return this._taskerBookingService.rejectTask(taskId);
  }

  // varify the start code and chantge task status to in_progress
  @Post(':taskId/start')
  varifyCodeAndStartWork(
    @Param('taskId') taskId: string,
    @Body() dto: VerifyStartCodeDto,
  ) {
    return this._taskerBookingService.verifyStartCodeAndStartWork(
      taskId,
      dto.code,
    );
  }

  @Patch(':taskId/break')
  takeBreak(@Param('taskId') taskId: string) {
    return this._taskerBookingService.takeBreak(taskId);
  }

  @Patch(':taskId/resume')
  resumeTask(@Param('taskId') taskId: string) {
    return this._taskerBookingService.resumeTask(taskId);
  }

  @Patch(':taskId/finish')
  finishTask(@Param('taskId') taskId: string) {
    return this._taskerBookingService.finishTask(taskId);
  }
}
