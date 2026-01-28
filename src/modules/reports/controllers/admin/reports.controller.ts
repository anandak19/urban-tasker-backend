import { BookingSummaryFilter } from '@modules/reports/dtos/query-filters.dto';
import type { IReportService } from '@modules/reports/interfaces/reports-services.interface';
import { REPORTS_TOKENS } from '@modules/reports/reports-tokens';
import { Controller, Get, Inject, Query } from '@nestjs/common';

@Controller('admin/reports')
export class ReportsController {
  constructor(
    @Inject(REPORTS_TOKENS.SERVICE) private _reportService: IReportService,
  ) {}

  @Get('summary')
  getDashboardSummery() {
    return this._reportService.getDashBoardSummary();
  }

  @Get('bookings')
  getBookingsSummary(@Query() query: BookingSummaryFilter) {
    return this._reportService.getBookingSummery(query);
  }

  @Get('graph-data')
  getGraphData() {
    return this._reportService.getGraphData();
  }
}
