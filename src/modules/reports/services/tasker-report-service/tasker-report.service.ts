import { BOOKING_TOKEN } from '@modules/bookings/bookings.token';
import type { ITaskerBookingsReportService } from '@modules/bookings/interfaces/bookings-services.interface';
import {
  GraphDataItemDto,
  IBookingsCountReportData,
} from '@modules/reports/dtos/graph-data.dto';
import {
  BookingReportFilterDto,
  ReportGroupFilterDto,
} from '@modules/reports/dtos/query-filters.dto';
import { ITaskerReportService } from '@modules/reports/interfaces/reports-services.interface';
import { Inject, Injectable } from '@nestjs/common';

@Injectable()
export class TaskerReportService implements ITaskerReportService {
  constructor(
    @Inject(BOOKING_TOKEN.TASKERS_BOOKING_REPORT_SERVICE)
    private readonly _taskerBookingReportsService: ITaskerBookingsReportService,
  ) {}

  getBookingsCountReportData(
    taskerId: string,
    filter: ReportGroupFilterDto,
  ): Promise<IBookingsCountReportData[]> {
    return this._taskerBookingReportsService.getBookingsCountReportData(
      taskerId,
      filter,
    );
  }

  getEarningsGraphData(
    taskerId: string,
    filter: BookingReportFilterDto = {},
  ): Promise<GraphDataItemDto[]> {
    return this._taskerBookingReportsService.getEarningsGraphData(
      taskerId,
      filter,
    );
  }
}
