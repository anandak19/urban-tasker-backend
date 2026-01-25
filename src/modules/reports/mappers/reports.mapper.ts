import { IEarningsAggregationResponse } from '@modules/bookings/interfaces/repo-responses.interface';
import { DashboardSummaryDto } from '../dtos/dashboard-summary.dto.';

export class ReportsMapper {
  static toDashBoardSummaryResponse(
    earningsData: IEarningsAggregationResponse,
    totalUsers: number,
    totalTaskers: number,
  ): DashboardSummaryDto {
    return {
      ...earningsData,
      totalTaskers: totalTaskers,
      totalUsers: totalUsers,
    };
  }
}
