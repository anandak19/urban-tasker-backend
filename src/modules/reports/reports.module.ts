import { Module } from '@nestjs/common';
import { REPORTS_TOKENS } from './reports-tokens';
import { ReportsService } from './services/reports.service';
import { ReportsController } from './controllers/admin/reports.controller';
import { BookingsModule } from '@modules/bookings/bookings.module';
import { UsersModule } from '@modules/users/users.module';
import { TaskerReportService } from './services/tasker-report-service/tasker-report.service';
import { TaskerReportsController } from './controllers/tasker/tasker-reports.controller';
import { PaymentModule } from '@modules/payment/payment.module';

@Module({
  imports: [BookingsModule, UsersModule, PaymentModule],
  controllers: [ReportsController, TaskerReportsController],
  providers: [
    { provide: REPORTS_TOKENS.SERVICE, useClass: ReportsService },
    { provide: REPORTS_TOKENS.TASKER_SERVICE, useClass: TaskerReportService },
  ],
})
export class ReportsModule {}
