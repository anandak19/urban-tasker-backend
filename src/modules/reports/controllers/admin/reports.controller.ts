import type { IReportService } from '@modules/reports/interfaces/reports-services.interface';
import { REPORTS_TOKENS } from '@modules/reports/reports-tokens';
import { Controller, Get, Inject } from '@nestjs/common';

@Controller('admin/reports')
export class ReportsController {
  constructor(
    @Inject(REPORTS_TOKENS.SERVICE) private _reportService: IReportService,
  ) {}

  @Get('summary')
  getDashboardSummery() {
    console.log('[sUMMERY]');
    return this._reportService.getDashBoardSummary();
  }
}
