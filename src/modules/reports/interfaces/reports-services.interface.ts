import { PaginatedResult } from '@shared/interfaces/query.interface';
import { DashboardSummaryDto } from '../dtos/dashboard-summary.dto.';
import { BookingSummaryListItemDto } from '../dtos/bookings-summery.dto';
import {
  BookingReportFilterDto,
  BookingSummaryFilter,
} from '../dtos/query-filters.dto';
import { GraphDataItemDto } from '../dtos/graph-data.dto';
import {
  PaymentStatusGraphDataDto,
  StatusGraphDataDto,
} from '../dtos/status-graph-data.dto';

export interface IReportService {
  getDashBoardSummary(): Promise<DashboardSummaryDto>;

  getBookingSummery(
    query: BookingSummaryFilter,
  ): Promise<PaginatedResult<BookingSummaryListItemDto>>;

  getGraphData(filter?: BookingReportFilterDto): Promise<GraphDataItemDto[]>;

  getStatusGraphData(): Promise<StatusGraphDataDto>;

  getPaymentStatusGraphData(): Promise<PaymentStatusGraphDataDto>;
}

export interface ITaskerReportService {
  getEarningsGraphData(
    taskerId: string,
    filter?: BookingReportFilterDto,
  ): Promise<GraphDataItemDto[]>;
}
