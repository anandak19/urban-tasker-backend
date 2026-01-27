import { PaginatedResult } from '@shared/interfaces/query.interface';
import { DashboardSummaryDto } from '../dtos/dashboard-summary.dto.';
import { BookingSummaryListItemDto } from '../dtos/bookings-summery.dto';
import { BookingSummaryFilter } from '../dtos/query-filters.dto';
import { GraphDataItemDto } from '../dtos/graph-data.dto';

export interface IReportService {
  getDashBoardSummary(): Promise<DashboardSummaryDto>;

  getBookingSummery(
    query: BookingSummaryFilter,
  ): Promise<PaginatedResult<BookingSummaryListItemDto>>;

  getGraphData(): Promise<GraphDataItemDto[]>;
}
