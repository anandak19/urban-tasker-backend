import { BOOKING_TOKEN } from '@modules/bookings/bookings.token';
import type { ITaskerBookingService } from '@modules/bookings/interfaces/bookings-services.interface';
import { GraphDataItemDto } from '@modules/reports/dtos/graph-data.dto';
import { BookingReportFilterDto } from '@modules/reports/dtos/query-filters.dto';
import { ITaskerReportService } from '@modules/reports/interfaces/reports-services.interface';
import { Inject, Injectable } from '@nestjs/common';

@Injectable()
export class TaskerReportService implements ITaskerReportService {
  constructor(
    @Inject(BOOKING_TOKEN.TASKERS_BOOKING_SERVICE)
    private readonly _taskerBookingService: ITaskerBookingService,
  ) {}

  getEarningsGraphData(
    taskerId: string,
    filter: BookingReportFilterDto = {},
  ): Promise<GraphDataItemDto[]> {
    return this._taskerBookingService.getEarningsGraphData(taskerId, filter);
  }
}
