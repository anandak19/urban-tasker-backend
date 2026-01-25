import { DashboardSummaryDto } from '../dtos/dashboard-summary.dto.';

export interface IReportService {
  getDashBoardSummary(): Promise<DashboardSummaryDto>;
}
