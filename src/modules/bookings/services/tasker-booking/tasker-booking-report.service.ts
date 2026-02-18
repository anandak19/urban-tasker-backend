import { BOOKING_TOKEN } from '@modules/bookings/bookings.token';
import type { IBookingRepository } from '@modules/bookings/interfaces/bookings-repositories.interface';
import { ITaskerBookingsReportService } from '@modules/bookings/interfaces/bookings-services.interface';
import {
  GraphDataItemDto,
  IBookingsCountReportData,
} from '@modules/reports/dtos/graph-data.dto';
import {
  BookingReportFilterDto,
  ReportGroupFilterDto,
} from '@modules/reports/dtos/query-filters.dto';
import { Inject, Injectable } from '@nestjs/common';
import { UserRoles } from '@shared/constants/enums/user.enum';

@Injectable()
export class TaskerBookingReportService
  implements ITaskerBookingsReportService
{
  constructor(
    @Inject(BOOKING_TOKEN.BOOKING_REPOSITORY)
    private _bookingRepo: IBookingRepository,
  ) {}

  async getEarningsGraphData(
    taskerId: string,
    filter: BookingReportFilterDto = {},
  ): Promise<GraphDataItemDto[]> {
    return await this._bookingRepo.getGraphData(
      UserRoles.TASKER,
      filter,
      taskerId,
    );
  }

  async getBookingsCountReportData(
    taskerId: string,
    filter: ReportGroupFilterDto,
  ): Promise<IBookingsCountReportData[]> {
    return await this._bookingRepo.getBookingsCountReportData(filter, taskerId);
  }
}
