import { AuthGuard } from '@core/guards/auth/auth.guard';
import {
  BookingReportFilterDto,
  ReportGroupFilterDto,
} from '@modules/reports/dtos/query-filters.dto';
import type { ITaskerReportService } from '@modules/reports/interfaces/reports-services.interface';
import { REPORTS_TOKENS } from '@modules/reports/reports-tokens';
import {
  Controller,
  Get,
  Inject,
  Query,
  Request,
  UseGuards,
} from '@nestjs/common';
import type { IAuthenticatedReqeust } from '@shared/interfaces/request.interface';

@UseGuards(AuthGuard)
@Controller('tasker/reports')
export class TaskerReportsController {
  constructor(
    @Inject(REPORTS_TOKENS.TASKER_SERVICE)
    private _taskerReportService: ITaskerReportService,
  ) {}

  @Get()
  getEarningsReportData(
    @Request() req: IAuthenticatedReqeust,
    @Query() filter: BookingReportFilterDto,
  ) {
    return this._taskerReportService.getEarningsGraphData(req.user.id, filter);
  }

  @Get('bookings-counts')
  getBookingsCountReportData(
    @Request() req: IAuthenticatedReqeust,
    @Query() filter: ReportGroupFilterDto,
  ) {
    return this._taskerReportService.getBookingsCountReportData(
      req.user.id,
      filter,
    );
  }
}
