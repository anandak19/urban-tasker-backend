import { Inject, Injectable } from '@nestjs/common';
import { IReportService } from '../interfaces/reports-services.interface';
import { DashboardSummaryDto } from '../dtos/dashboard-summary.dto.';
import { BOOKING_TOKEN } from '@modules/bookings/bookings.token';
import type { IAdminBookingService } from '@modules/bookings/interfaces/bookings-services.interface';
import type { IAdminUserService } from '@modules/users/interfaces/user-services.interface';
import { USER_TOKENS } from '@modules/users/user-tokens';
import { ReportsMapper } from '../mappers/reports.mapper';
import {
  BookingReportFilterDto,
  BookingSummaryFilter,
} from '../dtos/query-filters.dto';
import { PaginatedResult } from '@shared/interfaces/query.interface';
import { BookingSummaryListItemDto } from '../dtos/bookings-summery.dto';
import { GraphDataItemDto } from '../dtos/graph-data.dto';
import {
  PaymentStatusGraphDataDto,
  StatusGraphDataDto,
} from '../dtos/status-graph-data.dto';
import { TaskStatus } from '@shared/constants/enums/task.enum';
import { PAYMENT_TOKENS } from '@modules/payment/payment.token';
import type { IAdminPaymentService } from '@modules/payment/interfaces/payment-services.interface';
import { PaymentStatus } from '@shared/constants/enums/payment-status.enum';

@Injectable()
export class ReportsService implements IReportService {
  constructor(
    @Inject(BOOKING_TOKEN.ADMIN_BOOKING_SERVICE)
    private _adminBookingService: IAdminBookingService,

    @Inject(PAYMENT_TOKENS.ADMIN_PAYMENT_SERVICE)
    private _adminPaymentService: IAdminPaymentService,

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

  getGraphData(filter?: BookingReportFilterDto): Promise<GraphDataItemDto[]> {
    return this._adminBookingService.getGraphData(filter);
  }

  async getStatusGraphData(): Promise<StatusGraphDataDto> {
    const result: StatusGraphDataDto = {
      cancelled: 0,
      completed: 0,
      inProgress: 0,
      overdue: 0,
      pending: 0,
      rejected: 0,
    };

    const dbResult = await this._adminBookingService.getStatusGraphData();

    for (const item of dbResult) {
      console.log(item);
      switch (item._id) {
        case TaskStatus.CANCELLED:
          result.cancelled = item.total;
          break;

        case TaskStatus.COMPLETED:
          result.completed = item.total;
          break;

        case TaskStatus.IN_PROGRESS:
          result.inProgress = item.total;
          break;

        case TaskStatus.OVERDUE:
          result.overdue = item.total;
          break;

        case TaskStatus.PENDING:
          result.pending = item.total;
          break;

        case TaskStatus.REJECTED:
          result.rejected = item.total;
          break;
      }
    }
    return result;
  }

  async getPaymentStatusGraphData(): Promise<PaymentStatusGraphDataDto> {
    const result: PaymentStatusGraphDataDto = {
      attempted: 0,
      created: 0,
      faild: 0,
      paid: 0,
      pending: 0,
    };

    // call method to get actual data
    const data = await this._adminPaymentService.getPaymentStatusGraphData();
    // update result and return it
    for (const item of data) {
      console.log(item);
      switch (item._id) {
        case PaymentStatus.ATTEMPTED:
          result.attempted = item.total;
          break;

        case PaymentStatus.CREATED:
          result.created = item.total;
          break;

        case PaymentStatus.FAILD:
          result.faild = item.total;
          break;

        case PaymentStatus.PAID:
          result.paid = item.total;
          break;

        case PaymentStatus.PENDING:
          result.pending = item.total;
          break;
      }
    }

    return result;
  }
}
