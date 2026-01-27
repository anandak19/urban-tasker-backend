import { Inject, Injectable } from '@nestjs/common';
import { IReportService } from '../interfaces/reports-services.interface';
import { DashboardSummaryDto } from '../dtos/dashboard-summary.dto.';
import { BOOKING_TOKEN } from '@modules/bookings/bookings.token';
import type { IAdminBookingService } from '@modules/bookings/interfaces/bookings-services.interface';
import type { IAdminUserService } from '@modules/users/interfaces/user-services.interface';
import { USER_TOKENS } from '@modules/users/user-tokens';
import { ReportsMapper } from '../mappers/reports.mapper';
import { BookingSummaryFilter } from '../dtos/query-filters.dto';
import { PaginatedResult } from '@shared/interfaces/query.interface';
import { BookingSummaryListItemDto } from '../dtos/bookings-summery.dto';
import { GraphDataItemDto } from '../dtos/graph-data.dto';

@Injectable()
export class ReportsService implements IReportService {
  constructor(
    @Inject(BOOKING_TOKEN.ADMIN_BOOKING_SERVICE)
    private _adminBookingService: IAdminBookingService,

    @Inject(USER_TOKENS.ADMIN_USER_SERVICE)
    private _adminUsersService: IAdminUserService,
  ) {}

  // get report summery
  async getDashBoardSummary(): Promise<DashboardSummaryDto> {
    const earningsSummery =
      await this._adminBookingService.getEarningsSummery();
    const totalUsers = await this._adminUsersService.getTotalUsersCount();
    const totalTaskers = await this._adminUsersService.getTotalTaskersCount();

    return ReportsMapper.toDashBoardSummaryResponse(
      earningsSummery,
      totalUsers,
      totalTaskers,
    );
  }

  async getBookingSummery(
    filter: BookingSummaryFilter,
  ): Promise<PaginatedResult<BookingSummaryListItemDto>> {
    return await this._adminBookingService.getBookingSummery(filter);
  }

  getGraphData(): Promise<GraphDataItemDto[]> {
    return this._adminBookingService.getGraphData();
  }
}
